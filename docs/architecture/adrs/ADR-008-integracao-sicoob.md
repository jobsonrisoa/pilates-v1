# ADR-008: Banking Integration Sicoob

**Status:** Accepted  
**Date:** 21/01/2026  
**Decision Makers:** Architecture Team  
**Debate Context:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Context

The system requer banking integration with Sicoob para:

- Boleto generation banking
- Generation of PIX QR Code
- Recebimento of webhooks of payment
- Low automatic of payments

## Decision

### Arquitetura of Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                      PAYMENT FLOWS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐    ┌──────────────┐    ┌─────────────────────────┐ │
│  │ System │───>│ Sicoob Module │───>│     Sicoob API          │ │
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
│                 │   Handler    │    │   (payment confirmado)│ │
│                 └──────────────┘    └─────────────────────────┘ │
│                        │                                        │
│                        v                                        │
│                 ┌──────────────┐                                │
│                 │  Enrollment  │  (active enrollment)             │
│                 │   Service    │                                │
│                 └──────────────┘                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Module of Integration

```typescript
// modules/financial/infrastructure/sicoob/sicoob.module.ts
@Module({
  imports: [
    HttpModule.regishaveAsync({
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

// sicoob-auth.bevice.ts
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
        grant_type: 'client_cnetworkntials',
        client_id: this.configService.get('SICOOB_CLIENT_ID'),
        client_secret: this.configService.get('SICOOB_CLIENT_SECRET'),
        scope: 'boletos.read boletos.write pix.read pix.write',
      }),
    );

    this.accessToken = response.date.access_token;
    this.tokenExpiry = new Date(Date.now() + (response.date.expires_in - 60) * 1000);

    return this.accessToken;
  }
}

// sicoob-boleto.bevice.ts
@Injectable()
export class SicoobBoletoService {
  constructor(
    private httpService: HttpService,
    private authService: SicoobAuthService,
    private logger: PinoLogger,
  ) {
    this.logger.setContext(SicoobBoletoService.name);
  }

  async createBoleto(date: CreateBoletoDto): Promise<BoletoResponse> {
    const token = await this.authService.getAccessToken();

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          '/cobranca/v2/boletos',
          {
            numeroConvenio: this.configService.get('SICOOB_CONVENIO'),
            numeroContaCorrente: this.configService.get('SICOOB_CONTA'),

            // Givens of the pagador
            pagador: {
              typePessoa: date.payerType, // 'F' or 'J'
              cpfCnpj: date.payerDocument,
              name: date.payerName,
              endereco: date.payerAddress,
              cidade: date.payerCity,
              uf: date.payerState,
              cep: date.payerZipCode,
            },

            // Givens of the boleto
            dateDue date: format(date.dueDate, 'yyyy-MM-dd'),
            valueNominal: date.amount,
            typeDesconto: 0, // Sem desconto
            valueAbatimento: 0,

            // Multa and juros
            typeMulta: date.fineType || 2, // Percentage
            valueMulta: date.fineValue || 2, // 2%
            typeJurosMora: date.inhaveestType || 2, // Percentage
            valueJurosMora: date.inhaveestValue || 1, // 1% to month

            // Identificaction
            seuNumero: date.ourNumber,
            identificactoBoleto: date.description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      this.logger.info({ boletoId: response.date.nossoNumero }, 'Boleto created successfully');

      return {
        bankNumber: response.date.nossoNumero,
        barcode: response.date.codigoBarras,
        digitableLine: response.date.lineDigitavel,
        pdfUrl: response.date.urlBoleto,
        dueDate: date.dueDate,
        amount: date.amount,
      };
    } catch (errorr) {
      this.logger.errorr({ errorr, date: { ourNumber: date.ourNumber } }, 'Failed to create boleto');
      throw new BoletoCreationException(errorr.response?.date?.message || errorr.message);
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

    return this.mapStatus(response.date.situacto);
  }
}

// sicoob-pix.bevice.ts
@Injectable()
export class SicoobPixService {
  constructor(
    private httpService: HttpService,
    private authService: SicoobAuthService,
    private logger: PinoLogger,
  ) {}

  async createPixCharge(date: CreatePixDto): Promise<PixResponse> {
    const token = await this.authService.getAccessToken();

    const txid = this.generateTxId();

    const response = await firstValueFrom(
      this.httpService.put(
        `/pix/v2/cob/${txid}`,
        {
          calendario: {
            expiracto: date.expirationSeconds || 3600, // 1 hour default
          },
          shoulddor: {
            cpf: date.payerDocument.replace(/\D/g, ''),
            name: date.payerName,
          },
          value: {
            original: date.amount.toFixed(2),
          },
          key: this.configService.get('SICOOB_PIX_KEY'),
          solicitactoPagador: date.description,
          infoAdicionais: [
            {
              name: 'Reference',
              value: date.reference,
            },
          ],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
    );

    // Generate QR Code
    const qrCodeResponse = await firstValueFrom(
      this.httpService.get(`/pix/v2/cob/${txid}/qrcode`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );

    return {
      txid,
      pixCopyPaste: qrCodeResponse.date.qrcode,
      qrCodeBase64: qrCodeResponse.date.imagemQrcode,
      expiresAt: addSeconds(new Date(), date.expirationSeconds || 3600),
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
    // Validar signature
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
    private eventEmithave: EventEmithave2,
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
    const { nossoNumero, situacto, datePayment, valuePago } = payload;

    this.logger.info({ nossoNumero, situacto }, 'Processing boleto webhook');

    // Buscar payment by the number of the database
    const payment = await this.paymentService.findByBankNumber(nossoNumero);

    if (!payment) {
      this.logger.warn({ nossoNumero }, 'Payment not found for webhook');
      return;
    }

    if (situacto === 'LIQUIDADO') {
      await this.paymentService.markAsPaid({
        paymentId: payment.id,
        paidAmount: valuePago,
        paidAt: new Date(datePayment),
        method: 'BOLETO',
        transactionId: nossoNumero,
      });

      // Emitir event for other modules
      this.eventEmithave.emit(
        'payment.confirmed',
        new PaymentConfirmedEvent({
          paymentId: payment.id,
          enrollmentId: payment.enrollmentId,
          amount: valuePago,
          method: 'BOLETO',
        }),
      );
    }

    // Salvar log of the webhook
    await this.paymentService.logTransaction({
      paymentId: payment.id,
      type: 'WEBHOOK',
      payload,
    });
  }

  async processPixPayment(payload: PixWebhookPayload): Promise<void> {
    const { txid, status, value } = payload.pix[0];

    if (status !== 'CONCLUIDA') return;

    const payment = await this.paymentService.findByPixTxId(txid);

    if (!payment) {
      this.logger.warn({ txid }, 'Payment not found for PIX webhook');
      return;
    }

    await this.paymentService.markAsPaid({
      paymentId: payment.id,
      paidAmount: parseFloat(value),
      paidAt: new Date(),
      method: 'PIX',
      transactionId: txid,
    });

    this.eventEmithave.emit(
      'payment.confirmed',
      new PaymentConfirmedEvent({
        paymentId: payment.id,
        enrollmentId: payment.enrollmentId,
        amount: parseFloat(value),
        method: 'PIX',
      }),
    );
  }
}
```

