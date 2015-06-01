/**
 * 进制转换
 */
CJS.register( 'num.ary', function ( $ ) {
    return {
        // hexToDecimal 16进制转10进制
        'HTD': function ( num ) {
            return parseInt( '0X' + num );
        },
        // decimalToHex 10进制转16进制
        'DTH': function ( num ) {
            var number = parseInt( num );
            return number.toString( 16 );
        }
    };
} );