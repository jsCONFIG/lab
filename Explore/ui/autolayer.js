/**
 * 自动隐藏的layer层
 */
var $T = require('./expand.js');
var layer = require('./layer.js');
var mask = require('./mask.js');
var UNIKEY = '_ui_autolayer_uni';
var timer;

module.exports = function ( msg, conf ) {
    var cf = $T.parseParam( {
        // 是否屏幕居中
        screenCenter: false,
        delay: 1000,
        container: 'body',
        // 定位居中
        dir: 'cm',
        bNd: 'body',
        offsetL: 0,
        offsetT: 0,
        // 确保唯一
        unique: true,
        mask: false
    }, conf );

    var idStr;
    if( cf.unique ) {
        timer && clearTimeout( timer );
        idStr = UNIKEY;
    }

    var myLayer = layer.set( idStr, msg, {
        'container' : cf.container
    } );
    
    if( cf.screenCenter ) {
        myLayer.screenCenter(cf);
    }
    else {
        myLayer.beside( $( cf.bNd )[0], {
            'align' : cf.dir,
            'offsetL' : cf.offsetL,
            'offsetT' : cf.offsetT
        });
    }
    if (cf.mask) {
        mask.show();
    }

    timer = setTimeout( function () {
        myLayer.remove();
        timer = undefined;
        mask.hide();
    }, cf.delay );
};