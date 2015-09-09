/**
 * 检测某个对象元素构成的数组中
 * 是否有某个key为给定值
 */

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

export default arrHasKey;
