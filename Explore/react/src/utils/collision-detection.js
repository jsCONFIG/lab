import arrHasKey from './arr-has-key';
/**
 * 碰撞检测，纯数据
 */
/**
 * 工具方法集
 * @type {Object}
 */
let _utils = {};

/**
 * 核心判断方法
 * @return {Boolean}    [description]
 */
_utils.judgeCore = (aRange, bRange) => {

    // (aMaxX < bMinX || aMinX > bMaxX || aMaxY < bMinY || aMinY > bMaxY)

    return !(aRange.x[1] < bRange.x[0] || aRange.x[0] > bRange.x[1] || aRange.y[1] < bRange.y[0] || aRange.y[0] > bRange.y[1]);
};

_utils.keepNoCollision = (maps) => {
    // 按y起点升序排列
    maps = maps.slice(0).sort((aMap, bMap) => {
        return aMap.y[0] > bMap.y[0] ? -1 : 1;
    });

    let hasCollision = false;

    for (let i = 0, mapNum = maps.length; i < mapNum; i++) {
        let map = maps[i];
        map = {
            id: map.id,
            x: map.x.slice(0),
            y: map.y.slice(0)
        };

        let judgeResult = _utils.judgeBatch(map, maps, map.id);
        if (hasCollision = judgeResult.flag) {
            let resultList = judgeResult.list;
            
            for (let j = i; j < mapNum; j++) {
                let nextMap = maps[j];

                // 表示有碰撞
                if (resultList[nextMap.id]) {
                    let offsetY = map.y[1] - nextMap.y[0];
                    nextMap.y = [nextMap.y[0] + offsetY, nextMap.y[1] + offsetY];
                }
            }
        }
    }

    if (hasCollision) {
        return _utils.keepNoCollision(maps);
    }

    return maps;
};

/**
 * 获取建议的非碰撞情况下的map列表
 * @param  {[type]} maps      [description]
 * @param  {[type]} activeMap [description]
 * @return {[type]}           [description]
 */
_utils.getSuggest = (maps, activeMap) => {
    maps = maps.slice(0);
    let resultMaps = [];

    // 先确保activeMap的位置没被占用
    let judgeResult = _utils.judgeBatch(activeMap, maps);

    if (judgeResult.flag) {
        let resultList = judgeResult.list;

        for (let i = 0, mapNum = maps.length; i < mapNum; i++) {
            let map = maps[i];

            // 占用了active节点时，全部下移到active节点之下
            // 给active节点腾出位置来
            if (resultList[map.id]) {
                let offsetY = activeMap.y[1] - map.y[0];
                map.y = [map.y[0] + offsetY, map.y[1] + offsetY]
            }

        }

    }

    // 再保证其它节点不重叠
    resultMaps = _utils.keepNoCollision(maps);

    return resultMaps;
};

/**
 * 批量判断
 * @param  {[type]} aRange [description]
 * @param  {[type]} bMaps  [description]
 * @return {[type]}        [description]
 */
_utils.judgeBatch = (aRange, bMaps, skipId) => {
    let [resultList, result] = [{}, false];

    let [i, mapL] = [0, bMaps.length];

    for (; i < mapL; i++) {
        let mapItem = bMaps[i],
            mapId = mapItem.id;

        // 忽略点默认未碰撞
        if (mapId === skipId) {
            resultList[mapId] = false;
            continue;
        }

        let flag = _utils.judgeCore(aRange, mapItem);
        resultList[mapId] = flag;

        if (flag) {
            result = true;
            break;
        }

    }

    return {
        list: resultList,
        flag: result
    };
};

/**
 * 创建Map对象，位置关系为相对于外层节点
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
_utils.getMap = (node) => {
    let [ndW, ndH, ndX, ndY] = [nd.offsetWidth, nd.offsetHeight, nd.offsetLeft, nd.offsetTop];

    return {
        x: [ndX, ndX + ndW],
        y: [ndY, ndY + ndH]
    };
};

/**
 * 碰撞检测构造函数
 * @param {[type]} maps 参考节点Map
 * [{x: [0, 100], y: [0, 100]}, id: mapId]
 */
const Collision = function (maps) {
    this.map = maps || [];
};

 /**
  * 设置map里当前的“主角”， 
  * 实质为待判断的map
  */
Collision.prototype.setMain = function (id) {
    let pos = arrHasKey(this.map, 'id', id);

    this.lead = id;

    return this;
};

/**
 * 判断碰撞
 * @param  {[type]} myRange {x: [minX, maxX], y: [minY, maxY]}
 * @return {[type]}      [description]
 */
Collision.prototype.judge = function (myRange) {
    let self = this;

    let result;
    if (!this.map.length) {
        result = {
            list: [],
            flag: false
        };
    }
    result = _utils.judgeBatch(myRange, this.map, this.lead);

    return result;
};

Collision.prototype.updateMap = function (mid, map) {
    let pos = arrHasKey(this.map, 'id', mid);

    if (pos === -1) {
        return false;
    }

    this.map.splice(pos, 1, map);
    return true;
};

Collision.prototype.addMap = function (map) {
    if (map && map.hasOwnProperty('id')) {
        let pos = arrHasKey(this.map, 'id', map.id);

        if (pos !== -1) {
            return false;
        }

        this.map.push(map);

        return true;
    }
};

export default Collision;