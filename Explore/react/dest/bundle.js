(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/bottleliu/myspace/git/lab/Explore/react/src/action/drag.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatcherDispatcher = require('../dispatcher/dispatcher');

var _dispatcherDispatcher2 = _interopRequireDefault(_dispatcherDispatcher);

var _constantDrag = require('../constant/drag');

var _constantDrag2 = _interopRequireDefault(_constantDrag);

var dragActs = {
    // group操作,act: add, del, update
    fetchGroup: function fetchGroup(act, params) {
        var actType = _constantDrag2['default']['FETCH_DRAG_GROUP_' + act.toUpperCase()];

        if (!actType) {
            return;
        }

        _dispatcherDispatcher2['default'].dispatch(actType, {
            spec: params || {}
        });
    },

    // 单个drag操作
    fetchDrag: function fetchDrag(act, params) {
        var actType = _constantDrag2['default']['FETCH_DRAG_' + act.toUpperCase()];

        if (!actType) {
            return;
        }

        _dispatcherDispatcher2['default'].dispatch(actType, {
            spec: params || {}
        });
    }
};

exports['default'] = dragActs;
module.exports = exports['default'];


},{"../constant/drag":"/Users/bottleliu/myspace/git/lab/Explore/react/src/constant/drag.js","../dispatcher/dispatcher":"/Users/bottleliu/myspace/git/lab/Explore/react/src/dispatcher/dispatcher.js"}],"/Users/bottleliu/myspace/git/lab/Explore/react/src/component/drag/drag-base.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _actionDrag = require('../../action/drag');

var _actionDrag2 = _interopRequireDefault(_actionDrag);

var _constantDrag = require('../../constant/drag');

var _constantDrag2 = _interopRequireDefault(_constantDrag);

var _utilsParseParam = require('../../utils/parse-param');

var _utilsParseParam2 = _interopRequireDefault(_utilsParseParam);

var _dragPlaceholder = require('./drag-placeholder');

var _dragPlaceholder2 = _interopRequireDefault(_dragPlaceholder);

var _utilsCollisionDetection = require('../../utils/collision-detection');

var _utilsCollisionDetection2 = _interopRequireDefault(_utilsCollisionDetection);

/**
 * 单个拖拽组件，考虑到性能，仅在END时提交store，
 * 限制判断交给父级来处理
 */

