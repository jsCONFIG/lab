/**
 * 模板处理，使用同常见模板
 * @author liuping http://weibo.com/clpliuping 20131213
 * @example
 		var temp = '<#tp tempName dataName></#tp>'
 		if:
 			<#if (condition)>
 				xxx
 			<#elseif (condition)>
 				xxx
 			<#else>
 				xxx
 			</#if>
 		loop:
 			<#list ListData as list> 	//遍历一个数组对象
				${list_index} 		//在此次遍历中的当前索引
				${list.xxx} 		//取值
			</#list> 				//结束遍历
 */
CJS.Import( 'str.replace' );
CJS.register( 'str.template', function ( $ ) {
	var $f = $.FUNCS,
		$l = $.logic;
	return function ( str, data ) {
		if ( !$f.isWhat( str, 'string' ) ) {
			throw '[str.template]: need string as first parameter!';
		}
		// 获取本组的唯一值，用于模板占位
		var unikey = 'CJS_TP_' + $f.getKey() + '_';

		// 匹配所有字符串的模板，提取所有模板块
		var tempsReg 	= /(\<\#tp([^(\\|\>)]+)\>(.*?)\<\/\#tp\>)+?/g,
		// 匹配单个模板，提取该模板的所有信息
			singleTemp	= /\<\#tp([^(\\|\>)]+)\>(.*)\<\/\#tp\>/,
		// 匹配单个模板中的所有遍历模块 <#list 数据数组 as 模板中用来表示数组当前项的字符>
			loopsReg	= /(\<\#list([^(\\|\>)]+)\>(.*?)\<\/\#list\>)+?/g,
		// 匹配单个遍历模块
			singleLoop	= /\<\#list([^(\\|\>)]+)\>(.*)\<\/\#list\>/,
		// 匹配单个if模块
			ifReg		= /\<\#if\s*\(([^(\\|\>)]+)\)\s*\>(.*?)(\<\#elseif\s*\(([^(\\|\>)]+)\)\s*\>(.*?))?(\<\#else\s*\>(.*?))?\<\/\#if\>/,
			ifsReg		= /\<\#if\s*\(([^(\\|\>)]+)\)\s*\>(.*?)(\<\#elseif\s*\(([^(\\|\>)]+)\)\s*\>(.*?))?(\<\#else\s*\>(.*?))?\<\/\#if\>/g;

		// 获取字符串中的模板
		var tempsArr 	= str.match( tempsReg );
		// 模板替换，占位处理
		var num			= 0,
			htmlObj		= {},
			htmlStr 	= '';

		htmlStr = str.replace( tempsReg, function () {
			return '#{' + unikey + (num++) + '}'
		});

		// 输入数据字符串，返回处理后的字符串，以及是否非法的标识符，如果数据源中存在数据，则拉取数据，否则返回输入字符串
		var checkDataLegal = function ( datastr, rootData ) {
			var index = datastr.split('.')
				tempData = $f.copyObj( rootData || data ),
				flag = true;
			for ( var d = 1, dL = index.length; d < dL; d++ ) {
				if ( !$f.isWhat( tempData, 'object' ) ) {
					// 标识数据非法
					flag = false;
					break;
				}
				tempData = tempData[ index[d] ];
			}
			flag = !$f.isWhat( tempData, 'undefined' );
			return {'data': flag ? tempData : datastr, 'flag': flag};
		};

		// 获取基于某个data名称的循环单体和索引的正则表达式
		var loopItemIndexReg = function ( dataName ) {
			return {
				'item'	: new RegExp( '\\$\\{(' + dataName + '(\\.[a-zA-Z\\_0-9]+)*)\\}' , 'g' ),
				'index'	: new RegExp( '\\$\\{(' + dataName + '_index)\\}', 'g' )
			}
		};

		// 循环处理 @param Array 纯净的循环结构数组 返回处理之后的数据数组
		var parseLoop = function ( loops ) {
			if ( loops ) {
				var loopInfo, loop, loopBody, loopArr = [], flag = true;
				for ( var j in loops ) {
					// 解析单个循环
					loop = loops[j].match( singleLoop );

					// 当前循环信息 @return [ 数据数组, 用来表示当前项的占位字符 ]
					loopInfo = $f.trim( loop[1].replace( /\s+/g, ' ' ) ).split(' ');

					// 获取循环体
					loopBody = loop[2];

					var dataKey = loopInfo[0].split('.');

					// 如果用到的数据源不属于当前模板，则返回
					var checkObj = checkDataLegal( loopInfo[0] );
					if( !checkObj.flag ) {
						loopArr.push( loops[j] );
						break;	
					}

					// 获取循环中的数组数据
					var loopData = checkObj.data, loopStr = '';
					if ( $f.isArray( loopData ) ) {

						// 遍历数据数组，获取循环处理后的字符串
						for ( var h in loopData ) {
							var lRegObj = loopItemIndexReg( loopInfo[2] );
							loopStr += loopBody.replace( lRegObj.item, function(){
								if ( arguments[3] ) {
									return checkDataLegal( arguments[0], loopData[h] );
								}
								else {
									return loopData[h];
								}
							} );

							// 将索引所在位置用当前索引值替换
							loopStr = loopStr.replace( lRegObj.index, h );
						}
						loopArr.push( loopStr );
					}

					// 如果对应的数据不为数组，则直接返回模板字符串
					else {
						loopArr.push( loops[j] );
						flag = false;
					}
				}
				return { 'data' : loopArr, 'flag' : flag };
			}
			return {'data':[],'flag':false}
		};

		// 条件判断 @param String 纯净的条件判断模块 !important:在此之前需将所有数据位占位替换成相应的字符串
		var parseIf = function ( ifs ) {
			var theIf = ifs.match( ifReg );
			// 如果不是个条件判断语句，则直接返回输入的字符串
			if ( !theIf ) {
				return ifs;
			}
			// 获取可用于js执行的if命令字符串形式
			var commandStr = '' +
				'if(' + theIf[1] + '){"' + theIf[2].replace( /([\"\'])/g, '\\$1' ) + '"}' + 
				(theIf[3] ? ( 'else if(' + theIf[4] + '){"' + theIf[5].replace( /([\"\'])/g, '\\$1' ) + '"}' ) : '') + 
				(theIf[6] ? ( 'else{"' + theIf[7].replace( /([\"\'])/g, '\\$1' ) + '"}' ) : '' );
			return eval( commandStr );
		};

		if ( tempsArr ) {
			var temp, tempInfo, loopsArr, ifsArr, loopResultObj, result, dataReg, loopResultData={};
			for ( var i = 0, tempsL = tempsArr.length; i < tempsL; i++ ) {
				// 用于循环体计数
				var n = 0;
				temp = tempsArr[i].match( singleTemp );

				// 当前模板信息 @return [ 模板名称 模板用到的数据名称 ];
				tempInfo 	= $f.trim( temp[1].replace( /\s+/g, ' ' ) ).split(' ');
				// 把数据占位符替换成真实的数据
				dataReg = new RegExp( '\\#\\{(' + tempInfo[1] + '(\\.[a-zA-Z\\_0-9]+)+)\\}', 'g');
				temp[2] = temp[2].replace( dataReg, function () {
					var dataCheckObj = checkDataLegal( arguments[1] )
					return dataCheckObj.flag ? dataCheckObj.data : arguments[0];
				});
				result = temp[2];			
				// 处理循环
				loopsArr = temp[2].match( loopsReg );
				if ( loopsArr ) {
					loopResultObj = parseLoop( loopsArr );
					// 判断循环是否成功，成功才进行替换
					if ( loopResultObj.flag ) {
						// 获取可用于替换的数据对象
						for ( var m in loopResultObj.data ) {
							loopResultData[ unikey + m ] = loopResultObj.data[m];
						}
						// 将循环体所在位置替换成占位符，用于替换
						var tempHolderStr = temp[0].replace( loopsReg, function () {
							return '#{' + unikey + (n++) + '}';
						});
						result = $l.str.replace( tempHolderStr, loopResultData );
					}
				}
				ifsArr = result.match( ifsReg );
				if ( ifsArr ) {
					for ( var q in ifsArr ) {
						// 处理条件判断，单次匹配，多次替换
						result = result.replace( ifReg, parseIf( ifsArr[q] ) );
					}
				}
				// 将处理后的字符串存储到对应的位置，用于之后的替换
				htmlObj[ unikey + i ] = '<!--start-' + tempInfo[0] + '-->' + result.match(singleTemp)[2] + '<!--' + tempInfo[0] + '-end-->'  ;
			}
			// 处理结束，用处理后的字符串替换之前占位符位置，用以解决多模板的情况
			return $l.str.replace( htmlStr, htmlObj );
		}
		else {
			return  str;
		}
	};
});