/**
 * 用于对象解析
 * @param 根对象 外来对象 是否对数值进行数字化处理
 * @return 合并解析后的对象
 */
CJS.register( 'obj.parseObj', function ( $ ) {
    return function (rootObj, newObj, isNumParse) {
        var tempObj = {};
        var newObj = newObj || {};
        for (var i in rootObj) {
            tempObj[i] = rootObj[i];
            if (i in newObj) {
                var temp = newObj[i];
                var parseVal = parseFloat(temp);
                if (isNumParse && !isNaN(parseVal)) {
                    temp = parseVal;
                }
                tempObj[i] = temp;
            }
        }
        return tempObj;
    };
});