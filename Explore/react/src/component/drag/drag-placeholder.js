import utils from '../../utils/util';

// 虚拟占位节点
class DragPlaceholder extends React.Component {
    constructor () {
        super();
    }

    getStyleParam (param) {
        param = param || this.props;

        let styleObj = utils.merge({
            border: '1px dashed #aaa'
        }, param.styleObj);

        return styleObj;
    }

    render () {
        const styleObj = this.getStyleParam();

        return (
            <div className="bdrag-placeholder-node" style={styleObj}></div>
        );
    }

};

export default DragPlaceholder;