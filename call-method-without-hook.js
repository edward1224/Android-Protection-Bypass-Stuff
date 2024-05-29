setTimeout(function() {
    Java.perform(function () {
        var claz = Java.use('alfan.suri.class');
        // Define the method to call
        var methodToCall = claz.metod.overload('java.lang.String');    
        // Call the method with a sample string
        var result = methodToCall.call(c, 'This is string');
        // Log the result
        console.log("Result of metod(String str): " + result);


        // use below if did not     // Replace 'com.example.MyClass' with the actual class name that contains the native method
        var MyClass = Java.use('com.example.MyClass');
        
        // Create an instance of the class if necessary
        var instance = MyClass.$new();
        
        // Call the native method 'stringFromJNI'
        var result = instance.stringFromJNI();
        
        // Print the result
        console.log('Result from stringFromJNI: ' + result);work

        
    });
}, 0);
