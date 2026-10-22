# Frontend for stable-sl


## Environment Variables

Copy `.env.template` to `.env` and fill the values:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_COORDINATOR` | URL of the coordinator backend (e.g. `https://stable-sl-coordinator.pdJ.app:9001`) |
| `NEXT_PUBLIC_NETWORK` | `celoSepolia` for testnet, `CELO` for mainnet |
| `PORT` | Dev server port (default: 9002) |
| `NEXT_PUBLIC_ADMIN1` | Admin wallet address (for admin features) |
| `NEXT_PUBLIC_ADMIN2` | Secondary admin wallet address |


## Run in development mode

Install dependencies with:
```
pnpm install
```

Run with:
```
./bin/dev
```

And open in port 9002


## Development

```
make syntax
```


## Run in production mode

Supposing your sources are at `/var/www/htdcos/stable-sl/` build 
from that directory in `/var/www/htdcos/stable-sl/out` with:

```
make
```

Then configure `nginx` with a section like:
```
server {
    listen      443 ssl;
    listen       [::]:443 ssl;
    server_name  stable-sl.pdJ.app ;
    error_log  logs/stable-sl-error.log;
    access_log  logs/stable-sl-access.log;

    ssl_certificate      /etc/ssl/pdJ.app-cadena.crt;
    ssl_certificate_key  /etc/ssl/private/pdJ.app.key;

    root /htdocs/stable-sl/packages/nextjs-app/out/;
    index index.html;
    location / {
        try_files $uri /index.html;
    }
}
```
