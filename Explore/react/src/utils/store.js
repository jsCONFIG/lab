// store util

const storeUtil = {
    createParam (obj) {
        let param = '';

        for (let key in obj) {
            param += `&${key}=${obj[key]}`;
        }

        return param.slice(1);
    },

    mergeParam (conditions, param) {
        for (let key in conditions) {
            if (conditions[key]) {
                param[key] = conditions[key];
            }
            else{
                delete param[key];
            }
        }

        return this.createParam(param);
    },

    createStore (methods) {
        let name;

        class Store extends EventEmitter {};

        for (name in methods) {
            Store.prototype[name] = methods[name];
        }

        return new Store();
    }
};

export default storeUtil;
