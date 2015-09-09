const parseParam = function (rootObj, newObj = {}, isNumParse) {
    let tempObj = {};

    for (let i in rootObj ) {
        tempObj[i] = rootObj[i];

        if (i in newObj) {
            var temp = newObj[i];
            var parseVal = parseFloat(temp, 10);

            if (isNumParse && !isNaN(parseVal)) {
                temp = parseVal;
            }

            tempObj[i] = temp;
        }

    }
    return tempObj;
};

export default parseParam;