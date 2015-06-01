~function () {
    var pannel = document.getElementById('pannel'),
        inputor = document.getElementById('inputor'),
        send = document.getElementById('send');

    window.myCtx = cPlatform(document.getElementById('pannel'), {
        limmit: 10
    });
    counter = 1;
    // return;
    setInterval(function () {
        myCtx.add('BottleLiu' + (counter++), {speed: Math.random()});
        if (!counter%3) {
            myCtx.add('BottleLiuCopy3' + (counter - 1), {speed: Math.random()});
        }
        if (!counter%5) {
            myCtx.add('BottleLiuCopy5' + (counter - 1), {speed: Math.random()});
        }
        if (!counter%7) {
            myCtx.add('BottleLiuCopy7' + (counter - 1), {speed: Math.random()});
        }
        if (!counter%6) {
            myCtx.add('BottleLiuCopy8' + (counter - 1), {speed: Math.random()});
        }
    }, 300);

    send.addEventListener('click', function () {
        var val = inputor.value;
        if (!val) {
            return;
        }
        myCtx.add(val, {speed: Math.random(), font: '18px 微软雅黑', fillstyle: 'red'}, true);
        inputor.value = '';
    }, false);

    inputor.addEventListener('keyup', function (e) {
        if (e.keyCode != 13) {
            return;
        }
        var val = inputor.value;
        if (!val) {
            return;
        }
        myCtx.add(val, {speed: Math.random(), font: '18px 微软雅黑', fillstyle: 'red'}, true);
        inputor.value = '';
    }, false);
} ();