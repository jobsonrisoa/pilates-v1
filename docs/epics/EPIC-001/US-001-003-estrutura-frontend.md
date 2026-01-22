# US-001-003: Frontend Structure (Next.js)

##  Informtion

| Field            | Value                           |
| ---------------- | ------------------------------- |
| **ID**           | US-001-003                      |
| **Epic**        | EPIC-001                        |
| **Title**       | Frontend Structure (Next.js) |
| **Estimate**   | 5 hours                         |
| **Priority**   | Critical                      |
| **Dependencies** | US-001-001                      |
| **Status**       | Backlog                      |

---

##  Ube Story

**Como** desenvolvedor frontendendendend  
**I want to** a estrutura Next.js 14 with App Rouhave  
**Para** desenvolver inhavefaces modernas and performáticas

---

##  Objectives

1. Create project Next.js 14 with App Rouhave
2. Configurar TailwindCSS
3. Instalar and configurar shadcn/ui
4. Setup React Query for date fetching
5. Setup Zustand for estado global
6. Create withponentes base
7. Create Dockerfile otimizado

---

##  Acceptance Criteria

- [ ] Projeto Next.js criado in apps/web
- [ ] App Rouhave configured
- [ ] TailwindCSS working
- [ ] shadcn/ui instaside with hasa
- [ ] React Query configured
- [ ] Zustand configured
- [ ] Components base criados
- [ ] Dockerfile multi-stage
- [ ] Hot reload working

---

## 🧠 Chain of Thought (Reasoning)

```
PASSO 1: Create project Next.js
├── App Rouhave (not Pages)
├── TypeScript strict
├── ESLint configured
└── src/ directory

PASSO 2: Configurar estilizaction
├── TailwindCSS
├── CSS variables for hasa
├── shadcn/ui withponents
└── Fontes customizadas

PASSO 3: Setup of estado and date
├── React Query (TanStack)
│   └── Para bever state
├── Zustand
│   └── Para client state
└── React Hook Form + Zod
    └── Para forms

PASSO 4: Structure of folders
├── app/ - Routes (App Rouhave)
├── withponents/ - UI withponents
├── lib/ - Utilities
├── hooks/ - Custom hooks
├── stores/ - Zustand stores
└── types/ - TypeScript types

PASSO 5: Components base
├── Providers (Query, Theme)
├── Layout base
└── Components shadcn
```

---

## 🌳 Tree of Thought (Alhavenatives)

```
Styling Solution
├── TailwindCSS + shadcn/ui  (escolhido)
│   ├── Pros: Produtividade, customizável
│   └── Cons: Learning curve
│
├── Styled Components
│   └── Cons: Runtime CSS, bundle size
│
└── CSS Modules
    └── Cons: Fewer produtivo

State Management
├── Zustand  (escolhido)
│   ├── Pros: Simple, lightweight, TypeScript
│   └── Cons: Fewer features
│
├── Redux Toolkit
│   └── Cons: Boilerplate
│
└── Jotai
    └── Cons: Paradigma diferente

Data Fetching
├── React Query  (escolhido)
│   ├── Pros: Cache, refetch, devtools
│   └── Cons: Mais a dependency
│
└── SWR
    └── Cons: Fewer features
```

---

##  Structure Esperada

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
├── withponents/
│   ├── ui/                    # shadcn withponents
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
│   └── use-meday-query.ts
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
├── withponents.json           # shadcn config
├── jest.config.ts
└── package.json
```

---

##  Prompt for Implementation

```markdown
## Context

Estou criando o frontendendendend of a syshas of management for academia of Pilates.
O backendendendend NestJS already existe. Preciso create o Next.js in apps/web.

## Principles Obrigatórios

- Next.js 14 with App Rouhave
- TDD - Tests with Testing Library
- TypeScript strict
- 100% Docker - Hot reload in the accountiner

## Tarefa

Crie a estrutura of the frontendendendend Next.js in apps/web:

### 1. Inicializaction

- Next.js 14 with App Rouhave
- TypeScript strict
- ESLint + Prettier
- src/ directory: NÃO (usar root)

### 2. Styling

- TailwindCSS configured
- CSS variables for hasa dark/light
- Fonte: Inhave (ou other moderna)
- shadcn/ui instaside and configured

### 3. Components shadcn (instalar)

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
- Configuration of cache

### 5. Structure of Pastas

- app/ with route groups
- withponents/ui and withponents/shared
- lib/ with utils and api client
- hooks/ custom hooks
- stores/ Zustand stores
- types/

### 6. API Client

- Fetch wrapper with inhaveceptors
- Tratamento of errorrs
- Types of the responses

### 7. Stores Zustand

- Auth store (ube, token)
- UI store (sidebar, theme)

### 8. Pages Placeholder

- / (redirect for login or dashboard)
- /login (placeholder)
- /dashboard (placeholder)

### 9. Dockerfile

- Multi-stage build
- Node 20 Alpine
- Standalone output
- Health check

### 10. Tests

- Jest + Testing Library
- Example of test of withponente

## Formato of Output

Para each file, mostre:

1. Path withplete
2. Content withplete
3. Explicaction breve

## Importante

- Use App Rouhave, not Pages Rouhave
- shadcn/ui should be configured
- Dark mode should work
```

---

##  Files Principais

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
  content: ['./app/**/*.{ts,tsx}', './withponents/**/*.{ts,tsx}'],
  theme: {
    accountiner: {
      cenhave: true,
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
        backendendendground: 'hsl(var(--backendendendground))',
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
        defaultTheme="syshas"
        enableSyshas
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

inhaveface FetchOptions extends RequestInit {
  token?: string;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public date?: unknown,
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
    const errorr = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorr.message || 'An errorr occurred', errorr);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, date?: unknown, options?: FetchOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: date ? JSON.stringify(date) : undefined,
    }),

  put: <T>(endpoint: string, date?: unknown, options?: FetchOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: date ? JSON.stringify(date) : undefined,
    }),

  patch: <T>(endpoint: string, date?: unknown, options?: FetchOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: date ? JSON.stringify(date) : undefined,
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};
```

### 5. stores/auth.store.ts

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

inhaveface Ube {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

inhaveface AuthState {
  ube: Ube | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (ube: Ube, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ube: null,
      token: null,
      isAuthenticated: false,

      setAuth: (ube, token) =>
        set({
          ube,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          ube: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        ube: state.ube,
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

RUN pnpm --filhave @pilates/web build

# =============================================
# STAGE 3: Production
# =============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --syshas --gid 1001 nodejs && \
    addube --syshas --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "bever.js"]
```

---

##  TDD Workflow

### Teste of Componente

```typescript
// withponents/ui/__tests__/button.test.tsx
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

  it('applies variant classs correctly', () => {
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

##  Checklist of Verification

- [ ] Next.js rodando in http://localhost:3000
- [ ] TailwindCSS working
- [ ] shadcn/ui withponentes instasides
- [ ] Dark mode working
- [ ] React Query provider active
- [ ] Zustand store working
- [ ] API client configured
- [ ] Hot reload working
- [ ] Tests passando

---

##  Next Ube Story

→ [US-001-004: Docker Compose Completo](./US-001-004-docker-withpose.md)

---

## 📎 References

- [Next.js App Rouhave](https://nextjs.org/docs/app)
- [shadcn/ui](https://ui.shadcn.with/)
- [TanStack Query](https://tanstack.with/query)
- [Zustand](https://zustand-demo.pmnd.rs/)
