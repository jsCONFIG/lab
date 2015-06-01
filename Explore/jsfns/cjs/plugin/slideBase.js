/**
 * slide滑动组件基础模块，全套可配置
 * @param Object
 	{
		'prev'		: // 上一页节点
		'next'		: // 下一页节点
		'content'	: // 装内容的节点,
		'wrapper'	: // 外部包裹的节点,
		'stepT'		: // 单个动画切换持续时间
		'blankT'	: // 自动播放时的间隔时间
		'reroundT'	: // 一轮结束返回动画持续时间
		'aniType'	: // 动画类型
		'itemList'	: // 待处理节点列表(可选)，用于非等宽或等高节点的切换
		'sumL'		: // 切换的总长度
		'stepL'		: // 单个卡片的长度
		'fixL'		: // 修正值
		'dir'		: // 滑动的方向
		'autoSlide'	: // 是否自动滑动
		'wrapAdapt'	: // 外部包裹盒子宽高是否自适应 
		'holdPause'	: // 鼠标放上后是否暂停播放
 	}
 	// 下面一些事件通过自定义事件来执行
	'step'	: // 步进的回调方法
	'round'	: // 一轮结束的回调方法
	'pause'	: // 暂停的回调
	'play'	: // 播放的回调
 */
CJS.Import( 'evt.event' );
CJS.Import( 'css.base' );
CJS.Import( 'ani.action' );
CJS.register( 'plugin.slideBase', function ( $ ) {
	var $f = $.FUNCS,
		$l = $.logic;
	return function ( conf ) {
		var config = $f.parseObj( {
			'prev'		: undefined,
			'next'		: undefined,
			'content'	: undefined,
			'wrapper'	: undefined,
			'stepT'		: 1000,
			'blankT'	: 2000,
			'reroundT'	: 1000,
			'aniType'	: 'uniform',
			'itemList'	: undefined,
			'sumL'		: 100,
			'stepL'		: 10,
			'fixL'		: 0,
			'dir'		: 'marginLeft',
			'autoSlide'	: true,
			'wrapAdapt' : false,
			'holdPause'	: true
		}, conf );
		var $addEvt 	= $l.evt.event.addEvt,
			$custEvt	= $l.evt.event.custEvt,
			$action 	= $l.ani.action;

		var aniObjStep, aniObjBack, that = {}, autoClock, currentPos = tempPos = config.fixL, mainLock = false;
		var byHand = false, currentPage = 0;

		// 组件依赖初始化
		var pluginInit = function () {
			// 步进动画
			aniObjStep = $action( config.content, {
				'type'		: config.aniType,
	            'time'		: config.stepT,
	            'callback'	: function () {
	            	currentPos = tempPos;
	            	$custEvt.fire( that, 'step', config.content )
	            }
			});

			// 返回动画
			aniObjBack = $action( config.content, {
				'type' 		: config.aniType,
	            'time'		: config.reroundT,
	            'callback' 	: function () {
	            	currentPos = config.fixL;
	            	currentPage = 0;
	            	$custEvt.fire( that, 'round', config.content );
	            }
			});
		};

		// 步进滑动，接收参数可正可负，正数表示前进，负数表示后退
		var slideByStep = function ( key ) {
			var cssStyle = {},
				currentStyle = $l.css.base( config.content, config.dir );

			// tempPos = parseFloat( currentStyle ) + ( key >= 0 ? 1 : -1 ) * ( config.stepL + config.fixL );
			tempPos = currentPage * config.stepL + config.fixL;
			cssStyle[ config.dir ] = tempPos + 'px';
			// 做合法性检测
			if ( tempPos > config.fixL ){
				return;
			}
			// 此处做特殊值返回，用于处理播放完毕的情况
			if( tempPos < (-config.sumL + config.fixL + config.stepL) ) {
				return 'end';
			}
			currentPage += ( key >= 0 ? 1 : -1 );
			aniObjStep.play( cssStyle );
		};

		// 返回到初始
		var slideBack = function () {
			var cssStyle = {};
			cssStyle[ config.dir ] = 0 + config.fixL + 'px';
			aniObjBack.play( cssStyle );
		};

		// 翻上一页
		var prev = function () {
			return slideByStep( 1 );
		};

		// 翻下一页
		var next = function () {
			return slideByStep( -1 );
		};

		var autoPlay = function () {
			var checkKey;
			autoClock && window.clearInterval( autoClock );
			autoClock = window.setInterval( function () {
				if ( mainLock ) {
					return;
				}
				aniObjBack.destroy();
				aniObjStep.destroy();
				checkKey = next();
				if ( checkKey == 'end' ) {
					slideBack();
				}
			}, config.blankT );
		};

		var evtBind = function () {
			if ( config.autoSlide ){
				// 鼠标移入内容区，则锁定自动播放，移出则解锁
				$addEvt( config.content, 'mousein', function () {
					byHand || (mainLock = true);
				});
				$addEvt( config.content, 'mouseleave', function () {
					byHand || (mainLock = false);
				});
			}
			config.prev && $addEvt( config.prev, 'click', prev );
			config.next && $addEvt( config.next, 'click', next );
		};

		var init = function () {
			pluginInit();
			evtBind();
			config.autoSlide && autoPlay();
		};
		init();
		that.pause = function () {
			mainLock = true;
			// 通过手动操作
			byHand = true;
		};
		that.play = function () {
			mainLock = false;
			// 通过手动操作
			byHand = true;
		};
		return that;
	};
});