// only on android 12, the hooking of the library is done in the template-native.js

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
        console.log(library)
        if (library.includes("alfan")) {
            console.log("[+] Hooked library");
            hookFunctions();
        }
        return loaded;
    }
});


var inc = 0;
function hookFunctions() {
    // fill value

};
