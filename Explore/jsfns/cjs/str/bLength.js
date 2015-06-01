/**
 * 用于获取字符串的长度，全角及中文占两个长度
 * @param 待检测字符串
 * @return 字符串长度
 */
// CJS.Import( 'extra.reglib' );
CJS.register( 'str.bLength', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( str ) {
        if ( !$f.isWhat( str, 'string' ) ) {
            throw '[str.bLength]: need string as first parameter!'
        }
        /** 此方法暂时弃用
        //替换双字节为两个单字节字符
        var filterStr = str.replace( new RegExp( $l.extra.reglib.dbByte, 'g' ), 'aa' );
        return filterStr.length;
        */
        var strArr = str.split(''),
            temp,
            tempCode,
            counter = 0;
        for ( var i = 0, strL = strArr.length; i < strL; i++ ) {
            temp = strArr[ i ];
            tempCode = temp.charCodeAt(0);
            // ASCII为Unicode前128个字符
            tempCode > 127 ? (counter += 2) : (counter++);
        }
        return counter;
    };
});