var DragBase = (function (_React$Component) {
    _inherits(DragBase, _React$Component);

    function DragBase() {
        _classCallCheck(this, DragBase);

        _get(Object.getPrototypeOf(DragBase.prototype), 'constructor', this).call(this);

        this.defaultProps = {
            param: {
                style: (0, _utilsParseParam2['default'])(_constantDrag2['default'].DEFAULT_PARAMS, {}),
                minSize: [100, 100],
                maxSize: [Infinity, Infinity]
            }
        };

        this.state = {
            style: this.defaultProps.param.style
        };

        this.status = _constantDrag2['default'].STATUS.IDLE;

        // 展现相关数据
        this.displayData = {
            // 最近一次稳定状态下的展现数据
            stableData: {},

            // 临时状态下的展现数据
            tempData: {}
        };

        this.onDragStart = this.onDragStart.bind(this);

        this.onResizeStart = this.onResizeStart.bind(this);
        this.onResizing = this.onResizing.bind(this);
        this.onResizeEnd = this.onResizeEnd.bind(this);
    }

    _createClass(DragBase, [{
        key: 'onDragStart',
        value: function onDragStart(e) {
            var props = this.props;

            props.onDragStart(e, props.id);
        }

        // 尺寸改变
    }, {
        key: 'onResizeStart',
        value: function onResizeStart(e) {
            window.addEventListener('mouseup', this.onResizeEnd);
            window.addEventListener('mousemove', this.onResizing);

            var props = this.props,
                param = props.param;

            var state = this.state;

            var style = param.style;
            var size = {
                width: e.clientX - style.left,
                height: e.clientY - style.top
            };

            state.resizing = size;
            state.style = style;

            this.status = _constantDrag2['default'].STATUS.RESIZING;

            this.setState(state);
        }
    }, {
        key: 'onResizing',
        value: function onResizing(e) {
            var props = this.props;
            var param = props.param;

            var state = this.state;
            var style = state.style;
            var size = {
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
    }, {
        key: 'onResizeEnd',
        value: function onResizeEnd(e) {
            window.removeEventListener('mouseup', this.onResizeEnd);
            window.removeEventListener('mousemove', this.onResizing);

            var state = this.state;
            var props = this.props;

            this.status = _constantDrag2['default'].STATUS.IDLE;

            var style = (0, _utilsParseParam2['default'])(state.style, state.resizing);

            _actionDrag2['default'].fetchDrag('update', {
                style: style,
                id: props.id,
                gid: props.gid
            });
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            var state = this.state;
            var props = this.props;

            // 稳定状态数据更新
            if (this.status === _constantDrag2['default'].STATUS.IDLE || props.setStable) {
                props.setStable = false;
                this.displayData.stableData = (0, _utilsParseParam2['default'])({
                    width: null,
                    height: null,
                    left: null,
                    top: null
                }, props.param.style);
            }

            // 临时状态更新
            else {
                    this.displayData.tempData = (0, _utilsParseParam2['default'])({
                        width: null,
                        height: null,
                        left: null,
                        top: null
                    }, props.param.style);
                }
        }

        // 复原到上一个稳定状态
    }, {
        key: 'backToStable',
        value: function backToStable() {
            var props = this.props;

            var stableStyle = this.displayData.stableData;
            _actionDrag2['default'].fetchDrag('update', {
                style: stableStyle,
                id: props.id,
                gid: props.gid
            });
        }

        // 尝试复原到上一个稳定状态
        // 传入其它参考节点的位置，检测回去的Y轴方向是否有东西阻挡
    }, {
        key: 'tryToBack',
        value: function tryToBack(maps) {
            var styleData = this.displayData;

            var myRange = {
                x: [styleData.tempData.left, styleData.tempData.left + styleData.tempData.width],
                y: [styleData.tempData.top, styleData.tempData.top]
            };
            var collision = new _utilsCollisionDetection2['default'](maps);

            // 未碰撞的情况下复原
            if (!collision.judge(myRange).flag) {
                this.backToStable();
                return true;
            }

            return false;
        }
    }, {
        key: 'componentWillUnmout',
        value: function componentWillUnmout() {
            window.removeEventListener('mouseup', this.onDragEnd);
            window.removeEventListener('mousemove', this.onDraging);
            window.removeEventListener('mouseup', this.onResizeEnd);
            window.removeEventListener('mousemove', this.onResizing);
        }
    }, {
        key: 'render',
        value: function render() {

            var placeholder = undefined,
                styleObj = {};

            var state = this.state;
            var props = this.props;

            switch (this.status) {
                // resizing 过程，走自身的state
                case _constantDrag2['default'].STATUS.RESIZING:
                    styleObj = state.style;
                    styleObj = (0, _utilsParseParam2['default'])(styleObj, state.resizing);
                    break;

                // 操作完成，走flux来更新状态链
                case _constantDrag2['default'].STATUS.IDLE:
                    styleObj = props.param.style;
                    break;
            }

            return React.createElement(
                'div',
                { className: 'bdrag-mod', style: styleObj },
                React.createElement(
                    'span',
                    { className: 'bdrag-drag-handle', onMouseDown: this.onDragStart },
                    '|||'
                ),
                placeholder,
                React.createElement(
                    'span',
                    { className: 'bdrag-resize-handle', onMouseDown: this.onResizeStart },
                    '┘'
                )
            );
        }
    }]);

    return DragBase;
})(React.Component);

;

exports['default'] = DragBase;
module.exports = exports['default'];


},{"../../action/drag":"/Users/bottleliu/myspace/git/lab/Explore/react/src/action/drag.js","../../constant/drag":"/Users/bottleliu/myspace/git/lab/Explore/react/src/constant/drag.js","../../utils/collision-detection":"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/collision-detection.js","../../utils/parse-param":"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/parse-param.js","./drag-placeholder":"/Users/bottleliu/myspace/git/lab/Explore/react/src/component/drag/drag-placeholder.js"}],"/Users/bottleliu/myspace/git/lab/Explore/react/src/component/drag/drag-core.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _constantDrag = require('../../constant/drag');

var _constantDrag2 = _interopRequireDefault(_constantDrag);

var _actionDrag = require('../../action/drag');

var _actionDrag2 = _interopRequireDefault(_actionDrag);

var _storeDrag = require('../../store/drag');

var _storeDrag2 = _interopRequireDefault(_storeDrag);

var _dragBase = require('./drag-base');

var _dragBase2 = _interopRequireDefault(_dragBase);

var _dragPlaceholder = require('./drag-placeholder');

var _dragPlaceholder2 = _interopRequireDefault(_dragPlaceholder);

var _utilsMerge = require('../../utils/merge');

var _utilsMerge2 = _interopRequireDefault(_utilsMerge);

var _utilsParseParam = require('../../utils/parse-param');

var _utilsParseParam2 = _interopRequireDefault(_utilsParseParam);

var _utilsCollisionDetection = require('../../utils/collision-detection');

var _utilsCollisionDetection2 = _interopRequireDefault(_utilsCollisionDetection);

var _utilsArrHasKey = require('../../utils/arr-has-key');

