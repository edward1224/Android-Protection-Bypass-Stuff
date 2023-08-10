# Android Protection Bypass Stuff
Android Protection Bypass Stuff that I compiled from few resources.

## References 
[JNI Struct Table](https://docs.google.com/spreadsheets/d/1yqjFaY7mqyVIDs5jNjGLT-G8pUaRATzHWGFUgpdJRq8/edit#gid=0)


## Android Forensics

https://github.com/cugu/awesome-forensics

## Xamarin extract XALZ
https://github.com/x41sec/tools/blob/master/Mobile/Xamarin/Xamarin_XALZ_decompress.py

## Apk signer

Recomended : https://github.com/patrickfav/uber-apk-signer 

## Hook str equals

```js
Java.perform(function() {

    var str = Java.use('java.lang.String');

    str.equals.overload('java.lang.Object').implementation = function(obj) {
        var response = str.equals.overload('java.lang.Object').call(this, obj);
        if (obj) {
            if (obj.toString().length > 10) {

                send("Is " + str.toString.call(this) + " == " + obj.toString() + "? " + response);
            }
        }
        return response;
    }

});
```

## Check APK name

## Check APK minimum version

```
aapt list -a package.apk | grep SdkVersion
```


## Jni trace
https://github.com/chame1eon/jnitrace

## Convert Android Version

https://github.com/mathieures/convert-apk/

## Get application pid

```
pidof com.alfan.apps
```

## Get strace
```
strace -p <PID>
```

## Get mapping
```
cat /proc/<pid>/maps  | grep blabla.so
```

## Inspect address 

```js

// @ts-ignore
function print_arg(addr) {
    try {
        console.log("asfasfas")
        console.log(addr)
        var module = Process.findRangeByAddress(addr);
        if (module != null) return "\n"+hexdump(addr) + "\n" + ptr(addr).readCString();  + "\n";
        return ptr(addr) + "\n";
    } catch (e) {
        console.log(e)
        return addr + "\n";
    }
}
```



## Good tools cheatsheet

Good cheatsheet compilation for mobile pentest

https://github.com/mirfansulaiman/Command-Mobile-Penetration-Testing-Cheatsheet


## SSL Pinning bypass

Most completed SSL pinning bypass

https://codeshare.frida.re/@akabe1/frida-multiple-unpinning/


## Encryption AES or ETC

Can relied on this

https://codeshare.frida.re/@dzonerzy/aesinfo/

Modified to view raw string instead of hex

https://raw.githubusercontent.com/maulvialf/Android-Protection-Bypass-Stuff/main/aesinfo.js


## Magisk Alpha

Main magisk released now did not had magiskhide feature. However this feature is exist on magisk alpha (Use this on pentest environtment devices only)

https://t.me/magiskalpha


## Frida detection bypass

Use this frida. Make sure version used same with frida cli version that exist on ur machine

https://github.com/CrackerCat/strongR-frida-android

## APK decompiler

Mainly use jadx gui. Had amazing feature copy as frida snippet or xposed snippet. Fast string search and decompiler speed.

https://github.com/skylot/jadx

If APK did not decompiled well with jadx gui, use bytecode-viewer as alternative. Bytecode-Viewer had many decompiler tools inside.

https://github.com/Konloch/bytecode-viewer

## Hook runtime dex

I write article for this on CTF writeup here - https://maulvialf.medium.com/write-up-intechctf-android-game-3024629af286. TLDR script on below

```javascript
Java.perform(function () {
    var dalvik_system_BaseDexClassLoader = Java.use('dalvik.system.BaseDexClassLoader');
    dalvik_system_BaseDexClassLoader.$init.overload('java.lang.String', 'java.lang.String', 'java.lang.ClassLoader', '[Ljava.lang.ClassLoader;', 'boolean').implementation = function (dexPath, librarySearchPath, parent, sharedLibraryLoaders, isTrusted) {
        console.log('BaseDexClassLoader: ' + dexPath);
        this.$init(dexPath, librarySearchPath, parent, sharedLibraryLoaders, isTrusted);
        // Save the old class loader reference
        var oldLoader = Java.classFactory.loader;
        try {
            Java.classFactory.loader = this;
            // add your hook in here


            // end hook
        } catch (Exception) {
            console.log('Exception: ' + Exception);
        }
        // Restore the old class loader reference
        Java.classFactory.loader = oldLoader;
    }

});
```

## Get dex and defeat packer

Use this, and you would get dex files from packer

https://github.com/enovella/fridroid-unpacker.git

## Library dumper

Use this to dump library from memory and fixing broken memory

https://github.com/lasting-yang/frida_dump

## Flutter SSL Pinning bypass

Self explanatory

https://github.com/Impact-I/reFlutter

## Hook native lib with function name

```javascript
// "use strict";
var didHookApis = false;
Java.perform(function() {
    // Credit to @enovella:
    // https://github.com/frida/frida/issues/434#issuecomment-423822024
    const System = Java.use("java.lang.System");
    const Runtime = Java.use('java.lang.Runtime');
    const SystemLoadLibrary = System.loadLibrary.overload('java.lang.String');
    const VMStack = Java.use('dalvik.system.VMStack');
    SystemLoadLibrary.implementation = function(library) {
        const loaded = Runtime.getRuntime().loadLibrary0(
            VMStack.getCallingClassLoader(), library
        );
        if (library.includes("konyjsvm")) {
            console.log("[+] Hooked konyjsvm");
            hookFunctions();
        }
        return loaded;
    }
});

function hookFunctions() {
    Interceptor.attach(Module.getExportByName("libkonyjsvm.so", "lzf"), {
        onEnter: function(args) {
            // console.log("[+] Hooked ziping files!");
            this.zipfiles = args[2]
            this.ziplength = args[3]            
        },
        onLeave: function(retval) {
            send("================")
            console.log("zip files length", this.ziplength)
            var readzipfiles = Memory.readByteArray(this.zipfiles, this.ziplength.toInt32() );
            // send("zipfiles", readzipfiles)
            var file = new File("/data/data/com.apk.alfan/" + inc + ".zip","w");
            inc += 1;
            file.write(readzipfiles);
        }
})}  
```

## Hook native library with address

```javascript
// "use strict";
var didHookApis = false;
Java.perform(function() {
    // Credit to @enovella:
    // https://github.com/frida/frida/issues/434#issuecomment-423822024
    const System = Java.use("java.lang.System");
    const Runtime = Java.use('java.lang.Runtime');
    const SystemLoadLibrary = System.loadLibrary.overload('java.lang.String');
    const VMStack = Java.use('dalvik.system.VMStack');
    SystemLoadLibrary.implementation = function(library) {
        const loaded = Runtime.getRuntime().loadLibrary0(
            VMStack.getCallingClassLoader(), library
        );
        if (library.includes("intechfest")) {
            console.log("[+] Hooked library");
            hookFunctions();
        }
        return loaded;
    }
});
var inc = 0;
function hookFunctions() {

    const ghidraImageBase = 0x00040000; // example value get the real value in Ghidra from Window -> Memory map -> Set Image Base
    const moduleName = "libintechfest.so";
    const moduleBaseAddress = Module.findBaseAddress(moduleName);
    const functionRealAddress = moduleBaseAddress.add(0x000000000001003C); // SSM::Decrypt

    Interceptor.attach(functionRealAddress, {
        onEnter: function(args) {
        },
        onLeave: function(retval) {
            send("================")
            var one = ptr(retval).readCString();
            send(one)
        }
    })    
};
```


## APKLab

Vscode extension that make patching smali easy

https://github.com/APKLab/APKLab

## IDA Frida

Wanna export frida script on native binary? use this

https://github.com/P4nda0s/IDAFrida


## Frida Typescript

Wanna use code completion on writing frida scripts. Use typescripts

https://github.com/oleavr/frida-agent-example.git

## Useful magisk module that used zygisk

### Zygisk-Il2CppDumper

Game code dumper

https://github.com/Perfare/Zygisk-Il2CppDumper

### Shamiko

Used for magisk hide replacement. Hide some root detection

https://github.com/LSPosed/LSPosed.github.io/releases


## Automatic scanner

https://github.com/MobSF/Mobile-Security-Framework-MobSF


## Objection

Metasploit like for frida

https://github.com/sensepost/objection


## Webbased Frida GUI

https://github.com/m0bilesecurity/RMS-Runtime-Mobile-Security

https://github.com/nccgroup/house

## Monitor Intent & Activity

https://gist.github.com/bet4it/b62ac2d5bd45b8cb699905fa498baf5e

## IDA JNI header 

https://gist.github.com/Jinmo/048776db75067dcd6c57f1154e65b868

## GDB Server

https://github.com/kruglinski/gdbserver.git

https://gist.github.com/sekkr1/6adf2741ed3bc741b53ab276d35fd047


## Anti Frida bypass script

https://github.com/apkunpacker/AntiFrida_Bypass/blob/main/AntiAntiFrida.js

## Wait native library loaded 

```js
// frida  -U -f  id.aimardcr.insecure_jni -l solve.js

Java.perform(function () {
    aWaitingLoadLibrarys();
});

function aWaitingLoadLibrarys() {
    var library_name = "libapp.so"
    var library_loaded = 0
    Interceptor.attach(Module.findExportByName(null, 'android_dlopen_ext'), {
        onEnter: function (args) {
            // first arg is the path to the library loaded
            let library_path = Memory.readCString(args[0])
            if (library_path.includes(library_name)) {
                console.log("[.] Loading library : " + library_path)
                library_loaded = 1
            }
        },
        onLeave: function (args) {
            //if it's the library we want to hook, hooking it
            if (library_loaded == 1) {
                console.log("[+] Loaded")
                var BaseAddr = Module.findBaseAddress('libapp.so'); //lib name
                console.log('Fu:' + BaseAddr);
                //Now we will hook the callback func

                console.log("hook start here")
                // start hook
                // start hook
                // start hook
                // start hook
                console.log("end hook")

                library_loaded = 0;
                return BaseAddr;
            }
        }
    })
}
```

## Call native function directly

```js
// frida  -U -f  id.aimardcr.insecure_jni -l solve.js

Java.perform(function () {
    aWaitingLoadLibrarys();
});

function aWaitingLoadLibrarys() {
    var library_name = "libapp.so"
    var library_loaded = 0
    Interceptor.attach(Module.findExportByName(null, 'android_dlopen_ext'), {
        onEnter: function (args) {
            // first arg is the path to the library loaded
            let library_path = Memory.readCString(args[0])
            if (library_path.includes(library_name)) {
                console.log("[.] Loading library : " + library_path)
                library_loaded = 1
            }
        },
        onLeave: function (args) {
            //if it's the library we want to hook, hooking it
            if (library_loaded == 1) {
                console.log("[+] Loaded")
                var BaseAddr = Module.findBaseAddress('libapp.so'); //lib name
                console.log('Fu:' + BaseAddr);
                //Now we will hook the callback func

                (function () {

                    // @ts-ignore
                    function print_arg(addr) {
                        try {
                            console.log("asfasfas")
                            console.log(addr)
                            var module = Process.findRangeByAddress(addr);
                            if (module != null) return "\n"+hexdump(addr) + "\n" + ptr(addr).readCString();  + "\n";
                            return ptr(addr) + "\n";
                        } catch (e) {
                            console.log(e)
                            return addr + "\n";
                        }
                    }
                
                    // @ts-ignore
                    var base = Module.findBaseAddress("libapp.so");
                    // Attach to the target process

                    // Find the address of the native function
                    const funcAddr = base.add(0x000000000001B00C);
                    var bss = base.add(0x000000000001D04C)
                    var enc = base.add(0x000000000001B99F);
                    // Define the native function wrapper
                    const nativeFunc = new NativeFunction(funcAddr, "int", ["pointer", "pointer"]);

                    // Call the native function
                    const result = nativeFunc(bss, enc);
                    console.log("Result: " + result);
                    console.log(print_arg(bss))
                    console.log("Result: " + result);
                    
                })();

                library_loaded = 0;
                return BaseAddr;
            }
        }
    })
}
```

## ARM strace

https://github.com/andrew-d/static-binaries/blob/master/binaries/linux/arm/strace

## Patch memory

```js
function Hex2Bytes(hex) {
    hex = hex.replaceAll(" ", "")
    let bytes = [];
    for (let c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
}

function hexPatch(base, addr, hex) {
    let target = ptr(base).add(addr)
    let data = Hex2Bytes(hex)
    Memory.patchCode(target,data.length, function (vfn) {
       Memory.writeByteArray(target, data);
       console.log("Patched "+data.length+" bytes on "+target);
    })
}
```

## Hook file deletion

```js
// Find the unlink function
const unlink = new NativeFunction(Module.findExportByName(null, 'unlink'), 'int', ['pointer']);

// Hook the unlink function
Interceptor.attach(unlink, {
  onEnter: function(args) {
    // Get the path of the file being deleted
    const path = Memory.readUtf8String(args[0]);
    
    // Log the file path before it is deleted
    console.log(`Deleting file: ${path}`);
  }
});
```

## Disable ASLR

```
echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
```

## Tools

- https://github.com/lasting-yang/frida_hook_libart

## Developer mode bypass

https://codeshare.frida.re/@meerkati/universal-android-debugging-bypass/

## APK Multi join

- https://github.com/maulvialf/patch-apk-windows/ (modified from below)
- https://github.com/NickstaDB/patch-apk/
- https://github.com/REAndroid/APKEditor


## Zygisk Frida

https://github.com/lico-n/ZygiskFrida


## Articles I found useful when learning frida

- [](https://link-url-here.org)

## JNI Frida Hook

https://github.com/Areizen/JNI-Frida-Hook


## Zen Tracer

https://github.com/hluwa/ZenTracer


## Frida Script 

https://github.com/0xdea/frida-scripts


## Frida Unpack

https://github.com/dstmath/frida-unpack

## Frida Lib

https://github.com/4ch12dy/FridaLib

## Frida Il2cpp Bridge

https://github.com/vfsfitvnm/frida-il2cpp-bridge

