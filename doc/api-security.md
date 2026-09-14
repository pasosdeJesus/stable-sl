# Seguridad de las rutas del API

## Estado actual

Las rutas del API (`apps/stable-sl/app/api/*/route.ts`) son **públicas**: no
implementan autenticación. La protección actual se limita a:

1. **Validación de entrada**: formato de billetera (`0x` + 40 hex), formato de
   teléfono (`0` + 8 dígitos), nombre no vacío, token no vacío, cripto en
   `{usdt, gooddollar}`.
2. **Límites por KYC**: las billeteras `KYC1`-`KYC4` tienen límites más altos
   (`MAX_SLE_WHITELISTED`).
3. **Límites globales**: `MIN_SLE`/`MAX_SLE` y los saldos del operador limitan
   los montos.

## Autenticación prevista (pendiente)

Según `ARCHITECTURE.md`, se prevé:

- **Cliente ↔ coordinator**: un token de autenticación generado aleatoriamente.
- **Coordinator ↔ gateway**: un secreto compartido para cifrar los mensajes.

Esto **aún no está implementado**. Hoy cualquier cliente puede llamar a las
rutas. Es un riesgo conocido a cerrar antes de producción con valor real.

## Rutas y riesgo

| Ruta | Método | Riesgo si no hay auth |
|---|---|---|
| `purchase_quote`, `sales_quote` | GET | Crea cotizaciones; bajo (solo lectura de saldos + inserción) |
| `purchase_order`, `sales_order` | GET | Crea órdenes; medio (puede saturar la BD) |
| `purchase_order_state`, `sales_order_state` | GET | Lectura de estado; bajo |
| `ping`, `anything_to_send` | GET | Info/lectura; bajo (anything_to_send expone USSD) |
| `sms_received` | POST | **Alto**: dispara transferencia de cripto |
| `crypto_transferred` | POST | Medio: marca la orden como recibida |
| `report_send` | POST | Medio: marca la orden como pagada |

`sms_received` es la más sensible: una vez autenticado el SMS como de Orange
Money, transfiere cripto al usuario. Debe protegerse (que solo el gateway pueda
llamarla) y validar que el SMS provenga realmente de Orange Money.

## Recomendaciones

1. Implementar el token cliente↔coordinator y el secreto gateway↔coordinator.
2. Verificar la firma/origen del SMS de Orange Money antes de transferir.
3. Límites de tasa (rate limiting) en las rutas públicas.
4. Auditar cada ruta después de tocar `app/api` (ver el checklist de `learn.tg`
   `doc/api-security.md`).
