Java.perform(function() {
    var ContextImpl = Java.use('android.app.ContextImpl');
    ContextImpl.getAssets.implementation = function() {
        var assets = this.getResources().getAssets();
        console.log(assets)
        var fileNames = assets.list('');
        console.log(fileNames)
        return assets;
    };
});
