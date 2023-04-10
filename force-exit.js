// Linux

function findLibc() {
    const modules = Process.enumerateModulesSync();
    for (const module of modules) {
        if (module.name.toLowerCase().indexOf('libc') !== -1) {
            return module;
        }
    }
    return null;
}

const libc = findLibc();
if (!libc) {
    console.error('libc not found in the process.');
    return;
}

const exit = new NativeFunction(libc.findExportByName('exit'), 'void', ['int']);
exit(0);


// Windows

function findKernel32() {
  const modules = Process.enumerateModulesSync();
  for (const module of modules) {
    if (module.name.toLowerCase() === 'kernel32.dll') {
      return module;
    }
  }
  return null;
}

const kernel32 = findKernel32();
if (!kernel32) {
  console.error('kernel32.dll not found in the process.');
  return;
}

const ExitProcess = new NativeFunction(kernel32.findExportByName('ExitProcess'), 'void', ['uint32']);

// Call ExitProcess function with an exit code of 0
ExitProcess(0);
