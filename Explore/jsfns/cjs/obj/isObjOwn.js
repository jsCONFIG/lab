/**
 * 判断obj内部是否有某值（非键）
 * @param 
 * @return 
 */
CJS.register( 'obj.isObjOwn', function ( $ ) {
    return function (val, obj) {
        for (var i in obj) {
            if (obj[i] === val) {
                return true;
            }
        }
        return false;
    };
});