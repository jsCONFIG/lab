import DragBase from './drag-base';
import DragPlaceholder from './drag-placeholder';
import DragAlignLine from './drag-align-line';
import constants from '../../constant/drag';
import utils from '../../utils/util';
import collisionDetection from '../../utils/collision-detection';
import edgeDetection from '../../utils/edge-detection';

const defaultDragParam = {
    minSize: [100, 100],
    maxSize: [Infinity, Infinity],
    wrapperSize: {
        x: [-Infinity, Infinity],
        y: [-Infinity, Infinity]
    },
    buffer: [5, 5],

    // 稳定态调用的回调
    onStable (allPos) {}
};

const alignSense = .05;

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
            list: []
        };

        this.status = constants.STATUS.INIT;

        // 当前被操作的drag id
        this.activeDrag = null;

        // 辅助拖曳时的拖曳位置偏差
        this.offset = {};

        // 辅助resize时的位置
        this.resizePos = {};

        this.currentPos = {};

        // 拖曳时的临时位置
        this.draging = undefined;

        // 重置尺寸时的临时样式
        this.resizing = undefined;

        // 最大Top值，用来计算drag group的高度
        this.maxTop = defaultDragParam.minSize[1];

        // 初始化碰撞检测
        this.collision = new collisionDetection([], {
            collisionBuffer: [-50, -50],
            suggestBuffer: [5, 10]
        });

        // 储存碰撞检测参数
        this.collisionParam = {};

        // 辅助稳定状态下，无buffer的位置suggest
        this.helpCollision = new collisionDetection();

        // 辅助对齐线，在ing状态下出现
        this.edge = new edgeDetection(undefined, {
            sense: .05
        });
    }

    static defaultProps = defaultDragParam;

    componentDidMount () {
        let [props, state] = [this.props, this.state];

        let children = props.children;
        if (children) {
            if (!utils.isArray(children)) {
                children = [children];
            }

            state.children = children;
            this.setState(state, () => {
                if (state.children && state.children.length) {
                    let firstDragId = state.children[0].props.id;
                    this.collision.setMain(firstDragId);
                    this.judgeUpdate(true, firstDragId);
                    this.updateFromCollisionParam();
                }
                this.freshMaxTop();
                this.freshGroupHeight();
                // this.status = constants.STATUS.IDLE;
            });
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps && nextProps.children) {
            let state = this.state,
                children = nextProps.children;

            if (!utils.isArray(children)) {
                children = [children];
            }
            state.children = children;

            this.setState(state, () => {
                // 非ing态下更新，检测碰撞
                if (this.status === constants.STATUS.IDLE || this.status === constants.STATUS.INIT) {
                    let firstDragId = this.activeDrag || state.children[0].props.id;
                    this.collision.setMain(firstDragId);
                    this.judgeUpdate(true, firstDragId);
                    this.updateFromCollisionParam();
                }
                this.freshMaxTop();
                this.freshGroupHeight();
            });
        }
    }

    // 计算偏弱/强的灵敏度哪个高一些
    // 返回正(偏强)负(偏弱)数，一样时返回0
    calcSense (mixVal, myRangeVal, otherRangeVal) {
        let myRange = myRangeVal[1] - myRangeVal[0];
        mixVal = Math.abs(mixVal);
        if (mixVal >= myRange * (1 + alignSense)) {
            return false;
        }

        mixVal = Math.min(mixVal, myRange - mixVal);
        let senseVal = mixVal / myRange;

        if (senseVal <= alignSense) {
            if (myRangeVal[0] >= otherRangeVal[0]) {
                return -1;
            }
            else {
                return 1;
            }
        }
        return false;
    }

    // 解析对齐数据的state，返回解析后的数据对齐线数据
    parseAlignState (collisionList) {
        let [vLine, lLine] = [null, null];
        for (let i in collisionList) {
            if (collisionList.hasOwnProperty(i)) {
                let collisionItem = collisionList[i];
                
                if (collisionItem) {
                    let ySenseVal = this.calcSense(collisionItem.y, collisionItem.aRange.y, collisionItem.bRange.y),
                        xSenseVal = this.calcSense(collisionItem.x, collisionItem.aRange.x, collisionItem.bRange.x);

                    if (ySenseVal) {
                        lLine = {
                            style: {
                                top: ySenseVal < 0 ? collisionItem.aRange.y[0] : collisionItem.aRange.y[1]
                            }
                        };
                    }

                    if (xSenseVal) {
                        vLine = {
                            style: {
                                left: xSenseVal > 0 ? collisionItem.aRange.x[0] : collisionItem.aRange.x[1]
                            }
                        };
                    }
                }
            }
        }

        return {
            lLine,
            vLine
        };
    }

    // 从碰撞suggest结果中更新数据到state的list中，
    // 该方法在稳定态judge之后调用
    updateFromCollisionParam () {
        let state = this.state,
            dragList = state.children,
            collisionParam = this.collisionParam;

        if (!collisionParam) {
            return false;
        }

        if (dragList && dragList.length) {
            for (let i = 0, listL = dragList.length; i < listL; i++) {
                let dragItem = dragList[i].props,
                    dragId = dragItem.id;

                if (collisionParam[dragId]) {
                    dragItem.style = collisionParam[dragId];
                }
            }
            return true;
        }

        return false;
    }

    // 获取单个item
    getDragItem (dragId) {
        let children = this.state.children;
        let result = null;
        if (!utils.isArray(children)) {
            children = [children];
        }
        children.forEach(function (child) {
            if (child.props.id === dragId) {
                result = utils.clone(child.props);
            }
        });
        return result;
    }

    // 更新最大top值(稳定状态)
    freshMaxTop () {
        let [props, state] = [this.props, this.state];
        if (state.children && state.children.length) {
            let groupDrags = state.children.slice(0);
            let maxTop = 0;

            for (let i = 0, listL = groupDrags.length; i < listL; i++) {
                let dragItem = groupDrags[i].props;

                if (dragItem && dragItem.style && (dragItem.style.top + dragItem.style.height) > maxTop) {
                    maxTop = dragItem.style.top + dragItem.style.height;
                }

            }

            this.maxTop = maxTop;
        }
    }

    // 更新drag group的高度，
    // 注意不能在state里面调用
    freshGroupHeight () {
        let state = this.state;
        state.groupHeight = this.maxTop;

        this.setState(state, () => {
            if (this.status === constants.STATUS.IDLE) {
                this.onStable();
            }
        });
    }

    // 获取合适的位置
    getAdaptPos () {
        let [props, state] = [this.props, this.state];
        let dragId = this.activeDrag;
    }

    // 判断是否超出了外层容器的范围
    // 超出则返回处理后的结果(影响源)，否则返回false
    judgeTouchWrapper (currentStyle, type) {
        let wrapperSize = this.props.wrapperSize,
            flag = false;

        if (!wrapperSize) {
            return flag;
        }

        let myRange = {
            x: [currentStyle.left, currentStyle.left + currentStyle.width],
            y: [currentStyle.top, currentStyle.top + currentStyle.height]
        };

        if (wrapperSize.x) {
            if (myRange.x[0] < wrapperSize.x[0]) {
                flag = true;
                currentStyle.left = wrapperSize.x[0];
            }
            if (myRange.x[1] > wrapperSize.x[1]) {
                flag = true;
                if (type === 'resize') {
                    currentStyle.width = wrapperSize.x[1] - currentStyle.left;
                }
                else if (type === 'draging') {
                    currentStyle.left = wrapperSize.x[1] - currentStyle.width;   
                }
            }
        }

        if (wrapperSize.y) {
            if (myRange.y[0] < wrapperSize.y[0]) {
                flag = true;
                currentStyle.top = wrapperSize.y[0];
            }
            if (myRange.y[1] > wrapperSize.y[1]) {
                flag = true;
                if (type === 'resize') {
                    currentStyle.height = wrapperSize.y[1] - currentStyle.top;
                }
                else if (type === 'draging') {
                    currentStyle.top = wrapperSize.y[1] - currentStyle.height;   
                }
            }
        }

        if (flag) {
            return currentStyle;
        }

        return flag;
    }

    // 用于判断碰撞
    judgeUpdate = (letNoCollisionBuffer, custActiveId) => {
        let style;
        let dragId = custActiveId || this.activeDrag,
            state = this.state,
            props = this.props,
            status = this.status;

        if (dragId === null) {
            return;
        }

        switch (this.status) {
            case constants.STATUS.RESIZING:
                style = this.resizing;
                break;

            case constants.STATUS.DRAGING:
                style = this.draging;
                break;

            // 稳定态之前的最后一刻判断
            case constants.STATUS.BEFORE_IDLE:
                style = this.resizing || this.draging;
                if (!style) {
                    return;
                }
                break;

            default:
                let dragItem = this.getDragItem(dragId, props.id);
                style = dragItem.style;
        }

        let myRange = {
            id: dragId,
            x: [style.left, style.left + style.width],
            y: [style.top, style.top + style.height]
        };
        
        this.collision.updateMap(dragId, myRange);

        // 无碰撞buffer，在稳定态时调用
        let suggestPos = letNoCollisionBuffer ? this.collision.getSuggestPos(undefined, [5, 10]) : this.collision.getSuggestPos();

        // 非稳定状态下，判断对齐线有无碰撞
        let lLine = null,
            vLine = null;
        if (this.status === constants.STATUS.DRAGING || this.status === constants.STATUS.RESIZING) {
            let alignResult = this.edge.judgeAndGetClosest(myRange);
            if (alignResult) {
                let lPos = 0, vPos = 0;
                if (alignResult.level) {
                    lLine = {
                        style: {
                            top: alignResult.level.dir.substr(0, 3) === 'top' ? myRange.y[0] : myRange.y[1]
                        }
                    };
                }

                if (alignResult.vertical) {
                    vLine = {
                        style: {
                            left: alignResult.vertical.dir.substr(0, 4) === 'left' ? myRange.x[0] : myRange.x[1]
                        }
                    };
                }
            }
        }

        state.lLine = lLine;
        state.vLine = vLine;

        if (suggestPos) {
            this.updateWhenCollision(suggestPos);
        }
        else {
            this.setState(state);
        }
    }

    beforeUpdate = (status, dragId, style) => {
        this.collision.setMain(dragId);
        this.helpCollision.setMain(dragId);
    }

    // 根据碰撞，更新state
    // 进行时状态下调用
    updateWhenCollision (suggestPos) {
        let [props, state] = [this.props, this.state];

        let maxTop = this.maxTop;

        let groupDrags = state.children,
            latestList = {};

        for (let i = 0, dragL = groupDrags.length; i < dragL; i++) {
                let suggestItem,
                    dragItem = groupDrags[i].props,
                    copyStyle = utils.merge({}, dragItem.style),
                    suggestItemPos = utils.arrHasKey(suggestPos, 'id', dragItem.id);

                if (suggestItemPos != -1) {
                    suggestItem = suggestPos[suggestItemPos];
                }

                if (suggestItem) {
                    let pos = getOthersPos(suggestItem);
                    latestList[dragItem.id] = utils.merge(copyStyle, pos);
                }

                else {
                    latestList[dragItem.id] = copyStyle;
                }

                // 碰撞时，更新maxTop
                let latestItem = latestList[dragItem.id],
                    latestTop = latestItem.top + latestItem.height;
                if (latestTop  > maxTop) {
                    maxTop = latestTop;
                }
        }

        this.maxTop = maxTop;
        this.collisionParam = latestList;

        this.setState(state);
    }

    // 解析Drag内的子元素
    parseDragBase (dragBases) {
        let [props, state] = [this.props, this.state];
        let drags = [];

        let dragConf = props.conf || {};

        for (let i = 0, listL = dragBases.length; i < listL; i++) {
            let dragBase = dragBases[i];
            let dragParam = dragBase.props;

            // 拼合默认参数
            let defaultParam = utils.merge({}, defaultDragParam);
            dragParam = utils.merge(defaultParam, dragParam);

            let dragStyle = utils.merge({}, dragParam.style);

            // 进行时
            if (this.status !== constants.STATUS.IDLE
                    && this.collisionParam
                    && this.collisionParam[dragParam.id]) {

                dragStyle = dragParam.style = this.collisionParam[dragParam.id];
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

            // 半透明实体
            if (this.activeDrag === dragParam.id) {
                dragStyle.opacity = '.1';
            }
            else {
                delete dragStyle.opacity;
            }


            // 碰撞检测初始化
            dragStyle && this.collision.addMap({
                id: dragParam.id,
                x: [dragStyle.left, dragStyle.left + dragStyle.width],
                y: [dragStyle.top, dragStyle.top + dragStyle.height]
            });

            // 辅助对齐初始化数据
            dragStyle && this.edge.addMap({
                id: dragParam.id,
                x: [dragStyle.left, dragStyle.left + dragStyle.width],
                y: [dragStyle.top, dragStyle.top + dragStyle.height]
            });

            dragParam.style = dragStyle;

            drags.push(
                <DragBase
                    key = {dragParam.gid + '_' + dragParam.id}
                    param = {dragParam}
                    id = {dragParam.id}
                    gid = {dragParam.gid}
                    conf = {dragConf}
                    onDragStart = {this.onDragStart}
                    onResizeStart = {this.onResizeStart} >
                    {dragParam.children}
                </DragBase>
            );

        }

        return drags;
    }

    // 稳定态时的操作
    onStable = () => {
        let props = this.props,
            children = props.children,
            dragParams = {};

        if (!children) {
            return;
        }

        if (!utils.isArray(children)) {
            children = [children];
        }

        // 解析出当前的拖拽参数
        children.forEach(function (child) {
            let childParam = child.props;
            if (childParam.id) {
                dragParams[childParam.id] = utils.clone(childParam.style);
            }
        });

        props.onStable(dragParams);
    }

    onResizeStart = (e, dragId, startPos) => {
        let [props, state] = [this.props, this.state];
        let param = this.getDragItem(dragId);

        let style = param.style;

        let el = e.currentTarget;
        
        let size = {
            width: startPos.width,
            height: startPos.height,
            left: style.left,
            top: style.top
        };

        this.resizing = size;

        this.status = constants.STATUS.RESIZING;
        this.activeDrag = dragId;
        this.currentPos = {
            left: startPos.left,
            top: startPos.top
        };

        // 设置碰撞主元素
        this.collision.setMain(dragId);
        this.edge.setMain(dragId);
        
        window.addEventListener('mouseup', this.onResizeEnd);
        window.addEventListener('mousemove', this.onResizing);
        
        this.setState(state);
    }

    onResizing = (e) => {
        let [props, state] = [this.props, this.state];

        const judgeUpdate = this.judgeUpdate;
        let resizing = this.resizing,
            initPos = this.currentPos;

        let size = {
            width: e.clientX - initPos.left,
            height: e.clientY - initPos.top,
            left: resizing.left,
            top: resizing.top
        };

        this.judgeTouchWrapper(size, 'resize');

        if (size.width < props.minSize[0]) {
            size.width = props.minSize[0];
        }

        if (size.width > props.maxSize[0]) {
            size.width = props.maxSize[0];
        }

        if (size.height < props.minSize[1]) {
            size.height = props.minSize[1];
        }

        if (size.height > props.maxSize[1]) {
            size.height = props.maxSize[1];
        }

        // 尺寸信息存储在resizing中
        this.resizing = size;

        let tmpTop = size.top + size.height;
        if (tmpTop > this.maxTop) {
            this.maxTop = tmpTop;
        }

        this.setState(state, () => {
            judgeUpdate();
            this.freshGroupHeight();
        });
    }

    onResizeEnd = (e) => {
        window.removeEventListener('mouseup', this.onResizeEnd);
        window.removeEventListener('mousemove', this.onResizing);

        let [state, props] = [this.state, this.props];

        let resizing = this.resizing,
            collisionParam = this.collisionParam || {},
            dragList = state.children,
            dragId = this.activeDrag;

        // 重置状态
        this.status = constants.STATUS.BEFORE_IDLE;
        this.activeDrag = null;
        this.resizePos = null;

        for (let i = 0, listL = dragList.length; i < listL; i++) {
            let dragItem = dragList[i].props;
            // 碰撞数据
            if (collisionParam[dragItem.id]) {
                dragItem.style = collisionParam[dragItem.id];
            }

            // 当前resize数据
            if (dragItem.id === dragId) {
                dragItem.style = resizing;
            }
        }

        state.children = dragList;
        // 最后一波更新，包含<无碰撞buffer的位置判断，高度更新，外层容器高度更新>
        this.judgeUpdate(true, dragId);
        this.updateFromCollisionParam();

        this.resizing = undefined;
        this.collisionParam = {};
        this.status = constants.STATUS.IDLE;

        this.setState(state, () => {
            this.freshMaxTop();
            this.freshGroupHeight();
        });

    }

    onDragStart = (e, dragId) => {
        let props = this.props;
        let param = this.getDragItem(dragId);

        this.offset = {
            left: e.clientX - (param.style.left || 0),
            top: e.clientY - (param.style.top || 0)
        };

        window.addEventListener('mousemove', this.onDraging);
        window.addEventListener('mouseup', this.onDragEnd);

        let offset = this.offset;

        this.draging = {
            left: e.clientX - (offset.left || 0),
            top: e.clientY - (offset.top || 0),
            width: param.style.width,
            height: param.style.height
        };

        this.collisionParam = {};

        this.status = constants.STATUS.DRAGING;

        this.activeDrag = dragId;

        // 设置碰撞主元素
        this.collision.setMain(dragId);
        this.edge.setMain(dragId);
    }

    onDraging = (e) => {
        let state = this.state,
            draging = this.draging;

        const offset = this.offset;

        let nextDragingPos = {
            left: e.clientX - (offset.left || 0),
            top: e.clientY - (offset.top || 0),
            width:  draging.width,
            height: draging.height
        };
        
        let tempJudge = this.judgeTouchWrapper(nextDragingPos, 'draging');
        if (tempJudge) {
            nextDragingPos = tempJudge;
        }

        draging.left = nextDragingPos.left;
        draging.top = nextDragingPos.top;

        let tmpTop = draging.top + draging.height;
        if (tmpTop > this.maxTop) {
            this.maxTop = tmpTop;
        }

        this.judgeUpdate();
        this.freshGroupHeight();
    }

    onDragEnd = (e) => {
        window.removeEventListener('mouseup', this.onDragEnd);
        window.removeEventListener('mousemove', this.onDraging);

        let props = this.props,
            state = this.state,
            draging = this.draging,
            collisionParam = this.collisionParam || {},
            dragList = state.children,
            dragId = this.activeDrag;

        // 重置状态
        this.status = constants.STATUS.BEFORE_IDLE;
        this.activeDrag = null;
        
        for (let i = 0, listL = dragList.length; i < listL; i++) {
            let dragItem = dragList[i].props;
            // 碰撞数据
            if (collisionParam[dragItem.id]) {
                dragItem.style = collisionParam[dragItem.id];
            }

            // 当前拖拽数据
            if (dragItem.id === dragId) {
                dragItem.style = draging;
            }
        }

        // 最后一波更新，包含<无碰撞buffer的位置判断，高度更新，外层容器高度更新>
        this.judgeUpdate(true, dragId);

        this.updateFromCollisionParam();
        this.draging = undefined;
        this.collisionParam = {};
        this.status = constants.STATUS.IDLE;

        this.setState(state, () => {
            this.freshMaxTop();
            this.freshGroupHeight();
        });
    }

    render () {
        let state = this.state;

        let dragMods, placeholder, alignVerginLine, alignLevelLine, groupStyle = {};

        if (this.props.children) {
            let children = this.props.children;
            if (!utils.isArray(children)) {
                children = [children];
            }

            dragMods = this.parseDragBase(children);
        }
        

        if (this.status === constants.STATUS.DRAGING) {
            placeholder = <DragPlaceholder  styleObj={this.draging} />;
        }
        else if (this.status === constants.STATUS.RESIZING) {
            placeholder = <DragPlaceholder  styleObj={this.resizing} />;
        }

        if (state.vLine) {
            alignVerginLine = (<DragAlignLine {...state.vLine} dir="vertical" />);
        }

        if (state.lLine) {
            alignLevelLine = (<DragAlignLine {...state.lLine} dir="level" />);
        }

        if (state.groupHeight) {
            groupStyle.height = state.groupHeight;
        }

        return (
            <div className="bdrag-group" ref="dragGoup" style={groupStyle}>
                {dragMods}
                {placeholder}
                {alignVerginLine}
                {alignLevelLine}
            </div>
        );
    }
};

export default DragCore;