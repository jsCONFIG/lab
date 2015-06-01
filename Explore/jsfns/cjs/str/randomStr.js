/**
 * 获取随机的数字和小写字母组成的字符串
 * @param number
        要获取的字符串长度
 * @return string
        随机字符串
 * @info
        代码来源：《45个实用的JavaScript技巧、窍门和最佳实践》
        原文链接： http://flippinawesome.org/2013/12/23/45-useful-javascript-tips-tricks-and-best-practices/
        翻    译： 伯乐在线 - Owen Chen
        译文链接： http://blog.jobbole.com/54495/
 */
CJS.register( 'str.randomStr', function ( $ ) {
    var $f = $.FUNCS;
    return function ( num ) {
        if ( !$f.isWhat( num, 'number' ) ) {
            throw '[str.randomStr]: need number as first parameter!';
        }
        var result = '';
        // 利用toString方法的进制转换，将数据转换为0-9a-z的36进制，再从中截取指定长度
        for ( ; result.length < num; result += ( Math.random().toString( 36 ).substr( 2 ) ) );
        return result.substr( 0, num );
    };
});