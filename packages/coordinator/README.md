# Coordinator backend

To run it in production from adJ/OpenBSD we have been using the followin
`/etc/rc.d/stablessl`:

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

