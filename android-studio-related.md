# Exposed android listen port to another host

## Initiate

Windows host adb forward

```bash
adb forward tcp:23946 tcp:23946
```

Windows host

```bash
netsh interface portproxy add v4tov4 listenport=31337 listenaddress=0.0.0.0 connectport=23946 connectaddress=127.0.0.1
```

Windows VM

```bash
nc windowshostip 31337
```

## Cleaning

```bash
netsh interface portproxy delete v4tov4 listenport=23946 listenaddress=0.0.0.0
```

```bash
adb forward --remove-all
```
