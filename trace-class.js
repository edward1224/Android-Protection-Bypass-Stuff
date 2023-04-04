// only modify this

var classList = [
    "java.io.File",
]
var CONFIG_BACKTRACE = true;


// code

var Color = {
    RESET: "\x1b[39;49;00m", Black: "0;01", Blue: "4;01", Cyan: "6;01", Gray: "7;11", Green: "2;01", Purple: "5;01", Red: "1;01", Yellow: "3;01",
    Light: {
        Black: "0;11", Blue: "4;11", Cyan: "6;11", Gray: "7;01", Green: "2;11", Purple: "5;11", Red: "1;11", Yellow: "3;11"
    }
};


// when using on linux

// var LOG = function (input, kwargs) {
//     kwargs = kwargs || {};
//     var logLevel = kwargs['l'] || 'log', colorPrefix = '\x1b[3', colorSuffix = 'm';
//     if (typeof input === 'object')
//         input = JSON.stringify(input, null, kwargs['i'] ? 2 : null);
//     if (kwargs['c'])
//         input = colorPrefix + kwargs['c'] + colorSuffix + input + Color.RESET;
//     console[logLevel](input);
// };


// when using on windows
function ansiColor(color, str) {
    const ANSI_CODES = {
        'reset': '\u001b[0m',
        'black': '\u001b[30m',
        'red': '\u001b[31m',
        'green': '\u001b[32m',
        'yellow': '\u001b[33m',
        'blue': '\u001b[34m',
        'magenta': '\u001b[35m',
        'cyan': '\u001b[36m',
        'white': '\u001b[37m',
        'gray': '\u001b[90m'
    };

    return ANSI_CODES[color] + str + ANSI_CODES['reset'];
}



var LOG = function (input, kwargs) {
    kwargs = kwargs || {};
    var logLevel = kwargs['l'] || 'log';

    if (typeof input === 'object')
        input = JSON.stringify(input, null, kwargs['i'] ? 2 : null);
    if (kwargs['c'])
        input = ansiColor(kwargs['c'], input);
    console[logLevel](input);
};

const colors = [
    'reset', 'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'
];



/**
 *
 * @param input. 
 *      If an object is passed it will print as json 
 * @param kwargs  options map {
 *     -l level: string;   log/warn/error
 *     -i indent: boolean;     print JSON prettify
 *     -c color: @see ColorMap
 * }
 */

var printBacktrace = function () {
    Java.perform(function() {
        var android_util_Log = Java.use('android.util.Log'), java_lang_Exception = Java.use('java.lang.Exception');
        // getting stacktrace by throwing an exception
        LOG(android_util_Log.getStackTraceString(java_lang_Exception.$new()), { c: Color.Gray });
    });
};

function traceClass(targetClass) {
    
    var hook;
    try {
        hook = Java.use(targetClass);
    } catch (e) {
        console.error("trace class failed", e);
        return;
    }

    var methods = hook.class.getDeclaredMethods();
    hook.$dispose();

    var parsedMethods = [];
    methods.forEach(function (method) {
        var methodStr = method.toString();
        var methodReplace = methodStr.replace(targetClass + ".", "TOKEN").match(/\sTOKEN(.*)\(/)[1];
         parsedMethods.push(methodReplace);
    });

    uniqBy(parsedMethods, JSON.stringify).forEach(function (targetMethod) {
        traceMethod(targetClass + '.' + targetMethod);
    });
}

function traceMethod(targetClassMethod) {
    var delim = targetClassMethod.lastIndexOf('.');
    if (delim === -1)
        return;

    var targetClass = targetClassMethod.slice(0, delim);
    var targetMethod = targetClassMethod.slice(delim + 1, targetClassMethod.length);

    var hook = Java.use(targetClass);
    var overloadCount = hook[targetMethod].overloads.length;

    LOG({ tracing: targetClassMethod, overloaded: overloadCount }, { c: Color.Green });

    for (var i = 0; i < overloadCount; i++) {
        // console.log(targetMethod)
        hook[targetMethod].overloads[i].implementation = function () {
            var log = { '#': targetClassMethod, args: [] };
            if(CONFIG_BACKTRACE){
                printBacktrace()
            }
            for (var j = 0; j < arguments.length; j++) {
                var arg = arguments[j];
                // quick&dirty fix for java.io.StringWriter char[].toString() impl because frida prints [object Object]
                if (j === 0 && arguments[j]) {
                    if (arguments[j].toString() === '[object Object]') {
                        var s = [];
                        for (var k = 0, l = arguments[j].length; k < l; k++) {
                            s.push(arguments[j][k]);
                        }
                        arg = s.join('');
                    }
                }
                log.args.push({ i: j, o: arg, s: arg ? arg.toString(): 'null'});
            }

            var retval;
            try {
                retval = this[targetMethod].apply(this, arguments); // might crash (Frida bug?)
                log.returns = { val: retval, str: retval ? retval.toString() : null };
            } catch (e) {
                console.error(e);
            }
            LOG(log, { c: Color.Blue });
            return retval;
        }
    }
}

// remove duplicates from array
function uniqBy(array, key) {
    var seen = {};
    return array.filter(function (item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
}


var Main = function() {
    Java.perform(function () { // avoid java.lang.ClassNotFoundException
        classList.forEach(traceClass);
    });
};

Java.perform(Main);
