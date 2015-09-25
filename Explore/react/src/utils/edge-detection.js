/**
 * 多点边缘检测，用于实现类ps智能参考线的效果
 */
import utils from './util';

const arrHasKey = utils.arrHasKey;

const _tools = {
    // 两点边缘检测
    judgeCore (sense, myMap, referMap) {
        if (myMap.id === referMap.id) {
            return false;
        }

        else {
            let referXRange = referMap.x[1] - referMap.x[0],
                referYRange = referMap.y[1] - referMap.y[0];

                // 左左边距
            let xLeftGap = (myMap.x[0] - referMap.x[0]),
                // 右右边距
                xRightGap = (myMap.x[1] - referMap.x[1]),
                // 左右边距
                xLeftToRightGap = (myMap.x[0] - referMap.x[1]),
                // 右左边距
                xRightToLeftGap = (myMap.x[1] - referMap.x[0]);

            let xSenseLeft = Math.abs(xLeftGap / referXRange),
                xSenseRight = Math.abs(xRightGap / referXRange),
                xSenseLR = Math.abs(xLeftToRightGap / referXRange),
                xSenseRL = Math.abs(xRightToLeftGap / referXRange);

            let yTopGap = (myMap.y[0] - referMap.y[0]),
                yBottomGap = (myMap.y[1] - referMap.y[1]),
                yTopToBottomGap = (myMap.y[0] - referMap.y[1]),
                yBottomToTopGap = (myMap.y[1] - referMap.y[0]);

            let ySenseTop = Math.abs(yTopGap / referYRange),
                ySenseBottom = Math.abs(yBottomGap / referYRange),
                ySenseTB = Math.abs(yTopToBottomGap / referYRange),
                ySenseBT = Math.abs(yBottomToTopGap / referYRange);

            let xLeftFlag = xSenseLeft <= sense,
                xRightFlag = xSenseRight <= sense,
                xLRFlag = xSenseLR <= sense,
                xRLFlag = xSenseRL <= sense,
                yTopFlag = ySenseTop <= sense,
                yBottomFlag = ySenseBottom <= sense,
                yTBFlag = ySenseTB <= sense,
                yBTFlag = ySenseBT <= sense;

            if (!xLeftFlag && !xRightFlag && !yTopFlag && !yBottomFlag && !xLRFlag && !xRLFlag && !yTBFlag && !yBTFlag) {
                return false;
            }

            return {
                left: xLeftFlag ? xLeftGap : false,
                right: xRightFlag ? xRightGap : false,
                top: yTopFlag ? yTopGap : false,
                bottom: yBottomFlag ? yBottomGap : false,
                leftToRight: xLRFlag ? xLeftToRightGap : false,
                rightToLeft: xRLFlag ? xRightToLeftGap : false,
                topToBottom: yTBFlag ? yTopToBottomGap : false,
                bottomToTop: yBTFlag ? yBottomToTopGap : false
            };
        }
    },

    // 二维边缘检测
    judgeEdge (sense, myMap, maps) {
        let result = {},
            flag = false;

        maps.forEach((map) => {
            result[map.id] = _tools.judgeCore(sense, myMap, map);
            if (result[map.id]) {
                flag = true;
            }
        });

        return !flag ? flag : result;
    }
};

/**
 * 多点边缘检测
 */
class Edge {
    constructor (maps, opts = {}) {
        this.map = maps || [];
        this.lead = opts.lead;
        this.sense = opts.sense || .05;
    }

    setMain (id) {
        let pos = arrHasKey(this.map, 'id', id);
        if (pos !== -1) {
            this.lead = id;
        }

        return this;
    }

    setSense (senseVal) {
        this.sense = senseVal;
    }

    updateMap (mid, map) {
        let pos = arrHasKey(this.map, 'id', mid);

        if (pos === -1) {
            return false;
        }

        this.map.splice(pos, 1, map);
        return true;
    }

