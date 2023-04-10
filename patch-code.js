var address = ptr("0x407EEF");
// I think on this one, need automation with some kind of pwntools
var newInstruction = [0x48, 0x39, 0xDB]; // cmp rbx, rbx

Memory.protect(address, newInstruction.length, 'rwx'); // Make the memory region writable

Memory.patchCode(address, newInstruction.length, function(code) {
    for (var i = 0; i < newInstruction.length; i++) {
        code[i] = newInstruction[i];
    }
});

Memory.protect(address, newInstruction.length, 'rx'); // Restore original memory protection
