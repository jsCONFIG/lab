define(function (){
    var keycode = {
        'ctrl'          : 17,
        'shift'         : 16,
        'enter'         : 13,
        'backspace'     : 8,
        'tab'           : 9,
        'shift'         : 16,
        'alt'           : 18,
        'caps_lock'     : 20,
        'esc'           : 27,
        'space'         : 32,
        'pageup'        : 33,
        'pagedown'      : 34,
        'end'           : 35,
        'home'          : 36,
        'left'          : 37,
        'up'            : 38,
        'right'         : 39,
        'down'          : 40,
        'del'           : 46,
        'num_lock'      : 136,
        'scroll_lock'   : 137
    };

    // abc
    var abcArr = 'abcdefghijklmnopqrstuvwxyz'.split('');
    for ( var i = 0, aL = abcArr.length; i < aL; i++ ) {
        keycode[ abcArr[i] ] = 65 + abcArr[i].charCodeAt(0) - 97;
    }

    // f1-f12
    for ( var i = 1; i <= 12; i++ ) {
        keycode[ 'f' + i ] = 111 + i;
    }
    var reverse = {};
    for( var i in keycode ) {
        if( keycode.hasOwnProperty( i ) ) {
            reverse[ keycode[i] ] = i;
        }
    }

    return {
        'code' : keycode,
        'key'  : reverse
    };
});