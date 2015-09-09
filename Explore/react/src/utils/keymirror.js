const keyMirror = (obj) => {
    const ret = {};
    let key;

    if (!(obj instanceof Object && !Array.isArray(obj))) {
        throw new Error('keyMirror(...): Argument must be an object.');
    }
    
    for (key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }

        if (obj[key] === null) {
            ret[key] = key;
        }
        else {
            ret[key] = obj[key];
        }
    }
    return ret;
};

export default keyMirror;
