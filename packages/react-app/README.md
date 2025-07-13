# Frontend for stable-sl


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

    root /htdocs/stable-sl/packages/react-app/out/;
    index index.html;
    location / {
        try_files $uri /index.html;
    }
}
```
