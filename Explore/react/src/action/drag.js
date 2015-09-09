import dispatcher from '../dispatcher/dispatcher';
import actionTypes from '../constant/drag';

const dragActs = {
    // group操作,act: add, del, update
    fetchGroup (act, params) {
        let actType = actionTypes['FETCH_DRAG_GROUP_' + act.toUpperCase()];

        if (!actType) {
            return;
        }

        dispatcher.dispatch(actType, {
            spec: params || {}
        });
    },

    // 单个drag操作
    fetchDrag (act, params) {
        let actType = actionTypes['FETCH_DRAG_' + act.toUpperCase()];
        
        if (!actType) {
            return;
        }

        dispatcher.dispatch(actType, {
            spec: params || {}
        });
    }
};

export default dragActs;