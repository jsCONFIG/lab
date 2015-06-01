/**
 * 获取浏览器screen信息
 */
CJS.register( 'nav.screen', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( node ) {
        if ( !$f.isNode( node ) ) {
            throw '[]: need node as first parameter!'
        }
        var main = {};
        // avail为除去任务栏外的尺寸
        main.availH = screen.availHeight;
        main.availW = screen.availWidth;
        // 为显示器的尺寸
        main.height = screen.height;
        main.width  = screen.width;
        // 调色板比特深度
        main.colorDepth = screen.colorDepth;
        return main;
    };
});