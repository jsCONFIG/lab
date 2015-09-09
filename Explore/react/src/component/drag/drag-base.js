import dragActs from '../../action/drag';
import constants from '../../constant/drag';
import parseParam from '../../utils/parse-param';
import DragPlaceholder from './drag-placeholder';


/**
 * 单个拖拽组件，考虑到性能，仅在END时提交store，
 * 限制判断交给父级来处理
 */
class DragBase extends React.Component {
    constructor () {
        super();

        this.defaultProps = {
            param: {
                style: parseParam(constants.DEFAULT_PARAMS, {}),
                minSize: [100, 100],
                maxSize: [Infinity, Infinity]
            }
        };

        this.state = {
            style: this.defaultProps.param.style
        };

        this.status = constants.STATUS.IDLE;

        this.offset = {};

        this.onDragStart = this.onDragStart.bind(this);
        this.onDraging = this.onDraging.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);

        this.onResizeStart = this.onResizeStart.bind(this);
        this.onResizing = this.onResizing.bind(this);
        this.onResizeEnd = this.onResizeEnd.bind(this);

        this.beforeUpdate = this.beforeUpdate.bind(this);

    }

    beforeUpdate () {
        let [state, props] = [this.state, this.props];

        props.beforeUpdate(this.status, props.id, state.style);
    }

    onDragStart (e) {
        let props = this.props,
            style = props.param.style;

        this.offset = {
            left: e.clientX - (style.left || 0),
            top: e.clientY - (style.top || 0)
        };

        window.addEventListener('mousemove', this.onDraging);
        window.addEventListener('mouseup', this.onDragEnd);

        // 初始化拖曳state
        let state = this.state,
        offset = this.offset;

        state.style = style;
        state.draging = {
            left: e.clientX - (offset.left || 0),
            top: e.clientY - (offset.top || 0)
        };

        this.beforeUpdate(this.status, props.id, style);

        this.status = constants.STATUS.DRAGING;

        this.setState(state);
    }

    onDraging (e) {
        const offset = this.offset;
        const pos = {
            left: e.clientX - (offset.left || 0),
            top: e.clientY - (offset.top || 0)
        };

        let state = this.state;
        state.draging = pos;

        this.setState(state);
    }

    onDragEnd (e) {
        window.removeEventListener('mouseup', this.onDragEnd);
        window.removeEventListener('mousemove', this.onDraging);

        let props = this.props,
            state = this.state;

        this.status = constants.STATUS.IDLE;

        dragActs.fetchDrag('update', {
            style: parseParam(state.style, state.draging),
            id: props.id,
            gid: props.gid
        });
    }

    // 尺寸改变
    onResizeStart (e) {
        window.addEventListener('mouseup', this.onResizeEnd);
        window.addEventListener('mousemove', this.onResizing);

        let props = this.props,
            param = props.param;

        let state = this.state;

        let style = param.style;
        let size = {
            width: e.clientX - style.left,
            height: e.clientY - style.top
        };

        state.resizing = size;
        state.style = style;

        this.beforeUpdate(this.status, props.id, style);

        this.status = constants.STATUS.RESIZING;
        
        this.setState(state);
    }

    onResizing (e) {
        let props = this.props;
        let param = props.param;

        let state = this.state;
        let style = state.style;
        let size = {
            width: e.clientX - style.left,
            height: e.clientY - style.top
        };

        if (size.width < param.minSize[0]) {
            size.width = param.minSize[0];
        }

        if (size.height < param.minSize[1]) {
            size.height = param.minSize[1];
        }

        // 尺寸信息存储在resizing中
        state.resizing = size;

        this.setState(state);
    }

    onResizeEnd (e) {
        window.removeEventListener('mouseup', this.onResizeEnd);
        window.removeEventListener('mousemove', this.onResizing);

        let [state, props] = [this.state, this.props];
        this.status = constants.STATUS.IDLE;

        let style = parseParam(state.style, state.resizing);

        dragActs.fetchDrag('update', {
            style: style,
            id: props.id,
            gid: props.gid
        });
    }

    componentWillUnmout () {
        window.removeEventListener('mouseup', this.onDragEnd);
        window.removeEventListener('mousemove', this.onDraging);
        window.removeEventListener('mouseup', this.onResizeEnd);
        window.removeEventListener('mousemove', this.onResizing);
    }

    render () {

        let placeholder,
            styleObj = {};

        let [state, props] = [this.state, this.props];

        switch (this.status) {
            // ing状态下，数据来自自身state，
            // 以此来减少反射弧，提高性能
            case constants.STATUS.DRAGING:
                styleObj = state.style;

                let dragingPos = parseParam({
                    width: null,
                    height: null
                }, styleObj);

                // 占位节点位于容器内部，取相对位置
                dragingPos.top = state.draging.top - styleObj.top;
                dragingPos.left = state.draging.left - styleObj.left;

                placeholder = (
                    <DragPlaceholder  styleObj={dragingPos} />
                );

                // 传递值给父级进行碰撞检测
                let judgeParam = parseParam({top: null, left: null}, state.draging);
                judgeParam.width = dragingPos.width;
                judgeParam.height = dragingPos.height;

                props.onUpdate(this.status, props.id, judgeParam);

                break;

            case constants.STATUS.RESIZING:
                styleObj = state.style;
                styleObj = parseParam(styleObj, state.resizing);


                break;

            // 操作完成，走flux来更新
            case constants.STATUS.IDLE:
                styleObj = props.param.style;
                break;
        }

        return (
            <div className="bdrag-mod" style={styleObj} >
                <span className="bdrag-drag-handle" onMouseDown={this.onDragStart}>|||</span>
                {placeholder}
                <span className="bdrag-resize-handle" onMouseDown={this.onResizeStart}>┘</span>
            </div>
        );
    }
};

export default DragBase;