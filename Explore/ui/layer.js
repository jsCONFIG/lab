/**
 * ui组件，layer，简单的黑底白字层
 * @return {[type]}    [description]
 */
var ubase = require('./base.js');
var $T = require('./expand.js');

var TEMP = {
    LAYER: ['',
        '<div class="layer_txt" id="#{id}" >',
            '<p class="main" data-node="_uiContent">#{msg}</p>',
        '</div>'].join('')
};

// 无序存储所有layer
var layerLib = {};

// 分类有序存储各类型layer
var layerList = {};

// 创建一个layer层
var createLayer = function (id, msg, conf) {
    var cf = $T.parseParam({
        template: TEMP.LAYER,
        container: 'body',
        onClose: $T.emptyFn,
        // 初始化层的回调
        onInit: $T.emptyFn,
        // 点击关闭时是否保持(隐藏还是移除)
        closeKeep: false,
        // 是否保证一个页面只有一个layer，填写该值则表示以该值进行分类，做唯一化
        uniLayerKey: undefined,
        // 在uniLayerKey有值的情况下，是否翻转展示顺序，
        // 默认展示顺序为 先调用的先展示，后调用的后展示
        reversOrder: false
    }, conf);

    var uObj;
    if (uObj = layerLib[id]) {
        uObj.setContent(msg);
        return layerLib[id];
    }

    var idStr = id || '_ui_layer_' + $T.unikey(),
        layerType;

    var cNd = cf.container;

    var layerStr = $T.strReplace(cf.template, {
        id: idStr,
        msg: msg || ''
    });

    var nd = $(layerStr);
    $(cNd).append(nd);

    // 关闭层
    nd.delegate('[data-act=close]', 'click', function (e) {
        uObj.wantHide();
    });

    // 实例对象
    uObj = ubase(nd[0]);
    uObj.id = idStr;
    uObj.contentNd = nd.find('[data-node=_uiContent]');

    // 根据closeKeep参数，执行相关隐藏/删除操作
    uObj.wantHide = function () {
        var fnName = 'remove';
        if (cf.closeKeep) {
            fnName = 'hide';
        }

        uObj[fnName]();

        if (layerType && layerType.length) {

            // 如果反转，则在上一个隐藏之后，显示倒数第二加入的，
            // 否则，展示最开始加入的
            layerType[cf.reversOrder ? 'pop' : 'shift']();
            if (layerType.length) {
                layerType[cf.reversOrder ? (layerType.length - 1) : 0].show(undefined, true);
            }
        }

        cf.onClose(uObj);

    };

    // 使位置在容器的中间，封装beside
    uObj.makeCenter = function (offsetL, offsetT) {
        uObj.beside($(cf.container)[0], {
            align: 'cm',
            offsetL: offsetL,
            offsetT: offsetT
        });
    };

    // 删除
    uObj.remove = function () {
        var self = this;
        self.destroy();
        delete layerLib[self.id];
    };

    // 设置内容
    uObj.setContent = function (msgStr) {
        var self = this;
        self.contentNd.html(msgStr);
    };

    layerLib[idStr] = uObj;

    // 相关初始工作已完成，执行回调
    cf.onInit(uObj);

    // 保障页面同时刻某类型弹层只出现一个
    if (cf.uniLayerKey) {
        // 存储
        !layerList[cf.uniLayerKey] && (layerList[cf.uniLayerKey] = []);
        layerType = layerList[cf.uniLayerKey];

        layerType.push(uObj);

        // 如果反转，则将前一个隐藏
        if (cf.reversOrder && layerType.length >= 2) {
            layerType[layerType.length - 2].hide(undefined, true);
        }
        else {
            uObj.hide(undefined, true);
        }

        layerType[cf.reversOrder ? (layerType.length - 1) : 0 ].show(undefined, true);
    }
    return uObj;
};

module.exports = {
    set: createLayer,
    get: function (idStr) {
        return layerLib[idStr];
    },
    remove: function (idStr) {
        var uObj;
        if (uObj = layerLib[idStr]) {
            uObj.remove();
        }
    }
};