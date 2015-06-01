/**
 * array索引
 * @param 待检索项 检索源数组
 * @return 待检索项在检索源中的位置，不存在则返回-1
 */
CJS.Import( 'arr.isArray' );
CJS.register( 'arr.indexOf', function ( $ ) {
    var $l = $.logic;

    return function (item, arr) {
        if ( !$l.arr.isArray( arr ) ) {
            return false;
        }
        if (typeof arr.indexOf != 'undefined') {
            $l.arr.indexOf = function (otherItem, otherArr) {
                return otherArr.indexOf(otherItem);
            };
        } else {
            $l.arr.indexOf = function (otherItem, otherArr) {
                var index = -1;
                for (var i = 0; i < otherArr.length; i++) {
                    if (otherArr[i] === otherItem) {
                        index = i;
                        break;
                    }
                }
                return index;
            };
        }
        return $l.arr.indexOf(item, arr);
    };
});