
Java.perform(function () {
    aWaitingLoadLibrarys();
});

// @ts-ignore
function print_arg(addr) {
    try {
        console.log(addr)
        var module = Process.findRangeByAddress(addr);
        if (module != null) return "\n"+hexdump(addr) + "\n" + ptr(addr).readCString();  + "\n";
        return ptr(addr) + "\n";
    } catch (e) {
        console.log(e)
        return addr + "\n";
    }
}
var library_name = "libfan.so"

function aWaitingLoadLibrarys() {

    var library_loaded = 0
    Interceptor.attach(Module.findExportByName(null, 'android_dlopen_ext'), {
        onEnter: function (args) {
            // first arg is the path to the library loaded
            let library_path = Memory.readCString(args[0])
            console.log(library_name,library_path)
            if (library_path.includes(library_name)) {
                console.log("[.] Loading library : " + library_path)
                library_loaded = 1
            }
        },
        onLeave: function (args) {
            //if it's the library we want to hook, hooking it
            if (library_loaded == 1) {
                console.log("[+] Loaded")
                var BaseAddr = Module.findBaseAddress(library_name); //lib name
                console.log('Fu:' + BaseAddr);
                //Now we will hook the callback func
                const module = Process.getModuleByName(library_name);
                const exports2 = module.enumerateExports();

                // Iterate over the module exports and attach an Interceptor to each one
                exports2.forEach((exp) => {
                  Interceptor.attach(ptr(exp.address), {
                    onEnter: function(args) {
                        this.params = [];
                        for (let i = 0; i < 8; i++) {
                            this.params.push(args[i]);
                            console.log("this.args" + i + " onEnter: " + print_arg(args[i]));
                        }                        
                        console.log("Native call to " + exp.name + " from Java code:");
                    },
                    onLeave: function(retval){
                        for (let i = 0; i < 8; i++) {
                            console.log("this.args" + i + " onLeave: " + print_arg(this.params[i]));
                            
                        }
                        console.log("Return Address: " + print_arg(retval));                       
                    }
                  });


                });
                
                // Log when the script is attached and ready to trace

                library_loaded = 0;
                return BaseAddr;
            }
        }
    })
}
