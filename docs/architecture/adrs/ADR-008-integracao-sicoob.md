# ADR-008: Integração Bancária Sicoob

**Status:** Aceito  
**Data:** 21/01/2026  
**Decisores:** Equipe de Arquitetura  
**Contexto do Debate:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Contexto

O sistema requer integração bancária com Sicoob para:

- Geração de boletos bancários
- Geração de QR Code PIX
- Recebimento de webhooks de pagamento
- Baixa automática de pagamentos

## Decisão

### Arquitetura de Integração

```
┌─────────────────────────────────────────────────────────────────┐
│                      FLUXO DE PAGAMENTOS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐    ┌──────────────┐    ┌─────────────────────────┐ │
│  │ Sistema │───>│ Sicoob Module │───>│     Sicoob API          │ │
│  └─────────┘    └──────────────┘    └─────────────────────────┘ │
│       │                                         │               │
│       │         ┌──────────────┐                │               │
│       │         │   Payment    │<───────────────┘               │
│       └────────>│   Entity     │   (gera boleto/pix)            │
│                 └──────────────┘                                │
│                        │                                        │
│                        v                                        │
│                 ┌──────────────┐    ┌─────────────────────────┐ │
│                 │   Webhook    │<───│   Sicoob Notification   │ │
│                 │   Handler    │    │   (pagamento confirmado)│ │
│                 └──────────────┘    └─────────────────────────┘ │
│                        │                                        │
│                        v                                        │
│                 ┌──────────────┐                                │
│                 │  Enrollment  │  (ativa matrícula)             │
│                 │   Service    │                                │
│                 └──────────────┘                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Módulo de Integração

```typescript
// modules/financial/infrastructure/sicoob/sicoob.module.ts
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        baseURL: config.get('SICOOB_API_URL'),
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SicoobAuthService, SicoobBoletoService, SicoobPixService, SicoobWebhookHandler],
  exports: [SicoobBoletoService, SicoobPixService],
})
export class SicoobModule {}

// sicoob-auth.service.ts
@Injectable()
export class SicoobAuthService {
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await firstValueFrom(
      this.httpService.post('/oauth/token', {
        grant_type: 'client_credentials',
        client_id: this.configService.get('SICOOB_CLIENT_ID'),
        client_secret: this.configService.get('SICOOB_CLIENT_SECRET'),
        scope: 'boletos.read boletos.write pix.read pix.write',
      }),
    );

    this.accessToken = response.data.access_token;
    this.tokenExpiry = new Date(Date.now() + (response.data.expires_in - 60) * 1000);

    return this.accessToken;
  }
}

// sicoob-boleto.service.ts
@Injectable()
export class SicoobBoletoService {
  constructor(
    private httpService: HttpService,
    private authService: SicoobAuthService,
    private logger: PinoLogger,
  ) {
    this.logger.setContext(SicoobBoletoService.name);
  }

  async createBoleto(data: CreateBoletoDto): Promise<BoletoResponse> {
    const token = await this.authService.getAccessToken();

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          '/cobranca/v2/boletos',
          {
            numeroConvenio: this.configService.get('SICOOB_CONVENIO'),
            numeroContaCorrente: this.configService.get('SICOOB_CONTA'),

            // Dados do pagador
            pagador: {
              tipoPessoa: data.payerType, // 'F' ou 'J'
              cpfCnpj: data.payerDocument,
              nome: data.payerName,
              endereco: data.payerAddress,
              cidade: data.payerCity,
              uf: data.payerState,
              cep: data.payerZipCode,
            },

            // Dados do boleto
            dataVencimento: format(data.dueDate, 'yyyy-MM-dd'),
            valorNominal: data.amount,
            tipoDesconto: 0, // Sem desconto
            valorAbatimento: 0,

            // Multa e juros
            tipoMulta: data.fineType || 2, // Percentual
            valorMulta: data.fineValue || 2, // 2%
            tipoJurosMora: data.interestType || 2, // Percentual
            valorJurosMora: data.interestValue || 1, // 1% ao mês

            // Identificação
            seuNumero: data.ourNumber,
            identificacaoBoleto: data.description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      this.logger.info({ boletoId: response.data.nossoNumero }, 'Boleto created successfully');

      return {
        bankNumber: response.data.nossoNumero,
        barcode: response.data.codigoBarras,
        digitableLine: response.data.linhaDigitavel,
        pdfUrl: response.data.urlBoleto,
        dueDate: data.dueDate,
        amount: data.amount,
      };
    } catch (error) {
      this.logger.error({ error, data: { ourNumber: data.ourNumber } }, 'Failed to create boleto');
      throw new BoletoCreationException(error.response?.data?.mensagem || error.message);
    }
  }

