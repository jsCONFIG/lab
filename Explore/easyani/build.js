/**
 * 动画生成主函数
 * @param  {[type]} require [description]
 * @param  {[type]} exports [description]
 * @param  {[type]} module) {}          [description]
 * @return {[type]}         [description]
 */
define(function (require, exports, module) {
    var stage = require('src/stage'),
        t = require('src/tools');


    var canvasNd = t.get('stage');

    var stageExp = stage(canvasNd);

    var evtHandler = {
        dropPic: function (e) {
            e = t.fromateEvt(e);
            e.preventDefault();
            var fileList = e.dataTransfer.files;
            
            var imgSrc = '';
            if (window.URL) {
                imgSrc = window.URL.createObjectURL(fileList[0]);
            }
            else if (window.webkitURL) {
                imgSrc = window.webkitURL.createObjectURL(fileList[0]);
            }
            
            var img = new Image();
            img.addEventListener('load', function() {
                stageExp.pannel.addImg(img, {
                    x: 100,
                    y: 100
                });
            }, false);
            img.src = imgSrc;
        },
        preventDefault: function (e) {
            e.preventDefault();
        }
    };

    canvasNd.addEventListener('drop', evtHandler.dropPic, false);
    document.addEventListener('dragleave', evtHandler.preventDefault, false);
    document.addEventListener('drop', evtHandler.preventDefault, false);
    document.addEventListener('dragenter', evtHandler.preventDefault, false);
    document.addEventListener('dragover', evtHandler.preventDefault, false);
});