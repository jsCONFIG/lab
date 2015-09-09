import merge from '../../utils/merge';

// 虚拟占位节点
class DragPlaceholder extends React.Component {
    constructor () {
        super();
    }

    getStyleParam (param) {
        param = param || this.props;

        let styleObj = merge({
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