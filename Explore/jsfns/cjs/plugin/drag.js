/*
 * 鼠标拖曳行为
 */
CJS.Import('evt.event');
CJS.Import('dom.getClosest');
CJS.register('plugin.drag', function ($, conf) {
    var config = $.FUNCS.parseObj({
        'attrName'      : 'action-type',
        'dragWrapper'   : 'dragWrapper',
        'dragHand'      : 'dragHand',
        'rootNode'      : document.body,
        'bufferTime'    : 10,
        'dragStart'     : function () {},
        'dragEnd'       : function () {},
        'dragging'      : function () {}
    }, conf || {}, true);

    var $evt, $funcs, $getClosest;
    var that = {},
        mask,
        posStyleCache,
        // rowStyleCache, 
        relativePos,
        targetPos,
        agentObj,
        target;

    // 短方法名 
    var shortName = function () {
        $evt        = $.logic.evt.event;
        $funcs      = $.FUNCS;
        $getClosest = $.logic.dom.getClosest;
        $get        = $.logic.dom.get;
    };

    // 环境初始化
    var contextInit = function () {
        agentObj = $evt.agentEvt(config.rootNode, config);
    };

    // 功能组件
    var PLUGINS = {
        // 节点位置
        'nodePos': function (node) {
            return {
                'l': node.offsetLeft,
                't': node.offsetTop
            };
        },
        // 鼠标相对节点位置
        'mouseNodePos': function (node, spec) {
            var nodePos = PLUGINS.nodePos(node);
            return {
                'l': spec.l - nodePos.l,
                't': spec.t - nodePos.t
            }
        },
        // 节点初始初始化
        'start': function (node) {
            posStyleCache = node.style.position;
            (posStyleCache != 'absolute') && (node.style.position = 'absolute');
        },
        // 节点复原
        'end': function (node) {
            node.style.position = posStyleCache;
        },
        // 设置节点位置
        'setPos': function (node, posObj) {
            node.style.top = posObj.t + 'px';
            node.style.left = posObj.l + 'px';
        },
        'bufferClock': undefined,
        'buffer': function (func) {
            if (PLUGINS.bufferClock) {
                return;
            }
            PLUGINS.bufferClock = setTimeout(function () {
                func();
                PLUGINS.bufferClock = undefined;
            }, config.bufferTime);
        },
        'ctrlMask': function (key) {
            if(!mask){
                var temp = document.createElement('div');
                temp.innerHTML = '<div style="top:0;left:0;width:100%;height:100%;position:fixed;background-color:#000000;opacity:0;filter:alpha(opacity=0);"></div>'
                mask = temp.childNodes[0];
                document.body.appendChild(mask);
            }
            !key && (mask.style.display = 'none');
            key && (mask.style.display = 'block');
        }
    };

    // 鼠标事件
    var EVENTS = {
        'mouseDown': function (spec) {
            $evt.custEvt.fire(that, 'start', spec);
            agentObj.remove('*', 'mousemove', EVENTS.mouseMove);
            agentObj.add('*', 'mousemove', EVENTS.mouseMove);
        },
        'mouseMove': function (spec) {
            PLUGINS.buffer(function () {
                $evt.custEvt.fire(that, 'dragging', spec);
            });
        },
        'mouseUp': function (spec) {
            agentObj.remove('*', 'mousemove', EVENTS.mouseMove);
            $evt.custEvt.fire(that, 'end', spec);
        }
    };

    // 拖曳行为
    var ACTIONS = {
        'start': function (spec) {
            config.dragStart(spec);
            target = $getClosest(spec.el, '[' + config.attrName + '=' + config.dragWrapper + ']') || spec.el;
            PLUGINS.start(target);
            PLUGINS.ctrlMask(true);
            var boxZ = target.style.zIndex ? parseInt(target.style.zIndex) : 0;
            mask.style.zIndex = boxZ + 1;
            target.style.zIndex = boxZ + 2;
            relativePos = PLUGINS.mouseNodePos(target, spec);
            document.body.style.cursor = 'move';
        },
        'end': function (spec) {
            document.body.style.cursor = 'auto';
            PLUGINS.end(target);
            var boxZ = target.style.zIndex ? parseInt(target.style.zIndex) : 0;
            target.style.zIndex = boxZ - 2;
            mask.style.zIndex = boxZ - 2;
            PLUGINS.ctrlMask(false);
            config.dragEnd(spec);
        },
        'dragging': function (spec) {
            config.dragging(target);
            targetPos = {
                'l': spec.l - relativePos.l,
                't': spec.t - relativePos.t
            };
            PLUGINS.setPos(target, targetPos);
        }
    };

    var evtBind = function () {
        $evt.custEvt.add(that, 'start', ACTIONS.start);
        $evt.custEvt.add(that, 'end', ACTIONS.end);
        $evt.custEvt.add(that, 'dragging', ACTIONS.dragging);
        agentObj.add(config.dragHand, 'mousedown', EVENTS.mouseDown);
        agentObj.add(config.dragHand, 'mouseup', EVENTS.mouseUp);
    };

    var init = function () {
        shortName();
        contextInit();
        evtBind();
    };
    init();

    that.destroy = function () {
        agentObj.destroy();
        $evt.custEvt.destroy(that);
    };
    return that;
});