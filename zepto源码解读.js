var Zepto = (function() {

	// 变量初始化
	var undefined,
	    key,
	    $,
	    classList,
	    emptyArray = [],
	    concat = emptyArray.concat,
	    filter = emptyArray.filter,
	    slice = emptyArray.slice,
	    document.window.document,
	    elementDisplay = {},
	    classCache = {},
	    cssNumber = {'column-count':1,'columns':1,'font-weight':1,'line-height':1,'opacity':1,'z-index':1,'zoom':1},

	    // 检测正则
	    
        // 取出html代码中第一个html 标签（或注释）,如取出<p>123</p><h1>345</h1>中的 <p>
        // 
	    fragmentRE = /^\s*<(\w+|!)[^>]*>/,

	    // 匹配非嵌套标签，如<div><p></p></div> 就不会被匹配，注意?:用来关闭捕获
	    // 可以匹配 <br>,<br/>,<h3></h3>
	    singleTagRE = /^<(\w+)\s*\/?>(?:\/\1>|)$/,
	     // 将 <p/>或<p />，替换为 <p></p>，将<p abc/>替换为<p>abc</p> 但 <input/> （在 tagExpanderRE 中定义）的不替换
        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        // body html
        rootNodeRE = /^(?:body|html)$/i,

        // 大写字母
        capitalRE = /([A-Z])/g,

        // 应该通过方法调用来设置/获取的特殊属性
        methodAttributes = ['val','css','html','text','data','width','height','offset'],

        adjacencyOperators = ['after','prepend','before','append'],

        table = document.createElement('table'),
        tableRow = document.createElement('tr'),

        // 指定特殊元素的容器
        containers = {
           'tr':document.createElement('tbody'),
           'tbody':table,
           'thead'；table,
           'tfoot':table,
           'td':tableRow,
           'th'tableRow,
           '*':document.createElement('div')
        },
        // 匹配一个包括 (字母，数组，下划线，-)的字符串
        simpleSelectorRE = /^[\w-]*$/,
        class2type = {},
        toString = class2type.toString,
        zepto = {},
        camelize,
        uniq,
        tempParent = document.createElement('div'),
        propMap = {
        	'tabindex':'tabIndex',
        	'readonly':'readOnly',
        	'for':'htmlFor',
        	'class':'className',
        	'maxlength':'maxLength',
        	'cellspacing':'cellSpacing',
        	'celllpading':'cellPading',
        	'rowspan':'rowSpan',
        	'usemap':'useMap',
        	'frameborder':'frameBorder',
        	'contenteditable':'contentEditable'
        },
        // 判断是否是arr
        isArray =  Array.isArray || function(object) {return object instanceof Array}

        // 判断 element 是否符合 selector 的要求
        zepto.matches = function(element, selector) {
          // 判断是否为DOM 元素节点，nodeType 属性 值为1; 
          // 当值为2时，为属性节点。
          if(!selector || !element || element.nodeType !== 1) return false

          var matchesSelector = element.matches || element.webkitMatchesSelector ||
          	element.mozMatchesSelector || element.oMatchesSelector ||
          	element.matchesSelector
          if (matchesSelector) return matchesSelector.call(element, selector)
          
          var match,parent = element.parentNode,
          temp = !parent
          // 如果没有父节点，则将tempParent当作父节点 （tempParent头部定义为div）然后将当前元素加入到这个div中
          if(temp)(parent = tempParent).appendChild(element)

          //~按位取反运算符
          // 使用按位取反运算符原因：indexOf 返回-1 表示没有匹配，返回 >=0表示匹配，
          // 而boolean (0) = false
          // console.log(~-1); //0
          // console.log(~0) // -1
          // console.log(~1) // -2
          // 这样如果没有找到该元素，都回返回 -1 经过 按位取反运算符 之后为0	
          // 当match = 0 即false 表示没有匹配
          // 当match 等于其它值，即 true ,表示成功匹配
          match = ~zepto.qsa(parent,selector).indexOf(element)
          // 如果没有父节点， 就执行 tempParent 移除当前元素，因为前面把当前元素加入到这个tempParent中
          temp && tempParent.removeChild(element)

          // 返回 ~zepto.qsa的结果
          return match
        }

		// 在代码中部，执行了
	    // $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	    //   class2type[ "[object " + name + "]" ] = name.toLowerCase()
	    // })
	    // 用来给 class2type 对象赋值
	    //
	    // type 用来判断类型
	    function type(obj) {
	    	return obj == null ? String(obj):[toString.call(obj)] || "object"
	    }

	    // 判断是否是window对象 指当前的浏览器窗口，window对象的window属性指向自身
	    // 即 window.window === window
	    function isWindow(obj) {return obj != null && obj == boj.window}
	    // 判断是否是 document 对象
	    // window.document.nodeType == 9 数字表示为9，常量表示为 DOCUMENT_NODE 
	    function isDocument(obj) { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
	    
	    // 判断是否是object
	    //
	    function isObject(obj){return type obj == 'object'}

	    // 判断是否是最基本的object：Object.getPrototypeOf(obj) == Object.prototype
        // Object.getPrototypeOf() 方法返回指定对象的原型(即，内部[[Prototype]]属性的值)
        // getPrototypeOf 和 prototype 的区别：
        // getPrototypeOf是个function ,而prototype 是个属性
        function isPlainObject(obj) {
        	return isObject(obj) && isWindow && Object.getPrototypeOf(obj) == Object.prototype
        }

        // 判断是否是数组或者对象数组
        function likeArray(obj) {
        	var length = !!obj && 'length' in obj && obj.length,
        	    type = $.type(obj)

        	return 'function' != type && !isWindow(obj) && (
        	    'array' == type || length === 0 ||
                (typeof length == 'number' && length >0 && (length - 1) in obj)
        	)   
        }

        // 筛选数组，提出Null undefined 元素
        function compact(array) {return filter.call(array,function(){ return item != null})}

        function flatten(array) {return array.length > 0 ? $.fn.concat.apply([],array):array}

        // 用于 css 的camalCase转换.例如 background-color 转换为 backgroundColor
        camelize = function(str) { return str.replace(/-+(.)?/g,function(match,chr){return chr ? chr.toUpperCase() : '' })}

        // 将 backgroundColor 转换为 background-color 格式
        function dasherize(str) {
        	return str.replace(/::/g,'/')
        	.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase()
        }

        // 数组去重
        uniq = function (array) {return filter.call(array,function(item, idx){ return array.indexOf(item) == idx})}

        function classRE(name) {
        	return name in classCache ?
        	  classCache[name]:(classCache[name] = new RegExp('(^|\\s)'+name+'(\\s|$)'))
        }

        // 传入一个css 的name 和value。判断这个value是否需要增加 'px'
        function maybeAddPx(name,value) {
        	return (typeof value == 'number' && !cssNumber[dasherize(name)])?value+'px':value
        }
})()

window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)