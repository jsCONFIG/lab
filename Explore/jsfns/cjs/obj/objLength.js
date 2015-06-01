/**
 * 获取对象的长度
 * @param Object
 * @return lengthNumber
 */
CJS.register( 'obj.objLength', function ( $ ) {
    return function ( obj ) {
        var l = 0;
        for( var i in obj ) {
            if( obj.hasOwnProperty( i ) ) {
                l++;
            }
        }
        return l;
    };
});