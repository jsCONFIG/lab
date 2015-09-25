// 对齐线节点
class AlignLine extends React.Component {
    constructor () {
        super();
    }

    static defaultProps = {
        dir: 'vertical'
    }

    render () {
        let props = this.props,
            styleObj = props.style || {},
            dir = props.dir === 'vertical' ? 'vertical' : 'level';

        let classStr = `bdrag-align-line ${dir}`;

        return (
            <div className={classStr} style={styleObj}></div>
        );
    }

};

export default AlignLine;