/**
 * 判断某个对象是否含有某键(非值)，如果有，则返回对应的键值，否则返回null
 * @param object keyName
 * @return Boolean
 */
CJS.register( 'obj.isKeyHas', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( obj, keyName ) {
        if ( !$f.isWhat( obj, 'object' ) ) {
            throw '[obj.isKeyHas]: need object as first parameter!'
        }
        if ( obj.hasOwnProperty( keyName ) ) {
            return obj[keyName];
        }
        else {
            return null;
        }
    };
});