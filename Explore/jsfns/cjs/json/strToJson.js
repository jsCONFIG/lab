/**
 * 字符串转对象
 * @param 字符串query值
 * @return 解析后的对象
 */
CJS.register( 'json.strToJson', function ( $ ) {
    return function (str) {
        if (str == undefined) {
            return {};
        }
        var reg = /([^\?&\&]+)/g;
        var temp = str.match(reg);
        var resultObj = {};
        for (var i = 0; i < temp.length; i++) {
            var str = temp[i];
            var strArr = str.split('=');
            if (strArr.length >= 2) {
                resultObj[strArr[0]] = strArr[1];
            }
        }
        return resultObj;
    };
});