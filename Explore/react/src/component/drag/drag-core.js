import constants from '../../constant/drag';
import dragActs from '../../action/drag';
import dragStore from '../../store/drag';
import DragBase from './drag-base';
import DragPlaceholder from './drag-placeholder';
import merge from '../../utils/merge';
import parseParam from '../../utils/parse-param';
import collisionDetection from '../../utils/collision-detection';
import arrHasKey from '../../utils/arr-has-key';

const defaultDragParam = {
    minSize: [100, 100],
    maxSize: [Infinity, Infinity],
    buffer: [5, 5]
};

// 根据碰撞参数，得到被碰撞节点应该所在的位置
const getOthersPos = (suggestItem) => {
    return {
        left: suggestItem.x[0],
        top: suggestItem.y[0]
    };
};

/**
 * 管理drag的一个group
 * 需要参数：id, params
 */
class DragCore extends React.Component {
    constructor () {
        super();

        this.state = {
            collision: {}
        };

        this.status = constants.STATUS.IDLE;

        // 当前被操作的drag id
        this.activeDrag = null;

        this.offset = {};

        this.onDragStart = this.onDragStart.bind(this);
        this.onDraging = this.onDraging.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onResizeStart = this.onResizeStart.bind(this);
        this.freshData = this.freshData.bind(this);
        this.judgeUpdate = this.judgeUpdate.bind(this);
        this.beforeUpdate = this.beforeUpdate.bind(this);

        // 初始化碰撞检测
        this.collision = new collisionDetection([], {
            collisionBuffer: [-1, -1],
            suggestBuffer: [5, 10]
        });

        // 辅助ing状态下被碰撞移位节点的复原碰撞检测
        this.helpCollision = new collisionDetection()
    }

    componentDidMount () {
        dragStore.on('change', this.freshData);
        let props = this.props;

        dragActs.fetchGroup('add', {
            id: props.id,
            param: props.param
        });
    }

    componentWillUnmount () {
        dragStore.off('change', this.freshData);
    }

    // 获取合适的位置
    getAdaptPos () {
        let [props, state] = [this.props, this.state];
        let dragId = this.activeDrag;
    }

    // 用于判断碰撞
    judgeUpdate () {
        let dragId = this.activeDrag,
            state = this.state,
            props = this.props,
            style = state.draging,
            status = this.status;

        if (dragId === null) {
            return;
        }

        if (!style) {
            let dragItem = dragStore.get.drag(dragId, props.id);
            style = dragItem.style;
        }

        let myRange = {
            id: dragId,
            x: [style.left, style.left + style.width],
            y: [style.top, style.top + style.height]
        };
        this.collision.updateMap(dragId, myRange);

        let suggestPos = this.collision.getSuggestPos();

        if (suggestPos) {
            this.updateWhenCollision(suggestPos);
        }
    }

    beforeUpdate (status, dragId, style) {
        this.collision.setMain(dragId);
        this.helpCollision.setMain(dragId);
    }

    // 根据碰撞，更新state
    // 进行时状态下调用
    updateWhenCollision (suggestPos) {
        let [props, state] = [this.props, this.state];

        let groupDrags = dragStore.get.group(props.id),
            latestList = {};

        for (let i in groupDrags) {

            if (groupDrags.hasOwnProperty(i)) {
                let suggestItem,
                    dragItem = groupDrags[i],
                    copyStyle = merge({}, dragItem.style),
                    suggestItemPos = arrHasKey(suggestPos, 'id', i);

                if (suggestItemPos != -1) {
                    suggestItem = suggestPos[suggestItemPos];
                }

                if (suggestItem) {
                    let pos = getOthersPos(suggestItem);
                    latestList[dragItem.id] = merge(copyStyle, pos);
                }

                else {
                    latestList[dragItem.id] = copyStyle;
                }
            }

        }

        state.collision = latestList;

        this.setState(state);
    }

    freshData () {
        let props = this.props;
        let groupDrags = dragStore.get.group(props.id);

        let state = this.state;
        state.group = {
            id: props.id,
            list: groupDrags
        };

        const judgeUpdate = this.judgeUpdate;

        this.setState(state, function () {
            judgeUpdate();
        });
    }

