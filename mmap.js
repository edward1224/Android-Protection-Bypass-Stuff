function hookFunctions() {
    // fill value

    // show mmap of r x only
    // var modules_x = Process.enumerateRanges('r-x'); 
    // show mmap of all memory
    var modules_x = Process.enumerateRanges('---'); 

    for (var module of modules_x) {
            var symbol = DebugSymbol.fromAddress(module.base);
            console.log("=====================================")
            console.log(symbol, typeof symbol)
            console.log("base=", module.base, "size=", module.size, "permission", module.protection)
            console.log("=====================================")
    }	

};