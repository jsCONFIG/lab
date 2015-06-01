/**
 * 事件打包，支持常规事件，代理事件，自定义事件，扩展的鼠标事件
 */
CJS.Import( 'dom.getClosest' );
CJS.register('evt.event', function($){
	// 异常管理
	var error = $.FUNCS.error;

	/*
	 * mouse事件扩展
	 * 增加鼠标移出mouseleave和鼠标移入mousein的事件	
	 */
	var __mouseFn__;// 实际绑定的方法
	var mouseObj = {
		'mouseFnList' : $.FUNCS.dataCenter(),
		'mouseLock' : {
			'mouseleave' : false,
			'mousein'	 : false
		},
		'mouseFn' : function(node, type){
			if(mouseObj.mouseLock[type]){
				return;
			}
			var fnType = '__' + type + '__';
			var realType = (type == 'mouseleave' ? 'mouseout' : 'mouseover');
			__mouseFn__ = function(e){
				var evt = e || window.event;
				var relatedTarget = evt.relatedTarget || (type == 'mouseleave' ? evt.toElement : evt.fromElment);
				// 如果关联的目标包含在节点内部则表示是节点内部的过渡，无需触发，相反则需触发
				if(!$.FUNCS.isContains(relatedTarget, node)){
					var funList = mouseObj.mouseFnList.get(fnType);
					$.FUNCS.forEach(funList, function(item){
						item(evt);
					});
				}
			};
			addEvt(node, realType, __mouseFn__);
		},
		'removeMouse' : function(node, type, func){
			var fnType = '__' + type + '__';
			var realType = (type == 'mouseleave' ? 'mouseout' : 'mouseover');
			var funList = mouseObj.mouseFnList.get(fnType);
			var funPos = $.FUNCS.indexOf(func, funList);
			if(funPos > -1){
				// 从方法队列中移除对应的方法，如果队列为空则解除方法绑定
				mouseObj.mouseFnList.remove(fnType, funPos);
				if(funList.length == 0){
					removeEvt(node, realType, __mouseFn__);
					mouseObj.mouseLock[fnType] = true;
				}
			}
		}
	};
	var mouseExpand = {
		'add' : function(node, type, func){
			var fnType = '__' + type + '__';
			mouseObj.mouseFnList.set(fnType, func);// 储存方法
			mouseObj.mouseFn(node, type);
		},
		'remove' : function(node, type, func){
			mouseObj.removeMouse(node, type, func);
		}
	};
	/*
	 * 自定义事件	
	 */
	// 辅助对象添加组件，其中，原理与CJS.register的命名空间定义类似
	var custObjHelp = function(mainObj, name, data){
		if(name.indexOf('.') == -1 && (!name in mainObj)){
			mainObj[name] ? mainObj[name].push(data) : (mainObj[name] = [data]);
		}
		else if(name.indexOf('.') != -1){
			var nameArr = name.split('.');
			var tempFunc = mainObj;
			for(var i = 0; i < nameArr.length - 1; i++){
				tempFunc = tempFunc[nameArr[i]] = (nameArr[i] in tempFunc) ? tempFunc[nameArr[i]] : {};
			}
			var tempName = nameArr.pop();
			tempFunc[tempName] ? tempFunc[tempName].push(data) : (tempFunc[tempName] = [data]);
		}
	};
	var customEvent = {
		'evtBase' : {},
		'add' : function(obj, evtType, func) {
			var key = obj['__custEvtKey__'];
			if(key){
				var nameStr = key + '.' + evtType;
				custObjHelp(customEvent.evtBase, nameStr, func);
			}
			else {
				obj['__custEvtKey__'] = $.FUNCS.getKey();
				customEvent.add(obj, evtType, func);
			}
		},
		'remove' : function(obj, evtType, func) {
			var key = obj['__custEvtKey__'];
			var data;
			if(key && (data = customEvent.evtBase[key])){
				if(typeof func == 'undefined'){
					data[evtType] = [];
					return;
				}
				var index = $.FUNCS.indexOf(func, data[evtType]);
				if(index > -1){
					data[evtType].splice(index, 1);
				}
			}
		},
		'fire' : function(obj, evtType, dataArr){
			var key = obj['__custEvtKey__'];
			dataArr = dataArr ? dataArr : [];
			var data;
			if(key && (data = customEvent.evtBase[key])){
				funcList = data[evtType];
				if($.FUNCS.isArray(funcList)){
					if(!$.FUNCS.isArray(dataArr)){
						dataArr = [dataArr];	
					}
					for(var i = funcList.length - 1; i >= 0; i--){
						funcList[i].apply(null, dataArr);
					}
				}
			}
		},
		// 显示当前对象或者key值对应的事件名称列表，仅显示名称，避免外部操作修改
		'show' : function (obj) {
			var fnList, nameList = [];
			if ( $.FUNCS.isWhat( obj, 'object' ) ) {
				var key = obj['__custEvtKey__'];
				fnList = customEvent.evtBase[key];

			}
			else if ( $.FUNCS.isWhat( obj, 'number') ) {
				fnList = customEvent.evtBase[obj];
			}
			if ( fnList ) {
				for ( var i in fnList ) {
					nameList.push( i );
				}
			}
			return nameList;
		},
		'destroy' : function(obj){
			if ( $.FUNCS.isWhat( obj, 'object' ) ) {
				if ( obj.hasOwnProperty( '__custEvtKey__' ) ) {
					delete customEvent.evtBase[obj.__custEvtKey__];
					delete obj.__custEvtKey__;
				}
			}
		}
	};
	var custEvt = {
		'add' 		: customEvent.add,
		'remove' 	: customEvent.remove,
		'fire' 		: customEvent.fire,
		'show'		: customEvent.show,
		'destroy' 	: customEvent.destroy
	}
	/*
	 * 事件绑定
	 * @parameter 绑定节点 | 事件类型(支持mouseleave和mousein事件) | 绑定方法
	 */
	var addEvt = function(node, type, func){
		if(!node){
			error.set('[evt.event.addevt]','need node as first parameter!');
			return false;
		}
		// 增强鼠标离开和进入方法
		if(type == 'mouseleave' || type == 'mousein'){
			mouseExpand.add(node, type, func);
		}
		else{
			// 如果是滚轮事件，则针对火狐浏览器做兼容处理
			if ( type == 'mousewheel' ) {
				!node.hasOwnProperty( 'onmousewheel' ) && ( type = 'onDOMMouseScroll' );
			}
			if(node.addEventListener){
				node.addEventListener(type, func, true);
			}
			else if(node.attachEvent){
				node.attachEvent('on' + type, func);
			}
			else{
				node['on' + type] = func;
			}	
		}
	};
	/*
	 * 事件解绑
	 * @parameter 绑定节点 | 事件类型 | 绑定方法
	 */
	var removeEvt = function(node, type, func){
		if(!node){
			error.set('[evt.event.removeEvt]','need node as first parameter!');
			return false;
		}
		// 增强鼠标离开和进入方法
		if(type == 'mouseleave' || type == 'mousein'){
			mouseExpand.remove(node, type, func);
		}
		else{
			if(node.removeEventListener){
				node.removeEventListener(type, func, true);
			}
			else if(node.detachEvent){
				node.detachEvent('on' + type, func);
			}
			else{
				node['on' + type] = function(){};
			}
			
		}
	};
	/*
	 * 代理事件
	 * @parameter 绑定根节点 | 参数
	 * config :
	 * 	{
			'attrName' : 用于识别事件发生的节点的属性名
			'dataName' : 用于存储事件发生的相关数据的属性名
	 	}
	 	var test = $.logic.evt.event.agentEvt(document.body);
	 	test.add('clickNode', 'click', function(spec){console.log(spec)});
	 	// 其中，clickNode为那些action-type属性值为'clickNode'的节点
	 */
	var agentEvt = function(root, conf){
		if(!root){
			error.set('[evt.event.agentEvt]','need node as first parameter!');
			return false;
		}
		var config = $.FUNCS.parseObj({
			'attrName' : 'action-type',
			'dataName' : 'action-data'
		}, conf || {});
		var skipNodes = [];
		var FnBase = {};
		// 绑定锁，用于避免多次真实绑定，区分事件类型
		var addLock = {};
		var __func__ = function(e){
			// 重新定义evt对象
			var e = e || window.event || {};
			var target = e.target || e.srcElement,
				type = e.type,
				left = e.X || e.clientX,
				top = e.Y || e.clientY,
				temp;// 储存临时的relatedTarget对象
			if(type == 'mouseout' || type == 'mouseover'){
				temp = e.relatedTarget || (type == 'mouseout' ? e.toElement : e.fromElment);
			}
			var relatedTarget = temp,
				attr = target.getAttribute(config.attrName);

			// if ( attrVal != '*' && attr != attrVal) {
			// 	var tempTarget = $.logic.dom.getClosest( target, '[' + config.attrName + '=' + attrVal + ']' );
			// 	if ( !!tempTarget ) {
			// 		target = tempTarget;
			// 	}
			// }
			var startFn = function () {
				if ( FnBase[ type ] && FnBase[ type ][ attr ] && $.FUNCS.indexOf(target, skipNodes) == -1 ) {
					e.data = $.FUNCS.strToJson(target.getAttribute(config.dataName));
					e.el = target;
					e.relatedTarget = relatedTarget;
					e.l = left;
					e.t = top;
					var funcs = FnBase[type][attr];
					for ( var i = 0, fL = funcs.length; i < fL; i++ ) {
						funcs[i](e);
					}
				}
			};
			if ( !FnBase[ type ] ) {
				return;
			}
			// 如果所检测的相关数据不存在则朝上层节点遍历
			if ( !FnBase[ type ][ attr ] ) {
				target = target.parentNode;
				while(target.nodeType == 1 && $.FUNCS.isContains( target, root ) ){
					attr = target.getAttribute(config.attrName);
					if( FnBase[ type ][ attr ] ) {
						startFn();
					}
					target = target.parentNode;
				}
				return;
			}
			startFn();	
			// // 判断是否为指定属性，通配符直接通过
			// if(tempKey && $.FUNCS.indexOf(target, skipNodes) == -1){
			// 	e.data = $.FUNCS.strToJson(target.getAttribute(config.dataName));
			// 	e.el = target;
			// 	e.relatedTarget = relatedTarget;
			// 	e.l = left;
			// 	e.t = top;
			// 	// 遍历整个方法对象，
			// 	// 如果属性值为指定值或通配符，
			// 	// 则执行该情况下的指定事件类型的方法
			// 	var fnObj;
			// 	for(var i = 0; i < FnBase.length; i++){
			// 		fnObj = FnBase[i];
			// 		if(fnObj.attrVal == attrVal || fnObj.attrVal == '*'){
			// 			fnObj.evtType == evtType && fnObj.func(e);
			// 		}
			// 	}
			// }
		}
		// 属性值-绑定方法键值对
		// var attrFn = {};
		return {
			'add' : function(attrVal, evtType, func){
				// attrFn[attrVal] = {
				// 	'type': evtType,
				// 	'fn': func
				// };
				// 实际绑定的函数定义
				if( !FnBase[ evtType ] ) {
					FnBase[ evtType ] = {};
				}
				if( !FnBase[ evtType ][ attrVal ] ) {
					FnBase[ evtType ][ attrVal ] = [];
				}
				FnBase[ evtType ][ attrVal ].push( func );
				// 用于保证每个事件类型至多只绑定一次
				if(!addLock[evtType]){
					addEvt(root, evtType, __func__);
					addLock[evtType] = true;
				}
				return func;
			},
			'addSkip' : function(nodes){// 添加略过节点
				!$.FUNCS.isArray(nodes) && (nodes = [nodes]);
				Array.prototype.push.apply(skipNodes, nodes);
			},
			'removeSkip' : function(nodes){// 移除略过节点
				!$.FUNCS.isArray(nodes) && (nodes = [nodes]);
				for(var i = 0 ; i < nodes.length; i++){
					var pos = $.FUNCS.indexOf(nodes[i], skipNodes);
					pos > -1 && skipNodes.splice(pos, 1);
				}

			},
			'remove' : function(attrVal, evtType, func){
				if ( FnBase[evtType] && FnBase[evtType][attrVal] ) {
					var tempFuncs = FnBase[evtType][attrVal],
						pos = 0;
					if( (pos = $.FUNCS.indexOf( func, tempFuncs )) != -1 ) {
						// 删除对应的项
						tempFuncs.splice( pos, 1 );
					}
					// 如果对应项没有方法了，则移除掉对应的属性key
					if(tempFuncs.length == 0){
						delete FnBase[evtType][attrVal];
					}
					// 如果对应事件下没有方法了，则移除掉该事件绑定
					// 同时把事件绑定锁至为解锁状态
					if( $.FUNCS.objLength( FnBase[evtType] ) == 0 ) {
						removeEvt(root, evtType, __func__);
						addLock[evtType] = false;
					}
				}
				// 遍历FnBase
				// var fnObj, aK, eK, fK;
				// for(var i = 0; i < FnBase.length; i++){
				// 	fnObj = FnBase[i];
				// 	aK = (attrVal == '*') ? true : fnObj.attrVal == attrVal;
				// 	if(aK && fnObj.evtType == evtType && fnObj.func == func){
				// 		FnBase.splice(i, 1);
				// 	}
				// }
			},
			'destroy' : function(){
				removeEvt(root, evtType, __func__);
				addLock[evtType] = false;
			}
		};
	};
	return {
		'addEvt' 	: addEvt,
		'removeEvt' : removeEvt,
		'agentEvt' 	: agentEvt,
		'custEvt'	: custEvt
	}
});