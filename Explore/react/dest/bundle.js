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

        this.offset = {};

        this.onDragStart = this.onDragStart.bind(this);
        this.onDraging = this.onDraging.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);

        this.onResizeStart = this.onResizeStart.bind(this);
        this.onResizing = this.onResizing.bind(this);
        this.onResizeEnd = this.onResizeEnd.bind(this);
    }

    _createClass(DragBase, [{
        key: 'onDragStart',
        value: function onDragStart(e) {
            var props = this.props,
                style = props.param.style;

            this.offset = {
                left: e.clientX - (style.left || 0),
                top: e.clientY - (style.top || 0)
            };

            window.addEventListener('mousemove', this.onDraging);
            window.addEventListener('mouseup', this.onDragEnd);

            this.status = _constantDrag2['default'].STATUS.DRAGING;

            // 初始化拖曳state
            var state = this.state,
                offset = this.offset;

            state.style = style;
            state.draging = {
                left: e.clientX - (offset.left || 0),
                top: e.clientY - (offset.top || 0)
            };

            this.setState(state);
        }
    }, {
        key: 'onDraging',
        value: function onDraging(e) {
            var offset = this.offset;
            var pos = {
                left: e.clientX - (offset.left || 0),
                top: e.clientY - (offset.top || 0)
            };

            var state = this.state;
            state.draging = pos;

            this.setState(state);
        }
    }, {
        key: 'onDragEnd',
        value: function onDragEnd(e) {
            window.removeEventListener('mouseup', this.onDragEnd);
            window.removeEventListener('mousemove', this.onDraging);

            var props = this.props,
                state = this.state;

            this.status = _constantDrag2['default'].STATUS.IDLE;

            _actionDrag2['default'].fetchDrag('update', {
                style: (0, _utilsParseParam2['default'])(state.style, state.draging),
                id: props.id,
                gid: props.gid
            });
        }

        // 尺寸改变
    }, {
        key: 'onResizeStart',
        value: function onResizeStart(e) {
            window.addEventListener('mouseup', this.onResizeEnd);
            window.addEventListener('mousemove', this.onResizing);
            this.status = _constantDrag2['default'].STATUS.RESIZING;

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

            var state = this.state,
                props = this.props;

            switch (this.status) {
                // ing状态下，数据来自自身state，
                // 以此来减少反射弧，提高性能
                case _constantDrag2['default'].STATUS.DRAGING:
                    styleObj = state.style;

                    var dragingPos = (0, _utilsParseParam2['default'])({
                        width: null,
                        height: null
                    }, styleObj);

                    // 占位节点位于容器内部，取相对位置
                    dragingPos.top = state.draging.top - styleObj.top;
                    dragingPos.left = state.draging.left - styleObj.left;

                    placeholder = React.createElement(_dragPlaceholder2['default'], { styleObj: dragingPos });

                    break;

                case _constantDrag2['default'].STATUS.RESIZING:
                    styleObj = state.style;
                    styleObj = (0, _utilsParseParam2['default'])(styleObj, state.resizing);

                    break;

                // 操作完成，走flux来更新
                case _constantDrag2['default'].STATUS.IDLE:
                    styleObj = props.param.style;
                    break;
            }

            // 传递值给父级
            props.onUpdate(this.status, props.id, styleObj);

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


},{"../../action/drag":"/Users/bottleliu/myspace/git/lab/Explore/react/src/action/drag.js","../../constant/drag":"/Users/bottleliu/myspace/git/lab/Explore/react/src/constant/drag.js","../../utils/parse-param":"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/parse-param.js","./drag-placeholder":"/Users/bottleliu/myspace/git/lab/Explore/react/src/component/drag/drag-placeholder.js"}],"/Users/bottleliu/myspace/git/lab/Explore/react/src/component/drag/drag-core.js":[function(require,module,exports){
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

var _storeDrag = require('../../store/drag');

var _storeDrag2 = _interopRequireDefault(_storeDrag);

var _dragBase = require('./drag-base');

var _dragBase2 = _interopRequireDefault(_dragBase);

var _dragPlaceholder = require('./drag-placeholder');

var _dragPlaceholder2 = _interopRequireDefault(_dragPlaceholder);

var _utilsMerge = require('../../utils/merge');

var _utilsMerge2 = _interopRequireDefault(_utilsMerge);

var defaultDragParam = {
    minSize: [100, 100],
    maxSize: [Infinity, Infinity]
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

        this.state = {};

        this.freshData = this.freshData.bind(this);
        this.onDragUpdate = this.onDragUpdate.bind(this);
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

        // 用于判断碰撞
    }, {
        key: 'onDragUpdate',
        value: function onDragUpdate(act, dragId, style) {}
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
            var drags = [];
            for (var i = 0, dragNum = dragParamList.length; i < dragNum; i++) {
                var dragParam = dragParamList[i];

                // 拼合默认参数
                var defaultParam = (0, _utilsMerge2['default'])({}, defaultDragParam);
                dragParam = (0, _utilsMerge2['default'])(defaultParam, dragParam);

                drags.push(React.createElement(_dragBase2['default'], { key: i, param: dragParam, id: dragParam.id, gid: dragParam.gid, onUpdate: this.onDragUpdate }));
            }

            return drags;
        }
    }, {
        key: 'render',
        value: function render() {
            var state = this.state;

            var groupParam = state.group;

            var dragMods = undefined;

            if (groupParam) {
                dragMods = this.buildDragBase(groupParam.list);
            }

            return React.createElement(
                'div',
                { className: 'bdrag-group' },
                dragMods
            );
        }
    }]);

    return DragCore;
})(React.Component);

