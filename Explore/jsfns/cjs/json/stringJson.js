/**
 * JSON字符串转换
 * @param 
 * @return 
 */
CJS.Import( '' );
CJS.register( '', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( node ) {
        if ( !$f.isNode( node ) ) {
            throw '[]: need node as first parameter!'
        }

    };
});