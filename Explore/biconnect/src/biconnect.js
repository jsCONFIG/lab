!function () {
    var _reglib = {
        'hash' : /#bic_(.+)#bic_/
    };

    var $T = {};
    // 获取唯一值,[0-9a-z]{len}
    $T.unikey = function ( len ) {
        var l = (typeof len == 'number') ? len : 16;
        var result = '';
        for( ; result.length < l; result += Math.random().toString(36).substr(2) );
        return result.substr( 0, l );
    };

    // 清除字符串首尾空格
    $T.trim = function (str) {
        if ((typeof str).toLowerCase() != 'string') {
            return str;
        }
        var sL = str.length;
        var reg = /\s/;
        for ( var i = 0; i < sL; i++ ) {
            if( !reg.test( str.charAt( i ) ) ) {
                break;
            }
        }
        if( i >= sL ) {
            return '';
        }
        for ( var j = sL - 1; j >= 0; j-- ) {
            if( !reg.test( str.charAt( j ) ) ) {
                // 针对slice特性，修正一个位置
                j++;
                break;
            }
        }
        return str.slice( i, j );
    };

    $T.each = function ( arr, fn ) {
        if ( typeof arr.forEach != 'undefined') {
            arr.forEach( fn );
        }
        else {
            for ( var i = 0, aL = arr.length; i < aL; i++ ) {
                var tmpVal = fn( arr[i], i, arr );
                if( tmpVal === false ) {
                    return;
                }
            }
        }
    };

    // 仅供message事件使用的绑定
    $T.addEvt = function ( type, fn ) {
        if( window.addEventListener ) {
            return window.addEventListener( type, fn, false );
        }
        else if( window.attachEvent ){
            return window.attachEvent( 'on' + type, fn );
        }
        return false;
    };

    $T.isArray = function ( arr ) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    };

    $T.jsonToStr = function ( json ) {
        if( window.JSON ) {
            return JSON.stringify( json );
        }
        else {
            return '';
        }
    };

    $T.strToJson = function ( jsonStr ) {
        if( window.JSON ) {
            return JSON.parse( jsonStr );
        }
        else {
            return {};
        }
    };

    // 专用方法
    $T.getHashVal = function ( src ) {
        var matchArr = src.match( _reglib.hash );
        return matchArr ? matchArr[1] : '';
    };

    // 专用方法
    $T.changeHashVal = function ( src, data ) {
        var dataStr = '#bic_' + $T.jsonToStr( data ) + '#bic_';
        var tmpSrc = src.replace( _reglib.hash, '' );
        return tmpSrc + dataStr;
    };

    $T.receiveMsg = function ( fn, context ) {
        if( _monitorStatus ) {
            return;
        }
        if( window.postMessage ) {
            $T.addEvt( 'message', fn );
            _monitorStatus = true;
        }
        // 依靠hash的方式
        else {
            var ifN = context.iNode;
            // 如果在iframe内部
            if( !ifN ) {
                _hashCache = window.location.hash;
                _hashTimer = setInterval( function () {
                    if( window.location.hash != _hashCache ) {
                        _hashCache = window.location.hash;
                        fn({
                            'data' : $T.strToJson( $T.getHashVal( window.location.href ) )
                        });
                    }
                }, 500 );
            }
            // 含有iframe的情况
            else {
                var src = ifN.src;
                _hashCache = $T.getHashVal( src );
                _hashTimer = setInterval( function () {
                    var hashStr = '';
                    // 无效，对外部而言，获取到的iframe src地址始终为初始时设置的那个
                    // !!!!!!!!!!!!
                    if( ( hashStr = $T.getHashVal( ifN.src ) ) != _hashCache ) {
                        _hashCache = hashStr;
                        fn({
                            'data' : $T.strToJson( $T.getHashVal( ifN.src ) )
                        });
                    }
                }, 500 );
            }
            _monitorStatus = true;
        }
    };

    // postMessage方法
    $T.sendMsg = function ( iObj ) {
        var inIframe = !iObj.iNode;
        var ifN = iObj.iNode;
        if( window.postMessage ) {
            var send = function ( msg, urlStr ) {
                var urlStr = urlStr || '*';
                if( inIframe ) {
                    parent.postMessage( msg, urlStr );
                }
                else {
                    ifN && ifN.contentWindow.postMessage( msg, urlStr || ( ifN && ifN.src ) );
                }
            };
        }
        // 依靠hash的方式
        else {
            var send = function ( msg, urlStr ) {
                // 在iframe内部
                if( inIframe ) {
                    // 无效，外部获取不到iframe内改变后的地址
                    // !!!!!!!!
                    window.location.href = $T.changeHashVal( window.location.href, msg );
                }
                else {
                    ifN.src = $T.changeHashVal( ifN.src, msg );
                }
            };
            
        }
        return send;
    };

    var _hashCache,
        _hashTimer;

    // 开始则进行监听
    var _receiveHanler = function ( e ) {
        var data = e.data;
        var channel = data.channel,
            evType = data.evType,
            spec = data.data;

        var fns;
        if( fns = ( _handlerList[ channel ] && _handlerList[ channel ][ evType ] ) ) {
            $T.each( fns, function ( item, index ) {
                if( $T.isArray( spec ) ) {
                    item.fn && item.fn.apply( window, spec );
                }
                else {
                    item.fn && item.fn( spec );
                }
            });
        }
    };

    // postmessage监听状态，只绑定一次
    var _monitorStatus = false;

    /**
     * 定义
     * @return {[type]} [description]
     */
    var $iconnet = function ( iframeN ) {
        // 对象id,用于直接的销毁方法
        this.__id = 'bic_id_' + $T.unikey();
        this.iNode = iframeN;
        var self = this;
        $T.receiveMsg( _receiveHanler, self );
    };

    // 绑定的事件列表
    var _handlerList = {};

    /**
     * 扩展
     * @return {[type]} [description]
     */
    // 监听
    $iconnet.prototype.on = function( channel, evType, handler ) {
        var self = this;
        _handlerList[ channel ] || ( _handlerList[ channel ] = {} );
        _handlerList[ channel ][ evType ] || ( _handlerList[ channel ][ evType ] = [] );
        _handlerList[ channel ][ evType ].push( {
            'fn' : handler,
            'id' : self.__id
        } );
    };

    // 触发，触发对应iframe的相关事件
    $iconnet.prototype.dispatch = function( channel, evType, dataArr, target ) {
        var self = this;
        var sendFn = $T.sendMsg( self );
        sendFn( {
            'channel' : channel,
            'evType'  : evType,
            'data'    : dataArr
        }, target );
    };

    // 解绑
    $iconnet.prototype.off = function( channel, evType, handler ) {
        var fns;
        if( fns = ( _handlerList[ channel ] && _handlerList[ channel ][ evType ] ) ) {
            // 因为要操作循环数组，故采用下列的写法
            for( var i = 0; i < fns.length; i++ ) {
                if( fns[i].fn === handler ) {
                    fns.splice( i, 1 );
                    i--;
                }
            }
        }
    };

    // 销毁，将销毁通过当前实例创建的所有监听方法
    $iconnet.prototype.destroy = function() {
        var self = this,
            myId = self.__id;

    };

    var that = {};
    that.create = function ( iN ) {
        return new $iconnet( iN );
    };

    that.destroy = function () {
        _hashTimer && clearInterval( _hashTimer );
        _hashTimer = undefined;
    };

    window.$biconnect = that;
    if ( typeof window.module === "object" && window.module && typeof window.module.exports === "object" ) {
        window.module.exports = that;
    }
    else {
        if ( typeof define === "function" && define.amd ) {
            define( "biconnect", [], function () { return that; } );
        }
    }
}(this);