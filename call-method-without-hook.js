setTimeout(function() {
    Java.perform(function () {
        var claz = Java.use('alfan.suri.class');
        // Define the method to call
        var methodToCall = claz.metod.overload('java.lang.String');    
        // Call the method with a sample string
        var result = methodToCall.call(c, 'This is string');
        // Log the result
        console.log("Result of metod(String str): " + result);
    });
}, 0);