    buildDragBase (dragParamList) {
        let [props, state] = [this.props, this.state];
        let drags = [];

        for (let i in dragParamList) {
            if (!dragParamList.hasOwnProperty(i)) {
                continue;
            }

            let dragParam = dragParamList[i];

            // 拼合默认参数
            let defaultParam = merge({}, defaultDragParam);
            dragParam = merge(defaultParam, dragParam);

            let dragStyle = dragParam.style;

            // 进行时
            if (this.status !== constants.STATUS.IDLE
                    && state.collision
                    && state.collision[dragParam.id]) {

                dragStyle = dragParam.style = state.collision[dragParam.id];
            }

            else {
                // 辅助碰撞仅存储完成时的状态，
                // 不存储临时状态
                dragStyle && this.helpCollision.addMap({
                    id: dragParam.id,
                    x: [dragStyle.left, dragStyle.left + dragStyle.width],
                    y: [dragStyle.top, dragStyle.top + dragStyle.height]
                });
            }


            // 碰撞检测初始化
            dragStyle && this.collision.addMap({
                id: dragParam.id,
                x: [dragStyle.left, dragStyle.left + dragStyle.width],
                y: [dragStyle.top, dragStyle.top + dragStyle.height]
            });

            drags.push(
                <DragBase
                    key = {dragParam.gid + '_' + dragParam.id}
                    param = {dragParam}
                    id = {dragParam.id}
                    gid = {dragParam.gid}
                    onDragStart = {this.onDragStart}
                    onResizeStart = {this.onResizeStart} >
                    {dragParam.node}
                </DragBase>
            );

        }

        return drags;
    }

    onResizeStart (e, dragId) {
        this.status = constants.STATUS.RESIZING;

        this.activeDrag = dragId;

        // 设置碰撞主元素
        this.collision.setMain(dragId);
    }

    onDragStart (e, dragId) {
        let props = this.props;
        let param = dragStore.get.drag(dragId, props.id);

        this.offset = {
            left: e.clientX - (param.style.left || 0),
            top: e.clientY - (param.style.top || 0)
        };

        window.addEventListener('mousemove', this.onDraging);
        window.addEventListener('mouseup', this.onDragEnd);

        // 初始化拖曳state
        let state = this.state,
        offset = this.offset;

        state.draging = {
            left: e.clientX - (offset.left || 0),
            top: e.clientY - (offset.top || 0),
            width: param.style.width,
            height: param.style.height
        };

        state.collision = {};

        this.status = constants.STATUS.DRAGING;

        this.activeDrag = dragId;

        // 设置碰撞主元素
        this.collision.setMain(dragId);

        this.setState(state);
    }

    onDraging (e) {
        let state = this.state,
            draging = state.draging;

        const offset = this.offset;
        const judgeUpdate = this.judgeUpdate;
        
        draging.left = e.clientX - (offset.left || 0);
        draging.top = e.clientY - (offset.top || 0);

        this.setState(state, function () {
            judgeUpdate();
        });
    }

    onDragEnd (e) {
        window.removeEventListener('mouseup', this.onDragEnd);
        window.removeEventListener('mousemove', this.onDraging);

        let props = this.props,
            state = this.state,
            draging = state.draging,
            collisionParam = state.collision || {},
            dragList = state.group.list,
            dragId = this.activeDrag;

        // 重置状态
        delete state.draging;
        state.collision = {};
        this.status = constants.STATUS.IDLE;
        this.activeDrag = null;
        
        for (let i in dragList) {
            if (dragList.hasOwnProperty(i)) {
                // 碰撞数据
                if (collisionParam[i]) {
                    dragList[i].style = collisionParam[i];
                }

                // 当前拖拽数据
                if (i === dragId) {
                    dragList[i].style = draging;
                }
            }
        }

        dragActs.fetchGroup('update', {
            id: props.id,
            list: dragList
        });
    }

    render () {
        let state = this.state;

        let groupParam = state.group;

        let dragMods, placeholder;

        if (groupParam) {
            dragMods = this.buildDragBase(groupParam.list);
        }

        if (this.status === constants.STATUS.DRAGING) {
            placeholder = <DragPlaceholder  styleObj={state.draging} />;
        }

        return (
            <div className="bdrag-group">
                {dragMods}
                {placeholder}
            </div>
        );
    }
};

export default DragCore;