  async cancelBoleto(bankNumber: string): Promise<void> {
    const token = await this.authService.getAccessToken();

    await firstValueFrom(
      this.httpService.patch(
        `/cobranca/v2/boletos/${bankNumber}/baixar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
    );
  }

  async getBoletoStatus(bankNumber: string): Promise<BoletoStatus> {
    const token = await this.authService.getAccessToken();

    const response = await firstValueFrom(
      this.httpService.get(`/cobranca/v2/boletos/${bankNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );

    return this.mapStatus(response.data.situacao);
  }
}

// sicoob-pix.service.ts
@Injectable()
export class SicoobPixService {
  constructor(
    private httpService: HttpService,
    private authService: SicoobAuthService,
    private logger: PinoLogger,
  ) {}

  async createPixCharge(data: CreatePixDto): Promise<PixResponse> {
    const token = await this.authService.getAccessToken();

    const txid = this.generateTxId();

    const response = await firstValueFrom(
      this.httpService.put(
        `/pix/v2/cob/${txid}`,
        {
          calendario: {
            expiracao: data.expirationSeconds || 3600, // 1 hora default
          },
          devedor: {
            cpf: data.payerDocument.replace(/\D/g, ''),
            nome: data.payerName,
          },
          valor: {
            original: data.amount.toFixed(2),
          },
          chave: this.configService.get('SICOOB_PIX_KEY'),
          solicitacaoPagador: data.description,
          infoAdicionais: [
            {
              nome: 'Referência',
              valor: data.reference,
            },
          ],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
    );

    // Gerar QR Code
    const qrCodeResponse = await firstValueFrom(
      this.httpService.get(`/pix/v2/cob/${txid}/qrcode`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );

    return {
      txid,
      pixCopyPaste: qrCodeResponse.data.qrcode,
      qrCodeBase64: qrCodeResponse.data.imagemQrcode,
      expiresAt: addSeconds(new Date(), data.expirationSeconds || 3600),
    };
  }

  private generateTxId(): string {
    return `PIX${Date.now()}${randomBytes(8).toString('hex').toUpperCase()}`;
  }
}
```

### Webhook Handler

```typescript
// sicoob-webhook.controller.ts
@Controller('webhooks/sicoob')
export class SicoobWebhookController {
  constructor(
    private webhookHandler: SicoobWebhookHandler,
    private logger: PinoLogger,
  ) {}

  @Post('boleto')
  @HttpCode(200)
  async handleBoletoWebhook(
    @Body() payload: BoletoWebhookPayload,
    @Headers('x-webhook-signature') signature: string,
  ) {
    // Validar assinatura
    if (!this.webhookHandler.validateSignature(payload, signature)) {
      this.logger.warn({ signature }, 'Invalid webhook signature');
      throw new UnauthorizedException('Invalid signature');
    }

    await this.webhookHandler.processBoletoPayment(payload);

    return { received: true };
  }

  @Post('pix')
  @HttpCode(200)
  async handlePixWebhook(
    @Body() payload: PixWebhookPayload,
    @Headers('x-webhook-signature') signature: string,
  ) {
    if (!this.webhookHandler.validateSignature(payload, signature)) {
      throw new UnauthorizedException('Invalid signature');
    }

    await this.webhookHandler.processPixPayment(payload);

    return { received: true };
  }
}

// sicoob-webhook.handler.ts
@Injectable()
export class SicoobWebhookHandler {
  constructor(
    private paymentService: PaymentService,
    private eventEmitter: EventEmitter2,
    private logger: PinoLogger,
  ) {}

  validateSignature(payload: any, signature: string): boolean {
    const secret = this.configService.get('SICOOB_WEBHOOK_SECRET');
    const expectedSignature = createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  }

  async processBoletoPayment(payload: BoletoWebhookPayload): Promise<void> {
    const { nossoNumero, situacao, dataPagamento, valorPago } = payload;

    this.logger.info({ nossoNumero, situacao }, 'Processing boleto webhook');

    // Buscar pagamento pelo número do banco
    const payment = await this.paymentService.findByBankNumber(nossoNumero);

    if (!payment) {
      this.logger.warn({ nossoNumero }, 'Payment not found for webhook');
      return;
    }

    if (situacao === 'LIQUIDADO') {
      await this.paymentService.markAsPaid({
        paymentId: payment.id,
        paidAmount: valorPago,
        paidAt: new Date(dataPagamento),
        method: 'BOLETO',
        transactionId: nossoNumero,
      });

      // Emitir evento para outros módulos
      this.eventEmitter.emit(
        'payment.confirmed',
        new PaymentConfirmedEvent({
          paymentId: payment.id,
          enrollmentId: payment.enrollmentId,
          amount: valorPago,
          method: 'BOLETO',
        }),
      );
    }

    // Salvar log do webhook
    await this.paymentService.logTransaction({
      paymentId: payment.id,
      type: 'WEBHOOK',
      payload,
    });
  }

  async processPixPayment(payload: PixWebhookPayload): Promise<void> {
    const { txid, status, valor } = payload.pix[0];

    if (status !== 'CONCLUIDA') return;

    const payment = await this.paymentService.findByPixTxId(txid);

    if (!payment) {
      this.logger.warn({ txid }, 'Payment not found for PIX webhook');
      return;
    }

    await this.paymentService.markAsPaid({
      paymentId: payment.id,
      paidAmount: parseFloat(valor),
      paidAt: new Date(),
      method: 'PIX',
      transactionId: txid,
    });

    this.eventEmitter.emit(
      'payment.confirmed',
      new PaymentConfirmedEvent({
        paymentId: payment.id,
        enrollmentId: payment.enrollmentId,
        amount: parseFloat(valor),
        method: 'PIX',
      }),
    );
  }
}
```

### Eventos de Domínio

```typescript
// events/payment-confirmed.event.ts
export class PaymentConfirmedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly enrollmentId: string,
    public readonly amount: number,
    public readonly method: 'BOLETO' | 'PIX',
    public readonly occurredAt: Date = new Date(),
  ) {}
}

// enrollments/listeners/payment-confirmed.listener.ts
@Injectable()
export class PaymentConfirmedListener {
  constructor(
    private enrollmentService: EnrollmentService,
    private notificationService: NotificationService,
  ) {}

  @OnEvent('payment.confirmed')
  async handlePaymentConfirmed(event: PaymentConfirmedEvent) {
    // Ativar matrícula se estava pendente
    await this.enrollmentService.activateIfPending(event.enrollmentId);

    // Enviar confirmação ao aluno
    await this.notificationService.sendPaymentConfirmation({
      enrollmentId: event.enrollmentId,
      amount: event.amount,
      method: event.method,
      paidAt: event.occurredAt,
    });
  }
}
```

### Configuração de Ambiente

```bash
# .env
SICOOB_API_URL=https://api.sicoob.com.br
SICOOB_CLIENT_ID=your-client-id
SICOOB_CLIENT_SECRET=your-client-secret
SICOOB_CONVENIO=123456
SICOOB_CONTA=12345678
SICOOB_PIX_KEY=pix@academia.com.br
SICOOB_WEBHOOK_SECRET=your-webhook-secret

# Sandbox para desenvolvimento
SICOOB_SANDBOX=true
```

### Mock para Desenvolvimento

```typescript
// sicoob-mock.service.ts
@Injectable()
export class SicoobMockService implements ISicoobService {
  async createBoleto(data: CreateBoletoDto): Promise<BoletoResponse> {
    const mockNumber = `MOCK${Date.now()}`;

    return {
      bankNumber: mockNumber,
      barcode: '23793.38128 60000.000003 00000.000408 1 84340000010000',
      digitableLine: '23793381286000000000300000000401840000001000',
      pdfUrl: `http://localhost:3001/mock/boleto/${mockNumber}.pdf`,
      dueDate: data.dueDate,
      amount: data.amount,
    };
  }

  async createPixCharge(data: CreatePixDto): Promise<PixResponse> {
    const txid = `MOCK${Date.now()}`;

    return {
      txid,
      pixCopyPaste: '00020126580014br.gov.bcb.pix0136mock-pix-code',
      qrCodeBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', // QR mock
      expiresAt: addHours(new Date(), 1),
    };
  }

  // Endpoint para simular webhook em dev
  async simulatePayment(paymentId: string): Promise<void> {
    const payment = await this.paymentRepository.findById(paymentId);

    // Simular callback do banco
    await this.webhookHandler.processBoletoPayment({
      nossoNumero: payment.boletoCode,
      situacao: 'LIQUIDADO',
      dataPagamento: new Date().toISOString(),
      valorPago: payment.amount,
    });
  }
}
```

## Segurança

### Checklist

- [x] Credenciais em variáveis de ambiente
- [x] Validação de assinatura em webhooks
- [x] HTTPS obrigatório
- [x] Rate limiting em endpoints de webhook
- [x] Logs de todas as transações
- [x] Retry automático em falhas temporárias
- [x] Timeout configurado (30s)

### Webhook Security

```typescript
// Validar IP de origem (lista branca do Sicoob)
@Injectable()
export class SicoobIpGuard implements CanActivate {
  private readonly allowedIps = [
    '200.201.x.x', // IPs do Sicoob
  ];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;

    // Em dev, permitir qualquer IP
    if (process.env.NODE_ENV !== 'production') return true;

    return this.allowedIps.some((allowed) => ip.startsWith(allowed.replace('.x.x', '')));
  }
}
```

## Consequências

### Positivas

-  Automação completa de pagamentos
-  Baixa automática via webhook
-  Suporte a boleto e PIX
-  Eventos de domínio para desacoplamento

### Negativas

-  Dependência de API externa
-  Necessidade de conta no Sicoob
-  Sandbox limitado do Sicoob

## Referências

- [Sicoob API Documentation](https://developers.sicoob.com.br/)
- [PIX API BCB](https://www.bcb.gov.br/estabilidadefinanceira/pix)
