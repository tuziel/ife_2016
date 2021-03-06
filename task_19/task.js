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
	function swap(a, b, arr) {
		arr = arr || data;
		var temp = arr[a];
		arr[a] = arr[b];
		arr[b] = temp;
		// console.log(data);
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
		 * 获取队列数据
		 */
		getData: function () {
			return copyData();
		},

		/**
		 * 获取队列长度
		 */
		length: function () {
			return data.length;
		},

		/**
		 * 获取队列最大值
		 */
		getMax: function () {
			if (data.length === 0) {
				return false;
			}
			return data.reduce(function (a, b) {
				return Math.max(a, b);
			})
		},

		/**
		 * 获取队列最小值
		 */
		getMin: function () {
			if (data.length === 0) {
				return false;
			}
			return data.reduce(function (a, b) {
				return Math.min(a, b);
			})
		},

		/**
		 * 反转队列
		 */
		reverse: function () {
			data.reverse();
			this.render();

			return copyData();
		},

		/**
		 * 冒泡排序
		 */
		bubbleSort: function () {
			var length = data.length,
				stepList = [{ compare: [], data: copyData() }],
				outer,
				inner;

			for (outer = length - 1; outer > 0; outer--) {
				for (inner = 0; inner < outer; inner++) {
					if (data[inner] > data[inner + 1]) {
						swap(inner, inner + 1);
					}
					stepList.push({ compare: [inner, inner + 1], data: copyData() });
				}
			}

			this.render();
			return stepList;
		},

		/**
		 * 选择排序
		 */
		selectSort: function () {
			var length = data.length,
				stepList = [{ compare: [], data: copyData() }],
				outer,
				inner,
				min;

			for (outer = 0; outer < length - 1; outer++) {
				min = outer;
				for (inner = outer + 1; inner < length; inner++) {
					stepList.push({ compare: [inner, min, outer], data: copyData() });
					if (data[inner] < data[min]) {
						min = inner;
					}
				}
				swap(outer, min);
				stepList.push({ compare: [outer, min], data: copyData() });
			}

			this.render();
			return stepList;
		},

		/**
		 * 插入排序
		 */
		insertSort: function () {
			var length = data.length,
				stepList = [{ compare: [], data: copyData() }],
				outer,
				inner,
				temp;

			for (outer = 1; outer < length; outer++) {
				temp = data[outer];
				inner = outer;
				while (inner > 0 && data[inner - 1] >= temp) {
					data[inner] = data[inner - 1];
					stepList.push({ compare: [inner, inner - 1, outer], data: copyData() });
					inner--;
				}
				data[inner] = temp;
				stepList.push({ compare: [inner, outer], data: copyData() });
			}

			this.render();
			return stepList;
		},

		/**
		 * 希尔排序
		 */
		shellSort: function () {
			var length = data.length,
				stepList = [{ compare: [], data: copyData() }],
				gap = 1,
				outer,
				inner;

			while (gap < length / 3) {
				gap = 3 * gap + 1;
			}
			while (gap >= 1) {
				for (outer = gap; outer < length; outer++) {
					stepList.push({ compare: [outer, outer - gap], data: copyData() });
					for (inner = outer; inner >= gap && data[inner] < data[inner - gap]; inner -= gap) {
						swap(inner, inner - gap);
						stepList.push({ compare: [inner, inner - gap, outer], data: copyData() });
					}
				}
				gap = (gap - 1) / 3;
			}

			this.render();
			return stepList;
		},

		/**
		 * 归并排序
		 */
		mergeSort: function () {
			var length = data.length,
				stepList = [{ compare: [], data: copyData() }];

			mSort();

			function mSort() {
				if (length < 2) {
					return;
				}

				var step = 1,
					left,
					right;

				while (step < length) {
					left = 0;
					right = step;
					while (right + step <= length) {
						merge(left, left + step, right, right + step);
						left = right + step;
						right = left + step;
					}
					if (right < length) {
						merge(left, left + step, right, length);
					}
					step *= 2;
				}
			}

			function merge(startL, endL, startR, endR) {
				var left = [],
					right = [],
					i, j, k;

				k = startL;
				for (i = 0; i < endL - startL; i++) {
					left[i] = data[k++];
					stepList.push({ compare: [k, startL, endL - 1, endR - 1], data: copyData() });
				}
				k = startR;
				for (i = 0; i < endR - startR; i++) {
					right[i] = data[k++];
					stepList.push({ compare: [k, startL, endL - 1, endR - 1], data: copyData() });
				}
				left[left.length] = Infinity;
				right[right.length] = Infinity;

				i = j = 0;
				for (k = startL; k < endR; k++) {
					if (left[i] < right[j]) {
						data[k] = left[i++];
					} else {
						data[k] = right[j++];
					}
				}
				stepList.push({ compare: [startL, endR - 1], data: copyData() });
			}

			this.render();
			return stepList;
		},

		/**
		 * 快速排序
		 */
		quickSort: function () {
			var length = data.length,
				stepList = [{ compare: [], data: copyData() }];

			qSoft(0, length - 1);

			function qSoft(start, end) {
				var middel;
				if (start < end) {
					middel = partition(start, end);
					qSoft(start, middel - 1);
					qSoft(middel + 1, end);
				}
			}

			function partition(start, end) {
				var left = start,
					right = end + 1,
					pivot = data[start];

				while (true) {
					while (data[++left] < pivot && left < right) {
						stepList.push({ compare: [left, right, start, end], data: copyData() });
					};
					while (data[--right] > pivot) {
						stepList.push({ compare: [left, right, start, end], data: copyData() });
					};
					if (left >= right) break;
					swap(left, right);
					stepList.push({ compare: [left, right, start, end], data: copyData() });
				}
				swap(start, right);
				stepList.push({ compare: [left, right, start, end], data: copyData() });
				return right;
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
	btnReverse = document.getElementById("list-reverse"),
	btnShift = document.getElementById("list-shift"),
	btnBubbleSort = document.getElementById("list-bubble-sort"),
	btnSelectSort = document.getElementById("list-select-sort"),
	btnInsertSort = document.getElementById("list-insert-sort"),
	btnShellSort = document.getElementById("list-shell-sort"),
	btnMergeSort = document.getElementById("list-merge-sort"),
	btnQuickSort = document.getElementById("list-quick-sort"),
	timer = null,	// 定时器
	delay = 30,	// 定时器间隔
	stepList;	// 步骤记录表


/**
 * 渲染图表
 */
function renderChart(step) {
	var chart = document.getElementById("chart-wrap"),
		frag = document.createDocumentFragment(),
		compare = step.compare,
		data_ = step.data,
		max = list.getMax(),	// 最大值
		dataElm,	// 矩形元素
		proportion,	// 当前数值与最大值占比
		i;

	if (data_.length === 0) {
		chart.innerHTML = "";
		return false;
	}

	// 构造矩形
	for (i = 0; i < data_.length; i++) {
		// 当前数值与最大值占比
		proportion = data_[i] / max;
		proportion > 1 && (proportion = 1);

		// 创建矩形元素
		dataElm = document.createElement("span");
		dataElm.style.height = 500 * proportion + "px";
		dataElm.style.height = 500 * proportion + "px";
		dataElm.title = data_[i];

		// 插入DOM片段中缓存
		frag.appendChild(dataElm);
	}

	//插入页面
	chart.innerHTML = "";
	chart.appendChild(frag);
	for (i = 0; i < compare.length; i++) {
		chart.children[compare[i]].className = "act";
	}
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
 * 结束动画
 */
function ending() {
	clearInterval(timer);
	renderChart({ compare: [], data: list.getData() });
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
 * 队列元素的点击事件
 */
dom.onclick = function (ev) {
	var item = ev.target,
		index;

	if (item.nodeName.toLocaleLowerCase() === "span") {
		index = [].indexOf.call(dom.children, ev.target);
		list.remove(index);
		ending();
	}
}

/**
 * 按钮元素的点击事件
 */
btnPush.onclick = function () {
	var val = getInputVal();
	val && list.push(val);
	ending();
}
btnPop.onclick = function () {
	var val = list.pop();
	alert(val ? val : "队列为空");
	ending();
}
btnUnshift.onclick = function () {
	var val = getInputVal();
	val && list.unshift(val);
	ending();
}
btnShift.onclick = function () {
	var val = list.shift();
	alert(val ? val : "队列为空");
	ending();
}
btnReverse.onclick = function () {
	list.reverse();
	ending();
}
btnBubbleSort.onclick = function () {
	stepList = list.bubbleSort();
	renderStepList(delay);
}
btnSelectSort.onclick = function () {
	stepList = list.selectSort();
	renderStepList(delay);
}
btnInsertSort.onclick = function () {
	stepList = list.insertSort();
	renderStepList(delay);
}
btnShellSort.onclick = function () {
	stepList = list.shellSort();
	renderStepList(delay);
}
btnQuickSort.onclick = function () {
	stepList = list.quickSort();
	renderStepList(delay);
}
btnMergeSort.onclick = function () {
	stepList = list.mergeSort();
	renderStepList(delay);
}

// 渲染页面
list.render();
ending();
