!function () {
    var $BC = {},
        $C = {};
    $BC.info = 'VERSION: 1.0.0 \n AUTHOR: liuping \n A Package To Deal With Cross-domain';

    $C = {};

    var _tools = {
        // 创建隐藏节点
        'creatNode' : function ( nodeName, attrs, isShow, cbk ) {
            var node = document.createElement( nodeName );
            _tools.setAttrs( node, attrs );
            isShow || (node.style.display = 'none');
            node.onload = ( cbk || function () {} );
            document.body.appendChild( node );
            return node;
        },
        // 给节点设置属性
        'setAttrs' : function ( node, attrs ) {
            for( var i in attrs ) {
                if( attrs.hasOwnProperty( i ) ) {
                    node.setAttribute( i, attrs[i] );
                }
            }
            return node;
        },
        // 仅供message事件使用的绑定
        'addEvt' : function ( type, fn ) {
            if( window.addEventListener ) {
                return window.addEventListener( type, fn, false );
            }
            else if( window.attachEvent ){
                return window.attachEvent( 'on' + type, fn );
            }
            return false;
        },
        'remove' : function ( node ) {
            node.parentNode.removeChild( node );
        },
        'unikey' : function ( len ) {
            var l = (typeof len == 'number') ? len : 16;
            var result = '';
            for( ; result.length < l; result += Math.random().toString(36).substr(2) );
            return result.substr( 0, l );
        },
        'jsonToStr' : function (obj, isEncode) {
            var str = '';
            var temp = [];
            for (var i in obj) {
                var tempV = obj[i].toString();
                if ( isEncode ) {
                    i = encodeURIComponent( i );
                    tempV = encodeURIComponent( tempV );
                }
                temp[temp.length] = (i + '=' + tempV);
                temp[temp.length] = ( '&' );
            }
            temp.pop(); // 弹出最后一个&
            str = temp.join('');
            return str;
        },
        'parseObj' : function (rootObj, newObj, isNumParse) {
            var tempObj = {};
            newObj = newObj || {};
            for ( var i in rootObj ) {
                tempObj[i] = rootObj[i];
                if ( i in newObj ) {
                    var temp = newObj[i];
                    var parseVal = parseFloat(temp);
                    if ( isNumParse && !isNaN( parseVal ) ) {
                        temp = parseVal;
                    }
                    tempObj[i] = temp;
                }
            }
            return tempObj;
        },
        'parseJson' : function ( str ) {
            if( window.JSON && window.JSON.parse ) {
                return window.JSON.parse( str );
            }
            else {
                try{
                    eval('var __bcross_json_bk=' + str );
                    return __bcross_json_bk;
                }
                catch(e){
                    return false;
                }
            }
        }
    };
    
    var _cross = {
        // 通过h5的postMessage()方式来实现
        'postMsg' : function ( inIframe, ifN ) {
            if( window.postMessage ) {
                var send = function ( msg, urlStr ) {
                    if( inIframe ) {
                        parent.postMessage( msg, urlStr );
                    }
                    else {
                        ifN && ifN.contentWindow.postMessage( msg, urlStr || ( ifN && ifN.src ) );
                    }
                };

                var receive = function ( fn ) {
                    _tools.addEvt( 'message', fn );
                };

                return {
                    'send' : send,
                    'receive' : receive
                };
            }
            else {
                return false;
            }
        },
        // 通过jsonp方式来实现
        'jsonp' : function ( src, data, cbk ) {
            var unikey = '__bcross_' + _tools.unikey();
            window[ unikey ] = function ( json ) {
                cbk && cbk( json );
                try{
                    window[ unikey ] && ( delete window[ unikey ]);
                }
                catch(e){
                    window[ unikey ] && ( window[ unikey ] = null);
                }
                _tools.remove( scriptN );
            };

            var srcStr = src;
            if( srcStr.indexOf( '?' ) == -1 ) {
                srcStr = srcStr + '?cb=' + unikey;
            }
            else {
                srcStr = srcStr + '&cb=' + unikey;
            }
            srcStr += ('&' + _tools.jsonToStr( data ));
            var attrs = {
                'type' : 'text/javascript',
                'src' : srcStr
            };
            var scriptN = _tools.creatNode( 'script', attrs, true );
        },
        // 通过表单提交来实现
        // 原理为将表单数据提交到隐藏的iframe中
        // 本质上只能实现单向跨域通信，但可配合name实现双向跨域通信
        // aba
        'form' : function ( conf ) {
            var config = _tools.parseObj( {
                'enctype': 'multipart/form-data',
                'back_url': 'http://' + document.domain + '/my_bcross.php'
            }, conf );

            if( !config.back_url ) {
                return;
            }

            // 将back_url进行转换，
            // 防止back_url中的特殊值干扰url的query串
            config.back_url = escape( config.back_url );

            var iframN;
            // Input创建器
            var inputCreator = function ( data ) {
                var arr = [];
                for ( var i in data ) {
                    if ( data.hasOwnProperty( i ) ) {
                        arr[arr.length] = '<input type="hidden" name=' + i + ' value=' + data[i] + ' />';
                    }
                }
                return arr.join('');
            };

            var iframCreat = function () {
                var nameStr = 'b_iframe_' + _tools.unikey();
                var attrs = {
                    'name' : nameStr
                };
                // ie7-下，name属性不能设置成功
                if( /MSIE [7,6].0/.test(navigator.userAgent) ){
                    iframN = _tools.creatNode( '<iframe name="' + nameStr + '">', {}, false );
                }
                else {
                    iframN = _tools.creatNode( 'iframe', attrs, false );
                }
                return nameStr;
            };


            var iframeKey = iframCreat();

            // 创建form节点
            var formAttrs = {
                'target' : iframeKey,
                'enctype': config.enctype
            };
            var formNode = _tools.creatNode( 'form', formAttrs );

            var insertData = function ( data ) {
                formNode.innerHTML = inputCreator( data );
            };

            var inter = {
                'send' : function ( data, option ) {
                    var options  = _tools.parseObj( {
                        'url' : '',
                        'type': 'post',
                        'cbk' : function () {},
                        'datatype': 'json'
                    }, option );

                    var cbk = options.cbk;
                    var unikey = '__bcross_' + _tools.unikey();
                    window[ unikey ] = function ( json ) {
                        if( options.datatype == 'json' ) {
                            json = _tools.parseJson( json );
                        }
                        cbk && cbk( json );
                        window[ unikey ] && ( delete window[ unikey ]);
                    };

                    var urlStr = options.url;
                    if( urlStr.indexOf( '?' ) == -1 ) {
                        urlStr = urlStr + '?';
                    }
                    else {
                        urlStr = urlStr + '&';
                    }
                    urlStr += ('back_url=' + config.back_url + '&cb=' + unikey);

                    // 设置属性
                    _tools.setAttrs( formNode, {
                        'action' : urlStr,
                        'method' : options.type
                    } );
                    insertData(data);
                    formNode.submit();
                },
                'destroy' : function () {
                    formNode && _tools.remove( formNode );
                    iframN && _tools.remove( iframN );
                    formNode = iframN = null;
                }
            };
            return inter;
        }
    };

    $BC.postMsg = _cross.postMsg;
    $BC.jsonp = _cross.jsonp;
    $BC.form = _cross.form;

    window.$bcross || ( window.$bcross = $BC );
} ();