# US-001-003: Estrutura do Frontend (Next.js)

## 📋 Informações

| Campo            | Valor                           |
| ---------------- | ------------------------------- |
| **ID**           | US-001-003                      |
| **Épico**        | EPIC-001                        |
| **Título**       | Estrutura do Frontend (Next.js) |
| **Estimativa**   | 5 horas                         |
| **Prioridade**   | 🔴 Crítica                      |
| **Dependências** | US-001-001                      |
| **Status**       | 📋 Backlog                      |

---

## 📝 User Story

**Como** desenvolvedor frontend  
**Quero** uma estrutura Next.js 14 com App Router  
**Para** desenvolver interfaces modernas e performáticas

---

## 🎯 Objetivos

1. Criar projeto Next.js 14 com App Router
2. Configurar TailwindCSS
3. Instalar e configurar shadcn/ui
4. Setup React Query para data fetching
5. Setup Zustand para estado global
6. Criar componentes base
7. Criar Dockerfile otimizado

---

## ✅ Critérios de Aceite

- [ ] Projeto Next.js criado em apps/web
- [ ] App Router configurado
- [ ] TailwindCSS funcionando
- [ ] shadcn/ui instalado com tema
- [ ] React Query configurado
- [ ] Zustand configurado
- [ ] Componentes base criados
- [ ] Dockerfile multi-stage
- [ ] Hot reload funcionando

---

## 🧠 Chain of Thought (Raciocínio)

```
PASSO 1: Criar projeto Next.js
├── App Router (não Pages)
├── TypeScript strict
├── ESLint configurado
└── src/ directory

PASSO 2: Configurar estilização
├── TailwindCSS
├── CSS variables para tema
├── shadcn/ui components
└── Fontes customizadas

PASSO 3: Setup de estado e data
├── React Query (TanStack)
│   └── Para server state
├── Zustand
│   └── Para client state
└── React Hook Form + Zod
    └── Para formulários

PASSO 4: Estrutura de pastas
├── app/ - Routes (App Router)
├── components/ - UI components
├── lib/ - Utilities
├── hooks/ - Custom hooks
├── stores/ - Zustand stores
└── types/ - TypeScript types

PASSO 5: Componentes base
├── Providers (Query, Theme)
├── Layout base
└── Componentes shadcn
```

---

## 🌳 Tree of Thought (Alternativas)

```
Styling Solution
├── TailwindCSS + shadcn/ui ✅ (escolhido)
│   ├── Prós: Produtividade, customizável
│   └── Contras: Curva de aprendizado
│
├── Styled Components
│   └── Contras: Runtime CSS, bundle size
│
└── CSS Modules
    └── Contras: Menos produtivo

State Management
├── Zustand ✅ (escolhido)
│   ├── Prós: Simples, leve, TypeScript
│   └── Contras: Menos features
│
├── Redux Toolkit
│   └── Contras: Boilerplate
│
└── Jotai
    └── Contras: Paradigma diferente

Data Fetching
├── React Query ✅ (escolhido)
│   ├── Prós: Cache, refetch, devtools
│   └── Contras: Mais uma dependência
│
└── SWR
    └── Contras: Menos features
```

---

## 📁 Estrutura Esperada

```
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
│
├── components/
│   ├── ui/                    # shadcn components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   │
│   └── shared/
│       ├── header.tsx
│       ├── sidebar.tsx
│       └── loading.tsx
│
├── lib/
│   ├── api.ts                 # API client
│   ├── utils.ts               # cn() helper
│   └── validations/
│       └── schemas.ts
│
├── hooks/
│   ├── use-auth.ts
│   └── use-media-query.ts
│
├── stores/
│   ├── auth.store.ts
│   └── ui.store.ts
│
├── types/
│   ├── api.ts
│   └── index.ts
│
├── public/
│   └── ...
│
├── Dockerfile
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
├── components.json           # shadcn config
├── jest.config.ts
└── package.json
```

---

## 🤖 Prompt para Implementação

```markdown
## Contexto

Estou criando o frontend de um sistema de gestão para academia de Pilates.
O backend NestJS já existe. Preciso criar o Next.js em apps/web.

## Princípios Obrigatórios

- Next.js 14 com App Router
- TDD - Testes com Testing Library
- TypeScript strict
- 100% Docker - Hot reload no container

## Tarefa

Crie a estrutura do frontend Next.js em apps/web:

### 1. Inicialização

- Next.js 14 com App Router
- TypeScript strict
- ESLint + Prettier
- src/ directory: NÃO (usar root)

### 2. Estilização

- TailwindCSS configurado
- CSS variables para tema dark/light
- Fonte: Inter (ou outra moderna)
- shadcn/ui instalado e configurado

### 3. Componentes shadcn (instalar)

- Button
- Input
- Card
- Form
- Dialog
- Toast
- Dropdown Menu
- Table
- Tabs

### 4. Providers Setup

- QueryClientProvider (React Query)
- ThemeProvider (next-themes)
- Configuração de cache

### 5. Estrutura de Pastas

- app/ com route groups
- components/ui e components/shared
- lib/ com utils e api client
- hooks/ custom hooks
- stores/ Zustand stores
- types/

### 6. API Client

- Fetch wrapper com interceptors
- Tratamento de erros
- Types das responses

### 7. Stores Zustand

- Auth store (user, token)
- UI store (sidebar, theme)

### 8. Páginas Placeholder

- / (redirect para login ou dashboard)
- /login (placeholder)
- /dashboard (placeholder)

### 9. Dockerfile

- Multi-stage build
- Node 20 Alpine
- Standalone output
- Health check

### 10. Testes

- Jest + Testing Library
- Exemplo de teste de componente

## Formato de Output

Para cada arquivo, mostre:

1. Path completo
2. Conteúdo completo
3. Explicação breve

## Importante

- Use App Router, não Pages Router
- shadcn/ui deve estar configurado
- Dark mode deve funcionar
```

---

## 📝 Arquivos Principais

### 1. package.json (apps/web)

```json
{
  "name": "@pilates/web",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.0.0",
    "react-hook-form": "^7.0.0",
    "@hookform/resolvers": "^3.0.0",
    "zod": "^3.0.0",
    "next-themes": "^0.2.0",
    "lucide-react": "^0.300.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/react": "^14.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "autoprefixer": "^10.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 2. tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### 3. app/providers.tsx

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 4. lib/api.ts

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(response.status, error.message || 'An error occurred', error);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};
```

### 5. stores/auth.store.ts

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    },
  ),
);
```

### 6. Dockerfile (apps/web)

```dockerfile
# =============================================
# STAGE 1: Dependencies
# =============================================
FROM node:20-alpine AS deps

RUN corepack enable && corepack prepare pnpm@8 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/

RUN pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile

# =============================================
# STAGE 2: Builder
# =============================================
FROM deps AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm --filter @pilates/web build

# =============================================
# STAGE 3: Production
# =============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

---

## 🔴🟢🔵 TDD Workflow

### Teste de Componente

```typescript
// components/ui/__tests__/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);

    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## ✅ Checklist de Verificação

- [ ] Next.js rodando em http://localhost:3000
- [ ] TailwindCSS funcionando
- [ ] shadcn/ui componentes instalados
- [ ] Dark mode funcionando
- [ ] React Query provider ativo
- [ ] Zustand store funcionando
- [ ] API client configurado
- [ ] Hot reload funcionando
- [ ] Testes passando

---

## 🔗 Próxima User Story

→ [US-001-004: Docker Compose Completo](./US-001-004-docker-compose.md)

---

## 📎 Referências

- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs/)
