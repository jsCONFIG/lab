CJS.Import( 'num.ary' );
CJS.register( 'str.ctrlColor', function ( $ ) {
    var $ary = $.logic.num.ary;
    return {
        // hexToDecimal 16进制转10进制,16进制需要六位
        'HTD': function ( colorStr ) {
            if( /.*rgb.*/.test( colorStr ) ) {
                return colorStr.replace(/\s/g, '');
            }
            // 如果书写为三位字符的情况，自动补全成六位，补全规则为重复每一位
            if ( /^\#[0-9a-fA-F]{3}$/.test( colorStr ) ) {
                colorStr.replace( /([0-9a-fA-F])/g, '$1$1' )
            }
            var tempStr = colorStr.slice(1);
            var result = '';
            result = 'rgb(' + $ary.HTD ( tempStr.slice( 0, 2 ) ) + ',' + $ary.HTD ( tempStr.slice( 2, 4 ) ) + ',' + $ary.HTD ( tempStr.slice( 4, 6 ) ) + ')';
            return result;
        },
        // decimalToHex 10进制转16进制
        'DTH': function ( colorStr ) {
            var str = colorStr.replace( /\s/g, '' );
            var reg = /rgb\(([^\)]+)\)/i;
            var tempArr = str.match( reg );
            if ( !tempArr ) {
                $.FUNCS.error.set( '[str.ctrlColor]', 'illegal color string!' );
                return false;
            }
            tempArr = tempArr[1].split( ',' );
            return '#' + $ary.DTH( tempArr[0] ) + $ary.DTH( tempArr[1] ) + $ary.DTH( tempArr[2] );
        }
    };
} );