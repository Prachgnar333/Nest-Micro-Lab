# Mono Repo Setup & Configuration

## Overview

This is a NestJS-based monorepo using npm workspaces with TypeScript path aliases for clean imports across services and shared libraries.

## Mono Repo Structure

```
ecom-microservices/
├── apps/                          # Microservices applications
│   ├── api-gateway/               # API Gateway service
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── auth-service/              # Authentication service
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── order-worker/              # Order management service
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
│
├── libs/                          # Shared libraries
│   └── common/                    # Shared DTOs, interfaces, constants
│       ├── src/
│       │   ├── constants/         # Shared constants
│       │   ├── dto/               # Data Transfer Objects
│       │   ├── interfaces/        # TypeScript interfaces
│       │   └── index.ts           # Barrel export
│       └── package.json
│
├── package.json                   # Root workspace config
├── tsconfig.json                  # Root TypeScript config with path aliases
├── docker-compose.yml             # Container orchestration
└── .env                           # Environment variables
```

## TypeScript Path Aliases

The mono repo is configured with TypeScript path aliases for clean, import statements. Instead of relative paths like:

```typescript
import { LoginDto } from "../../../libs/common/src/dto/auth.dto";
```

You can write:

```typescript
import { LoginDto } from "@ecom/common";
```

### Configuration

The path aliases are defined in:

1. **Root [tsconfig.json](tsconfig.json)** - Base configuration

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@ecom/common": ["libs/common/src"],
      "@ecom/common/*": ["libs/common/src/*"]
    }
  }
}
```

2. **Service [tsconfig.json](apps/api-gateway/tsconfig.json) files** - Extend root config

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

## Workspace Configuration

The root [package.json](package.json) defines npm workspaces:

```json
{
  "name": "ecom-microservices",
  "workspaces": ["apps/*", "libs/*"]
}
```

This allows:

- Shared dependency management
- Monolithic scripts that run across all workspaces
- Efficient hoisting of common dependencies

## Shared Library: @ecom/common

Location: `libs/common/`

The shared library provides common types and utilities used across all services.

### Contents

```
libs/common/src/
├── constants/
│   └── index.ts          # HTTP_TIMEOUT, SERVICE_PORTS, ROUTES
├── dto/
│   ├── auth.dto.ts       # LoginRequestDto, LoginResponseDto
│   └── order.dto.ts      # OrderDto, CreateOrderDto
├── interfaces/
│   └── index.ts          # ServiceRoute, ProxyOptions, TokenPayload
└── index.ts              # Barrel export
```

### Usage in Services

**Example: Using shared DTOs in api-gateway**

```typescript
import { LoginRequestDto, LoginResponseDto } from "@ecom/common";

// Now you can use these types across the gateway
```

**Example: Using constants in order-worker**

```typescript
import { SERVICE_PORTS, ROUTES } from "@ecom/common";

console.log(SERVICE_PORTS.ORDER_WORKER); // 3002
```

## Package Management

### Installing Dependencies

Install to root (all workspaces):

```bash
npm install @nestjs/common --workspace
```

Install to specific workspace:

```bash
npm install @nestjs/common --workspace=api-gateway
```

### Running Scripts

Run script in specific workspace:

```bash
npm run build --workspace=api-gateway
```

Run script in all workspaces:

```bash
npm run build --workspaces
```

## Available Scripts

All scripts in root [package.json](package.json):

```bash
npm start           # Start all services: docker-compose up -d
npm stop            # Stop all services: docker-compose down
npm run build       # Build and start services
npm run restart     # Restart services
npm run ps          # Show running containers
npm run logs        # Follow all logs
npm run logs:gateway  # Follow gateway logs
npm run logs:auth     # Follow auth service logs
npm run logs:orders   # Follow order worker logs
```

## Import Patterns

### Correct Usage ✅

```typescript
// From @ecom/common
import { LoginDto } from "@ecom/common";
import { SERVICE_PORTS } from "@ecom/common";
import { ServiceRoute } from "@ecom/common";

// From local files (relative)
import { AuthService } from "./auth.service";
import { GatewayController } from "./gateway.controller";

