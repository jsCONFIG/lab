/**
 * 获取页面的滚动条位置
 */
CJS.register( 'extra.scrollPos', function ( $ ) {
    return function () {
        return {
            't': document.documentElement.scrollTop || document.body.scrollTop,
            'l': document.documentElement.scrollLeft || document.body.scrollLeft
        }
    };
});