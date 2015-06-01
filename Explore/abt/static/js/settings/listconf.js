/**
 * 右侧菜单配置参数
 */
$( function () {
    var module = $M.define( 'settings/listconf' );

    module.build( 'init', function () {

        var cf = {
            // 添加新的dom节点
            'insert' : {
                'title' : '插入',
                'name'  : '类型',
                'type'  : 'insert',
                'options' : [
                    {
                        'val' : 'insert-list',
                        'txt' : '列表',
                        // select该项时额外添加的html内容，可用于自定义参数，约定num为数目,type为类型
                        'extra': '条目数 <input type="text" name="num" value="3">'
                    },
                    {
                        'val' : 'insert-title',
                        'txt' : '标题',
                        'extra' : ['类型 <select name="type">',
                            '<option value="H1">H1</option>',
                            '<option value="H2">H2</option>',
                            '<option value="H3">H3</option>',
                            '<option value="H4">H4</option>',
                        '</select>'].join('')
                    }
                ],
                'act' : 'sureSet'
            },

            // 修改样式
            'editStyle' : {
                'title' : '修改',
                'name'  : '样式',
                'type'  : 'editStyle',
                'options' : [
                    {
                        'val' : 'editStyle-width',
                        'txt' : 'width',
                        'extra' : '宽度 <input title="1-12之间的数值" name="val" type="range" min="1" max="12" step="1" value="12">'
                    }
                ],
                'act' : 'sureSet'
            }
        };

        return cf;
    });

    module.create();
});