// From npm packages
import { Controller, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
```

### Incorrect Usage ❌

```typescript
// Don't use relative paths for shared library
import { LoginDto } from "../../../libs/common/src/dto/auth.dto";

// Don't mix import patterns inconsistently
import { LoginDto } from "@ecom/common/dto/auth.dto"; // Use barrel export instead
```

## Adding New Shared Code

To add new shared functionality:

1. Create file in `libs/common/src/` directory
2. Export from appropriate index file
3. Update `libs/common/src/index.ts` barrel export
4. Use via `@ecom/common` alias in services

Example: Adding a new utility

```typescript
// libs/common/src/utils/validators.ts
export function validateEmail(email: string): boolean {
  // validation logic
}

// libs/common/src/index.ts
export * from "./utils/validators";

// In any service:
import { validateEmail } from "@ecom/common";
```

## Extending the Mono Repo

### Adding a New Service

1. Create directory: `apps/my-service/`
2. Copy structure from existing service
3. Update package.json name: `@ecom/my-service`
4. Create tsconfig.json with paths to shared library
5. Update docker-compose.yml if needed

### Adding a New Library

1. Create directory: `libs/my-lib/`
2. Create `libs/my-lib/src/index.ts` barrel export
3. Create `libs/my-lib/package.json` with name: `@ecom/my-lib`
4. Add path alias to root tsconfig.json:
   ```json
   {
     "paths": {
       "@ecom/my-lib": ["libs/my-lib/src"],
       "@ecom/my-lib/*": ["libs/my-lib/src/*"]
     }
   }
   ```
5. Update service tsconfig.json files similarly

## Best Practices

### 1. Use Path Aliases

- Always import from `@ecom/*` for shared code
- Use relative imports only for service-specific modules

### 2. Organize Code by Feature

```
libs/common/src/
├── auth/           # Auth-related DTOs
├── orders/         # Order-related DTOs
├── utils/          # Utility functions
└── constants/      # Shared constants
```

### 3. Barrel Exports

Always export from index.ts files for cleaner imports:

```typescript
// ✅ Good
export * from "./auth.dto";
export * from "./order.dto";

// ❌ Avoid
// Make users import specific files
```

### 4. Version Management

- Services versions: `apps/*/package.json`
- Libraries versions: `libs/*/package.json`
- Keep root package.json for workspace management only

## TypeScript Compilation

TypeScript will resolve paths according to the following hierarchy:

1. **Service-level tsconfig.json** - Most specific
2. **Root tsconfig.json** - Base configuration
3. **Extends mechanism** - Inherited configuration

This ensures:

- Each service has proper path resolution
- Services can have specific compiler options
- Shared configuration is centralized

## Docker & Mono Repo

Each service has its own Dockerfile that:

- Copies the entire mono repo
- Uses its specific tsconfig.json
- Compiles only its code
- Runs within its container independently

This allows:

- Services to use shared code at compile time
- No runtime dependency on workspace structure
- Clean separation of concerns

## IDE Support

### VS Code

Path aliases work automatically in VS Code. You'll see:

- IntelliSense for `@ecom/*` imports
- Go-to-definition navigation
- Refactoring support across shared code

### TypeScript CLI

For type checking across the mono repo:

```bash
npx tsc --noEmit
```

This checks all files including shared libraries.

## Common Issues & Solutions

### Issue: Module not found @ecom/common

**Solution:**

- Verify tsconfig.json has paths configured
- Check relative path from service to libs/common is correct
- Restart TypeScript compiler in IDE

### Issue: Imports not resolving at runtime

**Solution:**

- Ensure docker containers rebuild after tsconfig changes
- Check Dockerfile COPY commands include libs/
- Verify NODE_PATH or ts-node configuration

### Issue: Circular dependencies

**Solution:**

- Shared library should never import from services
- Services can import from shared library only
- Keep shared code truly generic

## Further Reading

- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
- [NPM Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [NestJS Monorepo](https://docs.nestjs.com/cli/monorepo)

---

**The mono repo is now fully configured with TypeScript path aliases and npm workspaces!**
