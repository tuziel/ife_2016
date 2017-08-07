/**
 * 生成队列
 * @param {array} data
 * @param {HTMLElement} elm
 */
var list = (function (data, elm) {
	var data = data || [];
	var elm = elm || null;

	return {
		/**
		 * 从队列右边插入元素
		 * 返回数组长度
		 * @param {any} val
		 */
		push: function (val) {
			var item = document.createElement("span");
			item.innerHTML = val;
			elm.appendChild(item);
			console.log(data);
			return data.push(val);
		},

		/**
		 * 从队列右边删除元素
		 * 返回删除的元素
		 */
		pop: function () {
			var lastItem = elm.lastElementChild;
			lastItem && elm.removeChild(lastItem);
			console.log(data);
			return data.pop();
		},

		/**
		 * 从队列左边插入元素
		 * 返回数组长度
		 * @param {any} val
		 */
		unshift: function (val) {
			var item = document.createElement("span"),
				firstItem = elm.firstElementChild;
			item.innerHTML = val;
			elm.insertBefore(item, firstItem);
			console.log(data);
			return data.unshift(val);
		},

		/**
		 * 从队列左边删除元素
		 * 返回删除的元素
		 */
		shift: function () {
			var firstItem = elm.firstElementChild;
			firstItem && elm.removeChild(firstItem);
			console.log(data);
			return data.shift();
		},

		/**
		 * 删除索引位置的元素
		 * 返回删除的元素
		 * @param {number} index
		 */
		remove(index) {
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
		}
	}
})(
	[1, 5, 2, 4, 8, 2, 6, 8, 12, 74],
	document.getElementById("list")
	);

(function () {
	var dom = document.getElementById("list"),
		btnPush = document.getElementById("list-push"),
		btnPop = document.getElementById("list-pop"),
		btnUnshift = document.getElementById("list-unshift"),
		btnShift = document.getElementById("list-shift");

	/**
	 * 获取输入的数据
	 */
	function getInputVal() {
		var val = document.getElementById("list-input").value;

		if (!val) {
			alert("请输入数值");
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

	// 渲染页面
	list.render();

})();