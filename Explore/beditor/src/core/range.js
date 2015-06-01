define( ['./rgbase'], function ( rgBase ) {

    // 合并上面两个
    var newRange = function () {
        var rg = new rgBase();
        rg.fresh();
        return rg;
    };

    var newEmptRg = function() {
        return document.createRange();
    };

    return {
        'create' : newRange,
        'emptyRg' : newEmptRg
    };
});