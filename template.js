setTimeout(function() {
	Java.perform(function() {
        // fill value

    });
	
}, 0);


var LOG = function (input) {
    if (typeof input === 'object')
        input = JSON.stringify(input);
    console.log(input);
};

var printBacktrace = function () {
    Java.perform(function() {
        var android_util_Log = Java.use('android.util.Log'), java_lang_Exception = Java.use('java.lang.Exception');
        // getting stacktrace by throwing an exception
        LOG(android_util_Log.getStackTraceString(java_lang_Exception.$new()));
    });
};