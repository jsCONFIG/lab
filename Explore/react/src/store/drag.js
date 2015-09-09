import dispatcher from '../dispatcher/dispatcher';
import storeUtil from '../utils/store';
import dragConstants from '../constant/drag';
import arrHasKey from '../utils/arr-has-key';
import merge from '../utils/merge';

let dragGroup = {};

// 增操作
const add = {
    // 创建拖拽组，屏蔽组外其它组件的干扰
    group (gid, params) {
        if (!dragGroup[gid]) {
            dragGroup[gid] = [];
        }

        // 有初始化数据到group
        if (params) {
            let groupDragList = dragGroup[gid];
            if (!params instanceof Array) {
                params = [params];
            }

            for (let i = 0, listL = params.length; i < listL; i++) {
                let dragItem = params[i];

                // 做一个ID重复检测，有重复的ID则忽略
                // 强制更新使用对应的更新方法
                if (dragItem && dragItem.id) {
                    let pos = arrHasKey(groupDragList, 'id', dragItem.id);

                    if (pos != -1) {
                        break;
                    }

                    // 增加gid参数
                    dragItem.gid = gid;

                    groupDragList.push(dragItem);

                }

            }

        }
    },

    // 追加Drag到组内
    drag (param) {
        if (!param || !param.gid || !param.id || !dragGroup[param.gid]) {
            return false;
        }

        let myGroup = dragGroup[param.gid];

        let pos = arrHasKey(myGroup, 'id', param.id);

        // 强制使用对应的更新方法执行更新
        if (pos != -1) {
            return;
        }

        myGroup.push(param);
    }
};

// 删操作
const del = {
    group (groupId) {

    },

    drag (dragId) {

    }
};

// 改操作
const update = {
    // 更新对应的组的参数
    group (param, groupId) {

    },

    // 更新对应Drag的参数
    drag (param) {
        if (!param || !param.gid || !param.id || !dragGroup[param.gid]) {
            return false;
        }

        let myGroup = dragGroup[param.gid];

        let pos = arrHasKey(myGroup, 'id', param.id);

        // 强制使用对应的更新方法执行更新
        if (pos == -1) {
            return;
        }

        let myDrag = myGroup[pos];

        merge(myDrag, param);
    }
};

// 查操作
const get = {
    group (gid) {
        if (!gid || !dragGroup[gid]) {
            return null;
        }

        return dragGroup[gid];
    },

    drag (dragId, gid) {
        if (!dragId || !gid || !dragGroup[gid]) {
            return null;
        }

        let myGroup = dragGroup[gid];

        let pos = arrHasKey(myGroup, 'id', dragId);

        if (pos === -1) {
            return null;
        }

        return myGroup[pos];
    }
};

const dragStore = storeUtil.createStore({
    get
});


dragStore.dispatch = dispatcher.register((action) => {
    let spec = action.spec;
    switch (action.type) {
        // drag新增
        case dragConstants.FETCH_DRAG_ADD:
            add.drag(spec);
            break;

        // drag删除
        case dragConstants.FETCH_DRAG_DEL:
            break;

        // drag更新
        case dragConstants.FETCH_DRAG_UPDATE:
            update.drag(spec);
            break;

        // drag group新增
        case dragConstants.FETCH_DRAG_GROUP_ADD:
            add.group(spec.id, spec.param);
            break;

        // drag group删除
        case dragConstants.FETCH_DRAG_GROUP_DEL:
            break;

        // drag group更新
        case dragConstants.FETCH_DRAG_GROUP_UPDATE:
            update.group(spec);
            break;
    }
    
    dragStore.emit('change');
});

export default dragStore;
