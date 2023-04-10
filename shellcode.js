const shellcode = new Uint8Array([
    // Your shellcode bytes here
]);

// Attach to the target process
const targetProcess = Process.getModuleByName(targetProcessName);

// Allocate memory for the shellcode with read-write-execute (rwx) permissions
const shellcodeMemory = Memory.alloc(shellcode.length, 'rwx');

// Write the shellcode to the allocated memory
Memory.writeByteArray(shellcodeMemory, shellcode.buffer);

// Create a new NativeFunction for the shellcode
const shellcodeFunction = new NativeFunction(shellcodeMemory, 'void', []);

// Execute the shellcode
shellcodeFunction();