    addMap (map) {
        if (map && map.hasOwnProperty('id')) {
            let pos = arrHasKey(this.map, 'id', map.id);

            if (pos !== -1) {
                this.updateMap(map.id, map);
                return this;
            }

            this.map.push(map);

        }
        return this;
    }

    judge (myRange) {
        if (!myRange && this.lead) {
            let pos = arrHasKey(this.map, 'id', this.lead);
            if (pos !== -1) {
                myRange = this.map[pos];
            }
        }

        if (!myRange) {
            return false;
        }

        let result = _tools.judgeEdge(this.sense, myRange, this.map);

        return result;
    }

    // 判断并获取最接近的条目
    judgeAndGetClosest (myRange) {
        let judgeResult = this.judge(myRange);

        if (!judgeResult) {
            return false;
        }

        let vertical = undefined,
            level = undefined,
            vMin = Infinity,
            lMin = Infinity;

        for (let i in judgeResult) {

            if (judgeResult.hasOwnProperty(i)) {
                let alignItem = judgeResult[i];
                
                if (alignItem) {
                    // 数据预处理
                    let left = alignItem.left,
                        right = alignItem.right,
                        leftToRight = alignItem.leftToRight,
                        rightToLeft = alignItem.rightToLeft,
                        top = alignItem.top,
                        bottom = alignItem.bottom,
                        topToBottom = alignItem.topToBottom,
                        bottomToTop = alignItem.bottomToTop;

                    left = left === false ? Infinity : Math.abs(left);
                    right = right === false ? Infinity : Math.abs(right);
                    leftToRight = leftToRight === false ? Infinity : Math.abs(leftToRight);
                    rightToLeft = rightToLeft === false ? Infinity : Math.abs(rightToLeft);
                    top = top === false ? Infinity : Math.abs(top);
                    bottom = bottom === false ? Infinity : Math.abs(bottom);
                    topToBottom = topToBottom === false ? Infinity : Math.abs(topToBottom);
                    bottomToTop = bottomToTop === false ? Infinity : Math.abs(bottomToTop);

                    // 垂直鉴定
                    // 判断left, right, leftToRight, rightToLeft之间最小的
                    let tmpVMin = Infinity,
                        tmpVDir;

                    tmpVMin = Math.min(left, right, leftToRight, rightToLeft);

                    switch (tmpVMin) {
                        case left:
                            tmpVDir = 'left';
                            break;
                        case leftToRight:
                            tmpVDir = 'leftToRight';
                            break;
                        case right:
                            tmpVDir = 'right';
                            break;
                        case rightToLeft:
                            tmpVDir = 'rightToLeft';
                            break;
                    }

                    if (tmpVMin !== Infinity && tmpVMin <= vMin && tmpVDir) {
                        if (!vertical) {
                            vertical = {};
                        }
                        vertical.id = i;
                        vertical.val = vMin = tmpVMin;
                        vertical.dir = tmpVDir;
                    }

                    // 水平鉴定
                    let tmpLMin = Infinity,
                        tmpLDir;

                    tmpLMin = Math.min(top, bottom, topToBottom, bottomToTop);

                    switch (tmpLMin) {
                        case top:
                            tmpLDir = 'top';
                            break;
                        case topToBottom:
                            tmpLDir = 'topToBottom';
                            break;
                        case bottom:
                            tmpLDir = 'bottom';
                            break;
                        case bottomToTop:
                            tmpLDir = 'bottomToTop';
                            break;
                    }

                    if (tmpLMin !== Infinity && tmpLMin <= lMin && tmpLDir) {
                        if (!level) {
                            level = {};
                        }
                        level.id = i;
                        level.val = lMin = tmpLMin;
                        level.dir = tmpLDir;
                    }
                }
            }
        }

        // 追加符号
        if (vertical) {
            let targetV = judgeResult[vertical.id];
            vertical.val = targetV[vertical.dir];
        }

        if (level) {
            let targetL = judgeResult[level.id];
            level.val = targetL[level.dir];
        }

        let result = {
            vertical,
            level
        };

        return result;
    }
}

export default Edge;