var _utilsArrHasKey2 = _interopRequireDefault(_utilsArrHasKey);

var defaultDragParam = {
    minSize: [100, 100],
    maxSize: [Infinity, Infinity]
};

// 根据碰撞参数，得到被碰撞节点应该所在的位置
var getOthersPos = function getOthersPos(suggestItem) {
    return {
        left: suggestItem.x[0],
        top: suggestItem.y[0]
    };
};

/**
 * 管理drag的一个group
 * 需要参数：id, params
 */

var DragCore = (function (_React$Component) {
    _inherits(DragCore, _React$Component);

    function DragCore() {
        _classCallCheck(this, DragCore);

        _get(Object.getPrototypeOf(DragCore.prototype), 'constructor', this).call(this);

        this.state = {
            collision: {}
        };

        this.status = _constantDrag2['default'].STATUS.IDLE;

        // 当前被操作的drag id
        this.activeDrag = null;

        this.offset = {};

        this.onDragStart = this.onDragStart.bind(this);
        this.onDraging = this.onDraging.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.freshData = this.freshData.bind(this);
        this.judgeUpdate = this.judgeUpdate.bind(this);
        this.beforeUpdate = this.beforeUpdate.bind(this);

        // 初始化碰撞检测
        this.collision = new _utilsCollisionDetection2['default']();

        // 辅助ing状态下被碰撞移位节点的复原碰撞检测
        this.helpCollision = new _utilsCollisionDetection2['default']();
    }

    _createClass(DragCore, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            _storeDrag2['default'].on('change', this.freshData);
            var props = this.props;

            _actionDrag2['default'].fetchGroup('add', {
                id: props.id,
                param: props.param
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            _storeDrag2['default'].off('change', this.freshData);
        }

        // 获取合适的位置
    }, {
        key: 'getAdaptPos',
        value: function getAdaptPos() {
            var props = this.props;
            var state = this.state;

            var dragId = this.activeDrag;
        }

        // 用于判断碰撞
    }, {
        key: 'judgeUpdate',
        value: function judgeUpdate() {
            var dragId = this.activeDrag,
                state = this.state,
                style = state.draging,
                status = this.status;

            var myRange = {
                id: dragId,
                x: [style.left, style.left + style.width],
                y: [style.top, style.top + style.height]
            };
            this.collision.updateMap(dragId, myRange);

            var suggestPos = this.collision.getSuggestPos();

            if (suggestPos) {
                this.updateWhenCollision(suggestPos);
            }
        }
    }, {
        key: 'beforeUpdate',
        value: function beforeUpdate(status, dragId, style) {
            this.collision.setMain(dragId);
            this.helpCollision.setMain(dragId);
        }

        // 根据碰撞，更新state
        // 进行时状态下调用
    }, {
        key: 'updateWhenCollision',
        value: function updateWhenCollision(suggestPos) {
            var props = this.props;
            var state = this.state;

            var groupDrags = _storeDrag2['default'].get.group(props.id),
                latestList = {};

            for (var i in groupDrags) {

                if (groupDrags.hasOwnProperty(i)) {

                    var suggestItem = undefined,
                        dragItem = groupDrags[i],
                        copyStyle = (0, _utilsMerge2['default'])({}, dragItem.style),
                        suggestItemPos = (0, _utilsArrHasKey2['default'])(suggestPos, 'id', i);

                    if (suggestItemPos != -1) {
                        suggestItem = suggestPos[suggestItemPos];
                    }

                    if (suggestItem) {
                        var pos = getOthersPos(suggestItem);
                        latestList[dragItem.id] = (0, _utilsMerge2['default'])(copyStyle, pos);
                    } else {
                        latestList[dragItem.id] = copyStyle;
                    }
                }
            }

            state.collision = latestList;

            this.setState(state);
        }
    }, {
        key: 'freshData',
        value: function freshData() {
            var props = this.props;
            var groupDrags = _storeDrag2['default'].get.group(props.id);

            var state = this.state;
            state.group = {
                id: props.id,
                list: groupDrags
            };

            this.setState(state);
        }
    }, {
        key: 'buildDragBase',
        value: function buildDragBase(dragParamList) {
            var props = this.props;
            var state = this.state;

            var drags = [];

            for (var i in dragParamList) {
                if (!dragParamList.hasOwnProperty(i)) {
                    continue;
                }

                var dragParam = dragParamList[i];

                // 拼合默认参数
                var defaultParam = (0, _utilsMerge2['default'])({}, defaultDragParam);
                dragParam = (0, _utilsMerge2['default'])(defaultParam, dragParam);

                var dragStyle = dragParam.style;

                // 进行时
                if (this.status !== _constantDrag2['default'].STATUS.IDLE && state.collision && state.collision[dragParam.id]) {

                    dragStyle = dragParam.style = state.collision[dragParam.id];
                } else {
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

                drags.push(React.createElement(_dragBase2['default'], {
                    key: dragParam.gid + '_' + dragParam.id,
                    param: dragParam,
                    id: dragParam.id,
                    gid: dragParam.gid,
                    onDragStart: this.onDragStart }));
            }

            return drags;
        }
    }, {
        key: 'onDragStart',
        value: function onDragStart(e, dragId) {
            var props = this.props;
            var param = _storeDrag2['default'].get.drag(dragId, props.id);

            this.offset = {
                left: e.clientX - (param.style.left || 0),
                top: e.clientY - (param.style.top || 0)
            };

            window.addEventListener('mousemove', this.onDraging);
            window.addEventListener('mouseup', this.onDragEnd);

            // 初始化拖曳state
            var state = this.state,
                offset = this.offset;

            state.draging = {
                left: e.clientX - (offset.left || 0),
                top: e.clientY - (offset.top || 0),
                width: param.style.width,
                height: param.style.height
            };

            state.collision = {};

            this.status = _constantDrag2['default'].STATUS.DRAGING;

            this.activeDrag = dragId;

            // 设置碰撞主元素
            this.collision.setMain(dragId);

            this.setState(state);
        }
    }, {
        key: 'onDraging',
        value: function onDraging(e) {
            var state = this.state,
                draging = state.draging;

            var offset = this.offset;
            var judgeUpdate = this.judgeUpdate;

            draging.left = e.clientX - (offset.left || 0);
            draging.top = e.clientY - (offset.top || 0);

            this.setState(state, function () {
                judgeUpdate();
            });
        }
    }, {
        key: 'onDragEnd',
        value: function onDragEnd(e) {
            window.removeEventListener('mouseup', this.onDragEnd);
            window.removeEventListener('mousemove', this.onDraging);

            var props = this.props,
                state = this.state,
                draging = state.draging,
                collisionParam = state.collision || {},
                dragList = state.group.list,
                dragId = this.activeDrag;

            // 重置状态
            delete state.draging;
            state.collision = {};
            this.status = _constantDrag2['default'].STATUS.IDLE;
            this.activeDrag = null;

            for (var i in dragList) {
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

            _actionDrag2['default'].fetchGroup('update', {
                id: props.id,
                list: dragList
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var state = this.state;

            var groupParam = state.group;

            var dragMods = undefined,
                placeholder = undefined;

            if (groupParam) {
                dragMods = this.buildDragBase(groupParam.list);
            }

            if (this.status === _constantDrag2['default'].STATUS.DRAGING) {
                placeholder = React.createElement(_dragPlaceholder2['default'], { styleObj: state.draging });
            }

            return React.createElement(
                'div',
                { className: 'bdrag-group' },
                dragMods,
                placeholder
            );
        }
    }]);

    return DragCore;
})(React.Component);

;

exports['default'] = DragCore;
module.exports = exports['default'];


},{"../../action/drag":"/Users/bottleliu/myspace/git/lab/Explore/react/src/action/drag.js","../../constant/drag":"/Users/bottleliu/myspace/git/lab/Explore/react/src/constant/drag.js","../../store/drag":"/Users/bottleliu/myspace/git/lab/Explore/react/src/store/drag.js","../../utils/arr-has-key":"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/arr-has-key.js","../../utils/collision-detection":"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/collision-detection.js","../../utils/merge":"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/merge.js","../../utils/parse-param":"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/parse-param.js","./drag-base":"/Users/bottleliu/myspace/git/lab/Explore/react/src/component/drag/drag-base.js","./drag-placeholder":"/Users/bottleliu/myspace/git/lab/Explore/react/src/component/drag/drag-placeholder.js"}],"/Users/bottleliu/myspace/git/lab/Explore/react/src/component/drag/drag-placeholder.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _utilsMerge = require('../../utils/merge');

var _utilsMerge2 = _interopRequireDefault(_utilsMerge);

// 虚拟占位节点

var DragPlaceholder = (function (_React$Component) {
    _inherits(DragPlaceholder, _React$Component);

    function DragPlaceholder() {
        _classCallCheck(this, DragPlaceholder);

        _get(Object.getPrototypeOf(DragPlaceholder.prototype), 'constructor', this).call(this);
    }

    _createClass(DragPlaceholder, [{
        key: 'getStyleParam',
        value: function getStyleParam(param) {
            param = param || this.props;

            var styleObj = (0, _utilsMerge2['default'])({
                border: '1px dashed #aaa'
            }, param.styleObj);

            return styleObj;
        }
    }, {
        key: 'render',
        value: function render() {
            var styleObj = this.getStyleParam();

            return React.createElement('div', { className: 'bdrag-placeholder-node', style: styleObj });
        }
    }]);

    return DragPlaceholder;
})(React.Component);

;

exports['default'] = DragPlaceholder;
module.exports = exports['default'];


},{"../../utils/merge":"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/merge.js"}],"/Users/bottleliu/myspace/git/lab/Explore/react/src/constant/drag.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var spec = {
    DEFAULT_PARAMS: {
        left: 0,
        top: 0,
        width: 200,
        height: 100
    },
    STATUS: {
        IDLE: 'IDLE',
        DRAGING: 'DRAGING',
        RESIZING: 'RESIZING'
    },
    FETCH_DRAG_GROUP_ADD: 'FETCH_DRAG_GROUP_ADD',
    FETCH_DRAG_GROUP_DEL: 'FETCH_DRAG_GROUP_DEL',
    FETCH_DRAG_GROUP_UPDATE: 'FETCH_DRAG_GROUP_UPDATE',

    FETCH_DRAG_ADD: 'FETCH_DRAG_ADD',
    FETCH_DRAG_DEL: 'FETCH_DRAG_DEL',
    FETCH_DRAG_UPDATE: 'FETCH_DRAG_UPDATE'
};
exports['default'] = spec;
module.exports = exports['default'];


},{}],"/Users/bottleliu/myspace/git/lab/Explore/react/src/dispatcher/dispatcher.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dispatcher = (function (_Flux$Dispatcher) {
    _inherits(Dispatcher, _Flux$Dispatcher);

    function Dispatcher() {
        _classCallCheck(this, Dispatcher);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(Dispatcher.prototype), 'constructor', this).apply(this, args);
    }

    _createClass(Dispatcher, [{
        key: 'dispatch',
        value: function dispatch(type) {
            var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            if (!type) {
                throw new Error('You forgot to specify type.');
            }

            _get(Object.getPrototypeOf(Dispatcher.prototype), 'dispatch', this).call(this, _extends({ type: type }, action));
        }
    }, {
        key: 'dispatchAsync',
        value: function dispatchAsync(promise, types) {
            var _this = this;

            var action = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
            var request = types.request;
            var success = types.success;
            var failure = types.failure;

            this.dispatch(request, action);

            promise.then(function (response) {
                _this.dispatch(success, _extends({}, action, { response: response }));
            }, function (error) {
                _this.dispatch(failure, _extends({}, action, { error: error }));
            });
        }
    }]);

    return Dispatcher;
})(Flux.Dispatcher);

