/**
 * JQ弹幕组件，biu
 */
~function () {
    var $T = {
        unikey: function ( len ) {
            var l = (typeof len == 'number') ? len : 16;
            var result = '';
            for( ; result.length < l; result += Math.random().toString(36).substr(2) );
            return result.substr( 0, l );
        },
        strReplace: function (str, data) {
            var reg = /\#\{([a-zA-Z\_\-0-9]+)\}/g;
            var result = str.replace(reg, function (){
                var ar = (typeof data[arguments[1]] == 'undefined' ) ? '' : data[arguments[1]];
                return ar;
            });
            return result;
        },
        isType: function (v, type) {
            var typeV = (typeof v);
            if (typeV === 'undefined') {
                return /^undefined$/i.test(type);
            }
            else {
                var reg = new RegExp(type, 'gi');
                try {
                    var transStr = v.constructor.toString();
                    return reg.test(transStr);
                }
                catch (NULL) {
                    return (/^object$/i.test(typeV) && /^null$/i.test(type));
                }
            }
        },
        parseParam: function (rootObj, newObj, isNumParse) {
            var tempObj = {};
            newObj = $T.isType(newObj, 'object') ? newObj : {};
            for (var i in rootObj) {
                tempObj[i] = rootObj[i];
                if (i in newObj) {
                    var temp = newObj[i];
                    var parseVal = parseFloat(temp);
                    if (isNumParse && !isNaN(parseVal)) {
                        temp = parseVal;
                    }
                    tempObj[i] = temp;
                }
            }
            return tempObj;
        },

        // 获取随机整数
        randomRg: function (min, max) {
            var step = max - min;
            return min + Math.ceil(Math.random() * step);
        },

        // 计算滚动间隔
        countSpeed: function (speed, range, fps, minT, maxT) {
            var frameStep = 1000 / fps;
            var duration = $T.randomRg(minT, maxT);
            if (speed >= 0.5) {
                return speed * range / (duration / frameStep);
            }
            else {
                return 1;
            }
        },
        senseStrFilter: function (str) {
            
        }
    };

    // 发送器
    var sender = function () {};

    // 接收器/获取器
    var receptor = function () {};

    // 展示舞台
    // @param rangeNd 动画范围节点
    var platform = function (rangeNd) {
        this.container = $(rangeNd);
        this.channel = {};
        this.width = this.container.width();
        this.height = this.container.height();
        this._ = {};
        this.length = 0;
    };

    // 初始化canvas节点宽高
    platform.prototype.init = function (conf) {
        var canvas = $('<canvas></canvas>');
        canvas.attr('width', this.width);
        canvas.attr('height', this.height);
        canvas.css({
            position: 'absolute',
            left: '0',
            top: '0'
        });

        this.cf = $T.parseParam({
            fps: 120,
            font: '12px 微软雅黑',
            fillStyle: '#000',
            // 一条记录持续的时间
            minT: 2000,
            maxT: 8000,

            // 限制的最大可展示条数，默认无限制
            limmit: undefined
        }, conf);

        this._ = {};
        var tmpPos = this.container.css('position');
        if (tmpPos != 'relative' && tmpPos != 'absolute') {
            this.container.css('position', 'relative');
        }
        this.container.append(canvas);
        this._.epannel = epannel(canvas[0]);

        return this;
    };

    /**
     * 添加文本动画展示
     * @param {[type]} text    要展示的文本
     * @param {[type]} conf   配置参数speed-速度，font-ctx.font，fillstyle-ctx.fillstyle
     * @param {[type]} sudo 是否强制写入，在限制数目的情况下有效
     */
    platform.prototype.add = function(text, conf, sudo) {
        var self = this;
        if (typeof self.cf.limmit === 'number' && self.cf.limmit <= self.length && !sudo) {
            return false;
        }

        var cf = $T.parseParam({
            speed: 0.5,
            font: self.cf.font,
            fillstyle: self.cf.fillStyle
        }, conf);

        var verginPos = $T.randomRg(0, self.height);
        var textSize;
        var xPos = self.width;
        var myPannel = self._.epannel;
        var pKey;
        var stepL = 1;
        var speed = cf.speed;
        var fontStr = cf.font;
        var styleStr = cf.fillstyle;


        var paintFn = function (aniLevel) {
            myPannel._.canvas.fillStyle(styleStr);

            myPannel.addTxt(text,  {x: xPos -= stepL, y: verginPos}, fontStr, {v: 'middle', l: 'left'});

            if (!textSize) {
                textSize = myPannel.textWidth(text);
                stepL = $T.countSpeed(speed, xPos + textSize, self.cf.fps, self.cf.minT, self.cf.maxT);
            }
            if (xPos <= -textSize) {
                myPannel.removePaintFn(pKey);
                self.length--;
            }
        };

        pKey = myPannel.addPaintFn(paintFn);
        self.length++;
        myPannel.scan(self.cf.fps);
        return true;
    };

    window.cPlatform = function (container, conf) {
        var obj = new platform(container);
        obj.init(conf);
        return obj;
    };

    /**
     * 低级浏览器处理方案
     * 批量捆绑动画到一个动画盒子里实现
     */


    // 内容基类
    var contentItem = function (text) {
        var nd = $('<span>' + text + '</span>');
    };

    // 获取随机位置经处理过的Html内容
    contentItem.prototype.getHtml = function() {
        
    };

    // 获取对应方向上的尺寸
    contentItem.prototype.getBoxSize = function() {
        
    };

    contentItem.prototype.remove = function() {
        
    };
    

    // 降级方案的动画盒子
    var aniPannel = function (container) {
        this.container = $(container);
        this.conf = {};
        this.childrenNd = [];
        this.speed = 1;
        this.aniDir = 'l';
        this.status = 'idle';
        this.length = 0;
        // 整个盒子的长度，以其内容长度做追加
        this.boxLength = 0;
    };

    // @param item 内容基类
    aniPannel.prototype.renderItem = function(item) {
        var htmlStr = item.getHtml();
        this.container.append(htmlStr);
    };

    // @param item 内容基类
    aniPannel.prototype.push = function(item) {
        var iId = 'Biu' + $T.unikey();
        this.childrenNd.push({
            id: iId,
            item: item
        });
        // 先渲染内容到页面
        this.renderItem(item);

        this.boxLength += item.getBoxSize();
        this.length++;
        return iId;
    };

    aniPannel.prototype.pop = function() {
        if (this.length) {
            var item = this.childrenNd.pop();

            this.boxLength -= item.getBoxSize();
            item.remove();
            this.length--;
            return item;
        }
        return false;
    };

    aniPannel.prototype.unshift = function(item) {
        var iId = 'Biu' + $T.unikey();
        this.childrenNd.unshift({
            id: iId,
            item: item
        });
        // 先渲染内容到页面
        this.renderItem(item);

        this.boxLength += item.getBoxSize();
        this.length++;
        return iId;
    };

    aniPannel.prototype.shift = function(item) {
        if (this.length) {
            var item = this.childrenNd.shift();
            this.boxLength -= item.getBoxSize();
            item.remove();
            this.length--;
            return item;
        }
        return false;
    };

    // @param iId 条目ID，由追加方法返回
    aniPannel.prototype.del = function(iId) {
        var nList = this.childrenNd;
        for (var i = 0, cL = nList.length; i < cL; i++) {
            var item = nList[i];
            if (item.id === iId) {
                this.childrenNd.splice(i, 1);

                this.boxLength -= item.getBoxSize();
                item.remove();
                this.length--;
                return item;
            }
        }
        return false;
    };

    // pannel 的销毁方法
    aniPannel.prototype.destroy = function() {
        
    };

    // 继续执行动画
    aniPannel.prototype.play = function() {
        this.status = 'playing';
    };

    // 停止执行动画
    aniPannel.prototype.pause = function() {
        this.status = 'idle';
    };

} ();