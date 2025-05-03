# Coordinator backend


## Run in development mode

Create a PostgreSQL user and a database, for example in adJ/OpenBSD:

```sh
createdb -Ustablesl -h /var/www/var/run/postgresql stablesldes
```

Copy .env.template in .env and fill the variables.  Note that 
* You will need an RPC node for testnet,  we have noticed that the free plan
  of Alchemy allows more transactions per hour than Infura.
* You will need the private key of the wallet that will have the
  cUSD (or USDC in the case of testnet). For development use a 
  develoment wallet.

After create the database with:

```
npx drizzle-kit push
```



## Running in production mode
To run it in production from adJ/OpenBSD we have been using the following
`/etc/rc.d/stablesl`:

```
#!/bin/ksh
servicio="/var/www/htdocs/stable-sl/packages/coordinator/bin/prod.sh"

. /etc/rc.d/rc.subr

rc_check() {
        ps axw | grep ".*[n]ext start -p3023" > /dev/null
}

rc_stop() {
        p1=`ps axw | grep ".*[n]ext start -p3023" | sed -e "s/^ *\([0-9]*\) .*/\1/g"`
	echo "p1=$p1"
	# Ending $p1 would not end its son process --that would become son of process 1
	# We need to find it and end it separetely
	ph=`ps a -o ppid,pid | grep "^ *$p1" | sed -e "s/.* //g"`
	echo "ph=$ph"
        kill -9 $ph
        kill -9 $p1
}

rc_cmd $1
```

The logs are overwritten each time it starts, we check them with:
```sh
% tail -f prod.log
```
