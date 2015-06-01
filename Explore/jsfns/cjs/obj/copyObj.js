/**
 * 复制一个对象，如果是数组则复制后依然为数组
 * @param 待复制对象
 * @return 复制后的对象副本
 */
CJS.register( 'obj.copyObj', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function (obj) {
        if ( $f.isArray(obj) ) {
            return obj.slice(0);
        }
        var temp = {};
        for (var i in obj) {
            var tempObj = obj[i];
            if ((typeof obj[i]).toLowerCase() == 'object') {
                tempObj = $l.obj.copyObj(obj[i]);
            }
            temp[i] = tempObj;
        }
        return temp;
    };
});