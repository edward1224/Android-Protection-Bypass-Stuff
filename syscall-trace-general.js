var table = { /* syscall table here */ }

var arch = Process.arch;
var syscallPattern;
var syscallNumberRegister;

if (arch === 'x64') {
    syscallPattern = '0f 05';
    syscallNumberRegister = 'rax';
} else if (arch === 'x32') {
    syscallPattern = 'cd 80';
    syscallNumberRegister = 'eax';
} else if (arch === 'arm64') {
    syscallPattern = '01 00 00 d4';
    syscallNumberRegister = 'x8';
} else if (arch === 'arm') {
    syscallPattern = '00 00 00 ef';
    syscallNumberRegister = 'r7';
} else {
    throw new Error('Unsupported architecture: ' + arch);
}

var m = Process.findModuleByName('libc.so');
m.enumerateRanges('--x').forEach(function (range) {
    Memory.scanSync(range.base, range.size, syscallPattern).forEach(function (match) {
        Interceptor.attach(ptr(match.address), {
            onEnter: function (args) {
                var sc = parseInt(this.context[syscallNumberRegister]);
                var syscallName = table[sc] || 'UNKNOWN';
                console.log('Entering syscall', syscallName, args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            }
        })
    })
})
