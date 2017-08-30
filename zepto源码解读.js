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
          // 这样如果每一找到该元素，都回返回 -1 经过 按位取反运算符 之后为0	
        }

	
})()

window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)