
# full-pages(全屏滚动)

1、 如何使div实现全屏？
	- 全屏的元素及其父元素都要设置height:100%;
	- 将html、body标签设置height:100%;
	- (注：height:100%是随其父元素的高度变换而变换的)

2、jquery推荐的闭包方法：
	;(function($){
		// do something
	})(jQuery);

* 闭包的作用
	- 避免全局依赖
	- 避免第三方破坏
	- 兼容jQuery操作符‘$’和jQuery

3、 jQuery插件的的开发方式
* 类级别组件开发
	- 即给jQuery命名空间下添加新的全局函数，也称为静态方法
	
	jQuery.myPlaugin = function(){
		// do something
	}

例如：
	$.Ajax、 $.extend();
	
* 对象级别组件开发
	- 即挂在jQuery原型下的方法，这样通过选择器获取的jQuery对象实例也能共享该方法，也称为动态方法。

			$.fn.myPlugin = function(){
				// do something
			}
	这里$.fn === $.prototype

	例如：addClass()、attr()等，需要创建实例来调用

4、jQuery强大的链式调用

	$("div").next().addClass()……
	$fn.myPlaugin = function(){
		return this.each(){function(){
				// do something
			}}
	}

* 代码说明
	- return this 返回当前对象，来维护插件的链式调用
	- each 循环实现每个元素的访问

### 一、单例模式
	$.fn.MyPlugin = function(){
		var me = $(this),
		instance = me.data("myPlugin")
		if(!instance){
			me.data("myPlugin",(instance new myPlugin()))
		}
	};
* 代码说明
	- 如果实例存在则不重复创建实例
	- 利用 data()来存放插件对象的实例

#### 二、 .on()方法

* 语法：on(events[,selector][,data],handler(eventObject))
* 描述：在选定的元素上绑定一个或多个事件处理函数
	- events: 一个或多个空格分隔的事件类型，例如 click keydown。
	- selector： 一个选择器字符串，用于过滤出被选中的元素中能触发事件的后代元素，如果为null，那么被选中的元素总是能触发事件。
	- data：事件触发时，要传递给处理函数的 event.data。
	- handler(eventObject) 事件触发时，执行的函数。
* 优点： 事件委托不仅可以给未创建的后代元素绑定事件，当需要监视很多元素的时候，委托事件的开销更小。

#### 三、绑定鼠标滚轮事件
* js事件有很多需要兼容的地方，鼠标滚轮事件也有额外的差异。包括`IE6`浏览器在内的都适用 `mouseWheel`, 而只有`火狐`浏览器使用`DOMMouseScroll`.
* $(document).on('mouseWheel DOMMouseScroll',handler);

__如何判断鼠标的滚轮滑动方向__

* 其他浏览器通过 `wheeldalta` 属性来判断。但是火狐浏览器没有这个属性可以通过`detail`这个属性来判断。
* 开发中发现每次向下滚动时，`wheeldalta`都是`-120`。但是，detail却是`3, 火狐浏览器判断的数值正负与其他浏览器是相反的`

### 四、绑定键盘事件keydown
* 说明： `keydown`事件发生在键盘的键被按下的时候
* 原生js 中判断按下了那个键是存在兼容性问题的：
	- IE 	    只有 `keyCode` 属性
	- FireFox   中 `which` 和 `charCode` 属性
	- Opera     中 `keyCode` 和 `ehich` 属性等

__但是jQuery已经解决了这个兼容问题。__


| 键盘对应的键盘码  |
| ------ | ------ |
| 左 37  | 上 38  |
| 右 39  | 下 40  |

### 五、 转换Transform

* 转换方式
	- 旋转 `rotate` 例如： `transform: rotate(45deg)`
	- 缩放 `scale`  例如： `transform: scale(2,0.5)`
	- 移动 `translate` 例如： `transform: translate(100px,-50px)`
	- 扭曲 `skew`   例如： `transform: skew(45deg,45deg)`
	- 矩形变形 `matrix(<number>,<number>,<number>,<number>,<number>,<number>)`

#### 动画平滑过渡Transition

* 属性
	- `transition-property:` 设置过渡的css属性名称，例如：`background`,`color`,或者`all`.
	- `transition-duration:` 完成过渡效果需要时间，以`s/ms`为单位
	- `transition-timing-function:` 规定速度效果的速度曲线，例如：`linear,ease,ease-in,ease-out,ease-in-out,cubic-bezier`
	- `transition-delay:` 延迟时间，以`s/ms`为单位
	- `transition: <transition-property><transition-duration><transition-timing-function><transition-delay>`

#### 如何判断浏览器是否支持某个css属性

* 实现思路
	- 通过判断某个element的style中是否存在某个css属性

* 实现代码
	
	(function(element){
		if(element.style['transition']!== undefind){
			return true;
		}
		return false;
	})(document.createElement('div'));

#### .animate()动画
* 语法
	.animate(properties[,duration][,easing][,complete])
* 描述： 根据一组css属性，执行自定义动画
	- `properties` 一个css属性和值的对象，动画将根据这组对象移动
	- `duration` 一个字符串或者数字决定动画运动时间，(slow,normal,fast) ms为单位
	- `easing` 表示动画使用哪种移动函数，`linear`和`swing`,默认`swing`
	- `complete` 在动画完成时执行的函数。