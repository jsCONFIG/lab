/**
 * ajax请求
 * 提供数据传送，XMLHttpRequest请求创建，跨域初步功能
 */
CJS.register('trans.ajax', function($){
	var error = $.FUNCS.error;
	// 创建XMLHttpRequest对象
	var createXHR = function(){
		if(typeof XMLHttpRequest != 'undefined'){
			createXHR = function(){
				return new XMLHttpRequest();
			};
			return createXHR();
		} 
		else if (typeof ActiveXObject != 'undefined'){
			createXHR = function(){
				var XHR;
				try{
					XHR = new ActiveXObject("Msxml2.XMLHTTP");
				}
				catch(other){
					try{
						XHR = new ActiveXObject("Microsoft.XMLHTTP");
					}
					catch(error){
						error.set('[trans.ajax]:',error);
					}
				}
				return XHR;	
			};
			return createXHR();
		}
		else {
			error.set( '[trans.ajax]:', 'Your browser do not support XMLHttpRequest!' );
			throw 'Your browser do not support XMLHttpRequest!';
		}
	};
	var xhrListener = function(conf){
		var config = $.FUNCS.parseObj({
			'url' 		: '',				// 请求地址
			'method' 	: 'get',			// 请求方法
			'data' 		: '',				// 待传输数据，可以是query字符串，可以是对象
			'isAsyn'	: true,				// 是否异步传输，默认是
			'time'		: 5 * 1000,			// 超时时间
			'autoStop'	: false,			// 
			'onTimeout' : function(){},		// 超时的回调
			'onSend'	: function(){},		// 开始发送的回调
			'onReceived' : function(){},	// 开始接收的回调
			'onFinish'	: function(){},		// 请求结束的回调
			'postData'	: '',
			'contenType' : 'application/x-www-form-urlencoded',
			'charset'	: 'UTF-8'
		}, conf || {});
		if(!config.url){
			error.set('[trans.ajax]', 'url is must!');
			return;
		}
		var xhr = createXHR();
		var outClock;
		var urlL = config.url.length;
		var requestUrl = config.url;
		var sendData = '',
			pData = null;
		// 传输query字符串的情况
		if ( $.FUNCS.isWhat( config.data, 'string' ) ) {
			sendData = encodeURIComponent(config.data);// 编码待传送数据
			sendData = sendData.replace(/\%3D/g, '=');// 将不该编码的“=”和“&”替换回来
			sendData = sendData.replace(/\%26/g, '&');
		}
		// 传输对象的情况
		else if ( $.FUNCS.isWhat( config.data, 'object' ) ) {
			sendData = $.FUNCS.jsonToStr( data );
		}
		// get形式下的重新封装方法
		var setDataUrl = function(){
			var urlTail = config.url.indexOf('?') == -1 ? '?' : '' + config.url.slice(urlL - 1) == '&' ? '' : '&';
			requestUrl = config.url + urlTail + '__fresh=' + $.FUNCS.getKey();// 保持在IE下的“新鲜”
			requestUrl = requestUrl + '&' + sendData;
		};
		if('onreadystatechange' in xhr){
			xhr.onreadystatechange = function(){
				switch(xhr.readyState){
					case 1 :// 启动
						outClock && clearTimeout(outClock);// 设定超时处理，超时即取消连接
						outClock = setTimeout(function(){config.onTimeout(xhr);xhr.abort()}, config.time);
						break;
					case 2 :// 发送
						config.onSend(xhr);
						break;
					case 3 :// 接收
						outClock && clearTimeout(outClock);
						outClock = undefined;
						config.onReceived(xhr);
						break;
					case 4 :// 完成
						// 304代表数据未修改，可直接使用缓存数据
						if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
							config.onFinish(xhr);
						}
						break;
					default :

				}
			}
			// 如果是get方式，则对url进行重新封装
			if(config.method == 'get'){
				setDataUrl();
			}
			xhr.open(config.method, requestUrl, config.isAsyn);
			// 如果是post方式，则设置头信息，添加sendData值
			if(config.method == 'post'){
				xhr.setRequestHeader("Content-Type", config.contenType + ';' + config.charset);
				pData = sendData;
			}
			xhr.send( pData );
		}
	};
	// 用于实现跨域请求
	var corsXhrListener = function(conf){
		var config = $.FUNCS.parseObj({
			'method' 	: get,
			'url' 		: '',
			'isAsyn'	: true	
		}, conf || {});
		if(!config.url){
			error.set('[trans.ajax]', 'url is must!');
			return;
		}
		var xhr = createXHR();
		if('withCredentials' in xhr){
			xhr.open(config.method, config.url, config.isAsyn);
		}
		else if(typeof XDomainRequest != "undefined"){
			xhr = new XDomainRequest();
			xhr.open(config.method, config.url);
		}
		else{
			xhr  = null;
		}
		return xhr;
	}
	return {
		'send' 	: xhrListener,
		'newXhr' : createXHR,
		'cors'   : corsXhrListener
	}
});