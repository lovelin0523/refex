const State = require('./state')
const VNode = require('./vnode')

module.exports = {
	/**
	 * 构建响应式数据对象
	 * @param {Object} data
	 */
	proxy: function(data) {
		return new State(data)
	},
	/**
	 * 使用响应式数据的方法
	 * @param {Object} state
	 */
	useProxy: function(state) {
		return state.$data
	},
	/**
	 * 返回构建VNode所必须的参数
	 * @param {Object} tag
	 * @param {Object} options
	 */
	h: function(tag, options) {
		//判断tag参数
		if (typeof tag != 'string') {
			throw new TypeError('The tag name is undefined')
		}
		
		//判断options参数
		if (typeof options != 'object' || !options) {
			options = {}
		}
		
		//属性参数校验
		let attrs = options.attrs || {}
		
		//样式类校验，支持数组、对象和字符串，最终转为对象
		let cls = {}
		if(Array.isArray(options.cls)){
			options.cls.forEach(item=>{
				cls[item] = true
			})
		}else if(typeof options.cls == 'object' && options.cls){
			cls = Object.assign({},options.cls)
		}else if(typeof options.cls == 'string' && options.cls){
			cls[options.cls] = true
		}else {
			cls = {}
		}
		
		//指令集合，key为指令名称，值为指令参数，包含data和modifier两个数值，如：{ model:{value:333,modifier:'value'} }
		let directives = options.directives || {}
		
		//事件集合，如：{ click:function(){} }
		let tmpEvents = options.events || {}
		let events = {}
		for(let eventName in tmpEvents){
			events[eventName] = {
				handler:tmpEvents[eventName],
				params:[],
				modifier:undefined
			}
		}
		
		//指定创建的元素的文本内容
		let text = options.text
		
		//子节点数据，每个子节点也是h函数返回的数据
		let slots = options.slots || []
		
		//是否渲染该节点，只有if明确为false时才会不进行渲染
		let _if = options.if === false ? false : true
		
		//声明为prop的属性
		let props = options.props || []

		return {
			tag,
			attrs,
			cls,
			directives,
			events,
			text,
			slots,
			_if,
			props
		}
	},
	/**
	 * 根据字符串表达式获取真实的值
	 * @param {Object} state
	 * @param {Object} vnode
	 * @param {Object} exp
	 */
	parse:function(state,vnode,exp){
		//设置作用域
		let scope = Object.assign({}, state.$data)
		Object.assign(scope, vnode.getForData())
		return vnode.parseExpression(scope, exp)
	}
}
