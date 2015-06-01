/**
 * 对象转字符串, isEncode表示是否进行编码
 * @param object 是否进行编码
 * @return string
 */
CJS.register( 'json.jsonToStr', function ( $ ) {
    return function (obj, isEncode) {
        var str = '';
        var temp = [];
        for (var i in obj) {
            var tempV = obj[i].toString();
            if ( isEncode ) {
                i = encodeURIComponent( i );
                tempV = encodeURIComponent( tempV );
            }
            temp.push(i + '=' + tempV);
            temp.push( '&' );
        }
        temp.pop(); // 弹出最后一个&
        str = temp.join('');
        return str;
    };
});