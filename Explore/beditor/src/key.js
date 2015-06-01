/**
 * 按键处理组件
 * @param  {[type]} $T [description]
 * @return {[type]}    [description]
 */
define(['./lib', './keycode'], function ( $T, _keymap ) {
    var $keyobj = {};
    var _keyCache = {};
    var _allCache = {};

    // 实际绑定的function
    var mainFn = function ( e ) {
        var evt = e || window.event;
        var el = evt.srcElement || evt.target;
        var keyflag = el.__keyflag;
        var _cache = _keyCache[ keyflag ];
        var key = _keymap.key[ evt.keyCode ];

        // 规整化keymap
        if( evt.ctrlKey ) {
            key = 'ctrl_' + key;
        }
        if( evt.altKey ) {
            key = 'alt_' + key;
        }
        if( _cache && _cache[ key ] ) {
            $T.each( _cache[ key ], function ( item, i ) {
                item && item( evt, key );
            });
        }
    };

    var allFn = function ( e ) {
        var evt = e || window.event;
        var el = evt.srcElement || evt.target;
        var keyflag = el.__keyflag;
        var _cache = _allCache[ keyflag ];
        var key = _keymap.key[ evt.keyCode ];
        // 规整化keymap
        if( evt.ctrlKey ) {
            key = 'ctrl_' + key;
        }
        if( evt.altKey ) {
            key = 'alt_' + key;
        }
        evt.target || ( evt.target = el );
        $T.each( _cache, function ( item, i ) {
            item && item( evt, key );
        });
    };

    $keyobj.addAll = function ( node, fn ) {
        var keyflag = node.__keyflag;

        if( !( keyflag && _allCache[ keyflag ] ) ) {
            keyflag = $T.unikey();
            _allCache[ keyflag ] = [];
            node.__keyflag = keyflag;
            $T.addEvt( node, 'keyup', allFn );
        }
        _allCache[ keyflag ].push( fn );
    };

    // 绑定键盘事件
    $keyobj.add = function ( node, keymap, fn ) {
        var keyflag = node.__keyflag;

        if( !( keyflag && _keyCache[ keyflag ] ) ) {
            keyflag = $T.unikey();
            _keyCache[ keyflag ] = {};
            node.__keyflag = keyflag;
            $T.addEvt( node, 'keyup', mainFn );
        }

        // 规整化keymap
        if( keymap.indexOf( 'ctrl' ) != -1 ) {
            keymap = keymap.replace( 'ctrl_', '' );
            keymap = 'ctrl_' + keymap;
        }

        if( keymap.indexOf( 'alt' ) != -1 ) {
            keymap = keymap.replace( 'alt_', '' );
            keymap = 'alt_' + keymap;
        }

        _keyCache[ keyflag ][ keymap ] || ( _keyCache[ keyflag ][ keymap ] = [] );
        _keyCache[ keyflag ][ keymap ].push( fn );
    };
    return $keyobj;
});