/**
 * confirm组件
 */
var $T = require('./expand.js');
var ulayer = require('./layer.js');

var TEMP = {
    'CONFIRM' : ['',
        '<div class="layer_txt" id="#{id}" >',
            '<a href="javascript:void(0)" data-act="close">x</a>',
            '<p class="main" data-node="_uiContent">#{msg}</p>',
            '<p class="main"><button data-act="sure">#{sureTxt}</button><button data-act="cancel">#{cancelTxt}</button></p>',
        '</div>'].join('')
};

var CONFIRMID = '_ui_confirm_';

module.exports = function ( msg, conf ){
    var cf = $T.parseParam( {
        id: undefined,
        sureTxt: '确认',
        cancelTxt: '取消',
        onSure: $T.emptyFn,
        onCancel: $T.emptyFn,
        onClose: $T.emptyFn,
        container: 'body',
        template: TEMP.CONFIRM,
        // 点击关闭标签时，隐藏还是移除
        closeKeep: false,
        // 点击按钮时，是否自动隐藏
        autoHide: true
    }, conf );

    var idStr = cf.id || (CONFIRMID + $T.unikey());

    // 对模板进行预处理
    cf.template = $T.strReplace( cf.template, cf );

    cf.uniLayerKey = CONFIRMID;
    cf.reversOrder = true;

    var clayer = ulayer.set( idStr, msg, cf );
    clayer.makeCenter();

    // 确认/取消操作
    clayer._$.delegate( '[data-act=sure]', 'click', function ( e ) {
        var el = e.currentTarget,
            eData = $( el ).actData();

        cf.onSure( clayer, eData );

        clayer.wantHide();
    });

    clayer._$.delegate( '[data-act=cancel]', 'click', function ( e ) {
        var el = e.currentTarget,
            eData = $( el ).actData();

        cf.onCancel( clayer, eData );

        clayer.wantHide();
    });
};