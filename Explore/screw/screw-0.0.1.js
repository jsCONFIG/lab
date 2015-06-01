/**
 * screw，移动端h5专用螺丝钉框架
 */
~function(){
    var Screw, $;

    // 定义 screw构造器，配置信息，插件库，消息处理器，模块构造器，模块生成器，模块集(框架用)，模块集(外抛用)，bridge处理器，wrap处理器，工具集
    var screw,
        _cf,
        _pluginLib = {},
        _msgCenter,
        _module,
        _modBuild,
        _modules = {},
        _myMods = {},
        _bridge,
        _position,
        _tool;

    var $T;
    /**
     * 工具定义
     */
    _tool = function () {};

    _tool.prototype.trim = function ( str ) {
        if ( (typeof str).toLowerCase() != 'string' ) {
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

    // 在目标对象上添加相应对象
    _tool.prototype.addspace = function ( nameStr, fn, targetObj ) {
        var self = this,
            mNameStr = self.trim( nameStr );

        // 在目标对象上进行扩展
        if( typeof targetObj != 'object' ) {
            throw 'namespace need object as third parameter!';
        }

        var tmpFn = fn;

        var nameArr = mNameStr.split('.');
        var tempFunc = targetObj;

        for ( var i = 0; i < nameArr.length - 1; i++ ) {
            tempFunc =
                tempFunc[nameArr[i]] =
                    (nameArr[i] in tempFunc) ? tempFunc[nameArr[i]] : (new bmd());
        }

        var lastName = nameArr.pop();

        // 已定义则不覆写
        tempFunc.hasOwnProperty( lastName ) || ( tempFunc[ lastName ] = tmpFn );
        return targetObj;
    };

    // 继承
    _tool.prototype.extend = function ( subClass, supClass ) {
        // 这样做的好处是避免在超类很复杂的情况下，造成的资源浪费
        var F = function () {};
        F.prototype = supClass.prototype;

        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;

        return subClass;
    };

    $T = new _tool;

    /**
     * 模块相关方法定义
     */
    
    // 单个模块的构造器
    _module = function ( nameStr, fn ) {
        this.me = fn;
        this.name = nameStr;
    };

    // 注册当前模块，需保证被注册登记的模块与实际挂载在_myMods上的内容实质相同
    _modBuild = function ( nameStr, fn ) {
        // 不分层级，直接赋值，保证足够直接
        _modules[ nameStr ] = new _module( nameStr, fn );
        return fn;
    };

    /**
     * screw构造器定义
     */
    screw = function () {};

    screw.prototype.info = {
        'version' : '0.0.1',
        'detail' : 'screw-0.0.1\n@author BottleLiu clpliuping@126.com'
    };
    
    screw.prototype.define = function ( nameStr, fn ) {
        _modBuild( nameStr, fn );
        $T.addspace( nameStr, fn, _myMods);
        return this;
    };

    // 返回被mod化的对应模块，用于使用相应的mod方法
    screw.prototype.use = function ( nameStr, root ) {
        var rt = root || _modules;
        return rt[ nameStr ];
    };

    Screw = $ = {};

    // 在mod构造器上添加相应的包扩展，依赖处理/日志处理 都通过这种方法添加
    // 上线后无用的包扩展可以考虑上线前移除掉
    Screw.addPkg = function () {};

    // 删除相关的包扩展，用于添加之后的删除操作
    Screw.delPkg = function () {};

    window.Screw = window.$ = Screw;
}();