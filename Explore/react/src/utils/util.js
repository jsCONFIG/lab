// util
// 合并两个对象，newObj覆盖rootObj中的重名字段
const merge = (rootObj = {}, newObj = {}) => {
    for (let i in newObj) {
        if (newObj.hasOwnProperty(i)) {
            rootObj[i] = newObj[i];
        }
    }

    return rootObj;
};

/**
 * 根据rootObj的key，从newObj中取对应数据更新rootObj
 */
const smartyMerge = (rootObj, newObj = {}, isNumParse) => {
    let tempObj = {};

    for (let i in rootObj ) {
        tempObj[i] = rootObj[i];

        if (i in newObj) {
            let temp = newObj[i],
                parseVal = parseFloat(temp, 10);

            if (isNumParse && !isNaN(parseVal)) {
                temp = parseVal;
            }

            tempObj[i] = temp;
        }

    }
    return tempObj;
};

const arrHasKey = (arr, keyName, theVal) => {
    if (!arr instanceof Array) {
        return -1;
    }

    let flag = -1;

    for (let i = 0, arrL = arr.length; i < arrL; i++) {
        let item = arr[i];

        if (item && (item[keyName] === theVal)) {
            flag = i;
            break;
        }
        
    }

    return flag;
};

const isArray = (item) => {
    return item instanceof Array;
};

const clone = (tobeCloneItem) => {
    if (isArray(tobeCloneItem)) {
        return tobeCloneItem.slice(0);
    }
    else if (tobeCloneItem instanceof Object) {
        return merge({}, tobeCloneItem);
    }
    return tobeCloneItem;
};

// 对象元素构成的数组，创建以itemKey为参考的索引表
// 要保证itemKey对应的值唯一
const buildMap = (arr = [], itemKey) => {
    let indexMap = {},
        i = 0,
        arrL = arr.length;

    for (; i < arrL; i++) {
        indexMap[arr[i][itemKey]] = i;
    }

    return indexMap;
};

const TRIM_REG = /\s/;
const trim = (str) => {
    if (typeof str !== 'string') {
        return str;
    }
    let i = 0,
        strL = str.length,
        startPos = 0,
        endPos = strL;

    if (!strL) {
        return str;
    }

    // 避免大字符串的全局正则匹配
    for (; i < strL; i++) {
        startPos = i;
        if (!TRIM_REG.test(str.charAt(i))) {
            break;
        }
    }

    while (--strL) {
        if (!TRIM_REG.test(str.charAt(strL))) {
            break;
        }
        endPos = strL;
    }

    return str.slice(startPos, endPos);
}

const util = {
    merge,
    smartyMerge,
    createStore,
    arrHasKey,
    isArray,
    clone,
    buildMap,
    trim
};

export default util;