;

exports['default'] = new Dispatcher();
module.exports = exports['default'];


},{}],"/Users/bottleliu/myspace/git/lab/Explore/react/src/main.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _componentDragDragCore = require('./component/drag/drag-core');

var _componentDragDragCore2 = _interopRequireDefault(_componentDragDragCore);

var Main = (function (_React$Component) {
    _inherits(Main, _React$Component);

    function Main() {
        _classCallCheck(this, Main);

        _get(Object.getPrototypeOf(Main.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Main, [{
        key: 'render',
        value: function render() {
            var drags = [{
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
            return React.createElement(_componentDragDragCore2['default'], { id: '123456', param: drags });
        }
    }]);

    return Main;
})(React.Component);

;

var element = document.getElementById('wrapper');
React.render(React.createElement(Main), element);


},{"./component/drag/drag-core":"/Users/bottleliu/myspace/git/lab/Explore/react/src/component/drag/drag-core.js"}],"/Users/bottleliu/myspace/git/lab/Explore/react/src/store/drag.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatcherDispatcher = require('../dispatcher/dispatcher');

var _dispatcherDispatcher2 = _interopRequireDefault(_dispatcherDispatcher);

var _utilsStore = require('../utils/store');

var _utilsStore2 = _interopRequireDefault(_utilsStore);

var _constantDrag = require('../constant/drag');

var _constantDrag2 = _interopRequireDefault(_constantDrag);

var _utilsArrHasKey = require('../utils/arr-has-key');

var _utilsArrHasKey2 = _interopRequireDefault(_utilsArrHasKey);

var _utilsMerge = require('../utils/merge');

var _utilsMerge2 = _interopRequireDefault(_utilsMerge);

var dragGroup = {};

// 增操作
var add = {
    // 创建拖拽组，屏蔽组外其它组件的干扰
    group: function group(gid, params) {
        if (!dragGroup[gid]) {
            dragGroup[gid] = {};
        }

        // 有初始化数据到group
        if (params) {
            var groupDragList = dragGroup[gid];
            if (!params instanceof Array) {
                params = [params];
            }

            for (var i = 0, listL = params.length; i < listL; i++) {
                var dragItem = params[i];

                // 做一个ID重复检测，有重复的ID则忽略
                // 强制更新使用对应的更新方法
                if (dragItem && dragItem.id) {

                    if (groupDragList.hasOwnProperty(dragItem.id)) {
                        break;
                    }

                    // 增加gid参数
                    dragItem.gid = gid;

                    groupDragList[dragItem.id] = dragItem;
                }
            }
        }
    },

    // 追加Drag到组内
    drag: function drag(param) {
        if (!param || !param.gid || !param.id || !dragGroup[param.gid]) {
            return false;
        }

        var myGroup = dragGroup[param.gid];

        // 强制使用对应的更新方法执行更新
        if (myGroup.hasOwnProperty(param.id)) {
            return;
        }

        myGroup[param.id] = param;
    }
};

// 删操作
var del = {
    group: function group(groupId) {},

    drag: function drag(dragId) {}
};

// 改操作
var update = {
    // 更新对应的组的参数
    // 直接替换
    group: function group(params, gid) {
        var myGroup = dragGroup[gid];
        if (myGroup) {
            for (var i in myGroup) {
                if (myGroup.hasOwnProperty(i) && params[i]) {
                    myGroup[i] = params;
                }
            }

            return myGroup;
        }

        return false;
    },

    // 更新对应Drag的参数
    drag: function drag(param) {
        if (!param || !param.gid || !param.id || !dragGroup[param.gid]) {
            return false;
        }

        var myGroup = dragGroup[param.gid];

        if (!myGroup || !myGroup.hasOwnProperty(param.id)) {
            return;
        }

        var myDrag = myGroup[param.id];

        myGroup[param.id] = (0, _utilsMerge2['default'])(myDrag, param);
    }
};

// 查操作
var get = {
    group: function group(gid) {
        if (!gid || !dragGroup[gid]) {
            return null;
        }

        return dragGroup[gid];
    },

    drag: function drag(dragId, gid) {
        if (!dragId || !gid || !dragGroup[gid]) {
            return null;
        }

        var myGroup = dragGroup[gid];

        if (!myGroup.hasOwnProperty(dragId)) {
            return null;
        }

        return myGroup[dragId];
    }
};

var dragStore = _utilsStore2['default'].createStore({
    get: get
});

dragStore.dispatch = _dispatcherDispatcher2['default'].register(function (action) {
    var spec = action.spec;
    switch (action.type) {
        // drag新增
        case _constantDrag2['default'].FETCH_DRAG_ADD:
            add.drag(spec);
            break;

        // drag删除
        case _constantDrag2['default'].FETCH_DRAG_DEL:
            break;

        // drag更新
        case _constantDrag2['default'].FETCH_DRAG_UPDATE:
            update.drag(spec);
            break;

        // drag group新增
        case _constantDrag2['default'].FETCH_DRAG_GROUP_ADD:
            add.group(spec.id, spec.param);
            break;

        // drag group删除
        case _constantDrag2['default'].FETCH_DRAG_GROUP_DEL:
            break;

        // drag group更新
        case _constantDrag2['default'].FETCH_DRAG_GROUP_UPDATE:
            update.group(spec.id, spec.list);
            break;
    }

    dragStore.emit('change');
});

exports['default'] = dragStore;
module.exports = exports['default'];


},{"../constant/drag":"/Users/bottleliu/myspace/git/lab/Explore/react/src/constant/drag.js","../dispatcher/dispatcher":"/Users/bottleliu/myspace/git/lab/Explore/react/src/dispatcher/dispatcher.js","../utils/arr-has-key":"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/arr-has-key.js","../utils/merge":"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/merge.js","../utils/store":"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/store.js"}],"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/arr-has-key.js":[function(require,module,exports){
/**
 * 检测某个对象元素构成的数组中
 * 是否有某个key为给定值
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var arrHasKey = function arrHasKey(arr, keyName, theVal) {
    if (!arr instanceof Array) {
        return -1;
    }

    var flag = -1;

    for (var i = 0, arrL = arr.length; i < arrL; i++) {
        var item = arr[i];

        if (item && item[keyName] === theVal) {
            flag = i;
            break;
        }
    }

    return flag;
};

exports["default"] = arrHasKey;
module.exports = exports["default"];


},{}],"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/collision-detection.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _arrHasKey = require('./arr-has-key');

var _arrHasKey2 = _interopRequireDefault(_arrHasKey);

/**
 * 碰撞检测，纯数据
 */
/**
 * 工具方法集
 * @type {Object}
 */
var _utils = {};

/**
 * 核心判断方法
 * @return {Boolean}    [description]
 */
_utils.judgeCore = function (aRange, bRange) {
    var buffer = arguments.length <= 2 || arguments[2] === undefined ? [0, 0] : arguments[2];

    // (aMaxX < bMinX || aMinX > bMaxX || aMaxY < bMinY || aMinY > bMaxY)

    var flag = !(aRange.x[1] - buffer[0] <= bRange.x[0] || aRange.x[0] + buffer[0] >= bRange.x[1] || aRange.y[1] - buffer[1] <= bRange.y[0] || aRange.y[0] + buffer[1] >= bRange.y[1]);

    // 撞击的情况，返回撞击程度
    // 即两者交叉部分的距离
    if (flag) {
        flag = {
            x: aRange.x[0] < bRange.x[0] && bRange.x[0] < aRange.x[1] ? aRange.x[1] - bRange.x[0] : bRange.x[1] - aRange.x[0],
            y: aRange.y[0] < bRange.y[0] && bRange.y[0] < aRange.y[1] ? aRange.y[1] - bRange.y[0] : bRange.y[1] - aRange.y[0],
            aRange: aRange,
            bRange: bRange
        };
    }
    return flag;
};

/**
 * 批量判断
 * @param  {[type]} aRange [description]
 * @param  {[type]} bMaps  [description]
 * @return {[type]}        [description]
 */
_utils.judgeBatch = function (aRange, bMaps, skipId, buffer) {
    var resultList = {};
    var result = false;
    var i = 0;
    var mapL = bMaps.length;

    for (; i < mapL; i++) {
        var mapItem = bMaps[i],
            mapId = mapItem.id;

        // 忽略点默认未碰撞
        if (mapId === skipId) {
            resultList[mapId] = false;
            continue;
        }

        var flag = _utils.judgeCore(aRange, mapItem, buffer);
        resultList[mapId] = flag;

        if (flag) {
            result = true;
        }
    }

    return {
        list: resultList,
        flag: result
    };
};

_utils.keepNoCollision = function (maps) {
    // 按y起点升序排列
    maps = maps.slice(0).sort(function (aMap, bMap) {
        return aMap.y[0] > bMap.y[0] ? 1 : -1;
    });

    var hasCollision = false;

    for (var i = 0, mapNum = maps.length; i < mapNum; i++) {
        var map = maps[i];
        map = {
            id: map.id,
            x: map.x.slice(0),
            y: map.y.slice(0)
        };

        var judgeResult = _utils.judgeBatch(map, maps, map.id);
        if (hasCollision = judgeResult.flag) {
            var resultList = judgeResult.list;

            for (var j = i; j < mapNum; j++) {
                var nextMap = maps[j];

                // 表示有碰撞
                if (resultList[nextMap.id]) {
                    var offsetY = map.y[1] - nextMap.y[0];
                    nextMap.y = [nextMap.y[0] + offsetY, nextMap.y[1] + offsetY];
                }
            }
        }
    }

    if (hasCollision) {
        return _utils.keepNoCollision(maps);
    }

    return maps;
};

/**
 * 获取建议的非碰撞情况下的map列表
 * @param  {[type]} maps      [description]
 * @param  {[type]} activeMap [description]
 * @return {[type]}           [description]
 */
_utils.getSuggest = function (maps, activeMap) {
    maps = maps.slice(0);
    var resultMaps = [];

    // 先确保activeMap的位置没被占用
    var judgeResult = _utils.judgeBatch(activeMap, maps);

    if (judgeResult.flag) {
        var resultList = judgeResult.list;

        for (var i = 0, mapNum = maps.length; i < mapNum; i++) {
            var map = maps[i];

            // 占用了active节点时，全部下移到active节点之下
            // 给active节点腾出位置来
            if (resultList[map.id]) {
                var offsetY = activeMap.y[1] - map.y[0];
                map.y = [map.y[0] + offsetY, map.y[1] + offsetY];
            }
        }
    }

    // 再保证其它节点不重叠
    resultMaps = _utils.keepNoCollision(maps);

    return resultMaps;
};

/**
 * 碰撞检测构造函数
 * @param {[type]} maps 参考节点Map
 * [{x: [0, 100], y: [0, 100]}, id: mapId]
 */
var Collision = function Collision(maps) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    this.map = maps || [];
    this.bufferX = opts.bufferX || 0;
    this.bufferY = opts.bufferY || 0;
};

/**
 * 设置缓冲判断
 * @param {[type]} bufferX [description]
 * @param {[type]} bufferY [description]
 */
Collision.prototype.setBuffer = function (bufferX, bufferY) {
    this.bufferX = bufferX || 0;
    this.bufferY = bufferY || 0;
};

/**
 * 设置map里当前的“主角”， 
 * 实质为待判断的map
 */
Collision.prototype.setMain = function (id) {
    var pos = (0, _arrHasKey2['default'])(this.map, 'id', id);

    this.lead = id;

    return this;
};

/**
 * 判断碰撞
 * @param  {[type]} myRange {x: [minX, maxX], y: [minY, maxY]}
 * @return {[type]}      [description]
 */
Collision.prototype.judge = function (myRange) {
    var self = this;

    var result = undefined;
    if (!this.map.length) {
        result = {
            list: [],
            flag: false
        };
    }
    result = _utils.judgeBatch(myRange, this.map, this.lead, [this.bufferX, this.bufferY]);

    return result;
};

Collision.prototype.updateMap = function (mid, map) {
    var pos = (0, _arrHasKey2['default'])(this.map, 'id', mid);

    if (pos === -1) {
        return false;
    }

    this.map.splice(pos, 1, map);
    return true;
};

Collision.prototype.addMap = function (map) {
    if (map && map.hasOwnProperty('id')) {
        var pos = (0, _arrHasKey2['default'])(this.map, 'id', map.id);

        if (pos !== -1) {
            this.updateMap(map.id, map);
            return this;
        }

        this.map.push(map);
    }
    return this;
};

// 对map进行排序
Collision.prototype.sortMap = function (byWhat, isDesc) {
    if (byWhat === undefined) byWhat = 'y';

    var maps = this.map;

    maps.sort(function (mapA, mapB) {
        return (isDesc ? -1 : 1) * (mapA[byWhat][0] > mapB[byWhat][0] ? 1 : -1);
    });
    return this;
};

/**
 * 碰撞状况下，获取建议的位置
 * 以lead参数为基准
 * @param {object} judgeParam 碰撞判断参数，不填则实时获取
 * @return {[type]}                [description]
 */
Collision.prototype.getSuggestPos = function (judgeParam) {
    if (!judgeParam) {
        var pos = (0, _arrHasKey2['default'])(this.map, 'id', this.lead);
        if (pos === -1) {
            return false;
        }
        judgeParam = this.judge(this.map[pos]);
    }

    if (!judgeParam.flag) {
        return false;
    }

    var mapCopy = [],
        activeMap = undefined,
        maps = this.map;

    for (var i = 0, mapL = maps.length; i < mapL; i++) {
        var mapItem = maps[i];

        if (mapItem.id === this.lead) {
            activeMap = mapItem;
        } else {
            mapCopy.push(mapItem);
        }
    }

    return _utils.getSuggest(mapCopy, activeMap);
};

exports['default'] = Collision;
module.exports = exports['default'];


},{"./arr-has-key":"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/arr-has-key.js"}],"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/merge.js":[function(require,module,exports){
/**
 * 对象合并，影响源
 * @param  {[type]} rootObj   [description]
 * @param  {[type]} newObj    [description]
 * @return {[type]}           [description]
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var merge = function merge() {
    var rootObj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var newObj = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    for (var i in newObj) {
        if (newObj.hasOwnProperty(i)) {
            rootObj[i] = newObj[i];
        }
    }

    return rootObj;
};

exports["default"] = merge;
module.exports = exports["default"];


},{}],"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/parse-param.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var parseParam = function parseParam(rootObj, newObj, isNumParse) {
    if (newObj === undefined) newObj = {};

    var tempObj = {};

    for (var i in rootObj) {
        tempObj[i] = rootObj[i];

        if (i in newObj) {
            var temp = newObj[i];
            var parseVal = parseFloat(temp, 10);

            if (isNumParse && !isNaN(parseVal)) {
                temp = parseVal;
            }

            tempObj[i] = temp;
        }
    }
    return tempObj;
};

exports["default"] = parseParam;
module.exports = exports["default"];


},{}],"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/store.js":[function(require,module,exports){
// store util

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var storeUtil = {
    createParam: function createParam(obj) {
        var param = '';

        for (var key in obj) {
            param += '&' + key + '=' + obj[key];
        }

        return param.slice(1);
    },

    mergeParam: function mergeParam(conditions, param) {
        for (var key in conditions) {
            if (conditions[key]) {
                param[key] = conditions[key];
            } else {
                delete param[key];
            }
        }

        return this.createParam(param);
    },

    createStore: function createStore(methods) {
        var name = undefined;

        var Store = (function (_EventEmitter) {
            _inherits(Store, _EventEmitter);

            function Store() {
                _classCallCheck(this, Store);

                _get(Object.getPrototypeOf(Store.prototype), 'constructor', this).apply(this, arguments);
            }

            return Store;
        })(EventEmitter);

        ;

        for (name in methods) {
            Store.prototype[name] = methods[name];
        }

        return new Store();
    }
};

exports['default'] = storeUtil;
module.exports = exports['default'];


},{}]},{},["/Users/bottleliu/myspace/git/lab/Explore/react/src/main.js"])


//# sourceMappingURL=bundle.js.map