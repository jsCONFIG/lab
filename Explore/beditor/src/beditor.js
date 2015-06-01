/**
 * 富文本编辑器beditor
 * 使用requirejs处理模块
 * @return {[type]} [description]
 */
define( function ( require ) {
    var $T = require( './lib' ),
        $C = require( './config' ),
        $K = require( './key' ),
        $R = require( './core/range' ),
        $Command = require( './core/command' );

    var _editorCache = {},
        // 缓存range范围
        rgCache,
        deleArr = [];
    var emptyFn = function () {};

    // 挂载command到$T上
    $T.command = $Command;
    /**
     * 类定义
     * "$c_xxx"命名
     */
    // beditor基类
    var $c_be = function ( node ) {
        var tmpEditor = $T.find( '[be-type=editor]', node )[0],
            tmpTools = $T.find( '[be-type=tools]', node )[0];
        
        this.node = node;
        this.editor = tmpEditor;
        this.tools = tmpTools;
    };

    // plugin基类
    var $c_plugin = function ( pgObj ) {
        this.pgname = pgObj.name;
        this.destroy= pgObj.destroy || emptyFn;
        this.keymap = pgObj.smartKey;
        this.keyAct = pgObj.keyAct;
        this.btnAct = pgObj.btnAct;
        // 记录当前插件的使用情况
        this.status = 0;
    };

    // 存储定义的plugin对象
    var $plugins = [];

    // plugins tools
    var $pgTools = {
        'get' : function ( name ) {
            var pg;
            $T.each( $plugins, function ( item, index ) {
                if( item && item.pgname === name ) {
                    pg = item;
                }
            });
            return pg;
        }
    };

    // 编辑器键盘事件绑定
    var $pgFn = function ( e, key ) {
        var custRg = rgCache || $R.create();
        $T.each( $plugins, function ( item, index ) {
            if( $T.indexOf( key, item.keymap ) != -1 ) {
                rgCache = (item.keyAct && item.keyAct( e, key, custRg, $T )) || custRg;
            }
        });
    };

    // 工具栏鼠标点击行为的处理方法
    var $pgMouseFn = function ( evt, evObj ) {
        var custRg = rgCache || $R.create();

        $T.each( $plugins, function ( item, index ) {
            if( item.pgname == evObj.attr ) {
                evObj.data = $T.strToJson( evObj.el.getAttribute('data-bedata') );
                evObj.info = _editorCache[ evObj.root.__beditorkey ];
                delete evObj.root;
                rgCache = (item.btnAct && item.btnAct( evt, evObj, custRg, $T )) || custRg;
            }
        });
    };

    /**
     * 类扩展
     * @type {String}
     */
    $c_be.prototype.version = 'beditor 1.0.0 \n @author: BottleLiu \n @email: clpliuping@126.com';

    $c_be.prototype.getNode = function (){
        return this.node;
    };

    $c_be.prototype.getContent = function () {
        return this.editor.innerHTML;
    };

    $c_be.prototype.clear = function () {
        var str = this.editor.innerHTML;
        this.editor.innerHTML = '';
        return str;
    };

    $c_be.prototype.disable = function () {
        this.editor.removeAttribute( 'contenteditable' );
    };

    $c_be.prototype.enable = function () {
        this.editor.setAttribute( 'contenteditable', 'true' );
    };

    $c_be.prototype.plugins = function () {
        return $plugins.concat([]);
    };

    var $init = function () {
        // 后置加载插件
        require( $C.plugins, function () {
            for( var i = 0, aL = arguments.length; i < aL; i++ ) {
                var pgobj = arguments[i];
                if( pgobj ) {
                    $plugins.push( new $c_plugin( pgobj ) );
                }
            }
        } );
    };

    $init();
    $c_be.plugins = $pgTools;

    window.$beditor = function ( node ){
        var flag = node.__beditorkey;

        // 如果之前曾经初始化，则直接返回缓存中的对象
        if( flag && _editorCache[flag] ) {
            return _editorCache[flag].editor;
        }

        var flag = $T.unikey();
        var _c_be = new $c_be( node );
        
        // 存缓存
        _editorCache[ flag ] = {
            'editor' : _c_be,
            'node' : node
        };
        node.__beditorkey = _c_be.tools.__beditorkey = _c_be.editor.__beditorkey = flag;

        _c_be.enable();

        // 加载插件键盘事件
        $K.addAll( _c_be.editor, $pgFn );

        // 加载插件的tools bar上的点击行为
        var deleObj;
        deleArr[ deleArr.length ] = deleObj = $T.delegate( _c_be.tools );
        deleObj.add( '*', 'click', $pgMouseFn );

        // 点击时更新range缓存
        $T.addEvt( _c_be.editor, 'click', function ( e ) {
            console.log(111);
            rgCache = $R.create();
        });

        return _c_be;
    };
    return window.$beditor;
});