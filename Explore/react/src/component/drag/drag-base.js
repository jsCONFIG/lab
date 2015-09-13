import dragActs from '../../action/drag';
import constants from '../../constant/drag';
import parseParam from '../../utils/parse-param';
import DragPlaceholder from './drag-placeholder';
import collisionDetection from '../../utils/collision-detection';

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

        // 展现相关数据
        this.displayData = {
            // 最近一次稳定状态下的展现数据
            stableData: {},

            // 临时状态下的展现数据
            tempData: {}
        };

        this.onDragStart = this.onDragStart.bind(this);

        this.onResizeStart = this.onResizeStart.bind(this);

    }

    onDragStart (e) {
        let props = this.props;
        
        props.onDragStart(e, props.id);
    }

    // 尺寸改变
    onResizeStart (e) {
        let props = this.props;
        
        props.onResizeStart(e, props.id);
    }

    componentDidUpdate () {
        let [state, props] = [this.state, this.props];

        this.setStable = props.setStable;

        // 稳定状态数据更新
        if (this.status === constants.STATUS.IDLE || this.setStable) {
            this.setStable = false;

            this.displayData.stableData = parseParam({
                width: null,
                height: null,
                left: null,
                top: null
            }, props.param.style);
        }

        // 临时状态更新
        else {
            this.displayData.tempData = parseParam({
                width: null,
                height: null,
                left: null,
                top: null
            }, props.param.style);
        }
    }

    // 复原到上一个稳定状态
    backToStable () {
        let props = this.props;

        let stableStyle = this.displayData.stableData;
        dragActs.fetchDrag('update', {
            style: stableStyle,
            id: props.id,
            gid: props.gid
        });
    }

    // 尝试复原到上一个稳定状态
    // 传入其它参考节点的位置，检测回去的Y轴方向是否有东西阻挡
    tryToBack (maps) {
        let styleData = this.displayData;

        let myRange = {
            x: [styleData.tempData.left, styleData.tempData.left + styleData.tempData.width],
            y: [styleData.tempData.top, styleData.tempData.top]
        };
        let collision = new collisionDetection(maps);

        // 未碰撞的情况下复原
        if (!collision.judge(myRange).flag) {
            this.backToStable();
            return true;
        }

        return false;
    }

    componentWillUnmout () {
        window.removeEventListener('mouseup', this.onDragEnd);
        window.removeEventListener('mousemove', this.onDraging);
        window.removeEventListener('mouseup', this.onResizeEnd);
        window.removeEventListener('mousemove', this.onResizing);
    }

    render () {
        let props = this.props;

        let placeholder,
            styleObj = props.param.style;

        return (
            <div className="bdrag-mod" style={styleObj} >
                {this.props.children}
                <span className="bdrag-drag-handle" onMouseDown={this.onDragStart}>|||</span>
                {placeholder}
                <span className="bdrag-resize-handle" onMouseDown={this.onResizeStart}>┘</span>
            </div>
        );
    }
};

export default DragBase;