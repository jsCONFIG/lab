/**
 * 对象合并，影响源
 * @param  {[type]} rootObj   [description]
 * @param  {[type]} newObj    [description]
 * @return {[type]}           [description]
 */
const merge = (rootObj = {}, newObj = {}) => {
    for (let i in newObj) {
        if (newObj.hasOwnProperty(i)) {
            rootObj[i] = newObj[i];
        }
    }

    return rootObj;
};

export default merge;