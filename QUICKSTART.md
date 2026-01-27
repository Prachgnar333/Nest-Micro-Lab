# Quick Start Guide

## Prerequisites

- Docker and Docker Compose installed
- PowerShell or Bash terminal
- Port 3000, 3001, 3002, 5432, 5672 available

## Starting the System

```bash
cd ecom-microservices
docker-compose up -d
```

Wait 10-15 seconds for all services to initialize and compile TypeScript.

## Verify Services Running

```bash
docker-compose ps
```

All 5 services should show "Up" status:

- api-gateway
- auth-service
- order-worker
- postgres
- rabbitmq

## Quick Test Flow

### 1. Login and Get Token (Copy the token)

```powershell
$response = Invoke-WebRequest `
  -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@demo.com","password":"admin123"}'

$token = ($response.Content | ConvertFrom-Json).accessToken
Write-Host "Token: $token"
```

### 2. Get Orders List

```powershell
$authHeader = @{ "Authorization" = "Bearer $token" }
$response = Invoke-WebRequest `
  -Uri "http://localhost:3000/api/orders" `
  -Method GET `
  -Headers $authHeader

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### 3. Create an Order

```powershell
$authHeader = @{ "Authorization" = "Bearer $token" }
$response = Invoke-WebRequest `
  -Uri "http://localhost:3000/api/orders" `
  -Method POST `
  -Headers $authHeader `
  -ContentType "application/json" `
  -Body '{"item":"laptop","quantity":1,"price":999.99}'

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### 4. Check Health (No Auth Required)

```powershell
Invoke-WebRequest `
  -Uri "http://localhost:3000/api/orders/health" `
  -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

## Demo Users

| Email          | Password | Role  |
| -------------- | -------- | ----- |
| admin@demo.com | admin123 | admin |
| user@demo.com  | user123  | user  |

## Common Commands

```bash
# View logs for specific service
docker-compose logs -f api-gateway
docker-compose logs -f auth-service
docker-compose logs -f order-worker

# Restart a service
docker-compose restart api-gateway

# Stop all services
docker-compose down

# Remove volumes (database data)
docker-compose down -v
```

## Service URLs

- API Gateway: http://localhost:3000
- Auth Service: http://localhost:3001
- Order Worker: http://localhost:3002
- PostgreSQL: localhost:5432
- RabbitMQ Admin: http://localhost:15672 (guest/guest)

## Troubleshooting

**Services not starting:**

- Check Docker is running
- Check ports are available
- View logs: `docker-compose logs [service]`

**Port already in use:**

- Change ports in docker-compose.yml
- Or kill process using the port

**Compilation errors:**

- Wait longer for TypeScript to compile (can take 30 seconds)
- Check logs: `docker-compose logs [service]`

**JWT token expired:**

- Login again to get a new token
- Default expiry is 1 hour

## Architecture Diagram

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ HTTP Requests
       │
       ▼
┌─────────────────────────────────┐
│    API Gateway (Port 3000)      │
│  - Route requests               │
│  - Validate JWT tokens          │
│  - Propagate identity headers   │
│  - Track requests with IDs      │
└──┬───────────────────────────┬──┘
   │                           │
   │ /auth                     │ /orders
   │                           │
   ▼                           ▼
┌──────────────────┐   ┌──────────────────┐
│  Auth Service    │   │  Order Worker    │
│  (Port 3001)     │   │  (Port 3002)     │
│  - Login         │   │  - Get/Create    │
│  - Token Gen     │   │  - Authorization │
│  - Validation    │   │  - Orders Logic  │
└────────┬─────────┘   └────────┬─────────┘
         │                      │
         └──────────┬───────────┘
                    │
                    ▼
            ┌───────────────────┐
            │    PostgreSQL     │
            │  (Port 5432)      │
            └───────────────────┘
```

## What's Next?

After verifying the system works:

1. **Pattern B Implementation:**
   - Implement JWT validation in services themselves
   - Add passport-jwt to order-worker

2. **Database Integration:**
   - Add real order persistence to PostgreSQL
   - Use TypeORM for data access

3. **Advanced Features:**
   - Add RabbitMQ message processing
   - Implement circuit breaker pattern
   - Add caching with Redis
   - Add monitoring and logging

4. **Testing:**
   - Write E2E tests
   - Add unit tests
   - Test failure scenarios

See IMPLEMENTATION_SUMMARY.md for detailed documentation.
