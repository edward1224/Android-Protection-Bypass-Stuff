## Exposed android listen port to another host

### Initiate

Windows host adb forward
```
adb forward tcp:23946 tcp:23946
```


Windows host

```
netsh interface portproxy add v4tov4 listenport=31337 listenaddress=0.0.0.0 connectport=23946 connectaddress=127.0.0.1
```

Windows VM
```
nc windowshostip 31337
```


### Cleaning

```
netsh interface portproxy delete v4tov4 listenport=23946 listenaddress=0.0.0.0
```

```
adb forward --remove-all
```