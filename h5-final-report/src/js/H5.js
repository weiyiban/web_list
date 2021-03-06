/*H5内容管理对象*/

var H5 = function() {
    // 通过随机数 加 字符串 替换的方法生成 ID
    this.id = ('h5_' + Math.random()).replace('0.', 'id_');
    // 创建 DOM（默认隐藏）
    this.el = $('<div class="h5" id="' + this.id + '">').hide();
    // 将 DOM 添加到 body 中
    $('body').append(this.el);
    this.page = [];
    /**
     * 新增一个页
     * @param {string} name 组件的名称，会加入到ClassName中
     * @param {string} text 页内的默认文本
     * @return {H5} H5对象，可以重复使用H5对象支持的方法
     */
    this.addPage = function(name, text) {
        var page = $('<div class="h5_page section">');
        if (name !== undefined) {
            page.addClass('h5_page' + name);
        }
        if (text !== undefined) {
            page.text(text);
        }
        this.el.append(page);
        this.page.push(page);
        return this;
    }
    /* 新增一个组件 */
    this.addComponent = function(name, cfg) {
        var cfg = cfg || {};
        // 如果cfg没有传入type，默认设置为base类型
        cfg = $.extend({ type: 'base' }, cfg);
        // 定义一个变量，存储组件元素
        var component;
        var page = this.page.slice(-1)[0];
        switch (cfg.type) {
            case 'base':
                component = new H5ComponentBase(name, cfg);
                break;

            default:
        }
        page.append(component);
        return this;
    }
    /* H5对象初始化呈现 */
    this.loader = function() {
    	// 全屏滚动
        this.el.fullpage({
            onLeave: function(index, nextIndex, direction) {
            	$(this).find('.h5_component').trigger('onLeave');
            },
            afterLoad: function(anchorLink, index) {
            	$(this).find('.h5_component').trigger('onLoad');
            }
        })
        this.page[0].find('.h5_component').trigger('onLoad');
        this.el.show();
    }
    return this;
}