/**
 * alert组件
 */
var $T = require('./expand.js');
var icons = require('./icons.js');
var ulayer = require('./layer.js');

var TEMP = {
    'CONFIRM' : ['',
        '<div class="layer_txt" id="#{id}" >',
            '<a href="javascript:void(0)" data-act="close">x</a>',
            '<p class="main">#{iconStr}</p>',
            '<p class="main" data-node="_uiContent">#{msg}</p>',
            '<p class="main"><button data-act="sure">#{sureTxt}</button></p>',
        '</div>'].join(''),

    'ICON' : '<i class="#{icon}"></i>'
};

var ALERTID = '_ui_alert_';

module.exports = function ( msg, conf ){
    var cf = $T.parseParam( {
        'sureTxt'   : '确认',

        'icon'      : 'warn',

        'container' : 'body',

        'template'  : TEMP.CONFIRM
    }, conf );

    // 对模板进行预处理
    var tData = {
        'sureTxt' : cf.sureTxt,
        'iconStr' : ''
    };

    // 图标处理
    if( icons.hasOwnProperty( cf.icon ) ) {
        tData.iconStr = $T.strReplace( TEMP.ICON, {
            'icon' : icons[ cf.icon ]
        } );
    }

    cf.template = $T.strReplace( cf.template, tData );
    cf.uniLayerKey = ALERTID;

    cf.onInit = function ( myLayer ) {
        myLayer.screenCenter();
    };

    var myId = ALERTID + $T.unikey();
    var clayer = ulayer.set( myId, msg, cf );

    // 确认操作
    clayer._$.delegate( '[data-act=sure]', 'click', clayer.wantHide );
};