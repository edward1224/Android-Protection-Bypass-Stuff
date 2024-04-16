function detachAfterRead() {
    console.log(Process.memory.readByteArray(0x123456, 10)); // Read 10 bytes from memory address
    process.detach();
}
  
Java.perform(detachAfterRead);