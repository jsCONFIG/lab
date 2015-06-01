~function () {
    var $T = $M.tools;

    jQuery.fn.build = function () {
        var nodes = $( this ).find( '[data-node]' );

        var result = {};

        nodes.each( function ( index, item ) {
            var attr = $( item ).attr( 'data-node' );

            if( !result[ attr ] ) {
                result[ attr ] = [];
            }

            result[ attr ].push( item );
        });

        return result;
    };

    jQuery.fn.parseHtml = function () {
        var el = $( this );
        var result = {};
        var formNodes = $( 'input,textarea,select', el );
        formNodes.each( function ( index, item ) {
            item = $( item );
            // 增加略过节点
            if ( item.attr( 'formSkipe' ) == '1' ) {
                return;
            }
            var itemName = item.attr( 'name' );
            if ( itemName ) {
                switch ( item.attr( 'type' ) ) {
                    case 'checkbox' :
                        if ( item[0].checked ) {
                            if( result[ itemName ] ) {
                                result[ itemName ] += ',' + item.val();
                            }
                            else {
                                result[ itemName ] = item.val();
                            }
                        }
                        break;
                    case 'radio' :
                        if ( item[0].checked ) {
                            result[ itemName ] = item.val();
                        }
                        break;
                    default:
                        result[ itemName ] = $.trim( item.val() );
                }
            }
        });
        return result;
    };

    // 模糊移除class，参数为对应正则
    jQuery.fn.fuzzyRemoveClass = function ( reg ) {
        if( $T.isWhat( reg, 'regexp' ) ) {
            var attr = this.attr('class');
            attr = attr.replace( reg, '' );
            attr = attr.replace( /\s{2,}/g, ' ' );
            this.attr( 'class', attr );
        }
        else if( $T.isWhat( reg, 'string' ) ) {
            this.removeClass( reg );
        }
        
        return this;
    };

    jQuery.fn.actData = function () {
        var queryStr = $( this ).attr( 'act-data' );

        var result = {};

        if( queryStr ) {
            var reg = /([^\?&\&]+)/g;
            var temp = queryStr.match(reg);
            for (var i = 0; i < temp.length; i++) {
                var queryStr = temp[i];
                var strArr = queryStr.split('=');
                if (strArr.length >= 2) {
                    result[strArr[0]] = strArr[1];
                }
            }

        }

        return result;
    };

    if( window.$M ) {
        $M.options({ 
            'sourceRoot' : 'static/js/'
        });

        $M.expandT( {

            'strReplace' : function ( str, data ) {
                var reg = /\#\{([a-zA-Z\_\-0-9]+)\}/g;
                var result = str.replace( reg, function (){
                    var ar = ( typeof data[arguments[1]] == 'undefined' ) ? '' : data[arguments[1]];
                    return ar;
                } );
                return result;

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

            'toArray' : function ( likeArr, offset ) {
                return Array.prototype.slice.call( likeArr, offset || 0 );
            }
        } );
    }
}();