import Drag from './component/drag/drag';

class Main extends React.Component {
    render () {
        let style = {
            width: 200,
            height: 100,
            top: 400,
            left: 0
        };
        return (
            <Drag.Mod>
                <Drag.Parse id="1" style={style}>
                    <div>啦啦啦</div>
                </Drag.Parse>
                <Drag.Parse id="2" style={style}>
                    <div>啦啦啦啦</div>
                </Drag.Parse>
                <Drag.Parse id="3" style={style}>
                    <div>啦啦啦啦啦</div>
                </Drag.Parse>
            </Drag.Mod>
        );
    }
};

const element = document.getElementById('wrapper');
React.render(React.createElement(Main), element);