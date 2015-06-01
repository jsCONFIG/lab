/**
 * CJS
 * @version 1.0.0 2013/12/20 11:10
 * @author liuping | clpliuping@126.com
 */
/*
 * CJS是一款基础的平台，
 * 方便对代码模块进行管理
 */
if ( CJS ) {
    
}
else {
var CJS = (function () {
    // 版本号
    var version = '1.0 | liuping | clpliuping@126.com';
    // 核心库内部使用，同时外抛的基础通用方法集
    var FUNCS = {};
    // 通用变量
    var global = {};
    // 私有方法
    var PRIVATE = {};
    // 注册方法库
    var LOGICFUNS = {};
    LOGICFUNS.about = 'Library for define\'s functions, all of the functions you defined will be add to this zone.';


    /*================================
     * 通用方法集，抛出给所有方法共享
     *=================================
     */
    FUNCS.about = 'Library for common functions, you can use it in anywhere.';
    // 常量，用于合法性检测时错误的抛出
    FUNCS.NODESTRING = 'need node as first parameter!';
    
    // 对象合并，isNumParse表示是否转换为数值类型
    FUNCS.parseObj = function (rootObj, newObj, isNumParse) {
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

    // getkey获取唯一值
    FUNCS.getKey = function () {
        var date = new Date();
        return date.getTime();
    };

    // array索引
    FUNCS.indexOf = function (item, arr) {
        if (!FUNCS.isArray(arr)) {
            return false;
        }
        if (typeof arr.indexOf != 'undefined') {
            FUNCS.indexOf = function (otherItem, otherArr) {
                return otherArr.indexOf(otherItem);
            };
        } else {
            FUNCS.indexOf = function (otherItem, otherArr) {
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
        return FUNCS.indexOf(item, arr);
    };

    // 字符串转对象
    FUNCS.strToJson = function (str) {
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

    // 对象转字符串, isEncode表示是否进行编码
    FUNCS.jsonToStr = function (obj, isEncode) {
        var str = '';
        var temp = [];
        for (var i in obj) {
            var tempV = obj[i].toString();
            if ( isEncode ) {
                i = encodeURIComponent( i );
                tempV = encodeURIComponent( tempV );
            }
            temp[temp.length] = (i + '=' + tempV);
            temp[temp.length] = ( '&' );
        }
        temp.pop(); // 弹出最后一个&
        str = temp.join('');
        return str;
    };

    // 判断数组
    FUNCS.isArray = function (arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    };

    // 判断数据类型，完整支持所有数据类型,检测Array是否为object时，会返回false
    FUNCS.isWhat = function ( v, type ) {
        var typeV = ( typeof v );
        if ( typeV == 'undefined' ) {
            return /^undefined$/i.test( type );
        }
        else{
            var reg = new RegExp( type, 'gi' );
            try {
                var transStr = v.constructor.toString();
                return reg.test( transStr );
            }
            catch(NULL){
                return ( /^object$/i.test( typeV ) && /^null$/i.test( type ) );
            }
        }
    };

    // 判断obj内部是否有某值（非键）
    FUNCS.isObjOwn = function (val, obj) {
        for (var i in obj) {
            if (obj[i] === val) {
                return true;
            }
        }
        return false;
    };

    // 清除字符串首尾空格
    FUNCS.trim = function (str) {
        if ((typeof str).toLowerCase() != 'string') {
            return;
        }
        var reg = /^\s*(.*?)\s*$/;
        return str.replace(reg, '$1');
    };

    // 数据管理中心
    FUNCS.dataCenter = function () {
        var data = {
            /*
             * 数据库
             */
            'dataBase': {},
            /*
             * 读写权限值
             */
            'purviewKey': true,

            /*
             * 设置读写权限，默认可读写,可设置为只读
             * @patamete 键值
             */
            'purview': function (key) {
                data.purviewKey = !! key;
            },

            /*
             *  添加表，表不存在时将自动创建
             *  @pramete 表名 | 值 | 数据是否去重
             */
            'set': function (str, val, singleKey) {
                // 查询权限
                if (!data.purviewKey) {
                    return;
                }
                if (!FUNCS.isArray(data.dataBase[str])) {
                    if ( !! data.dataBase[str]) {
                        data.dataBase[str] = [data.dataBase[str]];
                    } else {
                        data.dataBase[str] = [];
                    }
                }
                var valIndex = FUNCS.indexOf(val, data.get(str));
                if (singleKey && valIndex > -1) {
                    data.dataBase[str].splice(valIndex, 1);
                }
                data.dataBase[str].push(val);
                return val;
            },
            /*
             *  取得表的数据
             *  @pramete 表名 | 是否是copy件
             */
            'get': function (str, isCopy) {
                var isCopy = ((typeof isCopy).toLowerCase() == 'boolean') ? isCopy : true;
                var result = data.dataBase[str];
                var temp = [];
                if (isCopy && result) {
                    Array.prototype.push.apply(temp, result);
                    result = temp;
                }
                return result;
            },
            /*
             * 取得中心的所有数据
             */
            'show': function () {
                return data.dataBase;
            },
            /*
             *  删除表的数据
             *  @pramete 表名 | [表中项的数字索引]
             */
            'remove': function (str, index) { // index不存在的情况下默认删除表
                // 查询权限
                if (!data.purviewKey) {
                    return;
                }
                var _removeData, index = parseInt(index);
                if (index >= 0) {
                    _removeData = data.dataBase[str][index];
                    data.dataBase[str].splice(index, 1);
                } else if (!index) {
                    _removeData = data.dataBase[str];
                    delete data.dataBase[str];
                }
                return _removeData;
            },
            /*
             *  克隆表的数据，内部复制
             *  @pramete 表名 | 目的表名
             */
            'clone': function (str, toStr) { // 克隆表
                // 查询权限
                if (!data.purviewKey || !data.dataBase[str]) {
                    return;
                }
                var _tempData = data.dataBase[str];
                for (var i = 0; i < _tempData.length; i++) {
                    data.set(toStr, _tempData[i]);
                }
                return _tempData;
            },
            /*
             *  检索是否存在某键
             *  @pramete 待检索键名
             */
            'isHas': function (keyname) {
                return (keyname in data.database);
            },
            /*
             *  检索某数据中是否存在某键，所存储值必须为对象
             *  @pramete 被检索键名，待检索键名
             */
            'isDataHas': function (keyname, name) {
                var valAttr = data.get(keyname);
                if (!FUNCS.isArray(valAttr)) {
                    return -1;
                }
                var val;
                var key = -1;
                for (var i = 0; i < valAttr.length; i++) {
                    val = valAttr[i];
                    if ((typeof val).toLowerCase() != 'object' || FUNCS.isArray(val)) {
                        continue;
                    }
                    if (name in val) {
                        key = i;
                        break;
                    }
                }
                return key;
            },
            /*
             *  检索某数据中是否存在某值，所存储的值必须是对象
             *  @pramete 数据表名，待检索值，可选参数检索值所处键名
             */
            'isDataOwn': function (keyname, indexVal, childKeyName) {
                var valAttr = data.get(keyname);
                if (!FUNCS.isArray(valAttr)) {
                    return -1;
                }
                var val;
                var key = -1;
                for (var i = 0; i < valAttr.length; i++) {
                    val = valAttr[i];
                    if ((typeof val).toLowerCase() != 'object' || FUNCS.isArray(val)) {
                        continue;
                    }
                    if ( !! childKeyName) {
                        if (val[childKeyName] === indexVal) {
                            return i;
                        }
                    } else {
                        for (var j in val) {
                            if (val[j] === indexVal) {
                                return i;
                            }
                        }
                    }
                }
                return -1;
            },
            /*
             *  导入并更新数据
             *  @pramete dataBase
             */
            'upload': function (databaseObj) {
                var database = databaseObj.show();
                if (!data.purviewKey || (typeof database).toLowerCase() != 'object') {
                    return;
                }
                for (var i in database) {
                    data.dataBase[i] = database[i];
                }
                return database;
            },
            /*
             *  导入表数据
             *  @pramete 表名 | 数组形式的值
             */
            'insert': function (str, dataArr, singleKey) {
                if (!data.purviewKey || !FUNCS.isArray(dataArr)) {
                    return;
                }
                if (singleKey) {
                    for (var i = 0; i < dataArr.length; i++) {
                        data.set(str, dataArr[i], true);
                    }
                } else {
                    if (!FUNCS.isArray(data.dataBase[str])) {
                        data.dataBase[str] = (data.dataBase[str] ? [data.dataBase[str]] : []);
                    }
                    data.dataBase[str] = data.dataBase[str].concat(dataArr);
                    return dataArr;
                }
            },
            /*
             *  清空数据库，并不删除
             */
            'destroy': function () { // 销毁数据库
                // 查询权限
                if (!data.purviewKey) {
                    return;
                }
                var _dataBase = [];
                for (var i in data.dataBase) {
                    _dataBase[i] = data.dataBase[i];
                }
                data.dataBase = {};
                return _dataBase;
            }
        }
        // 重新封装
        var _data = {
            'purview': data.purview,
            'set': data.set,
            'get': data.get,
            'show': data.show,
            'remove': data.remove,
            'clone': data.clone,
            'upload': data.upload,
            'insert': data.insert,
            'isHas': data.isHas,
            'isDataHas': data.isDataHas,
            'isDataOwn': data.isDataOwn,
            'destroy': data.destroy
        }
        return _data;
    };

    // 计数器
    FUNCS.counter = function () {
        var counterBase = {};

        var isNumber = function (val) {
            // var _temp = Number(val);
            // return ((_temp + '') != 'NaN');
            return FUNCS.isWhat( val, 'number' )
        };

        var toBeNum = function (val) {
            if (isNumber(val)) {
                return val;
            } else {
                return 0;
            }
        };

        var isUndefined = function (item) {
            return (typeof item === 'undefined');
        };

        var counter = {
            /**
             * 创建计数器方法
             * @param 计数器名 | config
             */
            create: function (name, conf) {
                if ( !! counterBase[name]) {
                    throw 'the same data already exists!';
                }

                var config = FUNCS.parseObj({
                    'max'       : undefined, // 限定的最大值，默认不限定
                    'min'       : undefined,
                    'step'      : 1, // 单次操作的权值
                    'maxFn'     : function () {}, // 超出最大的处理方法
                    'minFn'     : function () {}, // 低于最小的处理方法 
                    'onceFn'    : function () {}, // 单次操作成功的回调方法
                    'startVal'  : 0 // 初始设定值，只能为整数
                }, conf || {});
                var startVal = toBeNum(config.startVal);

                config.val = config.startVal = startVal;
                counterBase[name] = config;
                return true;
            },

            /**
             * 计数器加
             * @param 计数器名 [| 单步权值]
             */
            add: function (name, num) {
                if (!counterBase[name]) {
                    throw ('I do not know what you said about ' + name);
                }
                var step = (typeof num == 'undefined' ? counterBase[name].step : num);
                var _temp = counterBase[name].val + step;

                var key = !isUndefined(counterBase[name].max) &&
                    _temp > counterBase[name].max;
                if (key) {
                    counterBase[name].maxFn(_temp);
                    return false;
                } else {
                    counterBase[name].onceFn(_temp);
                    counterBase[name].val = _temp;
                    return true;
                }
            },

            /**
             * 计数器减
             * @param 计数器名 [| 单步权值]
             */
            sub: function (name, num) {
                if (!counterBase[name]) {
                    throw ('I do not know what you said about ' + name);
                }
                var step = (typeof num == 'undefined' ? counterBase[name].step : num);
                var _temp = counterBase[name].val - step;

                var key = !isUndefined(counterBase[name].min) &&
                    _temp < counterBase[name].min;
                if (key) {
                    counterBase[name].minFn(_temp);
                    return false;
                } else {
                    counterBase[name].onceFn(_temp);
                    counterBase[name].val = _temp;
                    return true;
                }
            },

            /**
             * 手动设定计数器
             * @param 计数器名 | 待设定的值
             */
            set: function (name, val) {
                if (!counterBase[name]) {
                    return false;
                }
                if (isNumber(val)) {
                    counterBase[name].val = val;
                }
                return true;
            },

            /**
             * 读取计数器
             * @param 计数器名
             */
            get: function (name) {
                if (!counterBase[name]) {
                    return false;
                }
                return counterBase[name].val;
            },
            isHas: function (name) {
                return (name in counterBase);
            },
            /**
             * 计数器重置
             * @param 计数器名
             */
            reset: function (name) {
                if (name == undefined) {
                    for (var i in counterBase) {
                        counterBase[i].val = counterBase[i].startVal;
                    }
                    return false;
                }
                if (!counterBase[name]) {
                    return false;
                }
                counterBase[name].val = counterBase[name].startVal;
                return true;
            },

            /** 
             * 删除计数器
             * @param 计数器名
             */
            del: function (name) {
                if (!counterBase[name]) {
                    return false;
                }
                delete counterBase[name];
            }
        };

        return counter;
    };

    //获取当前时间
    FUNCS.getTime = function (linkStr) {
        var linkStr = linkStr || '/';
        var d = new Date();
        return d.getFullYear() + linkStr + (d.getMonth() + 1) + linkStr + d.getDate() + linkStr + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    };

    // 删除节点
    FUNCS.removeNode = function (theNode) {
        theNode.parentNode.removeChild(theNode);
    };

    // 错误管理
    FUNCS.error = FUNCS.dataCenter();

    // 日志管理
    FUNCS.record = FUNCS.dataCenter();

    // 复制一个对象，如果是数组则复制后依然为数组
    FUNCS.copyObj = function (obj) {
        if (FUNCS.isArray(obj)) {
            return obj.slice(0);
        }
        var temp = {};
        for (var i in obj) {
            var tempObj = obj[i];
            if ((typeof obj[i]).toLowerCase() == 'object') {
                tempObj = FUNCS.copyObj(obj[i]);
            }
            temp[i] = tempObj;
        }
        return temp;
    };

    // 数组的forEach方法
    FUNCS.forEach = function (arr, func) {
        if (!FUNCS.isArray(arr)) {
            return false;
        }
        if (typeof arr.forEach != 'undefined') {
            FUNCS.forEach = function (arrOther, funcOther) {
                if (!FUNCS.isArray(arrOther)) {
                    return false;
                }
                arrOther.forEach(funcOther);
            };
            return FUNCS.forEach(arr, func);
        } else {
            FUNCS.forEach = function (arrOther, funcOther) {
                if (!FUNCS.isArray(arrOther)) {
                    return false;
                }
                for (var i = 0; i < arrOther.length; i++) {
                    funcOther(arrOther[i], i, arrOther);
                }
            };
            return FUNCS.forEach(arr, func);
        }
    };

    // 数组去重，delFirst可选，表示对重复元素是否删除索引值小的，保留靠后的
    FUNCS.concatArrOnly = function (arr1, arr2, delFirst) {
        var len1 = arr1.length,
            len2 = arr2.length,
            forRoot = len1 >= len2 ? arr2 : arr1,
            indexArr =  len1 < len2 ? arr2 : arr1,
            pos;
        for(var i in forRoot){
            pos = FUNCS.indexOf(forRoot[i], indexArr);
            if(pos > -1){
                delFirst && forRoot.splice(i, 1);
                !delFirst && indexArr.splice(pos, 1);
            }
        }
        return arr1.concat(arr2);
    };

    // html5 worker的一个简单的应用
    FUNCS.worker = function (jsSrc, conf) {
        if (window.Worker && ((typeof jsSrc).toLowerCase() == 'string')){
            var worker = new Worker(jsSrc);
            if ( ('onmessage' in worker) && ('postMessage' in worker) ){
                var config = FUNCS.parseObj( {
                    'onmessage' : function () {},
                    'onerror' : function () {}
                }, conf || {} );
                worker.onmessage = config.onmessage;
                worker.onerror = config.onerror;
                return worker;
            } else {
                FUNCS.workers = function () {return false};
                return false;
            }
                
        } else {
            return false;
        }

    };

    // check node   @param node (| nodeType值)
    FUNCS.isNode = function ( node, TypeVal ) {
        if ( node && ( ( typeof node.nodeType ).toLowerCase() == 'number' ) ) {
            if ( !TypeVal ) {
                return true;
            } 
            else {
                return node.nodeType == parseInt(TypeVal);
            }
        } 
        else {
            return false;
        }
    };

    // 获取对象的长度
    FUNCS.objLength = function ( obj ) {
        var l = 0;
        for( var i in obj ) {
            if( obj.hasOwnProperty( i ) ) {
                l++;
            }
        }
        return l;
    };

    /*======================
     * 私有方法及私有组件区
     *======================
     */

    // 挂载方法到CJS
    PRIVATE.add = function (name, func) {
        if (name.indexOf('.') == -1 && (!name in LOGICFUNS)) {
            LOGICFUNS[name] = func;
        } else if (name.indexOf('.') != -1) {
            var nameArr = name.split('.');
            var tempFunc = LOGICFUNS;
            for (var i = 0; i < nameArr.length - 1; i++) {
                tempFunc = tempFunc[nameArr[i]] = (nameArr[i] in tempFunc) ? tempFunc[nameArr[i]] : {};
            }
            tempFunc[nameArr.pop()] = func;
        }
    };
    // 辅助记录define及Rely行为，生成依赖关系数组，确保代码执行顺序
    PRIVATE.importTemp = {
        'base': FUNCS.dataCenter(),
        'reg': function (name, key) { // 刻录加载日志
            var key = key || '__r__'; // i表示Rely的顺序，r表示define的顺序
            PRIVATE.importTemp.base.set('regTemp', key + name); // 辅助检测import的死循环
        },
        // 对数据进行处理，便于执行相关操作，
        // 生成的格式为：{A : [B, C], B : [D]}表示A依赖B、C，B依赖D
        'formatBase': function () {
            var regExp = /^\_\_([ir])\_\_(.+)/;
            var startData = PRIVATE.importTemp.base.get('regTemp');
            var result = {};
            var tempData = {};
            var roundState = false;
            var tempName = [];
            for (var i = 0; i < startData.length; i++) {
                // 从字符串中取核心数据
                tempData = startData[i].match(regExp);
                if (tempData.length >= 3) { // 确保匹配到了数据
                    if (tempData[1] == 'i') {
                        roundState = true;
                        tempName.push(tempData[2]);
                    } else if (tempData[1] == 'r') {
                        if (!roundState) {
                            continue;
                        }
                        result[tempData[2]] = tempName;
                        tempName = [];
                        roundState = false;
                    }
                }
            }
            return result;
        },
        // 依赖关系死循环检测
        'loopCheck': function (relationObj) {
            var tempObj = relationObj || PRIVATE.importTemp.formatBase();
            rObj = FUNCS.copyObj(tempObj); // 杜绝传址
            for (var i in rObj) { // A
                // 依次对项的依赖项进行细化
                for (var j = 0; j < rObj[i].length; j++) {
                    // 如果某项的依赖项也存在依赖项，则把该项全替换为子项
                    if (rObj[i][j] in rObj) { // B in {A : [B, C], B : [D]}
                        // 重新定义循环初始条件
                        var temp = FUNCS.copyObj(rObj[rObj[i][j]]);
                        rObj[i].splice(j, 1);
                        rObj[i] = rObj[i].concat(temp); // {A : [D, C], B : [D]}
                    }
                }
                // 检测某项的依赖项是否包含自身
                if (FUNCS.indexOf(i, rObj[i]) > -1) {
                    FUNCS.error.set('[import]', 'Something may be wrong in import, so that the occurrence of dead loop!');
                    return false;
                }
            }
            return true;
        }
    };



    /*===============
     * 组件区
     *===============
     */

    /*
     * 代码托管器，按照示例中的写法，js文件加载完成后，
     * 通过define注册的方法将被返回到托管器中，执行初始化方法"run"时，
     * 这些保存的方法将被执行，从而完成初始化，这时候，就可以使用plugin中提供的一系列功能了。
     * 采用这种方法的好处是便于管理，当某个plugin依赖其它plugin时，异步加载js可能导致某个plugin还未
     * 完全加载，就被调用，这时将会导致运行出错，而使用代码托管之后，只需将依赖的plugin通过Rely方法
     * 导入，即可保证依赖的plugin在使用前已有定义。
     */
    var ctrlCenter = {
        'scriptCenter': FUNCS.dataCenter(),
        'define': function (name, func) {
            // 此处用于防止覆盖掉自带的方法:形如“__funcList__”的内置方法
            if (/^\_\_.*\_\_$/.test(name)) {
                FUNCS.error.set('[define]', 'illegal name!');
                return;
            }
            // 此处检索在注册的方法列表中是否已经存在name=某个注册名的对象，如存在则表示重复定义
            if (ctrlCenter.scriptCenter.isDataOwn('__funcList__', name, 'name') != -1) {
                FUNCS.error.set('[define]', 'repeat define for ' + name);
                return;
            }
            // 刻录加载日志，用于依赖关系检测
            PRIVATE.importTemp.reg(name);
            // 存储数据
            ctrlCenter.scriptCenter.set('__funcList__', {
                'name': name,
                'func': function (spec) {
                    FUNCS.record.set( 'record', this.name );
                    return func(spec);
                }
            });
        },
        'run': function (name, conf) {
            var config = FUNCS.parseObj({
                'jsTimeOut': 10 * 1000,
                'timeOutFn': function () {}
            }, conf || {}, true);

            // 文件加载检测，<!--仅在当前有文件正在加载时执行-->=============
            // 检测是否有文件正在加载，有则轮询至加载完成,超时则做超时错误处理
            if (JSOBJ.busyState) {
                for (var i in JSOBJ.busyState) {
                    if (JSOBJ.busyState[i]) {
                        // 做轮询的超时处理
                        if (!global.busyClock) {
                            global.busyClock = setTimeout(function () {
                                clearTimeout(global.pollClock);
                                FUNCS.error.set('[jsLoader]', 'TimeOut for loading url:' + i);
                                config.timeOutFn(i);
                                global.busyClock = undefined;
                                return;
                            }, config.jsTimeOut);
                        }
                        // 轮询文件是否加载完成
                        global.pollClock = setTimeout(function () {
                            ctrlCenter.run(name);
                        }, 200);
                        return;
                    }
                }
                // 已经加载完成了，则不需要再进行上面的检测，直至有新文件加载
                JSOBJ.busyState = {};
            }
            // 文件已加载，清除超时处理
            clearTimeout(global.busyClock);
            // 获取注册的方法列表
            var funcsObj = ctrlCenter.scriptCenter.get('__funcList__');
            // 未提供name时全部运行
            if (!name) {
                for (var i = funcsObj.length - 1; i >= 0; i--) {
                    ctrlCenter.run(funcsObj[i].name);
                }
                return true;
            }
            // 如果已经运行，则return
            if (ctrlCenter.isRun(name)) {
                return;
            }

            // 依赖关系处理=================================
            var funcsL = funcsObj.length;
            var orderRecoder = PRIVATE.importTemp.formatBase(); // 获取依赖关系列表
            // 如果死锁，则抛出错误
            if (!PRIVATE.importTemp.loopCheck(orderRecoder)) {
                console && console.log && console.log('dead loop!');
            }
            while (funcsL > 0 && funcsObj[funcsL - 1]) {
                var tempName = funcsObj[funcsL - 1].name;
                // 检测当前运行的代码是否存在依赖关系，如存在，其依赖文件是否已经运行
                if (FUNCS.isArray(orderRecoder[name]) && orderRecoder[name].length > 0) {
                    for (var i = 0; i < orderRecoder[name].length; i++) {
                        if (!ctrlCenter.isRun(orderRecoder[name][i])) { // 判断依赖方法是否已经运行
                            // 如果依赖的js已经加载，则运行之，否则，抛出错误
                            if (ctrlCenter.scriptCenter.isDataOwn('__funcList__', orderRecoder[name][i], 'name') > -1) {
                                ctrlCenter.run(orderRecoder[name][i]);
                            } else {
                                var errorStr = 'the js source of ' + orderRecoder[name][i] + ' is not exist!';
                                FUNCS.error.set('[Rely]', errorStr);
                                throw errorStr;
                            }
                        }
                    }
                }
                // 获取方法在方法存储库中的位置，并运行之
                var funcObjPos = ctrlCenter.scriptCenter.isDataOwn('__funcList__', name, 'name');
                if (funcObjPos > -1) {
                    var _func = funcsObj.splice(funcObjPos, 1)[0];
                    // 运行方法，得到运行后句柄
                    var handle = _func.func(CJS);
                    // 挂载方法到主区
                    PRIVATE.add(name, handle);
                    // 储存句柄
                    ctrlCenter.scriptCenter.set('__funcHandle__', {
                        'name': name,
                        'handle': handle
                    });
                    // 储存已运行方法
                    ctrlCenter.scriptCenter.set('__isRun__', name);
                }
            }
        },
        'isRun': function (name) {
            var arr = ctrlCenter.scriptCenter.get('__isRun__');
            if (!arr) {
                return false;
            }
            return FUNCS.indexOf(name, arr) > -1 ? true : false;
        },
        'destroy': function (name) {
            var funcArr = ctrlCenter.scriptCenter.get('__funcHandle__');
            var handleArr = [];
            var funcObj;
            if ( !! name) {
                for (var i = 0; i < funcArr.length; i++) {
                    funcObj = funcArr[i];
                    (funcObj.name == name) && funcObj.handle && funcObj.handle.destroy && funcObj.handle.destroy();
                }
            } else {
                for (var i = 0; i < funcArr.length; i++) {
                    funcObj = funcArr[i];
                    funcObj.handle && funcObj.handle.destroy && funcObj.handle.destroy();
                }
            }
        }
    };

    // 脚本文件加载器
    var JSOBJ = {
        // 待加载js地址队列
        'priorityQueue': [],
        // 已加载历史记录
        'historyQueue': [],
        // 存储js加载状态，ture为正在加载，false为加载完成
        'busyState': {},
        // 加载全局锁，用于避免一个队列中，已加载(队列中已没有)和将要加载(要加入队列中)的重复
        'globalLock': false,
        // 添加到待加载队列，队列顺序根据其配置的权值
        'addQueue': function (srcUrl, conf) {
            var config = FUNCS.parseObj({
                'power': 0 // 权重
            }, conf || {}, true);
            JSOBJ.busyState[srcUrl] = true; // 状态繁忙
            var jsObj = {
                'src': srcUrl
            };
            JSOBJ.priorityQueue.splice(config.power, 0, jsObj);
        },

        'jsTagCreat': function (conf) {
            JSOBJ.globalLock = true; // 锁定全局
            var config = FUNCS.parseObj({
                'isAsyn': true,
                'callBack': function () {},
                'isClear': true // 是否在加载完成后清除script标签
            }, conf || {});
            // 遍历加载
            while (JSOBJ.priorityQueue.length > 0) {
                var temp = JSOBJ.priorityQueue.pop();
                var scriptNode = document.createElement('script');
                scriptNode.type = 'text/javascript';
                scriptNode.defer = config.isAsyn;
                scriptNode.src = temp.src;
                if (config.isAsyn) {
                    if ('onreadystatechange' in scriptNode) {
                        scriptNode.onreadystatechange = function () {
                            var rs = scriptNode.readyState;
                            if (rs.toLowerCase() == 'loaded' || rs.toLowerCase() == 'complete') {
                                config.callBack(temp.src);
                                JSOBJ.busyState[temp.src] = false; // 状态空闲
                                config.isClear && FUNCS.removeNode(scriptNode);
                            }
                        };
                    } else {
                        scriptNode.onload = function () {
                            config.callBack(temp.src);
                            JSOBJ.busyState[temp.src] = false; // 状态空闲
                            config.isClear && FUNCS.removeNode(scriptNode);
                        };
                    }
                }
                document.body.appendChild(scriptNode);
            }
            if (JSOBJ.priorityQueue.length == 0) {
                JSOBJ.globalLock = false;
            }
        },

        'loader': function (srcUrl, conf) {
            if (FUNCS.isArray(srcUrl)) {
                for (var i = 0; i < srcUrl.length; i++) {
                    JSOBJ.loader(srcUrl[i], conf);
                }
                return;
            }
            var srcUrl = FUNCS.trim(srcUrl);
            // 查阅加载历史记录，保证js不重复加载
            if (FUNCS.indexOf(srcUrl, JSOBJ.historyQueue) != -1) {
                FUNCS.error.set('[jsLoader]', 'repeat loader for ' + srcUrl);
                return false;
            }
            var config = FUNCS.parseObj({
                'isAsyn': true,
                'power': 0,
                'isClear': true,
                'callBack': function () {}
            }, conf || {}, true);
            // 创建历史加载记录
            JSOBJ.historyQueue.push(srcUrl);
            // 进行添加到加载队列的一系列操作
            JSOBJ.addQueue(srcUrl, config);
            if (!JSOBJ.globalLock) {
                JSOBJ.jsTagCreat(config);
            }
        }
    };

    /*
     * Rely 方法，用于保证代码间的依附关系，
     * 避免组件的运行先于其依赖的其它组件，
     * 避免出现未定义就运行的情况。
     * 并不拉取文件，仅拉取文件间的依赖关系
     */
    var Rely = function (name) {
        PRIVATE.importTemp.reg(name, '__i__'); // 只记录顺序，最后统一在运行时保证初始化顺序
    };

    // 全局缓存，用于各个模块间的缓存使用
    var GLOBALCache = FUNCS.dataCenter();
    GLOBALCache.about = 'Global cache for all of the defined functions, just like \'window\'.';
    delete GLOBALCache.destroy;

    /*=========================================
     * GLOBAL全局方法区，直接挂载在window对象上
     *=========================================
     */
    
    /*
     * 用于将需要节点的方法以级联的形式书写，
     * 必须在所有依赖资源加载之后执行
     * <可使用define和Rely方法实现>
     * @param node
     * @return CJS Object
     */

    // window.$CJS = function ( node ) {
    //     // 暂缓吧，暂时没思路
    // };

    /*=============
     * 抛出方法
     *=============
     */
    return {
        'version'   : version,
        'FUNCS'     : FUNCS,                    // 基础方法组件，提供基础的一系列方法
        'error'     : FUNCS.error.show(),       // 错误日志，用于记录运行中的错误
        'record'    : FUNCS.record.show(),      // 日志管理，用于记录所有已注册方法的首次运行行为
        'define'    : ctrlCenter.define,        // 定义方法
        'run'       : ctrlCenter.run,           // 执行注册方法的初始化
        'isRun'     : ctrlCenter.isRun,         // 判断某一方法是否已经初始化
        'Rely'      : Rely,                     // 导入方法，用于处理组件间的依赖关系
        'logic'     : LOGICFUNS,                // 注册的组件将全部挂载到这个区域下
        'jsLoader'  : JSOBJ.loader,             // js加载模块
        'destroy'   : ctrlCenter.destroy,       // 销毁方法
        'GLOBAL'    : GLOBALCache
    };
})();
}
/**
 * 浏览器相关信息
 * @return object
 */
CJS.define( 'nav.browser', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    var uAgent      = navigator.userAgent,
        platform    = navigator.platform,
        lang        = navigator.language || navigator.userLanguage,
        version     = navigator.appVersion,
        plugins     = navigator.plugins,
        online      = navigator.onLine,
        cookie      = navigator.cookieEnabled;

    var regs = {
        'IE6_10'    : /MSIE\s+([0-9\.]+)/i,
        'IE11'      : /rv\s*\:\s*([0-9\.]+)/i,
        'Firefox'   : /Firefox\s*\/\s*([0-9\.]+)/i,
        'Chrome'    : /Chrome\s*\/\s*([0-9\.]+)/i,
        'Safari'    : /Version\/([0-9\.]+).*Safari/i,
        'Opera'     : /Opera|OPR\/?\s*([0-9\.]+)/
    }

    var main = {
        'IE'        : false,
        'Firefox'   : false,
        'Chrome'    : false,
        'Safari'    : false,
        'Opera'     : false
    };

    // 判断浏览器类型及其版本信息
    var which = function () {
        var list = [ 'IE6_10', 'IE11', 'Opera', 'Firefox', 'Safari', 'Chrome' ];
        for ( var i = 0, lL = list.length; i < lL; i++ ) {
            var nameStr = list[i];
            var item    = regs[nameStr];
            var filterArr = uAgent.match( item );
            if ( filterArr ) {
                // 版本
                var v = filterArr[1];
                if ( nameStr == 'IE6_10' ) {
                    main.IE = v;
                }
                else if ( nameStr == 'IE11' ) {
                    if ( uAgent.match( /\.NET/ ) ) {
                        main.IE = v;
                    }
                    else {
                        continue;
                    }
                }
                else {
                    main[nameStr] = v;
                }
                break;
            }
        }
    };
    which();
    main.cookie = cookie;
    main.lang = lang;
    main.plugins = plugins;
    main.platform = platform;
    main.onLine = online;
    return main;
});
/**
 * 获取屏幕相关信息
 */
CJS.define( 'nav.screen', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function () {
        var main = {};
        // avail为除去任务栏外的尺寸
        main.availH = screen.availHeight;
        main.availW = screen.availWidth;
        // 为显示器的尺寸
        main.height = screen.height;
        main.width  = screen.width;
        // 调色板比特深度
        main.colorDepth = screen.colorDepth;
        return main;
    };
});
/**
 * 创建节点
 * @param {sting} [nodeName] [nodeName], {object} [nodeAttr] [node attributes]
 * @return {node} [new node] 
 */
CJS.define( 'dom.newNode', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( nodeName, nodeAttrs ) {
        if ( !$f.isWhat( nodeName, 'string' ) ) {
            throw '[dom.newNode] need string as first parameter!';
        }
        var attrs = nodeAttrs || {};
        var theNode = document.createElement( nodeName );
        for ( var i in attrs ) {
            if ( attrs.hasOwnProperty( i ) ) {
                theNode.setAttribute( i, attrs[i] );
            }
        }
        return theNode;
    };
});
/**
 * 检测某个节点是否包含(>=)另一个节点
 * ps: 或许可以额外定义两个独一无二的class，分别赋给inner和outer
 * 然后css根据层级关系写好样式，判断inner的样式是否改变了，改变则说明层级关系成立，包含成立
 */
CJS.define( 'dom.contains', function ( $ ) {
    return function (inner, outer) {
        if (inner == outer) {
            return true;
        }
        if (inner.prototype && inner.prototype.contains && outer.prototype && outer.prototype.contains) {
            return outer.contains(inner);
        }
        var innerParent = inner;
        while (innerParent) {
            innerParent = innerParent.parentNode;
            if (innerParent === outer) {
                return true;
            }
        }
        return false;
    };
});
/**
 * 判断是否为某种节点类型
 * @param node nodeName
 * @return Boolean
 */
CJS.define( 'dom.whichNode', function ( $ ) {
    var $l = $.logic,
        $f = $.FUNCS;
    return function ( node, nodeName ) {
        if ( !$f.isNode( node ) ) {
            return false;
        }
        var nName = node.nodeName.toLowerCase();
        var theName = nodeName.toLowerCase();
        return (nName == theName);
    };
});
/**
 * 节点选择器，支持id，class，属性，简单混合逻辑为关键字
 * @param 索引关键字 封顶节点
 */
CJS.define('dom.get', function ($) {
    return function (indexStr, upNode) {
        var regs = {
            'id'        : /^\#([a-zA-Z\_]\S*)$/,
            'class'     : /^\.([a-zA-Z\_]\S*)$/,
            'attr'      : /^\[(\S+)\=[\'\"]?(\S+)[\'\"]?\]$/,
            'tag'       : /^[a-zA-Z]+$/,
            // 此处格式为 div|#lp（div或者id为lp的节点）  div&.lp（div且class为lp的节点）
            'tagAttr'   : /^([a-zA-Z]+)([\&\|])(.+)$/
        };
        // 错误管理器
        var error = $.FUNCS.error;
        var type, node = document.body,
            root = upNode || document,
            indexStr = $.FUNCS.isWhat( indexStr, 'undefined' ) ? 'body' : indexStr;

        // 取属性节点
        var getAttrNodes = function (attr, val) {
            var tempNode = [];
            if ( root.querySelectorAll && val != '*') {
                tempNode = NListToArray( root.querySelectorAll( indexStr ) );
            }
            else {
                var nodes = root.getElementsByTagName('*');
                for (var i = 0; i < nodes.length; i++) {
                    var attrVal = nodes[i].getAttribute(attr);
                    if (attr == 'class') { // 此处为class做特殊处理，用兼容ie7-
                        attrVal = nodes[i].className;
                    }
                    if (val == '*') {
                        attrVal && tempNode.push(nodes[i]);
                    }
                    else if (attrVal == val) {
                        tempNode.push(nodes[i]);
                    }
                }
            }
            return tempNode;
        }

        // nodeList类型转换为array类型
        var NListToArray = function ( Nl ) {
            return Array.prototype.splice.call(Nl, 0);
        };

        // 取class
        var getClassNode = function (className) {
            var tempNode;
            if ( root.querySelectorAll ) {
                tempNode = NListToArray( root.querySelectorAll( className ) );
            }
            else if (root.getElementsByClassName) {
                tempNode = root.getElementsByClassName(className);
                tempNode = NListToArray(tempNode);
            }
            else {
                tempNode = getAttrNodes('class', className);
            }
            return tempNode;
        };

        var getTagAttrNode = function (tagName, logicType, attr) {
            var nodes = [];
            if (logicType == '|') {
                var tempTags = root.getElementsByTagName(tagName);
                tempTags = NListToArray(tempTags); // nodeList转化为数组
                var tempNodes = getNode(attr) || [];
                nodes = $.FUNCS.concatArrOnly(tempTags, $.FUNCS.isArray(tempNodes) ? tempNodes : [tempNodes]);
            } else if (logicType == '&') {
                var tempAttrs = getNode(attr) || [];
                tempAttrs = $.FUNCS.isArray(tempAttrs) ? tempAttrs : [tempAttrs];
                for(var i = 0, len = tempAttrs.length; i < len; i++){
                    var attrNode = tempAttrs[i];
                    if(attrNode.nodeName && attrNode.nodeName.toLowerCase() == tagName){
                        nodes.push(attrNode);
                    }
                }
            }
            return nodes;
        };
        // 取索引类型
        var getType = function (indexStr) {
            for (var i in regs) {
                var matchVal = indexStr.match(regs[i]);
                if ( !! matchVal) {
                    type = i;
                    return matchVal;
                }
            }
        };
        var getNode = function (indexStr) {
            var matchVal = getType(indexStr);
            var node;
            switch (type) {
            case 'id':
                node = document.getElementById(matchVal[1]);
                break;
            case 'class':
                node = getClassNode(matchVal[1]);
                break;
            case 'attr':
                node = getAttrNodes(matchVal[1], matchVal[2]);
                break;
            case 'tag':
                node = NListToArray( root.getElementsByTagName(indexStr) );
                break;
            case 'tagAttr':
                node = getTagAttrNode(matchVal[1], matchVal[2], matchVal[3]);
                break;
            default:
                node = null;
            }
            return node;
        };
        return getNode(indexStr);
    };
});
/**
 * 获取距离当前节点最近的，符合条件的父节点
 * @param 依据的节点 索引字符串 (查询范围，默认为document)
 * @return 符合条件的父亲节点
 */
CJS.define('dom.getClosest', function ($) {
    return function (rootNode, toAttr, wrapperNode) {
        // 变量初始化
        var $func = $.FUNCS,
            type,
            $error = $func.error;

        var checkNode = function () {
            if ( !rootNode || typeof rootNode == 'undefined' ) {
                $error.set('[dom.getClosest]', 'need Node as first parameter!');
                return false;
            }
            else {
                return true;
            }
        };

        if (!checkNode()) {
            return;
        }
        var wrapperNode = wrapperNode || node.ownerDocument;
        // 关键正则定义
        var regs = {
            'id'    : /^\#([a-zA-Z\_]\S*)$/,
            'class' : /^\.([a-zA-Z\_]\S*)$/,
            'attr'  : /^\[(\S+)\=[\'\"]?(\S+)[\'\"]?\]$/,
            'tag'   : /^[a-zA-Z]+$/
        };

        // 递归节点属性获取目标节点
        var getAttrNodes = function (attr, val, isClass) {
            var forEachNode = function (node) {
                if ( node != wrapperNode || node.nodeType != 9) { // 节点为文档类型则表示未找到
                    var parentNode = node.parentNode;
                    if (parentNode.nodeType == 1) { // 如果不是元素节点，则访问其父节点
                        var parentAttr = isClass ? parentNode.className : parentNode.getAttribute(attr);
                        if (parentAttr === val) {
                            return parentNode;
                        } else {
                            return forEachNode(parentNode);
                        }
                    } else {
                        return forEachNode(parentNode);
                    }

                } else {
                    return null;
                }
            };
            return forEachNode(rootNode);
        }

        var getTagNameNode = function (tag) {
            var forEachNode = function (node) {
                if (node.nodeType != 9) { // 节点为文档类型则表示未找到
                    var parentNode = node.parentNode;
                    if (parentNode.nodeType == 1) { // 如果不是元素节点，则访问其父节点
                        var parentTagName = parentNode.tagName.toLowerCase();
                        if (parentTagName == tag) {
                            return parentNode;
                        } else {
                            return forEachNode(parentNode);
                        }
                    } else {
                        return forEachNode(parentNode);
                    }

                } else {
                    return null;
                }
            };
            return forEachNode(rootNode);
        };
        // 获取依据字符串的类型
        var getType = function () {
            for (var i in regs) {
                var matchVal = toAttr.match(regs[i]);
                if ( !! matchVal) {
                    type = i;
                    return matchVal;
                }
            }
        };

        // 获取目标节点
        var getNode = function () {
            var matchVal = getType();
            switch (type) {
            case 'id':
                node = document.getElementById(matchVal[1]);
                break;
            case 'class':
                node = getAttrNodes( 'class', matchVal[1], true);
                break;
            case 'attr':
                node = getAttrNodes(matchVal[1], matchVal[2]);
                break;
            case 'tag':
                node = getTagNameNode(toAttr.toLowerCase());
                break;
            default:
                node = rootNode;
            }
            return node;
        };
        return getNode();
    };
});
/**
 * 获取某节点的classList对象
 * @return 返回类似H5的classList的对象
 */
CJS.define( 'dom.getClassList', function ( $ ) {
    $f = $.FUNCS;
    return function ( node ) {
        if ( !$f.isNode( node ) ) {
            throw '[dom.getClass]: ' + $f.NODESTRING;
        }
        // 如果节点支持H5的classList，则直接返回classList对象
        if ( node.classList ) {
            return node.classList;
        }
        var result = {}, pureClass, classArr, classL = 0, classList = {};
        // 刷新class相关
        var freshClass = function () {
            // 获取清除首尾空格的class字符串
            pureClass = $f.trim( node.className );
            classArr = pureClass.split( ' ' );
            classL = classArr.length;
        };

        freshClass();
        // 移除class的方法
        var remove = function ( str ) {
            freshClass();
            if ( !!str && !!pureClass ) {
                var pos = $f.indexOf( str, classArr );
                if ( pos != -1 ) {
                    classArr.splice( pos, 1 );
                    node.className = classArr.join(' ');
                    freshClass();
                }
            }
            return node;
        };

        // 添加class的方法
        var add = function ( str ) {
            freshClass();
            if ( !!str ) {
                var pos = $f.indexOf( str, classArr );
                if ( pos == -1 ) {
                    classArr.push( str );
                    node.className = classArr.join( ' ' );
                    freshClass();
                }
            }
            return node;
        };

        // class切换
        var toggle = function ( str ) {
            freshClass();
            if ( !!str ) {
                var pos = $f.indexOf( str, classArr );
                if ( pos == -1 ) {
                    add( str );
                }
                else {
                    remove( str );
                }
            }
            return node;
        };

        // 检测是否存在某个class
        var contains = function ( str ) {
            freshClass();
            if ( !str ) {
                throw '[dom.getClassList]: error! Invalid parameter!';
            }
            var pos = $f.indexOf( str, classArr );
            return (pos != -1);
        };

        // 获取某个位置的class
        var item = function ( index ) {
            freshClass();
            var pos = ( parseInt( index ) == index ) ? index : 0;
            return classArr[ pos ];
        };

        for ( var i = 0; i < classL; i++ ) {
            classList[i] = classArr[i];
        }
        classList[ 'length'  ] = classL;
        classList[ 'remove'  ] = remove;
        classList[ 'add'     ] = add;
        classList[ 'toggle'  ] = toggle;
        classList[ 'contains'] = contains;
        classList[ 'item'    ] = item;
        
        return classList;
    };
} );
/**
 * 节点属性设置，无val时为获取相关属性，有val时为设置相关属性
 * @param 节点 属性名称 (待设置属性值，可选)
 */
CJS.define( 'dom.attr', function ( $ ) {
    $f = $.FUNCS;
    return function ( node, attr, val ) {
        if ( !$.isNode( node ) ) {
            throw '[dom.attr]: ' + $f.NODESTRING;
        }
        if ( val ) {
            node.setAttribute( attr, val );
        }
        else {
            return node.getAttribute( attr );
        }
    };
} );
/**
 * 节点克隆，将进行，将去除所有克隆节点的ID，保证合法性
 * @param 待克隆节点
 * @return 克隆后被处理过的节点
 */
CJS.define( 'dom.cloneNode', function ( $ ) {
    $f = $.FUNCS;
    return function ( node, conf ) {
        if ( !$f.isNode( node ) ) {
            throw '[dom.cloneNode]: ' + $f.NODESTRING;
        }

        var config = $f.parseObj( {
            'uniAttr' : ['id']  // 在页面中，要保持唯一性的属性
        }, conf || {} );

        var range = document.createRange(),
            fragment,       // 片段
            tempStr,        // 字符串形式
            box,            // 暂存的节点盒子
            reg;            // 正则

        var attrs = config.uniAttr.join( '|' );
        var tempRegStr = "(\\<[a-zA-Z]+)((\\s*[a-zA-Z&^(" + attrs + ")]+\\=[\"\'][^\\s&^\\>]+[\"\'])*)\\s(" + attrs + ")\=[\"\'][A-Za-z\\_\\#0-9]+[\"\']";
        reg = new RegExp( tempRegStr, 'gi' );
        // reg = /(\<[a-zA-Z]+)((\s*[a-zA-Z&^(id)]+\=[\"\'][^\s&^\>]+[\"\'])*)\sid\=[\"\'][A-Za-z\_]+[\"\']/gi;
        range.setStartBefore( node );
        range.setEndAfter( node );
        fragment = range.cloneContents();
        box = document.createElement('div');
        box.appendChild( fragment );
        // clear ID
        tempStr = box.innerHTML;
        box.innerHTML = tempStr.replace( reg, '$1$2' );
        return box.childNodes[0];
    };
} );
/**
 * 插入html
 * @param node htmlString , position
        position: beforebegin afterbegin beforeend afterend
 * @return node片段
 */
CJS.define( 'dom.insertHTML', function ( $ ) {
    var $f = $.FUNCS;
    return function ( node, htmlStr, pos ) {
        if ( !$f.isNode( node ) ) {
            throw '[dom.insertHTML]: ' + $f.NODESTRING;
        }
        // 如果无有效字符则直接返回
        if ( !htmlStr ) {
            return;
        }
        var position = pos || 'beforeend';
        position = position.toLowerCase();
        if ( node.insertAdjacentHTML ) {
            switch ( position ) {
                case 'beforebegin':
                    node.insertAdjacentHTML( pos, htmlStr );
                    return node.previousSibling;
                case 'afterbegin':
                    node.insertAdjacentHTML( pos, htmlStr );
                    return node.firstChild;
                case 'beforeend':
                    node.insertAdjacentHTML( pos, htmlStr );
                    return node.lastChild;
                case 'afterend':
                    node.insertAdjacentHTML( pos, htmlStr );
                    return node.nextSibling;
                default:
                    throw 'Illegal position of \'' + pos + '\'';
            }
        }
        else {
            var range = node.ownerDocument.createRange(),
                key = null;
            switch ( position ) {
                case 'beforebegin':
                    // 设置范围起点
                    range.setStartBefore( node );
                    // 将html字符串转换为fragment片段，用于节点操作
                    var fragment = range.createContextualFragment( htmlStr );
                    node.parentNode.insertBefore( fragment, node );
                    return node.previousSibling;
                case 'afterbegin':
                    var nodeChild = node.firstChild;
                    if ( !nodeChild ) {
                        node.innerHTML = htmlStr;
                    }
                    else {
                        range.setStartBefore( nodeChild );
                        var fragment = range.createContextualFragment( htmlStr );
                        node.insertBefore( fragment, nodeChild );
                    }
                    return node.firstChild;
                case 'beforeend':
                    range.setStart( node );
                    var fragment = range.createContextualFragment( htmlStr );
                    node.appendChild( fragment );
                    return node.lastChild;
                case 'afterend':
                    range.setStartAfter( node );
                    var fragment = range.createContextualFragment( htmlStr );
                    node.parentNode.insertBefore( fragment, node.nextSibling );
                    return node.nextSibling;
                default:
                    throw 'Illegal position of \'' + pos + '\'';
            }
        }
        // var box = document.createElement( 'div' );
        // box.innerHTML = htmlStr;
    };
} );
/**
 * 在节点的某个位置插入节点
 * @param 待插入节点 依据的节点 插入位置：beforebegin, afterbegin, beforeend, afterend
 * @return 插入的节点
 */
CJS.define( 'dom.insertNode', function ( $ ) {
    var $f = $.FUNCS;
    return function ( node, toNode, where ) {
        if ( !$.isNode( node ) || !$.isNode( toNode ) ) {
            throw '[dom.insertNode]: ' + $f.NODESTRING;
        }
        var where = where || 'beforeend';
        where = where.toLowerCase();
        if ( toNode.insertAdjacentElement ) {
            switch ( where ) {
                case 'beforebegin':
                    toNode.insertAdjacentElement( node, where );
                    break;
                case 'afterbegin':
                    toNode.insertAdjacentElement( node, where );
                    break;
                case 'beforeend':
                    toNode.insertAdjacentElement( node, where );
                    break;
                case 'afterend':
                    toNode.insertAdjacentElement( node, where );
                    break;
                default:
                    throw 'Illegal position of \'' + where + '\'';
            }
        }
        else {
            var range = toNode.ownerDocument.createRange(),
                key = null;
            switch ( position ) {
                case 'beforebegin':
                    toNode.parentNode.insertBefore( node, toNode );
                    break;
                case 'afterbegin':
                    var toNodeChild = toNode.firstChild;
                    if ( !toNodeChild ) {
                        toNode.appendChild( node );
                    }
                    else {
                        toNode.insertBefore( node, toNodeChild );
                    }
                    break;
                case 'beforeend':
                    toNode.appendChild( node );
                    break;
                case 'afterend':
                    toNode.parentNode.insertBefore( node, toNode.nextSibling );
                    break;
                default:
                    throw 'Illegal position of \'' + pos + '\'';
            }
        }
        return node;
    };
});
/**
 * 用于向上级节点查找，从当前节点开始查找，直到找到符合条件的节点或者查找到边界
 * @param Node, func[, boundary ]
        当前节点，判断方法，边界节点（默认为body）
 * @return Node
 */
CJS.Rely( 'dom.contains' );
CJS.define( 'dom.nodeBy', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic,
        $contains = $l.dom.contains;
    return function ( node, func, boundary ) {
        if ( !$f.isNode( node ) ) {
            throw '[dom.nodeBy]: ' + $f.NODESTRING;
        }
        var currentNode = node,
            toNode      = boundary || node.ownerDocument.body;

        // 包含关系检测
        if ( !$contains( node, toNode ) ) {
            throw '[dom.nodeBy]: ' + 'illegal boundary!';
        }
        
        // 遍历查找
        while ( currentNode != toNode ) {
            if ( func(currentNode) ) {
                return currentNode;
            }
            else {
                currentNode = currentNode.parentNode;
            }
        }
        return null;     
    };
});
/**
 * 对节点建模
 * @param node attr
        CJS.logic.dom.modeling( document.body, 'node-type' );
 * @return nodeObject
 */
CJS.Rely( 'dom.get' );
CJS.define( 'dom.nodeMap', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( node, attr ) {
        if ( !$f.isNode( node ) ) {
            throw '[dom.nodeMap]: ' + $f.NODESTRING;
        }
        var attrStr = attr || 'node-type';
        // 获取所有具有该属性的节点
        var nodeList = $l.dom.get( '[' + attrStr + '=*]', node );
        var result = {};
        for ( var i = 0, nL = nodeList.length; i < nL; i++ ) {
            var tempAttrName = nodeList[ i ].getAttribute( attrStr );
            if ( result.hasOwnProperty( tempAttrName ) ){
                result[ tempAttrName ].push( nodeList[ i ] );
            }
            else {
                result[ tempAttrName ] = [ nodeList[i] ];
            }
        }
        return result;
    };
});
/**
 * 同innerHTML，获取带当前节点的html字符串
 * @param 带获取的节点
 * @return html字符串
 */
CJS.define( 'dom.outerHTML', function ( $ ) {
    var $f = $.FUNCS;
    return function ( node ) {
        if ( !$f.isNode( node ) ) {
            throw '[dom.outerHTML]: ' + $f.NODESTRING;
        }
        var range,
            box = document.createElement( 'div' );
        if ( typeof node.outerHTML != 'undefined' ) {
            return node.outerHTML;
        }
        else if( node.cloneNode ){
            box.appendChild( node.cloneNode() );
            return box.innerHTML;
        }
        else if ( document.createRange ) {
            range = document.createRange();
            range.setStartBefore( node );
            range.setEndAfter( node );
            box.appendChild( range.cloneContents() );
            return box.innerHTML;
        }
    };
});
/**
 * 移除节点
 */
CJS.define( 'dom.removeNode', function ( $ ) {
    var $f = $.FUNCS;
    return function ( node ) {
        if ( !$f.isNode( node ) ) {
            throw '[dom.removeNode]: ' + $f.NODESTRING;
        }
        node.parentNode.removeChild( node );
    };
} );
/**
 * 用classA替换classB
 * @return node
 */
CJS.Rely( 'dom.getClassList' );
CJS.define( 'dom.replaceClass', function ( $ ) {
    var $f = $.FUNCS;
    return function ( node, classA, classB) {
        if ( !$f.isNode( node ) ) {
            throw '[dom.replaceClass]: need node as first parameter!';
        }
        var classList = $.logic.dom.getClassList( node );
        classList.remove( classB );
        classList.add( classA );
        return node;
    };
} );
/**
 * 替换某个节点
 * @param 用来替换的新节点(|新节点的html内容) 当前节点
 * @return 替换的新的节点 
 */
CJS.Rely( 'dom.insertHTML' );
CJS.Rely( 'dom.insertNode' );
CJS.Rely( 'dom.removeNode' );
CJS.define( 'dom.replaceNode', function ( $ ) {
    var $f          = $.FUNCS,
        $l          = $.logic,
        $insertHTML = $l.dom.insertHTML,
        $insertNode = $l.dom.insertNode;
    return function ( newNode, oldNode ) {
        if ( !$f.isNode( oldNode ) ) {
            throw '[dom.replaceNode]: need node as second parameter!'
        }
        if ( $f.isWhat( newNode, 'string' ) ) {
            $insertHTML( oldNode, newNode, 'afterend' );
        }
        else {
            $insertNode( oldNode, newNode, 'afterend' );
        }
        var theNewNode = oldNode.nextSibling;
        $l.dom.removeNode( oldNode );
        return theNewNode;
    };
});
CJS.Rely( 'css.base' )
CJS.define( 'dom.pos', function ( $ ) {
    var $CSS = $.logic.css.base;
    // 获取单个节点内容距离父节点的距离
    var getPosAdd = function ( node ) {
        var l = node.offsetLeft,
            t = node.offsetTop;
        return {
            'l': parseInt(l),
            't': parseInt(t)
        };
    };
    return function ( node ) {
        var pos = {
            'l': 0,
            't': 0
        };
        var currentNode = node;
        return getPosAdd(node);
    };
} )
/**
 * 样式获取及设置
 * @param node styleString|{styleObject}
        第二个参数为字符串时，将获取当前节点的样式，
        第二个参数为对象时，将对当前节点做样式设定
 */
CJS.define( 'css.base', function ( $ ) {
    return function ( node, spec ) {
        if( !$.FUNCS.isNode( node ) ) {
            $.FUNCS.error.set('[css.base]', 'need node as first parameter!');
            return false;
        }
        // 格式化样式名字符串为驼峰式
        var formatStr = function ( str ) {
            return str.replace(/([a-zA-Z]+)[\-]([a-zA-Z])([a-zA-Z]*)/g, function(){return (arguments[1] +arguments[2].toUpperCase() + arguments[3])});
        };

        // 格式化样式名字符串为-式
        var antiFormatStr = function ( str ) {
            return str.replace(/([a-z]+)([A-Z])([a-z]*)/g, function(){return (arguments[1] + '-' + arguments[2].toLowerCase() + arguments[3])})
        };
        // 额外列表
        var extraList = {
            'opacity': 'alpha',
            'boxShadow': 'progid:DXImageTransform.Microsoft.Shadow',
            'float': 'float'
        };

        var isFilter = false;

        // 获取计算样式
        var getComputedStyle = function ( styleName ) {
            if ( window.getComputedStyle ) {
                getComputedStyle = function ( styleNameTemp ) {
                    return window.getComputedStyle( node, null )[ styleNameTemp ];
                }; 
            } 
            else if ( document.defaultView && document.defaultView.getComputedStyle ) {
                getComputedStyle = function ( styleNameTemp ) {
                    return node.ownerDocument.defaultView.getComputedStyle( node, null )[ styleNameTemp ];
                };  
            } 
            else if ( node.currentStyle ){
                getComputedStyle = function ( styleNameTemp ) {
                    return node.currentStyle[ styleNameTemp ];
                };
            } 
            else {
                getComputedStyle = function ( styleNameTemp ) {
                    return node.style[ styleNameTemp ];
                };
            }
            return getComputedStyle( styleName );
        };
        
        // 获取样式综合
        var getStyle = function ( styleTypeTemp ) {
            // 先获取计算样式，无计算样式时才访问行内样式，防止类似于!important的使用，提高准确性
            return getComputedStyle( styleTypeTemp );
        };

        // format extra
        var format = function ( styleName ) {
            var styleTxt = getStyle( styleType );
            if( styleName in extraList ) {
                if( !styleTxt ) {
                    var tempStyleTxt = getStyle( 'filter' ) || '';
                    isFilter = true;
                    switch ( styleName ) {
                        case 'opacity': 
                            tempStyleTxt = tempStyleTxt.replace(/[\'\"]/g, '');
                            var matchArr = tempStyleTxt.match( new RegExp( extraList['opacity'] + '[\(]([^\)]+)[\)]' ) );
                            if ( matchArr ) {
                                styleTxt = matchArr[1].split('=')[1];
                            } else {
                                styleTxt = 'none';
                            }
                            break;
                        case 'boxShadow':
                            // 杀千刀的计算啊！
                            var matchArr = tempStyleTxt.match( new RegExp( extraList['boxShadow'] + '[\(]([^\)]+)[\)]' ) );
                            if( matchArr ) {
                                var dataObj = {}, tempStr = matchArr[1].replace(/\s/g, '').split(',');
                                for ( var i = 0, l = tempStr.length; i < l; i++ ) {
                                    var tempDataKey = tempStr[i].split( '=' );
                                    dataObj[ tempDataKey[ 0 ].toLowerCase() ] = tempDataKey[ 1 ];
                                }
                                // tan(theta) = y / x
                                var theta = 180 * ( ( Math.PI - parseFloat( dataObj['direction'] ) ) / Math.PI );
                                var styleX = parseFloat( dataObj[ 'strength' ] ) * Math.cos( theta );
                                var styleY = parseFloat( dataObj[ 'strength' ] ) * Math.sin( theta );
                                styleTxt = styleX + 'px ' + styleY + 'px ' + dataObj[ 'strength' ] + 'px ' + dataObj[ 'color' ];
                            } else {
                                styleTxt = 'none';
                            }
                            break;
                        case 'float':
                            break;
                        default:
                    }
                }
            }
            return styleTxt;
        };
        var freshCssFilterCatche = function ( content ) {};

        // set css
        var setCss = function ( cssObj ) {
            var cssCatche = node.style.cssText.toLowerCase() + ';';
            var cssStr = '', tempName = '';
            !isFilter && format( 'opacity' );// 用来得到isFilter
            for ( var i in cssObj ) {
                tempName = antiFormatStr( i );
                cssStr = cssStr + tempName + ':' + cssObj[i] + ';';
                if ( isFilter ) {
                    switch ( tempName ) {
                        case 'opacity':
                            cssStr = cssStr + 'filter:alpha(opacity=' + parseFloat( cssObj[i] ) * 100 + ')' + ';zoom:1;';
                            break;
                        case 'box-shadow':
                            var shadowTemp = cssObj[i].split(' ');
                            var x = parseInt(shadowTemp[0]),
                                y = parseInt(shadowTemp[1]);
                            cssStr = cssStr + 'filter:progid:DXImageTransform.Microsoft.Shadow(strength=' + Math.sqrt( x * x + y * y ) + ', direction=' + Math.atan( y / x ) + ', color="' + shadowTemp[3] + '");zoom:1;';
                            break;
                        default:

                    }
                }
            }
            node.style.cssText = cssCatche + cssStr;
        };
        if ( typeof spec == 'string' ) {
            var styleType = formatStr( spec );
            return format( styleType );
        } 
        else if ( typeof spec == 'object' ) {
            setCss( spec );
            return node;
        }
            
    };
} );
/**
 * 用于检测某个节点是显示还是隐藏
 * @param node isDeep
        待检测节点 是否深度检测(默认为否，即不考虑样式继承)
 * @return Boolean
 */
CJS.Rely( 'css.base' );
CJS.Rely( 'dom.nodeBy' );
CJS.define( 'css.isShow', function ( $ ) {
    var $f      = $.FUNCS,
        $l      = $.logic,
        $css    = $l.css.base,
        $nodeBy = $l.dom.nodeBy;

    return function ( node, isDeep ) {
        if ( !$f.isNode( node) ) {
            throw '[css.isShow]: ' + $f.NODESTRING;
        }
        var nodeDis = ( $css( node, 'display' ) == 'none' ),
            nodeVis = ( $css( node, 'visibility' ) == 'hidden' ),
            deep    = isDeep || false;

        // 检测当前节点设置是否显示，不追溯继承
        var isNodeShow = function ( theNode ) {
            return !( $css( theNode, 'display' ) == 'none' || $css( theNode, 'visibility' ) == 'hidden' );
        };
        if ( !deep ) {
            return isNodeShow( node );
        }
        if ( nodeDis || nodeVis ) {
            return false;
        }
        else{
            var hideNode = $nodeBy( node, function ( current ) {
                return !isNodeShow( current );
            });
            return !hideNode;
        }
    };
});
/**
 * 显示模块
 * @param node|nodeArray 略过节点
        支持节点或者节点数组
 */
CJS.Rely( 'css.isShow' );
CJS.define( 'css.show', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( nodes, skipNode ) {
        var show = function ( n ) {
            // 对当前节点做浅度显示检测，避免重复设置
            if( !$l.css.isShow( n ) ) {
                n.style.display = 'block';
                // n.style.visibility = 'visible';
            }
        };
        if ( $f.isNode( nodes ) ) {
            show(nodes);
        }
        else if ( $f.isArray( nodes ) ) {
            for ( var i = 0, nL = nodes.length; i < nL; i++ ) {
                if ( skipNode && skipNode == nodes[i] ) continue;
                show( nodes[i] );
            }
        }
        return nodes;
    };
});
/**
 * 隐藏模块
 * @param node|nodeArray 略过节点
        支持节点或者节点数组
 */
CJS.Rely( 'css.isShow' );
CJS.define( 'css.hide', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( nodes, skipNode ) {
        var hide = function ( n ) {
            // 做浅度检测，避免重复设置
            if ( $l.css.isShow( n) ) {
                n.style.display = 'none';
            }
        };
        if ( $f.isNode( nodes ) ) {
            hide(nodes);
        }
        else if ( $f.isArray( nodes ) ) {
            for ( var i = 0, nL = nodes.length; i < nL; i++ ) {
                if ( skipNode && skipNode == nodes[i] ) continue;
                hide( nodes[i] );
            }
        }
        return nodes;
    };
});
/**
 * 判断是否是数组
 */
CJS.define( 'arr.isArray', function ( $ ) {
    return function (arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    };
});
/**
 * array索引
 * @param 待检索项 检索源数组
 * @return 待检索项在检索源中的位置，不存在则返回-1
 */
CJS.Rely( 'arr.isArray' );
CJS.define( 'arr.indexOf', function ( $ ) {
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
/**
 * 数组map方法的兼容处理
 * @param array function
        待处理数组，用于处理的方法
            function有三个参数，分别为：遍历的当前项 当前索引值 处理的数组
 */
CJS.define( 'arr.map', function ( $ ) {
    var $f = $.FUNCS;
    return function ( arr, fun ) {
        if ( Array.prototype.map ) {
            return arr.map( fun );
        }
        else {
            var result = [];
            for ( var i = 0, arrL = arr.length; i < arrL; i++ ) {
                result[i] = fun( arr[i], i, arr );
            };
            return result;
        }
    };
});
/**
 * 事件打包，支持常规事件，代理事件，自定义事件，扩展的鼠标事件
 */
CJS.Rely( 'dom.getClosest' );
CJS.Rely( 'dom.contains' );
CJS.define('evt.event', function($){
    // 异常管理
    var error = $.FUNCS.error;
    var $contains = $.logic.dom.contains;

    /*
     * mouse事件扩展
     * 增加鼠标移出mouseleave和鼠标移入mousein的事件  
     */
    var __mouseFn__;// 实际绑定的方法
    var mouseObj = {
        'mouseFnList' : $.FUNCS.dataCenter(),
        'mouseLock' : {
            'mouseleave' : false,
            'mousein'    : false
        },
        'mouseFn' : function(node, type){
            if(mouseObj.mouseLock[type]){
                return;
            }
            var fnType = '__' + type + '__';
            var realType = (type == 'mouseleave' ? 'mouseout' : 'mouseover');
            __mouseFn__ = function(e){
                var evt = e || window.event;
                var relatedTarget = evt.relatedTarget || (type == 'mouseleave' ? evt.toElement : evt.fromElment);
                // 如果关联的目标包含在节点内部则表示是节点内部的过渡，无需触发，相反则需触发
                if(!$contains(relatedTarget, node)){
                    var funList = mouseObj.mouseFnList.get(fnType);
                    $.FUNCS.forEach(funList, function(item){
                        item(evt);
                    });
                }
            };
            addEvt(node, realType, __mouseFn__);
        },
        'removeMouse' : function(node, type, func){
            var fnType = '__' + type + '__';
            var realType = (type == 'mouseleave' ? 'mouseout' : 'mouseover');
            var funList = mouseObj.mouseFnList.get(fnType);
            var funPos = $.FUNCS.indexOf(func, funList);
            if(funPos > -1){
                // 从方法队列中移除对应的方法，如果队列为空则解除方法绑定
                mouseObj.mouseFnList.remove(fnType, funPos);
                if(funList.length == 0){
                    removeEvt(node, realType, __mouseFn__);
                    mouseObj.mouseLock[fnType] = true;
                }
            }
        }
    };
    var mouseExpand = {
        'add' : function(node, type, func){
            var fnType = '__' + type + '__';
            mouseObj.mouseFnList.set(fnType, func);// 储存方法
            mouseObj.mouseFn(node, type);
        },
        'remove' : function(node, type, func){
            mouseObj.removeMouse(node, type, func);
        }
    };
    /*
     * 自定义事件    
     */
    // 辅助对象添加组件，其中，原理与CJS.define的命名空间定义类似
    var custObjHelp = function(mainObj, name, data){
        if(name.indexOf('.') == -1 && (!name in mainObj)){
            mainObj[name] ? mainObj[name].push(data) : (mainObj[name] = [data]);
        }
        else if(name.indexOf('.') != -1){
            var nameArr = name.split('.');
            var tempFunc = mainObj;
            for(var i = 0; i < nameArr.length - 1; i++){
                tempFunc = tempFunc[nameArr[i]] = (nameArr[i] in tempFunc) ? tempFunc[nameArr[i]] : {};
            }
            var tempName = nameArr.pop();
            tempFunc[tempName] ? tempFunc[tempName].push(data) : (tempFunc[tempName] = [data]);
        }
    };
    var customEvent = {
        'evtBase' : {},
        'add' : function(obj, evtType, func) {
            var key = obj['__custEvtKey__'];
            if(key){
                var nameStr = key + '.' + evtType;
                custObjHelp(customEvent.evtBase, nameStr, func);
            }
            else {
                obj['__custEvtKey__'] = $.FUNCS.getKey();
                customEvent.add(obj, evtType, func);
            }
        },
        'remove' : function(obj, evtType, func) {
            var key = obj['__custEvtKey__'];
            var data;
            if(key && (data = customEvent.evtBase[key])){
                if(typeof func == 'undefined'){
                    data[evtType] = [];
                    return;
                }
                var index = $.FUNCS.indexOf(func, data[evtType]);
                if(index > -1){
                    data[evtType].splice(index, 1);
                }
            }
        },
        'fire' : function(obj, evtType, dataArr){
            var key = obj['__custEvtKey__'];
            dataArr = dataArr ? dataArr : [];
            var data;
            if(key && (data = customEvent.evtBase[key])){
                funcList = data[evtType];
                if($.FUNCS.isArray(funcList)){
                    if(!$.FUNCS.isArray(dataArr)){
                        dataArr = [dataArr];    
                    }
                    for(var i = funcList.length - 1; i >= 0; i--){
                        funcList[i].apply(null, dataArr);
                    }
                }
            }
        },
        // 显示当前对象或者key值对应的事件名称列表，仅显示名称，避免外部操作修改
        'show' : function (obj) {
            var fnList, nameList = [];
            if ( $.FUNCS.isWhat( obj, 'object' ) ) {
                var key = obj['__custEvtKey__'];
                fnList = customEvent.evtBase[key];

            }
            else if ( $.FUNCS.isWhat( obj, 'number') ) {
                fnList = customEvent.evtBase[obj];
            }
            if ( fnList ) {
                for ( var i in fnList ) {
                    nameList.push( i );
                }
            }
            return nameList;
        },
        'destroy' : function(obj){
            if ( $.FUNCS.isWhat( obj, 'object' ) ) {
                if ( obj.hasOwnProperty( '__custEvtKey__' ) ) {
                    delete customEvent.evtBase[obj.__custEvtKey__];
                    delete obj.__custEvtKey__;
                }
            }
        }
    };
    var custEvt = {
        'add'       : customEvent.add,
        'remove'    : customEvent.remove,
        'fire'      : customEvent.fire,
        'show'      : customEvent.show,
        'destroy'   : customEvent.destroy
    }
    /*
     * 事件绑定
     * @parameter 绑定节点 | 事件类型(支持mouseleave和mousein事件) | 绑定方法
     */
    var addEvt = function(node, type, func){
        if(!node){
            error.set('[evt.event.addevt]','need node as first parameter!');
            return false;
        }
        // 增强鼠标离开和进入方法
        if(type == 'mouseleave' || type == 'mousein'){
            mouseExpand.add(node, type, func);
        }
        else{
            // 如果是滚轮事件，则针对火狐浏览器做兼容处理
            if ( type == 'mousewheel' ) {
                !node.hasOwnProperty( 'onmousewheel' ) && ( type = 'onDOMMouseScroll' );
            }
            if(node.addEventListener){
                node.addEventListener(type, func, true);
            }
            else if(node.attachEvent){
                node.attachEvent('on' + type, func);
            }
            else{
                node['on' + type] = func;
            }   
        }
    };
    /*
     * 事件解绑
     * @parameter 绑定节点 | 事件类型 | 绑定方法
     */
    var removeEvt = function(node, type, func){
        if(!node){
            error.set('[evt.event.removeEvt]','need node as first parameter!');
            return false;
        }
        // 增强鼠标离开和进入方法
        if(type == 'mouseleave' || type == 'mousein'){
            mouseExpand.remove(node, type, func);
        }
        else{
            if(node.removeEventListener){
                node.removeEventListener(type, func, true);
            }
            else if(node.detachEvent){
                node.detachEvent('on' + type, func);
            }
            else{
                node['on' + type] = function(){};
            }
            
        }
    };
    /*
     * 代理事件
     * @parameter 绑定根节点 | 参数
     * config :
     *  {
            'attrName' : 用于识别事件发生的节点的属性名
            'dataName' : 用于存储事件发生的相关数据的属性名
        }
        var test = $.logic.evt.event.agentEvt(document.body);
        test.add('clickNode', 'click', function(spec){console.log(spec)});
        // 其中，clickNode为那些action-type属性值为'clickNode'的节点
     */
    var agentEvt = function(root, conf){
        if(!root){
            error.set('[evt.event.agentEvt]','need node as first parameter!');
            return false;
        }
        var config = $.FUNCS.parseObj({
            'attrName' : 'action-type',
            'dataName' : 'action-data'
        }, conf || {});
        var skipNodes = [];
        var FnBase = {};
        // 绑定锁，用于避免多次真实绑定，区分事件类型
        var addLock = {};
        var __func__ = function(e){
            // 重新定义evt对象
            var e = e || window.event || {};
            var target = e.target || e.srcElement,
                type = e.type,
                left = e.X || e.clientX,
                top = e.Y || e.clientY,
                temp;// 储存临时的relatedTarget对象
            if(type == 'mouseout' || type == 'mouseover'){
                temp = e.relatedTarget || (type == 'mouseout' ? e.toElement : e.fromElment);
            }
            var relatedTarget = temp,
                attr = target.getAttribute(config.attrName);

            // if ( attrVal != '*' && attr != attrVal) {
            //  var tempTarget = $.logic.dom.getClosest( target, '[' + config.attrName + '=' + attrVal + ']' );
            //  if ( !!tempTarget ) {
            //      target = tempTarget;
            //  }
            // }
            var startFn = function () {
                if ( FnBase[ type ] && FnBase[ type ][ attr ] && $.FUNCS.indexOf(target, skipNodes) == -1 ) {
                    e.data = $.FUNCS.strToJson(target.getAttribute(config.dataName));
                    e.el = target;
                    e.relatedTarget = relatedTarget;
                    e.l = left;
                    e.t = top;
                    var funcs = FnBase[type][attr];
                    for ( var i = 0, fL = funcs.length; i < fL; i++ ) {
                        funcs[i](e);
                    }
                }
            };
            if ( !FnBase[ type ] ) {
                return;
            }
            // 如果所检测的相关数据不存在则朝上层节点遍历
            if ( !FnBase[ type ][ attr ] ) {
                target = target.parentNode;
                while(target.nodeType == 1 && $contains( target, root ) ){
                    attr = target.getAttribute(config.attrName);
                    if( FnBase[ type ][ attr ] ) {
                        startFn();
                    }
                    target = target.parentNode;
                }
                return;
            }
            startFn();  
            // // 判断是否为指定属性，通配符直接通过
            // if(tempKey && $.FUNCS.indexOf(target, skipNodes) == -1){
            //  e.data = $.FUNCS.strToJson(target.getAttribute(config.dataName));
            //  e.el = target;
            //  e.relatedTarget = relatedTarget;
            //  e.l = left;
            //  e.t = top;
            //  // 遍历整个方法对象，
            //  // 如果属性值为指定值或通配符，
            //  // 则执行该情况下的指定事件类型的方法
            //  var fnObj;
            //  for(var i = 0; i < FnBase.length; i++){
            //      fnObj = FnBase[i];
            //      if(fnObj.attrVal == attrVal || fnObj.attrVal == '*'){
            //          fnObj.evtType == evtType && fnObj.func(e);
            //      }
            //  }
            // }
        }
        // 属性值-绑定方法键值对
        // var attrFn = {};
        return {
            'add' : function(attrVal, evtType, func){
                // attrFn[attrVal] = {
                //  'type': evtType,
                //  'fn': func
                // };
                // 实际绑定的函数定义
                if( !FnBase[ evtType ] ) {
                    FnBase[ evtType ] = {};
                }
                if( !FnBase[ evtType ][ attrVal ] ) {
                    FnBase[ evtType ][ attrVal ] = [];
                }
                FnBase[ evtType ][ attrVal ].push( func );
                // 用于保证每个事件类型至多只绑定一次
                if(!addLock[evtType]){
                    addEvt(root, evtType, __func__);
                    addLock[evtType] = true;
                }
                return func;
            },
            'addSkip' : function(nodes){// 添加略过节点
                !$.FUNCS.isArray(nodes) && (nodes = [nodes]);
                Array.prototype.push.apply(skipNodes, nodes);
            },
            'removeSkip' : function(nodes){// 移除略过节点
                !$.FUNCS.isArray(nodes) && (nodes = [nodes]);
                for(var i = 0 ; i < nodes.length; i++){
                    var pos = $.FUNCS.indexOf(nodes[i], skipNodes);
                    pos > -1 && skipNodes.splice(pos, 1);
                }

            },
            'remove' : function(attrVal, evtType, func){
                if ( FnBase[evtType] && FnBase[evtType][attrVal] ) {
                    var tempFuncs = FnBase[evtType][attrVal],
                        pos = 0;
                    if( (pos = $.FUNCS.indexOf( func, tempFuncs )) != -1 ) {
                        // 删除对应的项
                        tempFuncs.splice( pos, 1 );
                    }
                    // 如果对应项没有方法了，则移除掉对应的属性key
                    if(tempFuncs.length == 0){
                        delete FnBase[evtType][attrVal];
                    }
                    // 如果对应事件下没有方法了，则移除掉该事件绑定
                    // 同时把事件绑定锁至为解锁状态
                    if( $.FUNCS.objLength( FnBase[evtType] ) == 0 ) {
                        removeEvt(root, evtType, __func__);
                        addLock[evtType] = false;
                    }
                }
                // 遍历FnBase
                // var fnObj, aK, eK, fK;
                // for(var i = 0; i < FnBase.length; i++){
                //  fnObj = FnBase[i];
                //  aK = (attrVal == '*') ? true : fnObj.attrVal == attrVal;
                //  if(aK && fnObj.evtType == evtType && fnObj.func == func){
                //      FnBase.splice(i, 1);
                //  }
                // }
            },
            'destroy' : function(){
                removeEvt(root, evtType, __func__);
                addLock[evtType] = false;
            }
        };
    };
    return {
        'addEvt'    : addEvt,
        'removeEvt' : removeEvt,
        'agentEvt'  : agentEvt,
        'custEvt'   : custEvt
    }
});
/**
 * 获取event对象
 * @param e
 * @return event
 */
CJS.define( 'evt.getEvt', function ( $ ) {
    return function ( e ) {
        var evt = e || window.event;
        var target  = evt.target || evt.srcElement,
            type    = evt.type,
            left    = evt.X || evt.clientX,
            top     = evt.Y || evt.clientY,
            temp;// 储存临时的relatedTarget对象
        // 用于支持IE浏览器等不支持relatedTarget属性的浏览器
        if( type == 'mouseout' || type == 'mouseover' ){
            temp = evt.relatedTarget || (type == 'mouseout' ? evt.toElement : evt.fromElment);
        }
        evt.l = left;
        evt.t = top;
        evt.relatedTarget = temp;
        evt.target = target;
        return evt;
    };
});
/**
 * 销毁方法，支持多参数写法，数组集合写法
 */
CJS.define( 'extra.destroy', function ( $ ) {
    return function () {
        var argu = arguments, obj, arguL = argu.length;
        var destroy = function ( handle ) {
            handle && handle.destroy && handle.destroy();
        };
        for ( var i = 0; i < arguL; i++ ) {
            if ( $f.isWhat( argu[i], 'array' ) ) {
                for ( var j in argu[i] ) {
                    destroy( argu[i][j] );
                }
            }
            else {
                destroy( argu[i] );
            }
        }
    };
});
/**
 * 模块自销毁方法，用于组件的自销毁操作
 */
CJS.Rely( 'dom.contains' );
CJS.define( 'extra.autoDestroy', function ( $ ) {
    var autoTimer,
        stepT = 1000;
    var $F = $.FUNCS;

    var $contains = $.logic.dom.contains;

    var main = {
        'data'  : {},
        'state' : 0,
        'len'   : 0,
        'destroy': function ( h ) {
            h && h.destroy && h.destroy();
        },
        'check' : function () {
            if ( main.state ) return;
            main.state = 1;
            autoTimer = setInterval( function () {
                var mData = main.data;
                for ( var i in mData ) {
                    if ( mData.hasOwnProperty( i ) ) {
                        var item = main.data[i];
                        if ( item.isBusy ) {
                            continue;
                        }
                        // 通过检测该节点有无父亲节点来判断是否已经从文档流中删除
                        // 对于document无法检测
                        if ( !$contains( item.node, item.node.ownerDocument.body ) ) {
                            main.destroy( item.handle );
                            delete main.data[i];
                        }
                    }
                }
            }, stepT );
        },
        // @param 组件句柄 依赖节点(不支持document的检测)
        // @return uniKey
        'add': function ( handle, node ) {
            if ( node.nodeType && node.nodeType == 9 ) {
                throw 'Can not support this type!';
            }
            var theKey = 'autoClear_' + $F.getKey();
            var checkNode = node || document.body;
            main.data[theKey] = {
                'isBusy': false,
                'node'  : checkNode,
                'handle': handle
            };
            main.len++;
            main.state || main.check();
            return theKey;
        },
        // 暂停某个模块的自销毁，可复原 @param uniKey
        'pause': function ( theKey ) {
            theKey 
                && main.data[theKey]
                    && ( main.data[theKey].isBusy = true );
        },
        // 恢复某个被暂停的自销毁 @param uniKey
        'start': function ( theKey ) {
            theKey 
                && main.data[theKey]
                    && ( main.data[theKey].isBusy = false );
        },
        // 移除某个自销毁模块，不可复原 @param uniKey
        'remove': function ( theKey ) {
            if( theKey && main.data[theKey] ) {
                delete main.data[theKey];
                main.len--;
                if ( !main.len ) {
                    autoTimer && clearInterval( autoTimer );
                    autoTimer = undefined;
                    main.state = 0;
                }
            }
        }
    };

    return {
        'add'   : main.add,
        'pause' : main.pause,
        'start' : main.start,
        'remove': main.remove
    };
});
/**
 * 获取页面的滚动条位置
 */
CJS.define( 'extra.scrollPos', function ( $ ) {
    return function () {
        return {
            't': document.documentElement.scrollTop || document.body.scrollTop,
            'l': document.documentElement.scrollLeft || document.body.scrollLeft
        }
    };
});
/**
 * 用于获取窗口的当前宽度和高度，通过直接创建节点的方式获取
 * @param 
 * @return { 'w': 1280, 'h': 800 }
 */
CJS.Rely( 'css.base' );
CJS.define( 'extra.winSize', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( root ) {
        var rootDoc = (root && root.ownerDocument) || document;
        var node = rootDoc.createElement( 'div' );
        $l.css.base( node, {
            'position'  : 'fixed!important',
            'z-index'   : -10000,
            'top'       : 0,
            'left'      : 0,
            'width'     : '100%!important',
            'height'    : '100%!important'
        });
        rootDoc.body.appendChild( node );
        var width  = $l.css.base( node, 'width' ),
            height = $l.css.base( node, 'height' );
        $f.removeNode( node );
        node = null;
        return {
            'w' : parseInt( width ),
            'h' : parseInt( height )
        };
    };
});
/**
 * 常用正则表达式库
 * @return 字符串，便于添加g, i参数
 */
CJS.define( 'extra.reglib', function ( $ ) {
    return {
        // 数字
        'number'    : "^[0-9]+$",
        // 单词
        'word'      : "^[a-zA-Z]+$",
        // 由单词或数字组成的
        'numOrWord' : "^[0-9a-zA-Z]$",
        // 中文
        'chinese'   : "[\\u4e00-\\u9fa5]",
        // 双字节
        'dbByte'    : "[^x00-xff]",
        // 首尾空格
        'hfspace'   : "^\\s*|\\s*$",
        // url，键值位置对应： 'href':[0], 'protocol':[2], 'host':[4], 'port':[6], 'path':[7], 'param':[8], 'query':[9], 'hash':[11]
        'url'       : "^(([a-zA-Z]+):)?(\\\/{2,})?([^\\\/&^\\:]+)(:([0-9]*))?(\\\/[^\\?]*)?(\\?([^\\#]*)(\\#(.*))?)?$",
        'email'     : "^[\\_a-zA-Z]+[\\_a-zA-Z]*@[^\\s&^\\.]+(\\.[^\\s&^\\.]+)+$"
    };
});
/**
 * 解析url地址，返回包含url相关数据的对象
 * @param url字符串，可选，无此参数时，将取当前页面所在地址进行解析
 */
CJS.Rely( 'extra.reglib' );
CJS.define( 'extra.parseUrl', function ( $ ) {
    var $f = $.FUNCS;
    return function ( urlStr ) {
        if ( !urlStr ) {
            urlStr = window.location.href;
        }
        if ( $f.isWhat( urlStr, 'string' ) ) {
            var matchStr = urlStr.match( new RegExp( $.logic.extra.reglib.url, 'i' ) );
            if ( matchStr ) {
                return {
                    'url'       : matchStr[0],
                    'protocol'  : matchStr[2],
                    'slash'     : matchStr[3],
                    'host'      : matchStr[4],
                    'port'      : matchStr[6],
                    'path'      : matchStr[7],
                    'param'     : matchStr[8],
                    'query'     : matchStr[9],
                    'hash'      : matchStr[11]
                }
            }   
        }
    };
});
/**
 * 用于合并两个url的query值，取第一个的url地址
 * @param urlString urlString|Json(第二个参数可为url地址或object对象)
 */
CJS.Rely( 'extra.parseUrl' );
CJS.Rely( 'obj.merge' );
CJS.define( 'extra.mergeUrl', function ( $ ) {
    var $f          = $.FUNCS,
        $l          = $.logic,
        $parseUrl   = $l.extra.parseUrl;

    return function ( rootUrl, newUrl ) {
        var rootParse   = $parseUrl( rootUrl ),
            newParse    = $parseUrl( newUrl ),
            newJson,
            rootJson;

        // 用于支持第二个参数为对象的情况
        if ( $f.isWhat( newUrl, 'object' ) ) {
            newJson = newUrl;
            newParse = true;
        }
        if ( rootParse && newParse ) {
            rootJson = $f.strToJson( rootParse.query );
            newJson  = newJson || $f.strToJson( newParse.query );
            var lastestQuery = $f.jsonToStr( $l.obj.merge( rootJson, newJson ) );
            return rootParse.protocol + '://' + rootParse.host + (rootParse.port ? (':' + rootParse.port) : '') + (lastestQuery ? ('?' + lastestQuery):'') + (rootParse.hash ? ( '#' + rootParse.hash ) : '');
        }
    };
});
/**
 * 函数的队列化处理
 * @return Object
        {
            add: 添加方法进队列，@P function [插入位置],
            getPos: 获取队列中的位置, @P unikey或者对应的方法
            remove: 从队列中移除，@P unikey
            run: 执行队列
            pause: 暂停队列，可用run唤醒
        }
 */
CJS.define( 'extra.queue', function ( $ ) {
    var $f      = $.FUNCS,
        $l      = $.logic,
        $custEvt= $l.evt.event.custEvt;
    return function () {
        var keyMap = {};
        var MAINQUEUE = [],
            MAINSTATE = 0;   // 执行状态: 0 空闲；1 正在执行；2 暂停;

        var QUEUE = {};
        // 核心模块
        // 添加进队列， @return uniKey
        QUEUE.add  = function ( func, keyPos ) {
            var key = $f.getKey();
            var QL = MAINQUEUE.length
            var pos = ( keyPos < QL ? keyPos : QL );
            MAINQUEUE.splice( pos, 0, {
                'func'  : func,
                'isBusy': false,    // 繁忙状态，预置，用于之后拓展
                'key'   : key
            } ); 
            keyMap[ key ] = pos;
            return key;
        };

        // 获取当前的位置，@return []
        QUEUE.getPos = function ( unikey ) {
            if ( $f.isWhat( unikey, 'number' ) ) {
                return [keyMap[ unikey ]];
            }
            else if ( $f.isWhat( unikey, 'function' ) ) {
                var item, pos = [];
                for ( var i = 0, QL = MAINQUEUE.length; i < QL; i++ ) {
                    item = MAINQUEUE[i];
                    if ( item.func == unikey ) {
                        pos[pos.length] = i;
                    }
                }
                return pos;
            }
        };

        // 从队列中移除
        QUEUE.remove = function ( key ) {
            if ( keyMap[key] ) {
                var posV = keyMap[key];
                delete keyMap[key];
                var delItem = MAINQUEUE.splice( posV, 1 );
                return delItem.func;
            }
        };

        QUEUE.run = function () {
            switch ( MAINSTATE ) {
                case 0:
                    // 将状态至为正在执行
                    MAINSTATE = 1;
                    var theQueue = MAINQUEUE;
                    while( theQueue.length ) {
                        if ( MAINSTATE == 2 ) {
                            break;
                        }
                        if ( theQueue[ theQueue.length - 1 ].busyState ) {
                            // 如果当前模块被设置为繁忙，则暂不执行该内容
                        }
                        else {
                            // 弹出方法的同时，将键值映射表中的相关数据清除
                            var tempObj = theQueue.shift();
                            delete keyMap[ tempObj.key ];
                            var funcResult = tempObj.func();
                            // 将函数执行后的结果通过自定义事件返回
                            // @spec { 'result': 结果, 'key': 该方法对应的unikey }
                            $custEvt.fire( QUEUE, 'run', {
                                'result': funcResult,
                                'key'   : tempObj.key
                            } );
                        }
                    }
                    MAINSTATE = 0;
                    break;
                // 正在运行状态下不进行其它操作
                case 1:
                    break;
                case 2:
                    MAINSTATE = 0;
                    QUEUE.run();
                    break;
                default:
                    break;
            }
        };

        // 一般在长时间型执行队列中使用
        QUEUE.pause = function () {
            MAINSTATE = 2;
        };
        
        return QUEUE;
        
    }
});
CJS.define( 'ani.algorithm', function ( $ ) {

    /* 
     * 获取初始的改变大小， 可引申为初速度
     */
    return {
        // 匀变速运动
        'uniformlyChange' : function ( S, T, a ) {
            return ( ( S / T ) - ( a * T ) / 2 );
        },

        // 半段匀加（减）速运动，半段匀减（加）速运动
        'uniformlyAddMinus' : function ( S, T, a ) {
            return ( ( S / (  2 * T ) ) - ( a * T ) / 2 );
        },

        // 匀速运动
        'uniform' : function ( S, T ) {
            return ( S / T );
        },

        // 初速度为0的变速运动的加速度
        'acceleration' : function ( S, T ) {
            return ( ( 2 * S ) / ( T * T ) );
        } 
    }
});
/**
 * dom动画
 */
CJS.Rely( 'ani.algorithm' );
CJS.Rely( 'css.base' );
CJS.Rely( 'str.ctrlColor' );
CJS.Rely( 'evt.event' );
CJS.define( 'ani.action', function ( $ ) {
    var $algo   = $.logic.ani.algorithm,
        $css    = $.logic.css.base,
        $color  = $.logic.str.ctrlColor,
        $evt    = $.logic.evt.event;

    return function ( node, opt ) {
        if( !$.FUNCS.isNode( node ) ){
            $.FUNCS.error.set( 'ani.action', 'need node as first parameter!' );
            throw '[ani.action] need node as first parameter!'
        }
        var option = $.FUNCS.parseObj( {
            'type'          : 'uniform',
            'callback'      : function () {},
            'time'          : 500,
            'stepT'         : 50,                   // 每次改变的时间间隔，可理解为帧率的倒数
            'acceleration'  : 10,
            'threshold'     : 2                     // 达到目标的阈值
        }, opt || {}, true );
        
        var currentStyle = {}, courseStyle = {}, initialObj = {}, formatAcc = option.type == 'uniform' ? 0 : option.acceleration,
            accObj = {}, that = {}, targetStyle, clock;

        var extraColorList      = 'color,background-color',
            extraOpacityList    = 'opacity',
            extraShadowList     = 'box-shadow';

        // 样式做差基础
        var styleMinusBase = function ( firstCss, secondCss ) {
            var fNum = parseFloat( firstCss ),
                sNum = parseFloat( secondCss );
            if( typeof fNum == 'NaN' ) {
                return false;
            } 
            return (sNum - fNum);
        };

        // 样式做差逻辑部分
        var styleMinus = function ( firstCssObj, secondCssObj ) {
            var result = {};
            for ( var i in firstCssObj ) {
                // 针对颜色
                if ( extraColorList.indexOf( i ) != -1 ) {
                    var firstFormat = getFormat( firstCssObj[ i ] );
                    var secondFormat = getFormat( secondCssObj[ i ] );
                    result[ i ] = {
                        'r': secondFormat.r - firstFormat.r,
                        'g': secondFormat.g - firstFormat.g,
                        'b': secondFormat.b - firstFormat.b
                    }
                }
                // 针对常规样式
                else {
                    var tempResult = styleMinusBase( firstCssObj[ i ], secondCssObj[ i ] );
                    if( tempResult ) {
                        result[ i ] = tempResult;
                    }
                }
            }
            return result;
        };

        // 样式做加基础
        var styleAddBase = function ( firstCss, secondCss ) {
            var fNum = parseFloat( firstCss ),
                sNum = parseFloat( secondCss );
            if( isNaN( fNum ) ) {
                return false;
            }
            var temp = fNum + sNum;
            return temp + firstCss.toString().replace( /[\.\d\-]/g, '' );
        };

        // 格式化颜色为对象
        var getFormat = function ( data ) {
            // 处理未设置颜色时，计算样式值为rgba(0,0,0,0);而引起的黑屏状况
            data = data.replace( /\s/g, '' );
            if( data == 'rgba(0,0,0,0)' ) {
                var data = 'rgb(255,255,255)';
            }
            var formatColor = $color.HTD( data );
            var regArr = formatColor.match( /rgb[a]?\(([^\)]+)\)/i )[1].split( ',' );
            var colorObj = {
                'r': parseInt( regArr[0] ),
                'g': parseInt( regArr[1] ),
                'b': parseInt( regArr[2] ),
                'a': parseInt( regArr[3] != undefined ? regArr[3] : 1 )
            };
            return colorObj;
        };

        // 解码格式化的颜色为字符串
        var decodeFormate = function ( dataObj ) {
            return 'rgb(' + dataObj.r + ',' + dataObj.g + ',' + dataObj.b + ')';
        };

        // 样式做加逻辑部分
        var styleAdd = function ( firstCssObj, secondCssObj ) {
            var result = {};
            for ( var i in firstCssObj ) {
                if ( extraColorList.indexOf( i ) == -1 ) {
                    var tempResult = styleAddBase( firstCssObj[ i ], secondCssObj[ i ] );
                    if( tempResult ) {
                        result[ i ] = tempResult;
                    }
                }
                else {
                    var firstFormat = getFormat( firstCssObj[ i ] );
                    var secondFormat = getFormat( secondCssObj[ i ] );
                    var tempObj = {
                        'r': secondFormat.r + firstFormat.r,
                        'g': secondFormat.g + firstFormat.g,
                        'b': secondFormat.b + firstFormat.b
                    };
                    result[ i ] = 'rgb(' + tempObj.r + ',' + tempObj.g + ',' + tempObj.b + ')'
                }
            }
        };

        // 获取待改变的样式的当前值与"行走的路程"
        var getStyleData = function () {
            for ( var i in targetStyle ) {
                var tempStyle = $css( node, i );
                // 针对颜色做特殊处理
                if ( extraColorList.indexOf( i ) != -1 ) {
                    // 如果颜色设置为“透明”，则向其父节点取颜色，直至找到非“透明”设置或者到达最顶层
                    if ( tempStyle == 'transparent' ) {
                        var tempNode = node,
                            flag;
                        while ( tempNode != node.ownerDocument ) {
                            var loopStyle = $css( tempNode, i );
                            if ( loopStyle != 'transparent' ) {
                                tempStyle = loopStyle;
                                flag = true;
                                break;
                            }
                            tempNode = tempNode.parentNode;
                        }
                        !flag && ( tempStyle = '#ffffff');
                    }
                }
                else if ( extraOpacityList.indexOf( i ) != -1 ) {
                    if ( tempStyle == 'none' ) {
                        tempStyle = 1;
                    }
                }
                currentStyle[ i ] = tempStyle;
            }
            courseStyle = styleMinus( currentStyle, targetStyle );
        };

        // 获取初始改变值，可理解为初速度
        var getInitialV = function () {
            for ( var i in courseStyle ) {
                if ( extraColorList.indexOf( i ) == -1 ) {
                    initialObj[ i ] = $algo[ option.type ]( Math.abs( courseStyle[ i ] ), Math.ceil( option.time / option.stepT ), formatAcc );
                }
                else {
                    var extraObj = {};
                    for ( var j in courseStyle[ i ] ) {
                        extraObj[ j ] = $algo[ option.type ]( Math.abs( courseStyle[ i ][ j ] ), Math.ceil( option.time / option.stepT ), formatAcc );
                    }
                    initialObj[ i ] = extraObj;
                }   
            }
        };

        // 检测现有条件下，加速度的设定是否合法< 加(减)速运动时，初速度是否大于0 >
        var filterA = function ( firstV, S ) {
            if ( firstV >= 0 ) {
                return formatAcc;
            } 
            // 如果不合法，则设定初(末)速度为0的情况下，抛出合法的加速度
            else {
                // 针对半加速半减速的情况，对“路程”做减半处理
                var tempS = ( option.type == 'uniformlyAddMinus' ? S/2 : S ),
                    tempT = option.time / ( option.type == 'uniformlyAddMinus' ? 2 : 1 );
                return Math.abs( $algo[ 'acceleration' ]( tempS, Math.ceil( tempT / option.stepT ) ) );
            }
        };

        var actionBase = function () {
            var counter = 1, tMax = Math.ceil( option.time / option.stepT );
            // 循环基础依赖组件
            var loopBase = function ( func ) {
                if ( counter > tMax ) {
                    option.callback( targetStyle );
                    // 自定义事件触发，用于队列及其它相关处理
                    $evt.custEvt.fire( that, 'actionEnd', node );
                    return node;
                }
                counter++;
                func();
                clock && clearTimeout( clock );
                clock = setTimeout( function () { 
                            clock = undefined;
                            loopBase( func );
                        }, option.stepT );
            };

            // 获取当前<即本次>要改变的值，这里需注意“加速度”的正负
            var getCurrentV = function ( times, v0, realAcc ) {
                return (v0 + realAcc * times);
            };

            // 过滤初速度不合法的设置
            for ( var i in initialObj ) {
                if ( extraColorList.indexOf( i ) == -1 ) {
                    accObj[ i ] = filterA( initialObj[ i ], Math.abs( courseStyle[ i ] ) );
                    if ( formatAcc &&accObj[ i ] != formatAcc ) {
                        initialObj[ i ] = 0;
                    }
                }
                else {
                    // 临时的，针对颜色的，加速度的对象< 针对每个颜色通道 >
                    var extraObj = {};
                    for ( var j in initialObj[i] ) {
                        extraObj[ j ] = filterA( initialObj[ i ][ j ], Math.abs( courseStyle[ i ][ j ] ) );
                        if ( formatAcc && extraObj[ j ] != formatAcc ) {
                            initialObj[i][ j ] = 0;
                        }
                    }
                    accObj[ i ] = extraObj;
                }
            }

            // 节点样式改变的核心方法
            var changeFunc = function () {
                // 待处理的样式对象
                var result = {};
                // 遍历初始改变值<初速度>对象
                for ( var i in initialObj ) {
                    /* 针对颜色的动画
                     * 此处使用rgb的格式来进行动画赋值，
                     * 由于rgb中的各通道的数值必须为整数
                     * 所以当改变量不适中时，造成小数的情况下，会自动转化为接近的整数
                     * 所以实际感觉动画的时间可能与参数的时间存在出入
                     */
                    if ( extraColorList.indexOf( i ) != -1 ) {
                        var changeV = {}, tempState = {}, nextState = {}, flagKey,
                            // 编码颜色字符串为可处理的颜色对象
                                tempColorStyle = $css( node, i ),
                                currentColor,
                                formatTarget = getFormat( targetStyle[ i ] );
                            if ( tempColorStyle == 'transparent' ) {
                                var tempNode = node.parentNode,
                                    flag,
                                    tempColor = 'transparent';
                                while ( tempNode != document ) {
                                    var toBeTestCss = $css( tempNode, i );
                                    if ( toBeTestCss != 'transparent' ) {
                                        tempColorStyle = toBeTestCss;
                                        flag = true;
                                        break;
                                    }
                                    tempNode = tempNode.parentNode;
                                }
                                !flag && (tempColorStyle = '#ffffff');
                            }
                            currentColor = getFormat( tempColorStyle );
                        for ( var j in initialObj[ i ] ) {
                            // 判断正负的标记
                            flagKey = ( courseStyle[ i ][j] <= 0  ? -1  : 1 );
                            // 取某样式本次要改变量<非本次的值，而是改变量>
                            changeV[ j ] = flagKey * getCurrentV( counter, initialObj[ i ][j], accObj[ i ][j] );
                            // 将待改变量与当前样式值相加，获取最终的样式值<此处是真正的样式值，而非改变量>
                            tempState[ j ] = currentColor[ j ] + changeV[ j ];
                            // 保证合法性
                            if ( tempState[ j ] > 255 ) {
                                tempState[ j ] = 255;
                            }
                            else if( tempState[ j ] < 0 ) {
                                tempState[ j ] = 0;
                            }
                            // 将目标样式值减去本次待设置值，用于检测样式是否已经达到目标值
                            var isCssOk = ( flagKey * ( formatTarget[ j ] -tempState[ j ] ) ) < 0;
                            // 如果样式还未达到目标，则使这个待设置值生效。
                            if( !isCssOk ) {
                                nextState[ j ] = ( flagKey < 0 ? Math.floor( tempState[j] ) : Math.ceil( tempState[j] ) );
                            }
                            // 如果样式达到目标值，则将结果赋为目标值
                            else {
                                nextState[ j ] = Math.floor( formatTarget[ j ] );
                            }
                        }
                        // 解码已编码的颜色对象为标准字符串形式
                        result[i] = decodeFormate( nextState );
                    }
                    // 针对常规非颜色相关的动画
                    else {
                        // 判断正负的标记
                        var flagKey = ( courseStyle[ i ] <= 0  ? -1  : 1 );
                        // 取某样式本次要改变量<非本次的值，而是改变量>
                        var changeV = flagKey * getCurrentV( counter, initialObj[ i ], accObj[ i ] );
                        // 将待改变量与当前样式值相加，获取最终的样式值<此处是真正的样式值，而非改变量>
                        var styleTxt = $css( node, i );
                        // 针对IE8-浏览器无设置opacity时返回None的情况
                        if ( i == 'opacity' && styleTxt == 'none' ) {
                            styleTxt = 1;
                        }
                        var tempState = styleAddBase( styleTxt, changeV );
                        // 判断样式是否可加
                        if ( ( typeof tempState ).toLowerCase() != 'boolean' ) {
                            // 将目标样式值减去本次待设置值，用于检测样式是否已经达到目标值
                            var isCssOk = ( flagKey * styleMinusBase( tempState, targetStyle[ i ] ) ) < 0;
                            // 如果样式还未达到目标，则使这个待设置值生效。
                            if( !isCssOk ) {
                                result[ i ] = tempState;
                            }
                            // 如果样式达到目标值，则将结果赋为目标值，同时删除本次循环的依赖键值<则下次循环时它将不参与>
                            else {
                                result[ i ] = targetStyle[ i ];
                                delete initialObj[ i ];
                                
                            }
                        }
                    }
                }
                $css( node, result );
            };
            loopBase( changeFunc );
        };
        
        that.destroy = function () {
            clock && clearTimeout( clock );
            clock = undefined;
        };
        that.play = function ( theTarget ) {
            // that.destroy();
            // 置空相关设置
            currentStyle = {};
            courseStyle = {};
            initialObj = {};
            accObj = {};
            targetStyle = theTarget;
            getStyleData();
            getInitialV();
            actionBase();
        };
        return that;
    };
} );
/*
 * 动画队列，可支持不同节点的动画行为
 * @param 针对动画队列做特殊处理的参数对象数组，其设置参考action方法的参数设定
 * queue 说明：
 *      除增加node和style键值之外，其它同action的option参数
        var queue = $.logic.ani.queue([
            // 动画一
            {
                'node'          : div,                  // 待执行动画的节点                     <必须>
                'style'         : {'height':200px},     // 动画欲达到的样式                     <必须>
                'time'          : 2000,                 // 本次动画的持续时间                   <可选>
                'type'          : 'uniform',            // 动画类型                             <可选>
                'stepT'         : 50,                   // 每次改变的时间间隔,可理解为帧率的倒数<可选>
                'acceleration'  : 10,                   // 动画加速度                           <可选>
                'threshold'     : 2,                    // 目标阈值                             <可选>
                'callback'      : function () {}        // 单个动画的回调                       <可选>
            },
            // 动画二
            {
                xxxxxxxxxxx
            }
        ], function(){});
 */
CJS.Rely( 'evt.event' );
CJS.Rely( 'extra.destroy' );
CJS.Rely( 'ani.action' );
CJS.define( 'ani.queue', function ( $ ) {
    var $F              = $.FUNCS,
        $L              = $.logic,
        $action         = $L.ani.action,
        $evt            = $L.evt.event,
        $custEvt        = $evt.custEvt,
        $destroy        = $L.extra.destroy;
    return function ( queue, callBack ) {
        if ( !$F.isArray( queue ) ) {
            throw '[ani.queue]: need array as first parameter';
        }
        var queueL      = queue.length,
            actions     = [],
            that        = {},
            currentIndex= 0,
            callBack    = (callBack || function(){}),
            destroyKey  = false;

        // 用于在队列中拉取下一个动画执行
        var callNext = function ( spec ) {
            // 索引+1
            currentIndex++;
            var currentAct = queue[currentIndex];
            if ( currentAct ) {
                actionForQueue( currentAct );
            }
            else {
                callBack( queue );
            }
        };
        /**
         * 封装用于动画队列处理的action方法
         * @param {同action的opt，同时将node封装进其中，key为node} 待实现的样式对象
         */
        var actionForQueue = function ( opt ) {
            if ( opt ) {
                var tempAct = $action( opt.node, opt );
                actions.push( tempAct );
                $custEvt.add( tempAct, 'actionEnd', callNext );
                tempAct.play( opt.style );
            }
        };

        that.start = function () {
            actionForQueue( queue[0] );
        };
        that.destroy = function () {
            $destroy( actions );
            queue.length = 0;
        };
        return that;
    }
});
/**
 * 对象转字符串, isEncode表示是否进行编码
 * @param object 是否进行编码
 * @return string
 */
CJS.define( 'json.jsonToStr', function ( $ ) {
    return function (obj, isEncode) {
        var str = '';
        var temp = [];
        for (var i in obj) {
            var tempV = obj[i].toString();
            if ( isEncode ) {
                i = encodeURIComponent( i );
                tempV = encodeURIComponent( tempV );
            }
            temp.push(i + '=' + tempV);
            temp.push( '&' );
        }
        temp.pop(); // 弹出最后一个&
        str = temp.join('');
        return str;
    };
});
/**
 * 字符串转对象
 * @param 字符串query值
 * @return 解析后的对象
 */
CJS.define( 'json.strToJson', function ( $ ) {
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
/**
 * 进制转换
 */
CJS.define( 'num.ary', function ( $ ) {
    return {
        // hexToDecimal 16进制转10进制
        'HTD': function ( num ) {
            return parseInt( '0X' + num );
        },
        // decimalToHex 10进制转16进制
        'DTH': function ( num ) {
            var number = parseInt( num );
            return number.toString( 16 );
        }
    };
} );
/**
 * 提供常用的数学方法
 * @return Object
    MATH
 */
CJS.define( 'num.math', function ( $ ) {
    // 检测类型
    // 包括：对象<object>，数组<array>，字符串<string>，数值<number>，布尔值<boolean>，函数<function>
    // strKey值为对应尖括号里面的值
    var isWhat = $.FUNCS.isWhat;

    // 检测是否是数组
    var isArray = $.FUNCS.isArray;

    // 合并参数
    var parseParam = $.FUNCS.parseObj;

    /*===基本定义区============*/

    var math = Math;

    // 几次幂
    var pow = Math.pow;

    // 平方
    var square = function ( Num ) {
        return pow( Num, 2 );
    };

    // 立方
    var cube = function ( Num ) {
        return pow( Num, 2 );
    };

    // 平方根
    var sqrt = Math.sqrt;

    // 绝对值
    var abs = Math.abs;

    // 立方根
    var cbrt = function ( Num ) {
        return pow( Num, (1/3) );
    };

    // 计算数组中最小的数
    var min = function ( nums ) {
        if ( isArray( nums ) ) {
            return Math.min.apply( null, nums );
        }
        else {
            return Math.min( arguments );
        }
    };

    // 计算数组中最大的数
    var max = function ( nums ) {
        if ( isArray( nums ) ) {
            return Math.max.apply( null, nums );
        }
        else {
            return Math.max( arguments );
        }
    };

    /*===平面几何定义区============*/

    // 获取向量AB
    var toVector = function ( A, B ) {
        var vectorAB = {
            'x': B.x - A.x,
            'y': B.y - A.y
        };
        return vectorAB;
    };

    // 笛卡尔<直角>坐标转换成极坐标
    var cartesianToPolar = function ( point ) {
        var result = {
            'rou': sqrt( square( point.x ) + square( point.y ) ),
            'theata': Math.acos( point.x / result.rou )
        };
        return result;
    };

    // 极坐标转换成直角坐标
    var polarToCartesian = function ( point ) {
        return {
            'x': point.rou * Math.cos( point.theata ),
            'y': point.rou * Math.sin( point.theata )
        };
    };

    // 计算两点构成的直线的方程
    var lineParam = function ( P1, P2 ) {
        return {
            'A': P1.y - P2.y,
            'B': P2.x - P1.x,
            'C': P1.x * P2.y - P1.y * P2.x
        };
    };

    /**
     * 已知圆上一点的x<或y>坐标，求对应的y<或x>坐标
     * 圆方程采用标准方程：
     * (x-a)^2 + (y-b)^2 = r^2
     * opt = {a: 1, b: 1, r: 1}
     * @return array
            返回对应的两个点坐标
     */
    var xyOnRound = function ( x, y, opt ) {
        var result = [];
        if ( isWhat( x, 'number' ) ) {
            result.push( { 'x': x, 'y': opt.b + sqrt( square( opt.r ) - square( x - opt.a ) ) } );
            result.push( { 'x': x, 'y': opt.b - sqrt( square( opt.r ) - square( x - opt.a ) ) } );
        }
        else if ( isWhat( y, 'number' ) ) {
            result.push( { 'x': opt.a + sqrt( square( opt.r ) - square( y - opt.b ) ), 'y': y } );
            result.push( { 'x': opt.a - sqrt( square( opt.r ) - square( y - opt.b ) ), 'y': y } );
        }
        return result;
    };

    // 计算两点之间的距离
    var countW = function ( start, end ) {
        return sqrt( square( start.x - end.x ) + square( start.y - end.y ) );
    };

    // 计算点到线的距离，ABC为标准方程 Ax + BY + C = 0，point为点的坐标
    var pointToLineS = function ( A, B, C, Point ) {
        return abs( A * Point.x + B * Point.y + C ) / sqrt( square(A) + square(B) )
    };

    // 检测C点是否在AB点构成的直线上
    var isPointOnLine = function ( A, B, C ) {
        return !( (A.y - B.y) * C.x + (B.x - A.x) * C.y + A.x * B.y - A.y * B.x );
    };

    // 点A围绕点R旋转r角度之后的点B坐标<自Y的正方向向X的正方向旋转>
    var pointRotation = function ( A, R, r ) {
        var AR = countW( A, R );
        if ( AR == 0 ) {
            return A;
        }
        // R到A在X方向上的距离
        var RS = R.x - A.x;
        var AngleARS = Math.acos( RS / AR );
        // T为点B在过R的水平线上的投影
        var AngleBRT = Math.PI - AngleARS - r;
        var B = {
            'x': R.x + Math.cos( AngleBRT ) * AR,
            'y': R.y + Math.sin( AngleBRT ) * AR
        };
        return B;
    };

    // 检测某个点是否在由N个点构成的多边形内部
    var isPointInRange = function ( point, rangePointArr ) {
        // 方案未确定
    };

    // 检测某点是否在圆内
    // @param 待判断点坐标 圆心坐标 圆的半径
    var isPointInRound = function ( point, root, r ) {
        var PR = countW( point, root );
        return ( PR <= r );
    };

    // 已知点A,B,C，求角ABC，根据余弦定理求，此角度将 大于等于0，小于Math.PI
    var pointToAngle = function ( A, B, C ) {
        var AB = countW( A, B ),
            BC = countW( B, C ),
            AC = countW( A, C );
        var AngleABC = 0;
        // 如果存在点重合的情况，一律认为角度为0
        if ( AB && BC ) {
            AngleABC = Math.acos( ( square( AB ) + square( BC ) - square( AC ) ) / ( 2 * AB * BC ) );
        }
        return AngleABC;
    };

    // 两直线是否平行
    var isParallel = function ( A, B, C, D ) {
        var vectorAB = toVector( A, B );
        var vectorCD = toVector( C, D );
        return ( vectorAB.x * vectorCD.y == vectorAB.y * vectorCD.x );
    };

    // 两直线是否垂直
    var isVertical = function ( A, B, C, D ) {
        var vectorAB = toVector( A, B );
        var vectorCD = toVector( C, D );
        return !( vectorAB.x * vectorCD.x + vectorAB.y * vectorCD.y );
    };

    // 向量AB与向量CD的夹角
    var vectorToAngle = function ( A, B, C, D ) {
        var ABL = countW( A, B ),
            CDL = countW( C, D );
        var vectorAB = toVector( A, B ),
            vectorCD = toVector( C, D );
        var angle = 0;
        if ( ABL && CDL ) {
            var angleVal = ( vectorAB.x * vectorCD.x + vectorAB.y * vectorCD.y ) / ( ABL * CDL );
            // 此处的角度范围为0~PI，符合两向量夹角范围
            angle = Math.acos( angleVal );

        }
        return angle;
    };

    // 圆的面积
    var roundArea = function ( r ) {
        return Math.PI * square( r );
    };

    return {
        /** 
         * 原生Math对象
         */
        'math'              : math,
        /**
         * 两点间距离
         * @param Object Object
                两点坐标
         */
        'countW'            : countW,
        /**
         * 平方
         * @param Number
         */
        'square'            : square,
        /**
         * 立方
         * @param Number
         */
        'cube'              : cube,
        /**
         * 平方根
         * @param Number
         */
        'sqrt'              : sqrt,
        /**
         * 立方根
         * @param Number
         */
        'cbrt'              : cbrt,
        /**
         * 绝对值
         */
        'abs'               : abs,
        /**
         * 多少次幂
         */
        'pow'               : pow,
        /**
         * 最小值封装
         * @param Array
                待比较项组成的数组
         */
        'min'               : min,
        /**
         * 最大值封装
         * @param Array
                待比较项组成的数组
         */
        'max'               : max,
        /**
         * 直角坐标转换为极坐标
         * @param Object
                待转换点的坐标
         */
        'cToP'              : cartesianToPolar,
        /**
         * 极坐标转换为直角坐标
         * @param Object
                {'rou': xx, 'theata': xx}
         */
        'pToC'              : polarToCartesian,
        /**
         * 点构成的直线方程
         * @param Object Object
                两点坐标
         * @return Object
                标准直线方程的系数{A: xx, B: xx, C: xx}
         */
        'lineParam'         : lineParam,
        /**
         * 已知某点位于圆上，已知该点的x或y坐标值，得出对应的y或x坐标
         * @param number number Object
                圆方程采用标准形式：
                    (x-a)^2 + (y-b)^2 = r^2
                输入x, y, opt，
                其中，xy已知哪个就写哪个的值，未知的用null或者undefined占位
                其中，opt如下：
                    opt = {a: 1, b: 1, r: 1}
         * @return Array
                返回点对象构成的数组<符合条件的点不止一个>
         */
        'xyOnRound'         : xyOnRound,
        /**
         * 点到直线的距离
         * @param A B C ObjectPoint
                ABC为标准直线方程的系数
         */
        'pointToLineS'      : pointToLineS,
        /**
         * 检测某点是否在某两点构成的直线上
         * @param A B C
                A为待判断点坐标对象，
                BC为构成直线的两点的坐标对象
         */
        'isPointOnLine'     : isPointOnLine,
        /**
         * 点A绕点R自Y的正方向向X的正方向旋转r角度之后的坐标B
         * @param A R r
                AR点坐标，旋转角度r
         * @return B
                返回旋转后的点的坐标
         */
        'pointRotation'     : pointRotation,
        /**
         * 检测某点是否在某个多边形内，(待开发)
         */
        'isPointInRange'    : isPointInRange,
        /**
         * 判断某点是否在圆内
         * @param A R r
                待判断点A，圆心R坐标，半径r
         */
        'isPointInRound'    : isPointInRound,
        /**
         * 三点构成的角的角度
         * @param A B C
                三点的坐标
         * @return number
                角ABC的角度< 弧度制 >
         */
        'pointToAngle'      : pointToAngle,
        /**
         * 圆的面积
         * @param r半径
         */
        'roundArea'         : roundArea,
        /**
         * 判断点构成的直线是否垂直
         * @param A B C D
                AB点构成的直线与CD点构成直线
         */
        'isVertical'        : isVertical,
        /**
         * 判断点构成的直线是否平行
         * @param A B C D
                AB点构成的直线与CD点构成的直线
         */
        'isParallel'        : isParallel,
        /**
         * 两点转换成向量
         * @param A B
                AB两点的坐标
         * @return 向量AB
         */
        'toVector'          : toVector,
        /**
         * 两向量构成的夹角
         * @param A B C D
                向量AB与向量CD构成的夹角
         */
        'vectorToAngle'     : vectorToAngle
    };
} );
/**
 * 复制一个对象，如果是数组则复制后依然为数组
 * @param 待复制对象
 * @return 复制后的对象副本
 */
CJS.define( 'obj.copyObj', function ( $ ) {
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
/**
 * 判断某个对象是否含有某键(非值)，如果有，则返回对应的键值，否则返回null
 * @param object keyName
 * @return Boolean
 */
CJS.define( 'obj.isKeyHas', function ( $ ) {
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
/**
 * 判断obj内部是否有某值（非键）
 * @param 
 * @return 
 */
CJS.define( 'obj.isObjOwn', function ( $ ) {
    return function (val, obj) {
        for (var i in obj) {
            if (obj[i] === val) {
                return true;
            }
        }
        return false;
    };
});
/**
 * 用于合并两个对象，返回合并后的副本，不影响源，不同于parseObj依据rootObj的情况，
 * merge纯粹是合并两个对象
 * @param object object
 */
CJS.define( 'obj.merge', function ( $ ) {
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
/**
 * 获取对象的长度
 * @param Object
 * @return lengthNumber
 */
CJS.define( 'obj.objLength', function ( $ ) {
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
/**
 * 用于对象解析
 * @param 根对象 外来对象 是否对数值进行数字化处理
 * @return 合并解析后的对象
 */
CJS.define( 'obj.parseObj', function ( $ ) {
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
/**
 * 用于获取字符串的长度，全角及中文占两个长度
 * @param 待检测字符串
 * @return 字符串长度
 */
// CJS.Rely( 'extra.reglib' );
CJS.define( 'str.bLength', function ( $ ) {
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
// 颜色格式转换
CJS.Rely( 'num.ary' );
CJS.define( 'str.ctrlColor', function ( $ ) {
    var $ary = $.logic.num.ary;
    return {
        // hexToDecimal 16进制转10进制,16进制需要六位
        'HTD': function ( colorStr ) {
            if( /.*rgb.*/.test( colorStr ) ) {
                return colorStr.replace(/\s/g, '');
            }
            // 如果书写为三位字符的情况，自动补全成六位，补全规则为重复每一位
            if ( /^\#[0-9a-fA-F]{3}$/.test( colorStr ) ) {
                colorStr.replace( /([0-9a-fA-F])/g, '$1$1' )
            }
            var tempStr = colorStr.slice(1);
            var result = '';
            result = 'rgb(' + $ary.HTD ( tempStr.slice( 0, 2 ) ) + ',' + $ary.HTD ( tempStr.slice( 2, 4 ) ) + ',' + $ary.HTD ( tempStr.slice( 4, 6 ) ) + ')';
            return result;
        },
        // decimalToHex 10进制转16进制
        'DTH': function ( colorStr ) {
            var str = colorStr.replace( /\s/g, '' );
            var reg = /rgb\(([^\)]+)\)/i;
            var tempArr = str.match( reg );
            if ( !tempArr ) {
                $.FUNCS.error.set( '[str.ctrlColor]', 'illegal color string!' );
                return false;
            }
            tempArr = tempArr[1].split( ',' );
            return '#' + $ary.DTH( tempArr[0] ) + $ary.DTH( tempArr[1] ) + $ary.DTH( tempArr[2] );
        }
    };
} );
/**
 * 将某个占位符替换为对应的数据，占位符的格式为#{name}
 * @param 待处理字符串 数据对象
 * @return 处理之后的字符串
 */
CJS.define( 'str.replace', function ( $ ) {
    var $f = $.FUNCS;
    return function ( str, data ) {
        if ( !$f.isWhat( str, 'string' ) ) {
            throw '[str.replace]: need string as first parameter!';
        }
        var reg = /\#\{([a-zA-Z\_\-0-9]+)\}/g;
        return str.replace( reg, function (){return data[arguments[1]] || arguments[0]} );
    };
});
/**
 * 模板处理，使用同常见模板
 * @author liuping http://weibo.com/clpliuping 20131213
 * @example
        var temp = '<#tp tempName dataName></#tp>'
        if:
            <#if (condition)>
                xxx
            <#elseif (condition)>
                xxx
            <#else>
                xxx
            </#if>
        loop:
            <#list ListData as list>    //遍历一个数组对象
                ${list_index}       //在此次遍历中的当前索引
                ${list.xxx}         //取值
            </#list>                //结束遍历
 */
CJS.Rely( 'str.replace' );
CJS.define( 'str.template', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( str, data ) {
        if ( !$f.isWhat( str, 'string' ) ) {
            throw '[str.template]: need string as first parameter!';
        }
        // 获取本组的唯一值，用于模板占位
        var unikey = 'CJS_TP_' + $f.getKey() + '_';

        // 匹配所有字符串的模板，提取所有模板块
        var tempsReg    = /(\<\#tp([^(\\|\>)]+)\>(.*?)\<\/\#tp\>)+?/g,
        // 匹配单个模板，提取该模板的所有信息
            singleTemp  = /\<\#tp([^(\\|\>)]+)\>(.*)\<\/\#tp\>/,
        // 匹配单个模板中的所有遍历模块 <#list 数据数组 as 模板中用来表示数组当前项的字符>
            loopsReg    = /(\<\#list([^(\\|\>)]+)\>(.*?)\<\/\#list\>)+?/g,
        // 匹配单个遍历模块
            singleLoop  = /\<\#list([^(\\|\>)]+)\>(.*)\<\/\#list\>/,
        // 匹配单个if模块
            ifReg       = /\<\#if\s*\(([^(\\|\>)]+)\)\s*\>(.*?)(\<\#elseif\s*\(([^(\\|\>)]+)\)\s*\>(.*?))?(\<\#else\s*\>(.*?))?\<\/\#if\>/,
            ifsReg      = /\<\#if\s*\(([^(\\|\>)]+)\)\s*\>(.*?)(\<\#elseif\s*\(([^(\\|\>)]+)\)\s*\>(.*?))?(\<\#else\s*\>(.*?))?\<\/\#if\>/g;

        // 获取字符串中的模板
        var tempsArr    = str.match( tempsReg );
        // 模板替换，占位处理
        var num         = 0,
            htmlObj     = {},
            htmlStr     = '';

        htmlStr = str.replace( tempsReg, function () {
            return '#{' + unikey + (num++) + '}'
        });

        // 输入数据字符串，返回处理后的字符串，以及是否非法的标识符，如果数据源中存在数据，则拉取数据，否则返回输入字符串
        var checkDataLegal = function ( datastr, rootData ) {
            var index = datastr.split('.')
                tempData = $f.copyObj( rootData || data ),
                flag = true;
            for ( var d = 1, dL = index.length; d < dL; d++ ) {
                if ( !$f.isWhat( tempData, 'object' ) ) {
                    // 标识数据非法
                    flag = false;
                    break;
                }
                tempData = tempData[ index[d] ];
            }
            flag = !$f.isWhat( tempData, 'undefined' );
            return {'data': flag ? tempData : datastr, 'flag': flag};
        };

        // 获取基于某个data名称的循环单体和索引的正则表达式
        var loopItemIndexReg = function ( dataName ) {
            return {
                'item'  : new RegExp( '\\$\\{(' + dataName + '(\\.[a-zA-Z\\_0-9]+)*)\\}' , 'g' ),
                'index' : new RegExp( '\\$\\{(' + dataName + '_index)\\}', 'g' )
            }
        };

        // 循环处理 @param Array 纯净的循环结构数组 返回处理之后的数据数组
        var parseLoop = function ( loops ) {
            if ( loops ) {
                var loopInfo, loop, loopBody, loopArr = [], flag = true;
                for ( var j in loops ) {
                    // 解析单个循环
                    loop = loops[j].match( singleLoop );

                    // 当前循环信息 @return [ 数据数组, 用来表示当前项的占位字符 ]
                    loopInfo = $f.trim( loop[1].replace( /\s+/g, ' ' ) ).split(' ');

                    // 获取循环体
                    loopBody = loop[2];

                    var dataKey = loopInfo[0].split('.');

                    // 如果用到的数据源不属于当前模板，则返回
                    var checkObj = checkDataLegal( loopInfo[0] );
                    if( !checkObj.flag ) {
                        loopArr.push( loops[j] );
                        break;  
                    }

                    // 获取循环中的数组数据
                    var loopData = checkObj.data, loopStr = '';
                    if ( $f.isArray( loopData ) ) {

                        // 遍历数据数组，获取循环处理后的字符串
                        for ( var h in loopData ) {
                            var lRegObj = loopItemIndexReg( loopInfo[2] );
                            loopStr += loopBody.replace( lRegObj.item, function(){
                                if ( arguments[3] ) {
                                    return checkDataLegal( arguments[0], loopData[h] );
                                }
                                else {
                                    return loopData[h];
                                }
                            } );

                            // 将索引所在位置用当前索引值替换
                            loopStr = loopStr.replace( lRegObj.index, h );
                        }
                        loopArr.push( loopStr );
                    }

                    // 如果对应的数据不为数组，则直接返回模板字符串
                    else {
                        loopArr.push( loops[j] );
                        flag = false;
                    }
                }
                return { 'data' : loopArr, 'flag' : flag };
            }
            return {'data':[],'flag':false}
        };

        // 条件判断 @param String 纯净的条件判断模块 !important:在此之前需将所有数据位占位替换成相应的字符串
        var parseIf = function ( ifs ) {
            var theIf = ifs.match( ifReg );
            // 如果不是个条件判断语句，则直接返回输入的字符串
            if ( !theIf ) {
                return ifs;
            }
            // 获取可用于js执行的if命令字符串形式
            var commandStr = '' +
                'if(' + theIf[1] + '){"' + theIf[2].replace( /([\"\'])/g, '\\$1' ) + '"}' + 
                (theIf[3] ? ( 'else if(' + theIf[4] + '){"' + theIf[5].replace( /([\"\'])/g, '\\$1' ) + '"}' ) : '') + 
                (theIf[6] ? ( 'else{"' + theIf[7].replace( /([\"\'])/g, '\\$1' ) + '"}' ) : '' );
            return eval( commandStr );
        };

        if ( tempsArr ) {
            var temp, tempInfo, loopsArr, ifsArr, loopResultObj, result, dataReg, loopResultData={};
            for ( var i = 0, tempsL = tempsArr.length; i < tempsL; i++ ) {
                // 用于循环体计数
                var n = 0;
                temp = tempsArr[i].match( singleTemp );

                // 当前模板信息 @return [ 模板名称 模板用到的数据名称 ];
                tempInfo    = $f.trim( temp[1].replace( /\s+/g, ' ' ) ).split(' ');
                // 把数据占位符替换成真实的数据
                dataReg = new RegExp( '\\#\\{(' + tempInfo[1] + '(\\.[a-zA-Z\\_0-9]+)+)\\}', 'g');
                temp[2] = temp[2].replace( dataReg, function () {
                    var dataCheckObj = checkDataLegal( arguments[1] )
                    return dataCheckObj.flag ? dataCheckObj.data : arguments[0];
                });
                result = temp[2];           
                // 处理循环
                loopsArr = temp[2].match( loopsReg );
                if ( loopsArr ) {
                    loopResultObj = parseLoop( loopsArr );
                    // 判断循环是否成功，成功才进行替换
                    if ( loopResultObj.flag ) {
                        // 获取可用于替换的数据对象
                        for ( var m in loopResultObj.data ) {
                            loopResultData[ unikey + m ] = loopResultObj.data[m];
                        }
                        // 将循环体所在位置替换成占位符，用于替换
                        var tempHolderStr = temp[0].replace( loopsReg, function () {
                            return '#{' + unikey + (n++) + '}';
                        });
                        result = $l.str.replace( tempHolderStr, loopResultData );
                    }
                }
                ifsArr = result.match( ifsReg );
                if ( ifsArr ) {
                    for ( var q in ifsArr ) {
                        // 处理条件判断，单次匹配，多次替换
                        result = result.replace( ifReg, parseIf( ifsArr[q] ) );
                    }
                }
                // 将处理后的字符串存储到对应的位置，用于之后的替换
                htmlObj[ unikey + i ] = '<!--start-' + tempInfo[0] + '-->' + result.match(singleTemp)[2] + '<!--' + tempInfo[0] + '-end-->'  ;
            }
            // 处理结束，用处理后的字符串替换之前占位符位置，用以解决多模板的情况
            return $l.str.replace( htmlStr, htmlObj );
        }
        else {
            return  str;
        }
    };
});
/**
 * 获取随机的数字和小写字母组成的字符串
 * @param number
        要获取的字符串长度
 * @return string
        随机字符串
 * @info
        代码来源：《45个实用的JavaScript技巧、窍门和最佳实践》
        原文链接： http://flippinawesome.org/2013/12/23/45-useful-javascript-tips-tricks-and-best-practices/
        翻    译： 伯乐在线 - Owen Chen
        译文链接： http://blog.jobbole.com/54495/
 */
CJS.define( 'str.randomStr', function ( $ ) {
    var $f = $.FUNCS;
    return function ( num ) {
        if ( !$f.isWhat( num, 'number' ) ) {
            throw '[str.randomStr]: need number as first parameter!';
        }
        var result = '';
        // 利用toString方法的进制转换，将数据转换为0-9a-z的36进制，再从中截取指定长度
        for ( ; result.length < num; result += ( Math.random().toString( 36 ).substr( 2 ) ) );
        return result.substr( 0, num );
    };
});
/**
 * ajax请求
 * 提供数据传送，XMLHttpRequest请求创建，跨域初步功能
 */
CJS.define( 'trans.ajax', function($){
    var error = $.FUNCS.error;
    // 创建XMLHttpRequest对象
    var createXHR = function(){
        if(typeof XMLHttpRequest != 'undefined'){
            createXHR = function(){
                return new XMLHttpRequest();
            };
            return createXHR();
        } 
        else if (typeof ActiveXObject != 'undefined'){
            createXHR = function(){
                var XHR;
                try{
                    XHR = new ActiveXObject("Msxml2.XMLHTTP");
                }
                catch(other){
                    try{
                        XHR = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    catch(error){
                        error.set('[trans.ajax]:',error);
                    }
                }
                return XHR; 
            };
            return createXHR();
        }
        else {
            error.set( '[trans.ajax]:', 'Your browser do not support XMLHttpRequest!' );
            throw 'Your browser do not support XMLHttpRequest!';
        }
    };
    var xhrListener = function(conf){
        var config = $.FUNCS.parseObj({
            'url'       : '',               // 请求地址
            'method'    : 'get',            // 请求方法
            'data'      : '',               // 待传输数据，可以是query字符串，可以是对象
            'isAsyn'    : true,             // 是否异步传输，默认是
            'time'      : 5 * 1000,         // 超时时间
            'autoStop'  : false,            // 
            'onTimeout' : function(){},     // 超时的回调
            'onSend'    : function(){},     // 开始发送的回调
            'onReceived': function(){},    // 开始接收的回调
            'onFinish'  : function(){},     // 请求结束的回调
            'postData'  : '',
            'contenType': 'application/x-www-form-urlencoded',
            'charset'   : 'UTF-8'
        }, conf || {});
        if(!config.url){
            error.set('[trans.ajax]', 'url is must!');
            return;
        }
        var xhr = createXHR();
        var outClock;
        var urlL = config.url.length;
        var requestUrl = config.url;
        var sendData = '',
            pData = null;
        // 传输query字符串的情况
        if ( $.FUNCS.isWhat( config.data, 'string' ) ) {
            sendData = encodeURIComponent(config.data);// 编码待传送数据
            sendData = sendData.replace(/\%3D/g, '=');// 将不该编码的“=”和“&”替换回来
            sendData = sendData.replace(/\%26/g, '&');
        }
        // 传输对象的情况
        else if ( $.FUNCS.isWhat( config.data, 'object' ) ) {
            sendData = $.FUNCS.jsonToStr( data );
        }
        // get形式下的重新封装方法
        var setDataUrl = function(){
            var urlTail = config.url.indexOf('?') == -1 ? '?' : '' + config.url.slice(urlL - 1) == '&' ? '' : '&';
            requestUrl = config.url + urlTail + '__fresh=' + $.FUNCS.getKey();// 保持在IE下的“新鲜”
            requestUrl = requestUrl + '&' + sendData;
        };
        if('onreadystatechange' in xhr){
            xhr.onreadystatechange = function(){
                switch(xhr.readyState){
                    case 1 :// 启动
                        outClock && clearTimeout(outClock);// 设定超时处理，超时即取消连接
                        outClock = setTimeout(function(){config.onTimeout(xhr);xhr.abort()}, config.time);
                        break;
                    case 2 :// 发送
                        config.onSend(xhr);
                        break;
                    case 3 :// 接收
                        outClock && clearTimeout(outClock);
                        outClock = undefined;
                        config.onReceived(xhr);
                        break;
                    case 4 :// 完成
                        // 304代表数据未修改，可直接使用缓存数据
                        if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
                            config.onFinish(xhr);
                        }
                        break;
                    default :

                }
            }
            // 如果是get方式，则对url进行重新封装
            if(config.method == 'get'){
                setDataUrl();
            }
            xhr.open(config.method, requestUrl, config.isAsyn);
            // 如果是post方式，则设置头信息，添加sendData值
            if(config.method == 'post'){
                xhr.setRequestHeader("Content-Type", config.contenType + ';' + config.charset);
                pData = sendData;
            }
            xhr.send( pData );
        }
    };
    // 用于实现跨域请求
    var corsXhrListener = function(conf){
        var config = $.FUNCS.parseObj({
            'method'    : get,
            'url'       : '',
            'isAsyn'    : true  
        }, conf || {});
        if(!config.url){
            error.set('[trans.ajax]', 'url is must!');
            return;
        }
        var xhr = createXHR();
        if('withCredentials' in xhr){
            xhr.open(config.method, config.url, config.isAsyn);
        }
        else if(typeof XDomainRequest != "undefined"){
            xhr = new XDomainRequest();
            xhr.open(config.method, config.url);
        }
        else{
            xhr  = null;
        }
        return xhr;
    }
    return {
        'send'  : xhrListener,
        'newXhr' : createXHR,
        'cors'   : corsXhrListener
    }
});
/**
 * 表单提交不跳页
 * @param object
        {
            'url': 接收数据的地址，
            'method': 传送方式,
            'data': 需传送的数据,
            'outTime': 超时时间,
            'timeout': 超时后的处理,
            'success': iframe加载完成时的回调
        }
 */
CJS.Rely( 'dom.removeNode' );
CJS.define( 'trans.formUp', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;

    var $removeNode = $l.dom.removeNode;
    return function ( spec ) {
        var conf = $f.parseObj( {
            'url'       : undefined,
            'method'    : 'get',
            'data'      : {},
            'outTime'   : 5000,
            'timeout'   : function () {},
            'success'   : function () {}
        }, spec || {} );

        var timer;

        var uniKey = 'myIframe_' + $f.getKey();
        var myIframe = document.createElement( 'iframe' );
        var myForm  = document.createElement( 'form' );

        // Input创建器
        var inputCreator = function ( data ) {
            var arr = [];
            for ( var i in data ) {
                if ( data.hasOwnProperty( i ) ) {
                    arr[arr.length] = '<input type="hidden" name=' + i + ' value=' + data[i] + ' />';
                }
            }
            var randomKey = $f.getKey();
            arr.push( '<input type="hidden" name="_rd" value="' + randomKey + '"" />' )
            return arr.join('');
        };

        // 清除相关信息
        var clear = function () {
            timer && clearTimeout( timer );
            $removeNode( myForm );
            $removeNode( myIframe );
        };

        // 数据传送完成时的回调
        var finish = function () {
            clear();
            conf.success( conf.data );
        };

        // 开启超时时钟
        var startClock = function () {
            if ( timer ) {
                return;
            }
            timer = setTimeout( function () {
                timer = undefined;
                clear();
                conf.timeout( conf.data );
            }, conf.cbk );
        };

        var domInit = function () {
            myIframe.name = uniKey;
            myForm.action = conf.url;
            myForm.target = uniKey;
            myForm.method = conf.method;
            myForm.innerHTML = inputCreator( conf.data );
            myForm.style.display = 'none';
            myIframe.style.display = 'none';
            document.body.appendChild( myForm );
            document.body.appendChild( myIframe );
            myForm.submit();
        };

        var evtBind = function () {
            myForm.onload = finish;
            startClock();
        };
        var init = function () {
            domInit();
            evtBind();
        };
        init();
        
        return {
            'destroy': clear
        }
    };
});
/*
 * 鼠标拖曳行为
 */
CJS.Rely('evt.event');
CJS.Rely('dom.getClosest');
CJS.define('plugin.drag', function ($, conf) {
    var config = $.FUNCS.parseObj({
        'attrName'      : 'action-type',
        'dragWrapper'   : 'dragWrapper',
        'dragHand'      : 'dragHand',
        'rootNode'      : document.body,
        'bufferTime'    : 10,
        'dragStart'     : function () {},
        'dragEnd'       : function () {},
        'dragging'      : function () {}
    }, conf || {}, true);

    var $evt, $funcs, $getClosest;
    var that = {},
        mask,
        posStyleCache,
        // rowStyleCache, 
        relativePos,
        targetPos,
        agentObj,
        target;

    // 短方法名 
    var shortName = function () {
        $evt        = $.logic.evt.event;
        $funcs      = $.FUNCS;
        $getClosest = $.logic.dom.getClosest;
        $get        = $.logic.dom.get;
    };

    // 环境初始化
    var contextInit = function () {
        agentObj = $evt.agentEvt(config.rootNode, config);
    };

    // 功能组件
    var PLUGINS = {
        // 节点位置
        'nodePos': function (node) {
            return {
                'l': node.offsetLeft,
                't': node.offsetTop
            };
        },
        // 鼠标相对节点位置
        'mouseNodePos': function (node, spec) {
            var nodePos = PLUGINS.nodePos(node);
            return {
                'l': spec.l - nodePos.l,
                't': spec.t - nodePos.t
            }
        },
        // 节点初始初始化
        'start': function (node) {
            posStyleCache = node.style.position;
            (posStyleCache != 'absolute') && (node.style.position = 'absolute');
        },
        // 节点复原
        'end': function (node) {
            node.style.position = posStyleCache;
        },
        // 设置节点位置
        'setPos': function (node, posObj) {
            node.style.top = posObj.t + 'px';
            node.style.left = posObj.l + 'px';
        },
        'bufferClock': undefined,
        'buffer': function (func) {
            if (PLUGINS.bufferClock) {
                return;
            }
            PLUGINS.bufferClock = setTimeout(function () {
                func();
                PLUGINS.bufferClock = undefined;
            }, config.bufferTime);
        },
        'ctrlMask': function (key) {
            if(!mask){
                var temp = document.createElement('div');
                temp.innerHTML = '<div style="top:0;left:0;width:100%;height:100%;position:fixed;background-color:#000000;opacity:0;filter:alpha(opacity=0);"></div>'
                mask = temp.childNodes[0];
                document.body.appendChild(mask);
            }
            !key && (mask.style.display = 'none');
            key && (mask.style.display = 'block');
        }
    };

    // 鼠标事件
    var EVENTS = {
        'mouseDown': function (spec) {
            $evt.custEvt.fire(that, 'start', spec);
            agentObj.remove('*', 'mousemove', EVENTS.mouseMove);
            agentObj.add('*', 'mousemove', EVENTS.mouseMove);
        },
        'mouseMove': function (spec) {
            PLUGINS.buffer(function () {
                $evt.custEvt.fire(that, 'dragging', spec);
            });
        },
        'mouseUp': function (spec) {
            agentObj.remove('*', 'mousemove', EVENTS.mouseMove);
            $evt.custEvt.fire(that, 'end', spec);
        }
    };

    // 拖曳行为
    var ACTIONS = {
        'start': function (spec) {
            config.dragStart(spec);
            target = $getClosest(spec.el, '[' + config.attrName + '=' + config.dragWrapper + ']') || spec.el;
            PLUGINS.start(target);
            PLUGINS.ctrlMask(true);
            var boxZ = target.style.zIndex ? parseInt(target.style.zIndex) : 0;
            mask.style.zIndex = boxZ + 1;
            target.style.zIndex = boxZ + 2;
            relativePos = PLUGINS.mouseNodePos(target, spec);
            document.body.style.cursor = 'move';
        },
        'end': function (spec) {
            document.body.style.cursor = 'auto';
            PLUGINS.end(target);
            var boxZ = target.style.zIndex ? parseInt(target.style.zIndex) : 0;
            target.style.zIndex = boxZ - 2;
            mask.style.zIndex = boxZ - 2;
            PLUGINS.ctrlMask(false);
            config.dragEnd(spec);
        },
        'dragging': function (spec) {
            config.dragging(target);
            targetPos = {
                'l': spec.l - relativePos.l,
                't': spec.t - relativePos.t
            };
            PLUGINS.setPos(target, targetPos);
        }
    };

    var evtBind = function () {
        $evt.custEvt.add(that, 'start', ACTIONS.start);
        $evt.custEvt.add(that, 'end', ACTIONS.end);
        $evt.custEvt.add(that, 'dragging', ACTIONS.dragging);
        agentObj.add(config.dragHand, 'mousedown', EVENTS.mouseDown);
        agentObj.add(config.dragHand, 'mouseup', EVENTS.mouseUp);
    };

    var init = function () {
        shortName();
        contextInit();
        evtBind();
    };
    init();

    that.destroy = function () {
        agentObj.destroy();
        $evt.custEvt.destroy(that);
    };
    return that;
});
/**
 * 渐入渐隐操作对象
 */
CJS.Rely( 'css.base' );
CJS.Rely( 'ani.action' );
CJS.Rely( 'extra.destroy' );
CJS.define( 'plugin.fadeInOut', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( node, conf ) {
        if ( !$f.isNode( node ) ) {
            throw '[plugin.fadeInOut]: ' + $f.NODESTRING;
        }
        // 参数设置初始化
        var config = $f.parseObj( {
            'aniType'   : 'uniform',        // 动画类型
            'inCbk'     : function () {},   // 渐入的回调
            'outCbk'    : function () {}    // 渐隐的回调
        }, conf );
        var aniObjIn, aniObjOut;
        return {
            'in': function ( param ) {
                var dis = $l.css.base( node, 'display' );
                node.style.display = 'block';
                if ( typeof param == 'number' ) {
                    ( dis == 'none' ) && $l.css.base( node, { 'opacity': 0 } );
                    aniObjIn = $l.ani.action( node, {
                        'callback'  : config.inCbk,
                        'time'      : param,
                        'type'      : config.aniType
                    } );
                    aniObjIn.play( { 'opacity': 1 } );
                }
            },
            'out': function ( param ) {
                if ( typeof param == 'number' ) {
                    aniObjOut = $l.ani.action( node, {
                        'callback'  : config.outCbk,
                        'time'      : param,
                        'type'      : config.aniType
                    });
                    aniObjOut.play( { 'opacity': 0 } );
                }
                else {
                    node.style.display = 'none';
                }
            },
            'destroy': function () {
                $l.extra.destroy( aniObjIn, aniObjOut );
            }
        };
    };
});
/**
 * tab功能组件
 * @param object
        tabTag上支持数据定制显示及无数据定制的情况
 * @return tabObject
 */
CJS.Rely( 'dom.get' );
CJS.Rely( 'dom.nodeMap' );
CJS.Rely( 'dom.getClosest' );
CJS.Rely( 'dom.getClassList' );
CJS.Rely( 'css.show' );
CJS.Rely( 'css.hide' );
CJS.Rely( 'evt.event' );
CJS.define( 'plugin.tab', function ( $ ) {
    var $f      = $.FUNCS,
        $l      = $.logic,
        $css    = $l.css;

    return function ( node, conf ) {
        if ( !$f.isNode( node ) ) {
            throw '[plugin.tab]: ' + $f.NODESTRING;
        }
        var config = $f.parseObj( {
            'attrName'      : 'node-type',      // 节点属性名称
            'tabAttrVal'    : 'tab',            // tag节点属性值
            'contentAttrVal': 'content',        // content节点属性值
            'agentAttr'     : 'action-type',    // 用于代理事件的属性名称
            'dataAttr'      : 'action-data',    // 用于代理事件存储数据的属性名称
            'keyVal'        : 'tabKey',         // TabTag用于代理事件的属性值
            'contentVal'    : 'tabContent',     // TabContent用于代理事件的属性值
            'evtType'       : 'click',          // 触发的事件类型，支持mouseleave与mousein
            'activeClass'   : undefined,        // 被选中的TabTag的class
            'negativeClass' : undefined         // 未被选中的TabTag的class
        }, conf );

        var $agentEvt = $l.evt.event.agentEvt;

        var agentObj;

        var nodes, contents, keys, that = {}, classList;

        // 获取节点map
        var domInit = function () {
            nodes       = $l.dom.nodeMap( node, config.attrName ),
            contents    = nodes[ config.contentAttrVal ];
            keys        = nodes[ config.tabAttrVal ];
        };

        // 显示目标节点，隐藏其它节点
        var showTarget = function ( target ) {
            for ( var i = 0, nL = contents.length; i < nL; i++ ) {
                if ( contents[i] != target ) {
                    $css.hide( contents[i] );
                }
                else {
                    $css.show( target );
                }
            }
        };

        // 获取某节点在当前节点列表中的位置
        var getThisIndex = function ( target, attrVal ) {
            var index = -1,
                nList = nodes[attrVal];
            for ( var i = 0, nL = nList.length; i < nL; i++ ) {
                if ( nList[i] == target ) {
                    index = i;
                }
            }
            return index;
        };

        // 由tabTag触发tabContent的变化
        var tabToContent = function ( spec ) {
            var intKey = parseInt(spec.data.target);
            // 传入索引值的情况
            if( intKey < contents.length ) {
                showTarget( contents[ intKey ] );
            }
            else{
                var tempNode = $l.dom.get( spec.data.target || '' );
                // 传入节点ID的情况
                if ( tempNode ) {
                    showTarget( tempNode );
                }
                // 无传入，或者传入非法的情况，以默认方式展现
                else {
                    var index = getThisIndex( spec.el, config.tabAttrVal );
                    showTarget( contents[ index ] )
                }
            }
        };

        // 高亮tab标签
        var highlightTab = function ( target ) {
            for ( var i = 0, nL = keys.length; i < nL; i++ ) {
                if ( keys[i] != target ) {
                    $l.dom.replaceClass( target ).toggle( config.negativeClass, config.activeClass );
                }
                else {
                    $l.dom.replaceClass( target ).toggle( config.activeClass, config.negativeClass );
                }
            }
        };

        // 点击事件处理
        var clickFn = function ( spec ) {
            // showTarget( spec.target );
            highlightTab( spec.el );
            tabToContent( spec );
            $l.evt.event.custEvt.fire( that, 'tab', [spec] );
        };

        var evtBind = function () {
            agentObj = $agentEvt( node, {
                'attrName' : config.agentAttr,
                'dataName' : config.dataAttr
            });
            agentObj.add( config.keyVal, config.evtType, clickFn );
        };

        var init = function () {
            domInit();
            evtBind();
        };
        init();
        that.destroy = function () {
            // 销毁自定义事件和代理事件
            $l.evt.event.custEvt.destroy( that );
            agentObj.destroy();
        };
        return that;
    };
});
/**
 * 懒加载功能组件
 * @param 待检测的节点 回调方法 相关参数
        spec {
            buffer: 阈值距离，
            dir: 方向，可为top<垂直方向>或left<水平方向>,
            step: 监听scroll事件的缓冲时间,
            root: scroll行为发生的节点
        }
 */
CJS.Rely( 'dom.pos' );
CJS.Rely( 'dom.contains' );
CJS.Rely( 'evt.event' );
CJS.define( 'plugin.lazyload', function ( $ ) {
    var $F      = $.FUNCS,
        $L      = $.logic,
        $pos    = $L.dom.pos,
        $contains = $L.dom.contains;
    return function ( node, func, spec ) {
        var conf = $F.parseObj( {
            'buffer': 60,
            'dir'   : 'top',
            'step'  : 800,
            'root'  : document
        }, spec || {} );
        // 缓冲距离
        var bL = conf.buffer || 0, that = {};
        var dir = conf.dir.toLowerCase();
        var scrollRoot = ( conf.root.nodeType == 9 ) ? conf.root.body : conf.root;

        var isBusy = false,
            nodePos = 0,
            scrollPos = 0,
            scrollTimer;

        // 获取节点位置
        var getNodePos = function () {
            if ( dir == 'top' ) {
                getNodePos = function () {
                    return $pos( node ).t;
                }
                return getNodePos();
            }
            else {
                getNodePos = function () {
                    return $pos( node ).l;
                };
                return getNodePos();
            }
        };

        // 获取滚动条位置
        var getScrollPos = function () {
            if ( dir == 'top' ) {
                getScrollPos = function () {
                    return scrollRoot.scrollTop;
                }
                return getScrollPos();
            }
            else {
                getScrollPos = function () {
                    return scrollRoot.scrollLeft;
                };
                return getScrollPos();
            }
        };

        // 实际绑定scroll事件的方法，用于防止过度动荡
        var scrollBuffer = function () {
            scrollTimer && clearTimeout( scrollTimer );
            scrollTimer = setTimeout( function () {
                if ( $contains( node, document.body ) ) {
                    nodePos     = getNodePos();
                    scrollPos   = getScrollPos();
                    if ( Math.abs( nodePos - scrollPos ) <= conf.buffer ) {
                        func( node, {
                            'nodePos'   : nodePos,
                            'scrollPos' : scrollPos
                        });
                    }
                    scrollTimer = undefined;
                }
                else {
                    scrollTimer = undefined;
                    that.destroy();
                }
            }, conf.step );
        };

        var evtBind = function () {
            $L.evt.event.addEvt( conf.root, 'scroll', scrollBuffer );
        };

        var init = function () {
            evtBind();
        };
        init();

        that.destroy = function () {
            $L.evt.event.removeEvt( conf.root, 'scroll', scrollBuffer );
        };
        return that;
    };
});
/**
 * canvas API重新封装, graph 为图形处理
 * @param canvasNode
 */
CJS.Rely('dom.whichNode');
CJS.Rely('evt.event');
CJS.Rely('extra.queue');
CJS.Rely('num.math');
CJS.define( 'graph.canvas', function ( $ ) {
    var $f      = $.FUNCS,
        $l      = $.logic,
        $custEvt= $l.evt.event.custEvt,
        $math   = $l.num.math;
    return function ( canvasNode ) {
        if ( !$l.dom.whichNode( canvasNode, 'canvas') ) {
            return;
        }
        if ( canvasNode.getContext && canvasNode.getContext('2d') ) {
            var ctx = canvasNode.getContext('2d');
            var $rotate = $math.pointRotation;
            // 设置全局锁，防止在绘制单个图形时造成的绘制干扰
            var globalLock = false;
            
            /**
             * 绘制队列，用于防止多个并行操作时，各个绘制间的串扰
             */
            var queue = $l.extra.queue();

            /**
             * 绘制直线，支持旋转
             * @param 初始起点 初始终点 相关参数
             * @return object
                    旋转之后的起点和终点
             */
            var newLine = function ( start, end, spec ) {
                var conf = $f.parseObj( {
                    'size'      : 1,
                    'rotate'    : 0,
                    'color'     : '#000000',
                    'root'      : undefined,
                    'cbk'       : function () {}
                }, spec || {} );
                conf.root || (conf.root = start);
                var draw = function () {
                    ctx.beginPath();
                    var beginPoint, endPoint;
                    // 旋转处理
                    if ( !( conf.rotate % ( Math.PI * 2 ) ) ) {
                        beginPoint  = start;
                        endPoint    = end;
                    }
                    else {
                        beginPoint  = $rotate( start, conf.root, conf.rotate );
                        endPoint    = $rotate( end, conf.root, conf.rotate );
                    }
                    ctx.moveTo( beginPoint.x, beginPoint.y );
                    ctx.lineTo( endPoint.x, endPoint.y );
                    ctx.strokeStyle = conf.color;
                    ctx.strokeWidth = conf.size;
                    ctx.stroke();
                    return {
                        'start' : beginPoint,
                        'end'   : endPoint
                    };
                };
                var uniKey = queue.add( draw );
                var custFn = function ( spec ) {
                    // 仅对自身的返回进行处理
                    if ( spec.key == uniKey ) {
                        $custEvt.remove( queue, 'run', custFn );
                        conf.cbk( spec );
                    }
                };
                $custEvt.add( queue, 'run', custFn );
                queue.run();
            };

            /**
             * 绘制方形，支持旋转，使用绘制四条线段的方法拼接成一个方形
             * @param 宽 高 左顶点位置 相关参数
             * @return Object
                    旋转之后的四个点坐标
             */
            var newRect = function ( w, h, point, spec ) {
                var conf = $f.parseObj( {
                    'size'      : 1,
                    'isFill'    : false,
                    'color'     : '#000000',
                    'bgColor'   : '#000000',
                    'rotate'    : 0,            // 旋转角度
                    'root'      : undefined,    // 旋转依据点，默认为左顶点
                    'cbk'       : function () {}
                }, spec || {} );
                var draw = function () {
                    var pos = point || {'x':0,'y':0}
                    var roateRoot = conf.root || pos;
                    // 计算未旋转前的坐标
                    var pointBefore = {
                        'lt': {
                            'x': pos.x,
                            'y': pos.y
                        },
                        'rt': {
                            'x': pos.x + w,
                            'y': pos.y
                        },
                        'lb': {
                            'x': pos.x,
                            'y': pos.y + h
                        },
                        'rb': {
                            'x': pos.x + w,
                            'y': pos.y + h
                        }
                    };
                    var pointAfter;
                    if ( !( conf.rotate % (Math.PI * 2) ) ) {
                        pointAfter = pointBefore;
                    }
                    else {
                        pointAfter = {
                            'lt': $rotate( pointBefore.lt, roateRoot, conf.rotate ),
                            'rt': $rotate( pointBefore.rt, roateRoot, conf.rotate ),
                            'lb': $rotate( pointBefore.lb, roateRoot, conf.rotate ),
                            'rb': $rotate( pointBefore.rb, roateRoot, conf.rotate )
                        };
                    }
                    // 绘制图形
                    ctx.beginPath();
                    ctx.moveTo( pointAfter.lt.x, pointAfter.lt.y );
                    ctx.lineTo( pointAfter.rt.x, pointAfter.rt.y );
                    ctx.lineTo( pointAfter.rb.x, pointAfter.rb.y );
                    ctx.lineTo( pointAfter.lb.x, pointAfter.lb.y );
                    ctx.lineTo( pointAfter.lt.x, pointAfter.lt.y );
                    ctx.strokeStyle = conf.color;
                    ctx.strokeWidth = conf.size;
                    ctx.fillStyle   = conf.bgColor;
                    ctx.stroke();
                    conf.isFill && ctx.fill();
                    return pointAfter;
                };
                var uniKey = queue.add( draw );
                var custFn = function ( spec ) {
                    // 仅对自身的返回进行处理
                    if ( spec.key == uniKey ) {
                        $custEvt.remove( queue, 'run', custFn );
                        conf.cbk( spec );
                    }
                };
                $custEvt.add( queue, 'run', custFn );
                queue.run();
            };

            /**
             * 绘制弧形，默认为绘制一个圆
             * @param 
             */
            var newArc = function ( center, r, spec ) {
                var conf = $f.parseObj( {
                    'bgColor'   : '#000000',
                    'color'     : '#000000',
                    'rotate'    : 0,
                    'root'      : undefined,
                    'sAngle'    : 0,
                    'eAngle'    : Math.PI * 2,
                    'isFill'    : false,
                    'cbk'       : function () {}
                }, spec || {} );
                var draw = function () {
                    conf.rotate %= (Math.PI * 2);
                    var rotatePoint,
                        rotateSA = conf.sAngle,
                        rotateEA = conf.eAngle;
                    var root = conf.root || center;

                    if ( conf.rotate ) {
                        rotatePoint = $rotate( center, root, conf.rotate );
                        rotateSA += conf.rotate;
                        rotateEA += conf.rotate;
                    }
                    else {
                        rotatePoint = center;
                    }
                    // 绘制图形
                    ctx.beginPath();
                    ctx.arc( rotatePoint.x, rotatePoint.y, r, rotateSA, rotateEA );
                    ctx.strokeStyle = config.color;
                    ctx.stroke();
                    if(config.isFill){
                        ctx.fillStyle = config.bgColor;
                        ctx.fill();
                    }
                };
                var uniKey = queue.add( draw );
                var custFn = function ( spec ) {
                    // 仅对自身的返回进行处理
                    if ( spec.key == uniKey ) {
                        $custEvt.remove( queue, 'run', custFn );
                        conf.cbk( spec );
                    }
                };
                $custEvt.add( queue, 'run', custFn );
                queue.run();
            };
            /**
             * 设置形变
             */
            var setTransform = function ( r, x, y ) {
              ctx.setTransform( Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), x, r );
            };
            return {
                'line'          : newLine,
                'rect'          : newRect,
                'arc'           : newArc,
                'transform'     : setTransform
            };
        }
    };
});
// 执行所有方法
CJS.run();
