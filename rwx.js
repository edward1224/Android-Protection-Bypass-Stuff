// Iterate over memory ranges
Process.enumerateRanges('---').forEach(function (range) {
    try {
        // Change the memory range permissions to read-write-execute (rwx)
        const rwxProtection = 'rwx';
        const newRange = Memory.protect(range.base, range.size, rwxProtection);

        // Check if the protection change was successful
        if (newRange) {
            console.log(`Changed ${range.base}-${range.base.add(range.size)} to ${rwxProtection}`);
        } else {
            console.log(`Failed to change ${range.base}-${range.base.add(range.size)} to ${rwxProtection}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
