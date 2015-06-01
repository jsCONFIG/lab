/**
 * 用于合并两个对象，返回合并后的副本，不影响源，不同于parseObj依据rootObj的情况，
 * merge纯粹是合并两个对象
 * @param object object
 */
CJS.register( 'obj.merge', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( rootObj, otherObj ) {
        var newObj = $f.copyObj( rootObj );
        for ( var i in otherObj ) {
            newObj[i] = otherObj[i];
        }
        return newObj;
    };
});