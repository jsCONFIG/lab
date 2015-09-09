import DragCore from './component/drag/drag-core';

class Main extends React.Component {
    render () {
        let drags = [{
            id: '1',
            gid: 123456,
            style: {
                width: 200,
                height: 100,
                top: 100,
                left: 0
            }
        }, {
            id: '2',
            gid: 123456,
            style: {
                width: 200,
                height: 100,
                top: 200,
                left: 0
            }
        }, {
            id: '3',
            gid: 123456,
            style: {
                width: 200,
                height: 100,
                top: 300,
                left: 0
            }
        }, {
            id: '4',
            gid: 123456,
            style: {
                width: 200,
                height: 100,
                top: 400,
                left: 0
            }
        }];
        return (
            <DragCore id={'123456'} param={drags}></DragCore>
        );
    }
};

const element = document.getElementById('wrapper');
React.render(React.createElement(Main), element);