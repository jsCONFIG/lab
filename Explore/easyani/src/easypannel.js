/**
 * esayPannel
 * @return {[type]} [description]
 */
define(function () {
    var _reg = {
        'cssF' : /\-([a-z]{1})/g
    };

    var _tool = {
        'C' : function ( nd ) {
            return document.createElement( nd );
        },

        'buildCanvas' : function () {
            var canvas = _tool.C('canvas');

        },

        'isType' : function ( v, type ) {
            var typeV = ( typeof v );
            if ( typeV == 'undefined' ) {
                return /^undefined$/i.test( type );
            }
            else{
                var reg = new RegExp( type, 'gi' );
                try {
                    var transStr = v.constructor.toString();
                    return reg.test( transStr );
                }
                catch(NULL){
                    return ( /^object$/i.test( typeV ) && /^null$/i.test( type ) );
                }
            }
        },

        // 获取对象长度
        'objLength' : function ( obj ) {
            var l = 0;
            for( var i in obj ) {
                if( obj.hasOwnProperty( i ) ) {
                    l++;
                }
            }
            return l;
        },
        unikey: function ( len ) {
            var l = (typeof len == 'number') ? len : 16;
            var result = '';
            for( ; result.length < l; result += Math.random().toString(36).substr(2) );
            return result.substr( 0, l );
        }
    };

    var _dom = function ( nd ) {
        var l = 0,
            self = this;
        if( _tool.isType( nd, 'NodeList' ) ) {
            nd = Array.prototype.slice.call( nd, 0);
        }

        if( _tool.isType( nd, 'Array' ) ) {
            l = nd.length;
            for( var i = 0; i < l; i++ ) {
                self[i] = nd[i];
            }
        }
        else if( nd.nodeType ) {
            l = 1;
            self[0] = nd;
        }

        self.length = l;
    };

    _dom.prototype.css = function ( cssObj ) {
        var self = this;
        if( !self.length ) {
            return self;
        }

        if( self[0].style.cssText ) {
            for( var j = 0; j < self.length; j++ ) {
                var me = self[j];
                var myCssText = me.style.cssText;

                for( var i in cssObj ) {
                    if( cssObj.hasOwnProperty( i ) ) {
                        var reg = new RegExp( i + '\\s*\\:?[^\\;]+\\;?' );
                        myCssText.replace( reg, '' );
                        myCssText += ( i + ':' + cssObj[i] + ';' );
                    }
                }
                me.style.cssText = myCssText;
            }
        }

        else {
            for( var j = 0; j < self.length; j++ ) {
                var me = self[j];

                for( var i in cssObj ) {
                    if( cssObj.hasOwnProperty( i ) ) {
                        var itmp = i;
                        var itmp = i.replace( _reg.cssF, function () {
                            return arguments[1].toUpperCase();
                        });
                        me.style[ itmp ] = cssObj[i];
                    }
                }
            }
        }
    };

    _dom.prototype.getSize = function () {
        var self = this;
        if( !self.length ) {
            return {};
        }

        var size = {
            'height'    : self[0].offsetHeight,
            'width'     : self[0].offsetWidth
        };

        return size;
    };

    var _canvas = function ( canvas ) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.dataStore = undefined;
    };

    // 对ctx进行样式设置
    _canvas.prototype.doStyle = function ( styleObj ) {
        var sObj = styleObj || {};

        // 赋值相关样式设置
        for( var i in sObj ) {
            if( sObj.hasOwnProperty( i ) && ( i in self.ctx ) ) {
                self.ctx[ i ] = sObj[ i ];
            }
        }

        return this;
    };

    // 画线
    _canvas.prototype.line = function ( pointArr, styleObj ) {
        if( pointArr.length < 2 ) {
            return;
        }
        var self = this;

        self.doStyle( styleObj );

        self.ctx.moveTo( pointArr[0][0], pointArr[0][1] );

        for( var i = 1, pL = pointArr.length; i < pL; i++ ) {
            var item = pointArr[i];
            self.ctx.lineTo( item[0], item[1] );
        }
        self.ctx.stroke();
        return this;
    };

    _canvas.prototype.fillStyle = function ( style ) {
        this.ctx.fillStyle = style;
        return this;
    };

    _canvas.prototype.fillText = function ( text, pos, spec ) {
        spec = spec || {};
        this.ctx.font = spec.font || '';
        if( spec.align ) {
            // 垂直定位
            spec.align.v && (this.ctx.textBaseline = spec.align.v);
            spec.align.l && (this.ctx.textAlign = spec.align.l);
        }

        if( spec.maxW ) {
            this.ctx.fillText( text, pos.x, pos.y, spec.maxW );
        }
        else {
            this.ctx.fillText( text, pos.x, pos.y );   
        }
        return this;
    };

    // 同fillRect
    _canvas.prototype.fillRect = function ( pointArr, w, h, styleObj ) {
        if( pointArr.length < 2 ) {
            return;
        }
        var self = this;

        self.doStyle( styleObj );

        self.ctx.fillRect( pointArr[0], pointArr[1], w, h );
        return this;
    };

    // 同rect
    _canvas.prototype.rect = function ( pointArr, w, h, styleObj ) {
        if( pointArr.length < 2 ) {
            return;
        }
        var self = this;

        self.doStyle( styleObj );

        self.ctx.rect( pointArr[0], pointArr[1], w, h );
        self.ctx.stroke();
        return this;
    };

    // 绘圆
    _canvas.prototype.arc = function ( ogPoint, r, startAg, endAg ) {
        var self = this;
        var sAg = startAg || 0,
            eAg = endAg || Math.PI * 2;

        self.ctx.beginPath();
        self.ctx.arc( ogPoint[0], ogPoint[1], r, sAg, eAg, true );
        return this;
    };

    // 克隆当前canvas，并返回复印件，可用于解决画布跨域图片导致画布被污染的问题
    _canvas.prototype.clone = function () {
        var size = (new _dom(this.canvas)).getSize();
        var myData = this.ctx.getImageData( 0, 0, size.width, size.height );

        var canvas = _tool.C('canvas');

        // 初始化canvas画布
        canvas.width = size.width;
        canvas.height = size.height;

        this.ctx.putImageData( myData, 0, 0 );
        return canvas;
    };

    _canvas.prototype.clear = function ( sPos, shape ) {
        var self = this;
        var cSize = (new _dom(this.canvas)).getSize();
        var s = sPos || [0, 0],
            e = shape || [cSize.width, cSize.height];

        // 存储数据，用于restore
        self.dataStore = self.ctx.getImageData( s[0], s[1], e[0], e[1] );
        self.ctx.clearRect( s[0], s[1], e[0], e[1] );
        return this;
    };

    _canvas.prototype.saveData = function ( sPos, shape ) {
         var self = this;
        var cSize = (new _dom(this.canvas)).getSize();
        var s = sPos || [0, 0],
            e = shape || [cSize.width, cSize.height];

        var data = this.ctx.getImageData( 0, 0, e[0], e[1] );
        self.dataStore = data;
        return this;
    };

    _canvas.prototype.restore = function ( sPos ) {
        var self = this;
        if( !self.dataStore ) {
            return self;
        }
        var cSize = (new _dom(this.canvas)).getSize();
        var s = sPos || [0, 0];

        this.ctx.putImageData( self.dataStore, s[0], s[1] );

        return this;
    };

    // 拼图基类
    var _epannel = function (canvas) {
        if( !canvas ) {
            return;
        }
        // this.img = img;

        // 私有
        this._ = {};
        this._.$canvas = new _dom( canvas );

        this._.canvas = new _canvas( canvas );
    };

    // rt，font类似css的font属性，这个pos是文字的左下顶点的位置
    _epannel.prototype.addTxt = function ( txt, pos, font, align, maxW ) {
        var self = this;
        self._.canvas.fillText( txt, pos, {
            'font' : font,
            'align': align,
            'maxW' : maxW
        } );
        return self;
    };

    // 添加对齐的文本
    // 支持水平，垂直对齐，支持额外自定义距离
    _epannel.prototype.addTxtAlign = function ( txt, alignL, alignV, font ) {

    };

    _epannel.prototype.textWidth = function (txt) {
        if (typeof txt == 'undefined') {
            return 0;
        }
        return this._.canvas.ctx.measureText(txt).width;
    };

    // pos参数说明：
    // {
    //  'x' : xxx,
    //  'y' : xxx,
    //  'sx': xxx, // 可选,截图参数
    //  'sy': xxx  // 可选,截图参数
    // }
    // size参数说明：(可选)
    // {
    //  'w' : xxx, // 缩放参数
    //  'h' : xxx, // 缩放参数
    //  'sw': xxx, // 截图参数
    //  'sh': xxx  // 截图参数
    // }
    _epannel.prototype.addImg = function ( img, pos, size ) {
        pos = pos || {};
        size= size || {};

        var ctx = this._.canvas.ctx;
        var mod = _tool.objLength( pos ) + _tool.objLength( size );
        
        // 卧槽！太恶心的参数了
        switch( mod ) {
            case 2:
                ctx.drawImage( img, pos.x, pos.y );
                break;
            case 4:
                ctx.drawImage( img, pos.x, pos.y, size.w, size.h );
                break;
            case 8:
                ctx.drawImage( img, pos.sx, pos.sy, size.sw, size.sh, pos.x, pos.y, size.w, size.h );
                break;
            default:
                ctx.drawImage( img, pos.x, pos.y );
        }

        return this;
    };

    // 自定义处理图片
    _epannel.prototype.custImg = function ( img, middleWare ) {
        // 对图片进行大小缩放处理
        var imgCanvas = _tool.C('canvas'),
            imgDom = new _dom( img );

        // 取和最终的“画板”一样的尺寸
        imgCanvas.width = this._.canvas.canvas.width;
        imgCanvas.height = this._.canvas.canvas.height;

        var imgCObj = new _canvas( imgCanvas );
        
        if( middleWare ) {
            middleWare( imgCObj.ctx );
        }

        var imgSrc = imgCanvas.toDataURL();
        var newImg = _tool.C( 'img' );
        newImg.src = imgSrc;

        return newImg;
    };

    // 添加将图片添加到canvas圆形区域，使用纹理实现
    _epannel.prototype.addArcImg = function ( img, orgPos, R ){
        var middleWare = function ( imgCtx ) {
            imgCtx.drawImage( img, 0, 0, 2 * R, 2 * R );
            imgCtx.rect( 0, 0, 2 * R, 2 * R );
            imgCtx.clip();
        };

        // 自定义图片
        var newImg = this.custImg( img, middleWare );

        // 运用纹理进行填充

        var canvas = this._.canvas;
        var pat = canvas.ctx.createPattern( newImg, 'no-repeat' );
        canvas.arc( [orgPos.x, orgPos.y], R );
        canvas.ctx.save();
        canvas.ctx.translate( orgPos.x - R, orgPos.y - R );
        canvas.ctx.fillStyle = pat;
        canvas.ctx.fill();
        canvas.ctx.restore();
    };

    // 添加图片到canvas方形区域，使用纹理实现
    _epannel.prototype.addRecImg = function ( img, pos, w, h ){
        var middleWare = function ( imgCtx ) {
            imgCtx.drawImage( img, 0, 0, w, h );
            imgCtx.rect( 0, 0, w, h );
            imgCtx.clip();
        };

        // 自定义图片
        var newImg = this.custImg( img, middleWare );

        // 运用纹理进行填充

        var canvas = this._.canvas;
        var pat = canvas.ctx.createPattern( newImg, 'no-repeat' );
        canvas.rect( [pos.x, pos.y], w, h );
        canvas.ctx.save();
        canvas.ctx.translate( pos.x, pos.y );
        canvas.ctx.fillStyle = pat;
        canvas.ctx.fill();
        canvas.ctx.restore();
    };

    _epannel.prototype.clearAll = function () {
        this._.canvas.clear();
        return this;
    };

    // 扫描动画
    _epannel.prototype.scan = function (fps) {
        if (!fps) {
            return;
        }
        var self = this;

        var scanStep = 1000 / fps;

        if (!self._.scanStatus) {
            // 在定时器的基础间隔上，划分为10个等级
            var aniLevel = 1;
            self._.scanStatus = setInterval(function () {
                self._.canvas.clear();
                var scanFnList = self._.scanFnList;
                // var flag;
                for (var i in scanFnList) {
                    if (scanFnList.hasOwnProperty(i)) {
                        scanFnList[i] && scanFnList[i](aniLevel);
                        // flag = true;
                    }
                }

                // 如果没有了绘制方法，则停止扫描
                // !flag && self.stopScan();
                aniLevel++;
                if (aniLevel > 10) {
                    aniLevel = 1;
                }

            }, scanStep);
            return true;
        }
        return false;
    };

    _epannel.prototype.stopScan = function () {
        this._.scanStatus && clearInterval(this._.scanStatus);
        this._.scanStatus = undefined;
    };

    // 添加扫描中的绘制方法
    _epannel.prototype.addPaintFn = function (paintFn) {
        if (!this._.scanFnList) {
            this._.scanFnList = {};
        }
        var pKey = _tool.unikey();
        this._.scanFnList[pKey] = paintFn;
        return pKey;
    };

    // 移除扫描中的绘制方法
    _epannel.prototype.removePaintFn = function (pKey) {
        if (!this._.scanFnList) {
            return false;
        }
        
        if (this._.scanFnList.hasOwnProperty(pKey)) {
            delete this._.scanFnList[pKey];
            return true;
        }
        return false;
    };

    // 即canvas节点的getDataUrl
    _epannel.prototype.getDataUrl = function () {
        return this._.canvas.canvas.toDataURL();
    };

    var epannel = function ( nd ) {
        var epannelObj = new _epannel( nd );
        // 初始化
        // epannelObj.init();
        return epannelObj;
    };

    return epannel;
});