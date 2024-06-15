
(function () {
    // @ts-ignore
    function print_arg(addr) {
        try {
            var module = Process.findRangeByAddress(addr);
            if (module != null) return "\n"+hexdump(addr) + "\n";
            return ptr(addr) + "\n";
        } catch (e) {
            return addr + "\n";
        }
    }
    // @ts-ignore
    function hook_native_addr(funcPtr, paramsNum) {
        var module = Process.findModuleByAddress(funcPtr);
        try {a
            Interceptor.attach(funcPtr, {
                onEnter: function (args) {
                    this.logs = "";
                    this.params = [];
                    // @ts-ignore
                    this.logs=this.logs.concat("So: " + module.name + "  Method: main offset: " + ptr(funcPtr).sub(module.base) + "\n");
                    this.logs=this.logs.concat("rax: " + print_arg(this.context.rax) + "\n");
                    this.logs=this.logs.concat("rbx: " + print_arg(this.context.rbx) + "\n");
                    this.logs=this.logs.concat("rcx: " + print_arg(this.context.rcx) + "\n");
                    this.logs=this.logs.concat("rdx: " + print_arg(this.context.rdx) + "\n");
                    this.logs=this.logs.concat("rdi: " + print_arg(this.context.rdi) + "\n");
                    this.logs=this.logs.concat("rsi: " + print_arg(this.context.rsi) + "\n");

                    this.logs=this.logs.concat("rbp: " + print_arg(this.context.rbp) + "\n");
                    this.logs=this.logs.concat("rsp: " + print_arg(this.context.rsp) + "\n");
                    this.logs=this.logs.concat("rsp: " + print_arg(this.context.rdp) + "\n");
                    this.logs=this.logs.concat("r8: " + print_arg(this.context.r8) + "\n");
                    this.logs=this.logs.concat("r9: " + print_arg(this.context.r9) + "\n");
                    this.logs=this.logs.concat("r10: " + print_arg(this.context.r10) + "\n");
                    this.logs=this.logs.concat("r11: " + print_arg(this.context.r11) + "\n");
                    this.logs=this.logs.concat("r12: " + print_arg(this.context.r12) + "\n");
                    this.logs=this.logs.concat("r13: " + print_arg(this.context.r13) + "\n");
                    this.logs=this.logs.concat("r14: " + print_arg(this.context.r14) + "\n");
                    
                    // incase need memory hook
                    // var rbp_val = this.context.rbp;
                    // var rbp_pointer = Memory.readPointer(ptr(rbp_val));

                    // var bytes_at_rbp = Memory.readByteArray(ptr(rbp_val), 20);
                    // console.log("20 bytes at rbp (0x" + rbp_val.toString(16) + "):", bytes_at_rbp);
                    

                    console.log(this.logs);
                }, onLeave: function (retval) {

                }
            });
        } catch (e) {
            console.log(e);
        }
    }
    // @ts-ignore
    hook_native_addr(Module.findBaseAddress("threads - Copy (2)").add(0x9480), 0x3);
})();
