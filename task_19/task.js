/**
 * 生成由数字10~100组成的随机数组
 * @param {number} length
 */
function randomList(length) {
	var arr = [],
		i;
	for (i = 0; i < length; i++) {
		arr.push(Math.floor(Math.random() * 91 + 10));
	}
	return arr;
}

/**
 * 生成队列
 * @param {array} data
 * @param {HTMLElement} elm
 */
var list = (function (data, elm) {
	var data = data || [];
	var elm = elm || null;

	// 返回数据副本，防止外部修改数据
	function copyData() {
		var data_ = [],
			i;
		for (i = 0; i < data.length; i++) {
			data_.push(data[i]);
		}
		return data_;
	}

	/**
	 * 交换a, b的位置
	 * @param {number} a
	 * @param {number} b
	 */
	function swap(a, b) {
		var temp = data[a];
		data[a] = data[b];
		data[b] = temp;
		console.log(data);
	};

	return {
		/**
		 * 从队列右边插入元素
		 * 返回数组长度
		 * @param {number} val
		 */
		push: function (val) {
			var item = document.createElement("span");
			item.innerHTML = val;
			elm.appendChild(item);
			return data.push(val);
		},

		/**
		 * 从队列右边删除元素
		 * 返回删除的元素
		 */
		pop: function () {
			var lastItem = elm.lastElementChild;
			lastItem && elm.removeChild(lastItem);
			return data.pop();
		},

		/**
		 * 从队列左边插入元素
		 * 返回数组长度
		 * @param {number} val
		 */
		unshift: function (val) {
			var item = document.createElement("span"),
				firstItem = elm.firstElementChild;
			item.innerHTML = val;
			elm.insertBefore(item, firstItem);
			return data.unshift(val);
		},

		/**
		 * 从队列左边删除元素
		 * 返回删除的元素
		 */
		shift: function () {
			var firstItem = elm.firstElementChild;
			firstItem && elm.removeChild(firstItem);
			return data.shift();
		},

		/**
		 * 删除索引位置的元素
		 * 返回删除的元素
		 * @param {number} index
		 */
		remove: function (index) {
			var item = elm.children[index];
			elm.removeChild(item);
			return data.splice(index, 1);
		},

		splice: function () { },

		/**
		 * 渲染页面
		 */
		render: function () {
			var data_ = data;

			// 清空页面与数据
			elm.innerHTML = "";
			data = [];

			// 插入数据渲染页面
			data_.forEach(function (i) {
				this.push(i);
			}, this);
		},

		/**
		 * 获取列表数据
		 */
		getData: function () {
			return copyData();
		},

		/**
		 * 获取列表长度
		 */
		length: function () {
			return data.length;
		},

		/**
		 * 获取列表最大值
		 */
		getMax: function () {
			return data.reduce(function (a, b) {
				return Math.max(a, b);
			})
		},

		/**
		 * 获取列表最小值
		 */
		getMin: function () {
			return data.reduce(function (a, b) {
				return Math.min(a, b);
			})
		},

		/**
		 * 冒泡排序
		 */
		bubbleSort: function () {
			var length = data.length,
				stepList = [copyData()],
				outer,
				inner;

			for (outer = length - 1; outer > 0; outer--) {
				for (inner = 0; inner < outer; inner++) {
					if (data[inner] > data[inner + 1]) {
						swap(inner, inner + 1);
						stepList.push(copyData());
					}
				}
			}

			this.render();
			return stepList;
		}
	}
})(
	randomList(50),
	document.getElementById("list")
	);

var dom = document.getElementById("list"),
	btnPush = document.getElementById("list-push"),
	btnPop = document.getElementById("list-pop"),
	btnUnshift = document.getElementById("list-unshift"),
	btnShift = document.getElementById("list-shift"),
	btnBubbleSort = document.getElementById("list-bubble-sort"),
	timer = null,	// 定时器
	stepList;	// 步骤记录表


/**
 * 渲染图表
 */
function renderChart(arr) {
	var chart = document.getElementById("chart-wrap"),
		frag = document.createDocumentFragment(),
		max = list.getMax(),	// 最大值
		dataElm,	// 矩形元素
		proportion,	// 当前数值与最大值占比
		i;

	// 构造矩形
	for (i = 0; i < arr.length; i++) {
		// 当前数值与最大值占比
		proportion = arr[i] / max;
		proportion > 1 && (proportion = 1);

		// 创建矩形元素
		dataElm = document.createElement("span");
		dataElm.style.height = 500 * proportion + "px";
		dataElm.style.height = 500 * proportion + "px";
		dataElm.title = arr[i];

		// 插入DOM片段中缓存
		frag.appendChild(dataElm);
	}

	//插入页面
	chart.innerHTML = "";
	chart.appendChild(frag);
}

/**
 * 渲染步骤表
 */
function renderStepList(delay) {
	var i = 0;

	clearInterval(timer);
	timer = setInterval(function () {
		renderChart(stepList[i++]);
		if (i >= stepList.length) {
			clearInterval(timer);
		}
	}, delay);
}

/**
 * 获取输入的数据
 */
function getInputVal() {
	var val = document.getElementById("list-input").value;

	if (list.length() > 60) {
		alert("队列元素数量最多为60个");
	}
	if (!val) {
		alert("请输入10到100以内的数字");
		return false;
	}
	if (isNaN(val)) {
		alert("请输入10到100以内的数字");
		return false;
	}

	val -= 0;
	if (val < 10 || val > 100) {
		alert("请输入10到100以内的数字");
		return false;
	}

	return val;
}

/**
 * 列表元素的点击事件
 */
dom.onclick = function (ev) {
	var item = ev.target,
		index;

	if (item.nodeName.toLocaleLowerCase() === "span") {
		index = [].indexOf.call(dom.children, ev.target);
		list.remove(index);
	}
}

/**
 * 按钮元素的点击事件
 */
btnPush.onclick = function () {
	var val = getInputVal();
	val && list.push(val);
}
btnPop.onclick = function () {
	var val = list.pop();
	alert(val ? val : "队列为空");
}
btnUnshift.onclick = function () {
	var val = getInputVal();
	val && list.unshift(val);
}
btnShift.onclick = function () {
	var val = list.shift();
	alert(val ? val : "队列为空");
}
btnBubbleSort.onclick = function () {
	stepList = list.bubbleSort();
	renderStepList(0);
}

// 渲染页面
list.render();
