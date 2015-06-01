define(function (require, exports, module) {
    var stage = require('src/stage');

    var nd = function (idStr) {
        return document.getElementById(idStr);
    }

    var canvasNd = nd('stage'),
        play = nd('play'),
        pause = nd('pause');

    var stageExp = stage(canvasNd);

    var xPos = 800, stepL = 1;

    var textToLeft = function (step) {
        stageExp.pannel.addTxt('Hello word!',  {x: xPos -= stepL, y: 200}, '18px 微软雅黑', {v: 'middle', l: 'left'});
        if (xPos <= 100) {
            stageExp.stop();
            console.log('stop');
        }
    };

    stageExp.addShow(textToLeft);

    play.addEventListener('click', function () {stageExp.play();}, false);
    pause.addEventListener('click', function () {stageExp.stop();}, false);
});