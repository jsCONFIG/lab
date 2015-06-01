/**
 * 判断是否是数组
 */
CJS.register( 'arr.isArray', function ( $ ) {
    return function (arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    };
});