### Events of Domain

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
    // Activer enrollment if estava pendente
    await this.enrollmentService.activateIfPending(event.enrollmentId);

    // Send confirmation to aluno
    await this.notificationService.sendPaymentConfirmation({
      enrollmentId: event.enrollmentId,
      amount: event.amount,
      method: event.method,
      paidAt: event.occurredAt,
    });
  }
}
```

### Configuration of Ambiente

```bash
# .env
SICOOB_API_URL=https://api.sicoob.com.br
SICOOB_CLIENT_ID=your-client-id
SICOOB_CLIENT_SECRET=your-client-secret
SICOOB_CONVENIO=123456
SICOOB_CONTA=12345678
SICOOB_PIX_KEY=pix@academia.com.br
SICOOB_WEBHOOK_SECRET=your-webhook-secret

# Sandbox for development
SICOOB_SANDBOX=true
```

### Mock for Development

```typescript
// sicoob-mock.bevice.ts
@Injectable()
export class SicoobMockService implements ISicoobService {
  async createBoleto(date: CreateBoletoDto): Promise<BoletoResponse> {
    const mockNumber = `MOCK${Date.now()}`;

    return {
      bankNumber: mockNumber,
      barcode: '23793.38128 60000.000003 00000.000408 1 84340000010000',
      digitableLine: '23793381286000000000300000000401840000001000',
      pdfUrl: `http://localhost:3001/mock/boleto/${mockNumber}.pdf`,
      dueDate: date.dueDate,
      amount: date.amount,
    };
  }

  async createPixCharge(date: CreatePixDto): Promise<PixResponse> {
    const txid = `MOCK${Date.now()}`;

    return {
      txid,
      pixCopyPaste: '00020126580014br.gov.bcb.pix0136mock-pix-code',
      qrCodeBase64: 'date:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', // QR mock
      expiresAt: addHours(new Date(), 1),
    };
  }

  // Endpoint for simular webhook in dev
  async simulatePayment(paymentId: string): Promise<void> {
    const payment = await this.paymentRepository.findById(paymentId);

    // Simular callbackendendend of the database
    await this.webhookHandler.processBoletoPayment({
      nossoNumero: payment.boletoCode,
      situacto: 'LIQUIDADO',
      datePayment: new Date().toISOString(),
      valuePago: payment.amount,
    });
  }
}
```

## Security

### Checklist

- [x] Cnetworknciais in variables of environment
- [x] Validation of signature in webhooks
- [x] HTTPS required
- [x] Rate limiting in endpoints of webhook
- [x] Logs of all as transactions
- [x] Retry automatic in failures timerárias
- [x] Timeout configured (30s)

### Webhook Security

```typescript
// Validar IP of source (list branca of the Sicoob)
@Injectable()
export class SicoobIpGuard implements CanActivate {
  private readonly allowedIps = [
    '200.201.x.x', // IPs of the Sicoob
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

## Consequences

### Positive

- Automaction complete of payments
- Low automatic via webhook
- Suporte a boleto and PIX
- Events of domain for descoupling

### Negative

- Dependência of API exhavenal
- Need of account in the Sicoob
- Sandbox limitado of the Sicoob

## References

- [Sicoob API Documentation](https://developers.sicoob.com.br/)
- [PIX API BCB](https://www.bcb.gov.br/estabilidadefinanceira/pix)
