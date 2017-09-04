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

        // 获取一个元素的默认 display 样式值,可能的结果是 inline-block...,(none转换为block)
        function defaultDisplay(nodeName) {
           var element, display
           if(!emementDisplay[nodeName]) {
           	 // 如果elementDisplay对象中，没有存储nodeName的信息
           	 // 则新建一个nodeName 元素，添加到body中
           	 element = document.createElement(nodeName)
           	 document.body.appendChild(element)
           	 display = getComputedStyle(element,'').getPropertyValue("display")
           	 // 接着马上移除元素
           	 element.parentNode.removeChild(element)
           	 // 如果是'none' 则换成 'block'
           	 display == "none" && (display = "block")

           	 // 存储
           	 elementDisplay[nodeName] = display
           }
           return elementDisplay[nodeName]
        }

        // 返回一个元素的子元素，已数组形式
        function children(element) {
        	// 有些浏览器支持elem.children 获取子元素，有些不支持
        	return 'children' in element ?
        	slice.call(element.children):
        	// 浏览器不支持 elem.children 只能通过 elem.childrenNodes 获取子元素，nodeType = 1 为dom元素节点
        	// $.map 下文定义的
        	$.map(element.childNodes,function(node){ if(node.nodeType ==1) return node })
        }

        // 构造函数，在zepto.Z中被使用
        function Z(dom,selector) {
        	var i,len = dom ? dom.length:0
        	for(i = 0;i<len;i++) this[i] = dom[i]
        	this.length = len
        	this.selector = selector || ''	
        }

        // `$.zepto.fragment` 需要一个HTML字符串和一个可选标记名来生成dom
        // 生产的dom返回一个数组形式
        // 改功能可以被插件覆盖
        // 没有覆盖所有浏览器
        // 
        // 参数：
        // html：待处理的html字符串
        // name: 通过name 可在 containers 中查找容器节点，如果不传入，取得的容器默认为div
        // properties: 节点属性对象
        zepto.fragment = function(html, name, properties) {
        	var dom, nodes, container
        	if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

        	// 如果不是单标签
        	if(!dom) {
        		// replace() 方法用于在字符串中用一些字符串替换另外一些字符，或者替换一个与正则表达式匹配的字符串。
        		// 
        		if(html.replace) html = html.replace(tagExpanderRE,"<$1></$2>")

        		// 如果name 未传入，则赋值为html 的第一个标签
        		if(name === undefined) name = fragmentRE.test(html) &&	RegExp.$1
        		// containers 头部定义
        		// 指定热水元素的 容器
        		// containers = {
        		// 
        		// },
        		if(!(name in containers)) name = "*"
        			// 生成容器 及其 子元素
        			container = containers[name]
        			container.innerHTML = '' + html

        			dom = $.each(slice.call(container.childNodes),function(){
        				container.removeChild(this)
        			})
        	}

        	if(isPlainObject(properties)) {
        		//先将dom转换为zepto对象
        		nodes = $(dom)

        		$.each(properties,function(key,value) {
        			if (methodAttributes.indexOf(key) > -1) node[key](value)
        			else nodes.attr(key, value)	
        		})
        	}
        	return dom	
        }

        // 返回的是函数 Z 的一个实例
        zepto.Z = function(dom, selector) {
        	return new Z(dom, selector)
        }

        // 判断 object 是否是 zepto，Z的实例
        zepto.isZ = function(object) {
        	return object instanceof zepto.Z
        }

        zepto.init = function(selector, context) {
        	var dom
        	// 未传参，返回空Zepto 对象
        	if(!selector) return zepto.Z()
        	// selector 是字符串
        	else if (typeof selector == 'string') {
        		// 字符串的情况，一般有两种：
	            // 第一，一段 html 代码，旨在通过zepto生成dom对象
	            // 第二，一段查询字符串，旨在通过zepto查找dom对象
	            // 将查询结果存储到 dom 变量中
	            // 有 context 则查找，没有context 则为生成dom
	            // 去前后空格
	            selector = selector.trim()
	            if(selector[0] == '<' && fragmentRE.test(selector))
	            	dom = zepto.fragment(selector, RegExp.$1, content), selector = null

                else if (content !== undefined) return $(context).find(selector)

        	    else dom = zepto.qsa(document, selector)
        	}

        	else if (isFuntion(selector)) return $(document).ready(selector)

        	// 如果选择器本身就是 zepto 实例，则直接返回
        	else if (zepto.isZ(selector)) return selector

        	else {
        		// 如果给的是数组，则先筛选出数组中为null 和undefined 的元素
        		if (isArray(selector)) dom = compact(selector)

        		// 如果是object，直接强制塞进一个数组
        		else if (isObject(selector))
        		   dom = [selector], selector = null
        		else if (fragmentRE.test(selector))
        		   dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
        		else if (context !== undefined) return $(context).find(selector)
        		else dom = zepto.qsa(document, selector)      	
        	}

        	// 最终通过 zepto.Z 创建对象
        	return zepto.Z(dom, selector)	
        }

        // $(a)返回zepto 实例
        $ = function(selector, context) {
        	return zepto.init(selector, context)
        }

        //内部方法：用户合并一个或多个对象到第一个对象
        //参数：
        // target 目标对象 对象都合并到 target里
        //  source 合并对象
        //  deep 是否执行深度合并
        function extend(target, source, deep) {
          for(key in source)
            if(deep && (isPlainObject(source[key]) || isArray(source[key]))) {

              if(isPlainObject(source[key]) && isPlainObject(target[key]))
                target[key] = {}

              // source[key] 是数组。而target[key] 不是数组，则target[key]=[] 初始化一下，否则递归会出错
              if (isArray(source[key]) && !isArray(target[key]))
                target[key] = []
              // 执行递归
              extend(target[key], source[key], deep)

            }
            // 不满足以上条件，说明source[key] 是一般的值类型，直接赋值给target 就是了
            else if (source[key] !== undefined) target[key] = source[key]
        }

      $.extend = function(target) {
        var deep, args = slice.call(arguments, 1)
        if(typeof target == 'boolean') {
          deep = target
          target = args.shift()
        }

        // 遍历后面的参数， 都合并到target上 
        args.forEach(function(arg) { extend(target, arg, deep)})
        return target
      }
      
      // 通过选择器表达式查找DOM
      // 原理 判断下选择器的类型 （id/class/标签/表达式）
      // 
      // 当浏览器不支持 el,matches时，可以用document.querySelectorAll 来实现 matchs
      // Zepto 的 css选择器。使用document.querySelectorAll 及优化处理一些特殊情况，可被插件覆盖
      zepto.qsa = function(element, selector) {
        var found,
        maybeID = selector[0] == '#' //如果有 # 就是 id选择器
        maybeClass = !maybeID && selector[0] == '.'//不是id选择器

        // 如果是 id 或 class 则取符号后的名字，如果没有类和名字，则直接是selector
        // eg:selector = '#xixi'; selector.slice(1);输出 'xixi'
        nameOnly = maybeID || maybeClass ? selector.selector.slice(1): selector,
        isSimple = simpleSelectorRE.test(nameOnly)

        // 以下代码的基本思路是：
        // 1.优先通过 ID 获取元素
        // 2.然后试图通过 className 和 tagName 获取元素
        // 3.最后通过 querySelectorAll 来获取
        
        // 判断是否有getElementById方法 && 是个单选择 && 是个id选择器
        return (element.getElementById && isSimple && maybeID) ?
          ((found = element.getElementById(nameOnly))? [found]:[]) :
          (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ?[]: 

          slice.call(
              // 条件判断 A?(B?C:D) :E
              isSimple && !maybeID && element.getElementByClassName ?
              maybeClass ? element.getElementByClassName(nameOnly) :
              element.getElementByTagName(selector):
              element.querySelectorAll(selector)
            )
      }

      // 在元素集中过滤某些元素
      function filtered(nodes, selector) {
        return selector == null ? $(nodes) : $(nodes).filter(selector)
      }

})()

window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)