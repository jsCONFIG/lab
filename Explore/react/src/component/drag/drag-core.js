import dragActs from '../../action/drag';
import dragStore from '../../store/drag';
import DragBase from './drag-base';
import DragPlaceholder from './drag-placeholder';
import merge from '../../utils/merge';
import collisionDetection from '../../utils/collision-detection';

const defaultDragParam = {
    minSize: [100, 100],
    maxSize: [Infinity, Infinity]
};

/**
 * 管理drag的一个group
 * 需要参数：id, params
 */
class DragCore extends React.Component {
    constructor () {
        super();

        this.state = {};

        this.freshData = this.freshData.bind(this);
        this.onDragUpdate = this.onDragUpdate.bind(this);
        this.beforeUpdate = this.beforeUpdate.bind(this);

        this.collision = new collisionDetection();
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

    // 用于判断碰撞
    onDragUpdate (status, dragId, style) {
        let myRange = {
            id: dragId,
            x: [style.left, style.left + style.width],
            y: [style.top, style.top + style.height]
        };

        this.collision.updateMap(dragId, myRange);

        let flag = this.collision.judge(myRange);
        console.log(flag);
    }

    beforeUpdate (status, dragId, style) {
        this.collision.setMain(dragId);
    }

    freshData () {
        let props = this.props;
        let groupDrags = dragStore.get.group(props.id);

        let state = this.state;
        state.group = {
            id: props.id,
            list: groupDrags
        };


        this.setState(state);
    }

    buildDragBase (dragParamList) {
        let drags = [];
        for (let i = 0, dragNum = dragParamList.length; i < dragNum; i++) {
            let dragParam = dragParamList[i];

            // 拼合默认参数
            let defaultParam = merge({}, defaultDragParam);
            dragParam = merge(defaultParam, dragParam);

            let dragStyle = dragParam.style;

            // 碰撞检测初始化
            dragStyle && this.collision.addMap({
                id: dragParam.id,
                x: [dragStyle.left, dragStyle.left + dragStyle.width],
                y: [dragStyle.top, dragStyle.top + dragStyle.height]
            });

            drags.push(
                <DragBase
                    key = {i}
                    param = {dragParam}
                    id = {dragParam.id}
                    gid = {dragParam.gid}
                    beforeUpdate = {this.beforeUpdate}
                    onUpdate = {this.onDragUpdate} />
            );

        }

        return drags;
    }

    render () {
        let state = this.state;

        let groupParam = state.group;

        let dragMods;

        if (groupParam) {
            dragMods = this.buildDragBase(groupParam.list);
        }

        return (
            <div className="bdrag-group">
                {dragMods}
            </div>
        );
    }
};

export default DragCore;