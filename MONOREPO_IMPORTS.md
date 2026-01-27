# Mono Repo Import Examples

## How to Import Shared Code

This guide shows you exactly how to import code from the shared `@ecom/common` library in your services.

## Examples by Location

### In API Gateway (`apps/api-gateway/`)

```typescript
// File: apps/api-gateway/src/gateway.controller.ts

// ✅ Import from shared library using path alias
import {
  LoginRequestDto,
  LoginResponseDto,
  SERVICE_PORTS,
  ROUTES,
} from "@ecom/common";

// ✅ Import local services
import { ProxyService } from "./proxy.service";
import { AuthIntrospectionService } from "./auth-introspection.service";

// ❌ Don't use relative paths for shared code
// import { LoginDto } from '../../../libs/common/src/dto/auth.dto';

@Controller("api")
export class GatewayController {
  constructor(
    private proxy: ProxyService,
    private auth: AuthIntrospectionService,
  ) {}

  // Your handler code
}
```

### In Auth Service (`apps/auth-service/`)

```typescript
// File: apps/auth-service/src/auth.service.ts

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

// ✅ Import shared DTOs
import { LoginRequestDto, LoginResponseDto, UserDto } from "@ecom/common";

@Injectable()
export class AuthService {
  constructor(private config: ConfigService) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    // Your login logic
    return {
      accessToken: "jwt-token-here",
    };
  }

  async validateUser(email: string): Promise<UserDto> {
    // Your validation logic
    return {
      id: "u1",
      email: email,
      roles: ["admin"],
    };
  }
}
```

### In Order Worker (`apps/order-worker/`)

```typescript
// File: apps/order-worker/src/order.controller.ts

import { Controller, Get, Post, Req, Body } from "@nestjs/common";

// ✅ Import shared types and constants
import { OrderDto, CreateOrderDto, SERVICE_PORTS } from "@ecom/common";

import { OrdersService } from "./orders/orders.service";

@Controller("orders")
export class OrderController {
  constructor(private ordersService: OrdersService) {}

  @Get("health")
  health() {
    return {
      ok: true,
      service: "order-worker",
      port: SERVICE_PORTS.ORDER_WORKER, // ✅ Using constant from shared library
    };
  }

  @Get()
  async list(@Req() req: any): Promise<{ userId: string; orders: OrderDto[] }> {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return { error: "Unauthorized" };
    }

    const orders = await this.ordersService.getAll();
    return { userId, orders };
  }

  @Post()
  async create(@Req() req: any, @Body() body: CreateOrderDto) {
    // Your create logic
  }
}
```

## Current Shared Library Structure

### Available from `@ecom/common`

```typescript
// ============ DTOs ============
import {
  LoginRequestDto,
  LoginResponseDto,
  AuthPayload,
  UserDto,
  CreateOrderDto,
  OrderItem,
  OrderDto,
  ListOrdersResponseDto,
} from "@ecom/common";

// ============ Constants ============
import {
  HTTP_TIMEOUT,
  SERVICE_PORTS, // { API_GATEWAY: 3000, AUTH: 3001, ORDER_WORKER: 3002 }
  ROUTES,
} from "@ecom/common";

// ============ Interfaces ============
import {
  ServiceRoute,
  ProxyOptions,
  ProxyResponse,
  TokenPayload,
} from "@ecom/common";
```

## File-by-File Imports

If you need to import from specific files in the shared library:

```typescript
// Import everything from a category
import * from '@ecom/common';

// Import specific exports
import { LoginDto, AuthPayload } from '@ecom/common';

// Granular imports (using barrel export)
import { HTTP_TIMEOUT, SERVICE_PORTS } from '@ecom/common';
```

## Adding New Shared Code

When you create new shared code, follow this pattern:

### Step 1: Create the file in libs/common

```typescript
// libs/common/src/utils/validation.ts
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  return /^\d{10}$/.test(phone);
}
```

### Step 2: Export from appropriate index

```typescript
// libs/common/src/index.ts
export * from "./constants";
export * from "./dto/auth.dto";
export * from "./dto/order.dto";
export * from "./interfaces";
export * from "./utils/validation"; // ← Add this
```

### Step 3: Use in your services

```typescript
// apps/api-gateway/src/some.service.ts
import { validateEmail, validatePhoneNumber } from "@ecom/common";

export class SomeService {
  verifyEmail(email: string) {
    if (!validateEmail(email)) {
      throw new Error("Invalid email");
    }
  }
}
```

## Best Practices

### ✅ Do This

```typescript
// Use path aliases for shared code
import { LoginDto, OrderDto } from "@ecom/common";

// Use relative imports for local code
import { AuthService } from "./auth.service";

// Group imports by source
import { LoginDto, OrderDto, SERVICE_PORTS } from "@ecom/common";
import { Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";
```

### ❌ Don't Do This

```typescript
// Don't use relative paths for shared library
import { LoginDto } from "../../../libs/common/src/dto/auth.dto";

// Don't scatter imports
import { LoginDto } from "@ecom/common";
import { OrderDto } from "@ecom/common";
import { SERVICE_PORTS } from "@ecom/common";

// Don't mix patterns inconsistently
import { something } from "@ecom/common/src/dto/auth.dto"; // Wrong path style
```

## Troubleshooting

### "Cannot find module '@ecom/common'"

**Check:**

1. Is tsconfig.json in your service updated with paths?
2. Is the file in `libs/common/src/`?
3. Is it exported from `libs/common/src/index.ts`?

**Solution:**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "paths": {
      "@ecom/common": ["../../libs/common/src"],
      "@ecom/common/*": ["../../libs/common/src/*"]
    }
  }
}
```

### Import works in IDE but fails at runtime

**Cause:** Docker container doesn't have shared library files

**Solution:**

- Ensure Dockerfile COPYs the entire workspace
- Check docker-compose.yml volumes configuration
- Rebuild containers: `docker-compose up --build`

### "Circular dependency" error

**Cause:** Shared library imports from a service

**Solution:**

- Keep `libs/common/` generic and service-agnostic
- Only services can import from shared library
- Never put service-specific code in shared library

## Quick Reference

| Location     | Import                                         | Usage                  |
| ------------ | ---------------------------------------------- | ---------------------- |
| Auth Service | `import { LoginDto } from '@ecom/common'`      | Use in login handler   |
| Order Worker | `import { OrderDto } from '@ecom/common'`      | Use in order endpoints |
| API Gateway  | `import { SERVICE_PORTS } from '@ecom/common'` | Route configuration    |
| Any Service  | `import { ... } from '@ecom/common'`           | Shared utilities       |

---

**Remember:** The `@ecom/common` alias makes your code cleaner and your shared library usage more obvious!
