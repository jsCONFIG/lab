/**
 * 舞台
 */
define(function (require, exports, module) {
    var tools = require('./tools'),
        ep = require('./easypannel'),
        aniFrame = require('./frame');

    var stage = function (canvasNd) {
        this.pannel = ep(canvasNd);
        this.showList = [];
        // 状态分为三种，init, idle和busy
        this.state = 'init';

        // 将整个show按照每10个帧做一次划分，从1开始
        this.showStep = 1;
    };

    /**
     * 添加一个show，
     * 只能执行删除show操作
     * @param {Function} fn 
     */
    stage.prototype.addShow = function(fn) {
        if (!tools.isType(fn, 'function')) {
            return false;
        }

        this.showList.push(fn);
        return this;
    };

    // 删除一个show
    stage.prototype.delShow = function(fn) {
        var pos = tools.indexOf(this.showList, fn);
        if (pos != -1) {
            this.showList.splice(pos, 1);
        }
        return this;
    };

    // 每一帧执行的方法，包含清屏和绘制
    stage.prototype.frameItem = function () {
        // 清屏操作
        this.pannel.clearAll();

        // 绘帧操作
        var showList = this.showList;
        for (var i = 0, sL = showList.length; i < sL; i++) {
            var showItem = showList[i];
            showItem(this.showStep);
        }

        // 分级
        this.showStep++;
        if (this.showStep > 10) {
            this.showStep = 1;
        }
        return this;
    };

    stage.prototype.play = function () {
        var self = this;
        if (self.state === 'idle') {
            self.frame.reback();
        }
        else if (self.state === 'init') {
            self.frame = aniFrame(function () {self.frameItem()});
        }
        self.state = 'busy';
        return self;
    };

    stage.prototype.stop = function () {
        if (this.state === 'busy') {
            this.frame.cancel();
            this.state = 'idle';
        }
        return this;
    };

    return function (canvasNd) {
        return new stage(canvasNd);
    };
});