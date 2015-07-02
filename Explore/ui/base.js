/**
 * ui组件基类
 */
var $T = require('./expand.js');
    
// 对齐数组，支持左上，右上，左下，右下，中上，中下, 中间
var alignArr = ['lt', 'rt', 'lb', 'rb', 'ct', 'cb', 'cm'];

var Class_base = function ( node ) {
    this[0] = node;
    // 封一个$变量
    this._$ = $( node );
};

Class_base.prototype.show = function ( cbk, justDisplay ) {
    var self = this;
    !justDisplay ? self._$.show() : self._$.css( 'display', '' );
    cbk && cbk( self );
};

Class_base.prototype.hide = function ( cbk, justDisplay ) {
    var self = this;
    !justDisplay ? self._$.hide() : self._$.css( 'display', 'none' );
    cbk && cbk( self );
};

Class_base.prototype.setPos = function ( l, t ) {
    this._$.css({
        'left' : l,
        'top' : t
    });
};

Class_base.prototype.destroy = function () {
    this._$.remove();
};

// 对齐
Class_base.prototype.beside = function ( nd, conf ) {
    if( !$T.isNode( nd ) ) {
        return;
    }

    var self = this;
    var cf = $T.parseParam( {
        // 是否只是拿到其参数而不操作
        'justParam' : false,
        'align' : 'ct',
        'offsetL' : 0,
        'offsetT' : 0
    }, conf );

    if( $.inArray(cf.align, alignArr) == -1 ) {
        cf.align = 'ct';
    }
    var $nd = $( nd ),
        info = $nd.offset();

    info.width = $nd.width();
    info.height = $nd.height();

    var mySize = {
        'w' : self._$.width(),
        'h' : self._$.height()
    };

    var target = {
        'top' : info.top,
        'left': info.left
    };

    // 修正
    if( $nd[0] == document.body ) {
        var winW = $( window ).width();
        // 5为一个缓冲值
        if( info.width + 5 < winW ) {
            target.left = 0;
        }

    }

    if( cf.align.indexOf('t') != -1 ) {
        target.top -= mySize.h;
    }

    if( cf.align.indexOf('b') != -1 ) {
        target.top += info.height;
    }

    if( cf.align.indexOf('r') != -1 ) {
        target.left = ( target.left + info.width - mySize.w );
    }

    if( cf.align.indexOf('c') != -1 ) {
        target.left = ( target.left + info.width / 2 - mySize.w / 2);
    }

    if( cf.align.indexOf('m') != -1 ) {
        target.top = ( target.top + info.height / 2 - mySize.h / 2 );
    }

    target.top += (cf.offsetT || 0);
    target.left += (cf.offsetL || 0);

    !cf.justParam && self._$.css( target );
    return target;
};

// 使屏幕居中
Class_base.prototype.screenCenter = function ( conf ) {
    var cf = $T.parseParam( {
        'offsetL' : 0,
        'offsetT' : 0
    }, conf );

    cf.align = 'cm';
    cf.justParam = true;

    var bd = document.body,
        $bd = $( bd ),
        target = this.beside( bd, cf );

    var info = $bd.offset();
    info.width = $bd.width();
    info.height = $bd.height();

    target.top -= ( (info.height - $(window).height() )/2 - ($bd.scrollTop() || $(window).scrollTop()) );
    target.left -= ( (info.width - $(window).width() )/2 - ($bd.scrollLeft() || $(window).scrollLeft()) );
    this._$.css( target );
};

module.exports = function ( node ) {
    return new Class_base( node );
};