;

exports['default'] = DragCore;
module.exports = exports['default'];


},{"../../action/drag":"/Users/bottleliu/myspace/git/lab/Explore/react/src/action/drag.js","../../store/drag":"/Users/bottleliu/myspace/git/lab/Explore/react/src/store/drag.js","../../utils/merge":"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/merge.js","./drag-base":"/Users/bottleliu/myspace/git/lab/Explore/react/src/component/drag/drag-base.js","./drag-placeholder":"/Users/bottleliu/myspace/git/lab/Explore/react/src/component/drag/drag-placeholder.js"}],"/Users/bottleliu/myspace/git/lab/Explore/react/src/component/drag/drag-placeholder.js":[function(require,module,exports){
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
            dragGroup[gid] = [];
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
                    var pos = (0, _utilsArrHasKey2['default'])(groupDragList, 'id', dragItem.id);

                    if (pos != -1) {
                        break;
                    }

                    // 增加gid参数
                    dragItem.gid = gid;

                    groupDragList.push(dragItem);
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

        var pos = (0, _utilsArrHasKey2['default'])(myGroup, 'id', param.id);

        // 强制使用对应的更新方法执行更新
        if (pos != -1) {
            return;
        }

        myGroup.push(param);
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
    group: function group(param, groupId) {},

    // 更新对应Drag的参数
    drag: function drag(param) {
        if (!param || !param.gid || !param.id || !dragGroup[param.gid]) {
            return false;
        }

        var myGroup = dragGroup[param.gid];

        var pos = (0, _utilsArrHasKey2['default'])(myGroup, 'id', param.id);

        // 强制使用对应的更新方法执行更新
        if (pos == -1) {
            return;
        }

        var myDrag = myGroup[pos];

        (0, _utilsMerge2['default'])(myDrag, param);
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

        var pos = (0, _utilsArrHasKey2['default'])(myGroup, 'id', dragId);

        if (pos === -1) {
            return null;
        }

        return myGroup[pos];
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
            update.group(spec);
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


},{}],"/Users/bottleliu/myspace/git/lab/Explore/react/src/utils/merge.js":[function(require,module,exports){
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