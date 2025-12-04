# nest-micro-lab

Tiny event-driven order system (NestJS + RabbitMQ).

## Services
- `api-gateway` — NestJS HTTP service; POST `/orders` publishes `order_created` events to RabbitMQ.
- `order_worker` — NestJS microservice; listens to `order_created` events and processes orders.
- `rabbitmq` — RabbitMQ with management UI (15672).

## Quick start (from project root)

Build images and start services:

```powershell
cd "d:\PrachBackUp22072025\SE 3\Software Architecture\nest-micro-lab"
docker compose build
docker compose up -d
```

View logs:

```powershell
# all logs
docker compose logs -f
# or just worker logs
docker compose logs -f order-worker
```

RabbitMQ management UI: http://localhost:15672 (user: `admin`, pass: `admin`).

## Test the flow (curl / PowerShell)

PowerShell example:

```powershell
$body = @{orderId = 1; item = "Coffee"; quantity = 2} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/orders" -Method POST -ContentType "application/json" -Body $body
```

curl example (Linux/macOS/git-bash):

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"orderId": 1, "item": "Coffee", "quantity": 2}'
```

Expected:
- HTTP 201 response: `{"status":"Order accepted","order":{...}}`
- `order-worker` logs show `Received order_created event: ...` and `Order processed successfully`.

## Notes
- I removed the obsolete `version` field from `docker-compose.yml` because newer Compose ignores it and logs a warning.
- There may be transient RMQ acknowledgement warnings in logs; these do not prevent the basic flow from working.

If you want, I can add:
- A small HTTP GET endpoint to return processed orders,
- A small script to send multiple test orders,
- Or tweak the RabbitMQ queue options for persistence.
