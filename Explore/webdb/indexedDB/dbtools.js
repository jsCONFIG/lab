~function () {
    var _t = {
        isType: function (v, type) {
            var typeV = (typeof v);
            if (typeV == 'undefined') {
                return /^undefined$/i.test(type);
            }
            else {
                var reg = new RegExp(type, 'gi');
                try {
                    var transStr = v.constructor.toString();
                    return reg.test(transStr);
                }
                catch (NULL){
                    return (/^object$/i.test(typeV) && /^null$/i.test(type));
                }
            }
        },
        parseParam: function (rootObj, newObj, isNumParse) {
            var tempObj = {};
            newObj = this.isType(newObj, 'object') ? newObj : {};
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
        }
    };

    if (!window.indexedDB) {
        window.indexedDB = window.mozIndexedDB || window.webkitIndexedDB;
    }

    var dbt = function () {
        this.db = undefined;
        this.table = {};
        this.debug = true;
    };

    dbt.prototype.open = function(dbName, tbParam, version) {
        var self = this;

        var request = indexedDB.open(dbName, version || 1);
        request.onupgradeneeded = function () {
            if (!tbParam) {
                return;
            }
            var db = request.result;
            self.db = db;
            self.createTable(
                tbParam.tbName,
                tbParam.primaryKey,
                tbParam.conf,
                tbParam.initData
            );
        };

        request.onsuccess = function (e) {

            self.db = request.result;
        };
    };

    dbt.prototype.close = function() {
        this.db.close();
    };

    /**
     * 类似于一个建表操作
     * @param  {string} tbName 表名，must
     * @param  {string} primaryKey 主键，must
     * @param  {object} conf       配置参数:
     * {
     *     autoIncrement: 是否开启自增序列，类似于mysql,
     *     indexList: 索引设置（集成unique指定）[{name: 建名, keypath: 选定的键值, option: 设置参数对象} ]
     * }
     * @return {[type]}            [description]
     */
    dbt.prototype.createTable = function(tbName, primaryKey, conf, data) {
        if (!tbName || !primaryKey) {
            return false;
        }

        if (!this.table.hasOwnProperty(tbName)) {
            var cf = _t.parseParam({
                autoIncrement: true,
                indexList: undefined
            }, conf);

            var indexList = cf.indexList;

            var option = {
                keyPath: primaryKey,
                autoIncrement: cf.autoIncrement
            };

            // 主键及自增设置
            var objectStore = this.db.createObjectStore(tbName, option);

            // 索引设置
            if (indexList) {
                if (_t.isType(indexList, 'object')) {
                    indexList = [indexList];
                }

                var indexItem;
                for (var i = 0, iLL = indexList.length; i < iLL; i++) {
                    indexItem = indexList[i];

                    indexItem.name && objectStore.createIndex(
                        indexItem.name,
                        indexItem.keypath || indexItem.name,
                        indexItem.option || {unique: false}
                    );
                }
            }

            this.table[tbName] = objectStore;
        }
        
        this.insert(tbName, data);
        return this;
    };

    /**
     * 数据插入操作
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    dbt.prototype.insert = function(tbName, data, oncomplete) {
        var tables = this.table;
        if (!tbName || !data) {
            return false;
        }

        var ta = this.db.transaction(tbName, 'readwrite');
        var objectStore = ta.objectStore(tbName);

        if (_t.isType(data, 'object')) {
            data = [data];
        }

        var successList = [],
            failList = [];

        var dataItem;
        for (var i = 0, dL = data.length; i < dL; i++) {
            dataItem = data[i];
            try {
                objectStore.put(dataItem);
                successList.push(i);
            }
            catch(e) {
                failList.push({
                    index: i,
                    error: e
                });
            }
        }

        ta.oncomplete = function () {
            oncomplete && oncomplete(this);
        };

        if (this.debug) {
            console.log(successList.length + ' rows affected');
            failList.length && console.log('Fail list:', failList);
        }

        return this;
    };

    /**
     * 获取范围
     * @param  {[type]} type eq, lt, gt, lte, gte, in, ein, ine, eine
     * @param  {[type]} val  [description]
     * @return {[type]}      [description]
     */
    dbt.prototype.getRange = function(type, val) {
        var idbRg;
        switch (type) {
            case 'eq':
                idbRg = IDBKeyRange.only(val);
                break;
            case 'lt':
                idbRg = IDBKeyRange.upperBound(val, true);
                break;
            case 'gt':
                idbRg = IDBKeyRange.lowerBound(val, true);
                break;
            case 'lte':
                idbRg = IDBKeyRange.upperBound(val, false);
                break;
            case 'gte':
                idbRg = IDBKeyRange.lowerBound(val, false);
                break;
            default:
                var tMatch;
                if (tMatch = type.match(/^(e)?in(e)?$/)) {
                    idbRg = IDBKeyRange.bound(val[0], val[1], !tMatch[1], !tMatch[2]);
                }
        }
        return idbRg;
    };

    /**
     * select方法
     * @param  {[type]} whereObj:
     * {
     *     indexKey: keyName,
     *     type: eq / lt / gt / lte / gte / [e]in[e] ,
     *     val: val / [val1, val2]
     * }
     * @return {[type]}          [description]
     */
    dbt.prototype.select = function(tbName, whereObj, cbk, dir) {
        var tables = this.table;
        if (!tbName) {
            return null;
        }

        var boundKeyRange = this.getRange(whereObj.type || 'eq', whereObj.val);
        var ta = this.db.transaction(tbName, 'readonly');
        var objectStore = ta.objectStore(tbName);

        var dataArr = [];

        objectStore.index(whereObj.indexKey).openCursor(
            boundKeyRange,
            IDBCursor[dir || 'NEXT_NO_DUPLICATE']
        ).onsuccess = function (evt) {
            var cursor = evt.target.result;
            if (!cursor) {
                cbk && cbk(dataArr);
                return;  
            }
              
            dataArr.push(cursor.value);
            cursor.continue();
        };

    };

    dbt.prototype.delete = function(tbName, whereObj, cbk) {
        var tables = this.table;
        if (!tbName) {
            return null;
        }

        var boundKeyRange = this.getRange(whereObj.type || 'eq', whereObj.val);
        var ta = this.db.transaction(tbName, 'readwrite');
        var objectStore = ta.objectStore(tbName);

        var dataArr = [];
        
        objectStore.delete(boundKeyRange);
        return true;

    };

    window.dbt = dbt;
} ();