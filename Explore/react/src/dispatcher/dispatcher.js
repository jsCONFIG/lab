class Dispatcher extends Flux.Dispatcher {
    constructor (...args) {
        super(...args);
    }

    dispatch (type, action = {}) {
        if (!type) {
            throw new Error('You forgot to specify type.');
        }

        super.dispatch({type, ...action});
    }

    dispatchAsync (promise, types, action = {}) {
        const { request, success, failure } = types;

        this.dispatch(request, action);

        promise.then(
            (response) => {
                this.dispatch(success, {...action, response});
            },

            (error) => {
                this.dispatch(failure, {...action, error});
            }
        );
    }
};

export default new Dispatcher();
