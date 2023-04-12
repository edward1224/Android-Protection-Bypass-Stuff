// not tested
var table = { /* syscall table here */ }

var arch = Process.arch;
var syscallNumberRegister;

if (arch === 'x64') {
    syscallNumberRegister = 'rax';
} else if (arch === 'x32') {
    syscallNumberRegister = 'eax';
} else if (arch === 'arm64') {
    syscallNumberRegister = 'x8';
} else if (arch === 'arm') {
    syscallNumberRegister = 'r7';
} else {
    throw new Error('Unsupported architecture: ' + arch);
}

function isSyscall(instruction) {
    if (arch === 'x64' || arch === 'x32') {
        return instruction.mnemonic === 'syscall' || instruction.mnemonic === 'int' && instruction.operands[0].value === 0x80;
    } else if (arch === 'arm64') {
        return instruction.mnemonic === 'svc' && instruction.operands[0].value === 0;
    } else if (arch === 'arm') {
        return instruction.mnemonic === 'svc' && instruction.operands[0].value === 0x00000000;
    }
    return false;
}

function stalk(threadId) {
    Stalker.follow(threadId, {
        events: {
            call: false,
            ret: false,
            exec: true,
        },
        onReceive: function (events) {
            var iterator = new Stalker.EventIterator(events);
            while (iterator.next() !== null) {
                var instruction = iterator.decode();
                if (isSyscall(instruction)) {
                    var context = iterator.ctx;
                    var sc = parseInt(context[syscallNumberRegister]);
                    var syscallName = table[sc] || 'UNKNOWN';
                    console.log('Entering syscall', syscallName, context);
                }
            }
        },
    });
}

// Main thread
stalk(Process.getCurrentThreadId());

// All other threads
Process.enumerateThreadsSync().forEach(function (thread) {
    if (thread.id !== Process.getCurrentThreadId()) {
        stalk(thread.id);
    }
});
