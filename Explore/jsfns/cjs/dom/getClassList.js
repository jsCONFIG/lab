/**
 * 获取某节点的classList对象
 * @return 返回类似H5的classList的对象
 */
CJS.register( 'dom.getClassList', function ( $ ) {
	$f = $.FUNCS;
	return function ( node ) {
		if ( !$f.isNode( node ) ) {
			throw '[dom.getClass]: ' + $f.NODESTRING;
		}
		// 如果节点支持H5的classList，则直接返回classList对象
		if ( node.classList ) {
			return node.classList;
		}
		var result = {}, pureClass, classArr, classL = 0, classList = {};
		// 刷新class相关
		var freshClass = function () {
			// 获取清除首尾空格的class字符串
			pureClass = $f.trim( node.className );
			classArr = pureClass.split( ' ' );
			classL = classArr.length;
		};

		freshClass();
		// 移除class的方法
		var remove = function ( str ) {
			freshClass();
			if ( !!str && !!pureClass ) {
				var pos = $f.indexOf( str, classArr );
				if ( pos != -1 ) {
					classArr.splice( pos, 1 );
					node.className = classArr.join(' ');
					freshClass();
				}
			}
			return node;
		};

		// 添加class的方法
		var add = function ( str ) {
			freshClass();
			if ( !!str ) {
				var pos = $f.indexOf( str, classArr );
				if ( pos == -1 ) {
					classArr.push( str );
					node.className = classArr.join( ' ' );
					freshClass();
				}
			}
			return node;
		};

		// class切换
		var toggle = function ( str ) {
			freshClass();
			if ( !!str ) {
				var pos = $f.indexOf( str, classArr );
				if ( pos == -1 ) {
					add( str );
				}
				else {
					remove( str );
				}
			}
			return node;
		};

		// 检测是否存在某个class
		var contains = function ( str ) {
			freshClass();
			if ( !str ) {
				throw '[dom.getClassList]: error! Invalid parameter!';
			}
			var pos = $f.indexOf( str, classArr );
			return (pos != -1);
		};

		// 获取某个位置的class
		var item = function ( index ) {
			freshClass();
			var pos = ( parseInt( index ) == index ) ? index : 0;
			return classArr[ pos ];
		};

		for ( var i = 0; i < classL; i++ ) {
			classList[i] = classArr[i];
		}
		classList[ 'length'  ] = classL;
		classList[ 'remove'  ] = remove;
		classList[ 'add'     ] = add;
		classList[ 'toggle'  ] = toggle;
		classList[ 'contains'] = contains;
		classList[ 'item'    ] = item;
		
		return classList;
	};
} );