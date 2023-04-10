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
