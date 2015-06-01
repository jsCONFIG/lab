/**
 * 数组map方法的兼容处理
 * @param array function
        待处理数组，用于处理的方法
            function有三个参数，分别为：遍历的当前项 当前索引值 处理的数组
 */
CJS.register( 'arr.map', function ( $ ) {
    var $f = $.FUNCS;
    return function ( arr, fun ) {
        if ( Array.prototype.map ) {
            return arr.map( fun );
        }
        else {
            var result = [];
            for ( var i = 0, arrL = arr.length; i < arrL; i++ ) {
                result[i] = fun( arr[i], i, arr );
            };
            return result;
        }
    };
});