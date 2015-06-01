/**
 * tab功能组件
 * @param object
        tabTag上支持数据定制显示及无数据定制的情况
 * @return tabObject
 */
CJS.Import( 'dom.get' );
CJS.Import( 'dom.nodeMap' );
CJS.Import( 'dom.getClosest' );
CJS.Import( 'dom.getClassList' );
CJS.Import( 'css.show' );
CJS.Import( 'css.hide' );
CJS.Import( 'evt.event' );
CJS.register( 'plugin.tab', function ( $ ) {
    var $f      = $.FUNCS,
        $l      = $.logic,
        $css    = $l.css;

    return function ( node, conf ) {
        if ( !$f.isNode( node ) ) {
            throw '[plugin.tab]: ' + $f.NODESTRING;
        }
        var config = $f.parseObj( {
            'attrName'      : 'node-type',      // 节点属性名称
            'tabAttrVal'    : 'tab',            // tag节点属性值
            'contentAttrVal': 'content',        // content节点属性值
            'agentAttr'     : 'action-type',    // 用于代理事件的属性名称
            'dataAttr'      : 'action-data',    // 用于代理事件存储数据的属性名称
            'keyVal'        : 'tabKey',         // TabTag用于代理事件的属性值
            'contentVal'    : 'tabContent',     // TabContent用于代理事件的属性值
            'evtType'       : 'click',          // 触发的事件类型，支持mouseleave与mousein
            'activeClass'   : undefined,        // 被选中的TabTag的class
            'negativeClass' : undefined         // 未被选中的TabTag的class
        }, conf );

        var $agentEvt = $l.evt.event.agentEvt;

        var agentObj;

        var nodes, contents, keys, that = {}, classList;

        // 获取节点map
        var domInit = function () {
            nodes       = $l.dom.nodeMap( node, config.attrName ),
            contents    = nodes[ config.contentAttrVal ];
            keys        = nodes[ config.tabAttrVal ];
        };

        // 显示目标节点，隐藏其它节点
        var showTarget = function ( target ) {
            for ( var i = 0, nL = contents.length; i < nL; i++ ) {
                if ( contents[i] != target ) {
                    $css.hide( contents[i] );
                }
                else {
                    $css.show( target );
                }
            }
        };

        // 获取某节点在当前节点列表中的位置
        var getThisIndex = function ( target, attrVal ) {
            var index = -1,
                nList = nodes[attrVal];
            for ( var i = 0, nL = nList.length; i < nL; i++ ) {
                if ( nList[i] == target ) {
                    index = i;
                }
            }
            return index;
        };

        // 由tabTag触发tabContent的变化
        var tabToContent = function ( spec ) {
            var intKey = parseInt(spec.data.target);
            // 传入索引值的情况
            if( intKey < contents.length ) {
                showTarget( contents[ intKey ] );
            }
            else{
                var tempNode = $l.dom.get( spec.data.target || '' );
                // 传入节点ID的情况
                if ( tempNode ) {
                    showTarget( tempNode );
                }
                // 无传入，或者传入非法的情况，以默认方式展现
                else {
                    var index = getThisIndex( spec.el, config.tabAttrVal );
                    showTarget( contents[ index ] )
                }
            }
        };

        // 高亮tab标签
        var highlightTab = function ( target ) {
            for ( var i = 0, nL = keys.length; i < nL; i++ ) {
                if ( keys[i] != target ) {
                    $l.dom.getClassList( target ).toggle( config.negativeClass, config.activeClass );
                }
                else {
                    $l.dom.getClassList( target ).toggle( config.activeClass, config.negativeClass );
                }
            }
        };

        // 点击事件处理
        var clickFn = function ( spec ) {
            // showTarget( spec.target );
            highlightTab( spec.el );
            tabToContent( spec );
            $l.evt.event.custEvt.fire( that, 'tab', [spec] );
        };

        var evtBind = function () {
            agentObj = $agentEvt( node, {
                'attrName' : config.agentAttr,
                'dataName' : config.dataAttr
            });
            agentObj.add( config.keyVal, config.evtType, clickFn );
        };

        var init = function () {
            domInit();
            evtBind();
        };
        init();
        that.destroy = function () {
            // 销毁自定义事件和代理事件
            $l.evt.event.custEvt.destroy( that );
            agentObj.destroy();
        };
    };
});