/**
 * 生成队列
 * @param {array} data
 * @param {HTMLElement} elm
 */
function List(data, elm) {
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
			item.innerText = val;
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
		 * @param {any} val
		 */
		unshift: function (val) {
			var item = document.createElement("span"),
				firstItem = elm.firstElementChild;
			item.innerText = val;
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
		 * 根据逗号空格等字符切分字符串
		 * 返回一个字符串数组
		 * @param {string} text 输入的字符串
		 */
		sliceWord: function (text) {
			if (typeof text !== "string") {
				return false;
			}

			var strList = [],
				index;

			strList = text.split(/[\r\n,，、\s]+/);

			// 去除空字符串
			for (index = 0; index < strList.length; index++) {
				!strList[index] && strList.splice(index, 1);
			}

			return strList;
		},

		/**
		 * 模糊查找队列中的元素
		 * 返回符合条件元素的索引数组
		 * @param {string} str 输入的字符串
		 */
		search: function (str) {
			var arr = [];
			str = this.sliceWord(str);

			data.forEach(function (elm, i) {
				var flag, j;

				for (j = 0; j < str.length; j++) {
					// 如果当前元素与搜索条件吻合，标识置1
					if (("" + elm).indexOf(str[j]) > -1) {
						flag = 1;
					}
				}
				// 如果存在标识，将当前元素加入返回列表中
				if (flag) {
					arr.push(i);
				}
			})

			return arr;
		},

		/**
		 * 元素是否已存在
		 * @param {string} str 输入的字符串
		 */
		isExist: function (str) {
			return data.indexOf(str) > -1;
		},

		/**
		 * 限制元素在count个以内
		 * @param {number} count 元素数量
		 */
		fixed: function (count) {
			while (data.length > count) {
				this.shift();
			}
		}
	}
}

var domTag = getId("list-tag"),
	domHobby = getId("list-hobby"),
	inputTag = getId("list-tag-input"),
	btnPush = getId("list-push"),
	listTag = List(["HTML", "CSS", "JS"], domTag),
	listHobby = List(["游泳", "瑜伽", "摄影"], domHobby);

function getId(id) {
	return document.getElementById(id);
}

/**
 * 获取输入的数据
 * @param {string} id 获取元素的id
 */
function getInputVal(id) {
	var val = document.getElementById(id).value;

	if (!val) {
		alert("请输入数值");
		return false;
	}

	return val;
}

/**
 * 渲染列表
 * @param {HTMLElement} dom 渲染的元素
 * @param {array} arr 渲染的数据
 */
function renderTag(dom, arr) {
	var domList = dom.children,
		index;
	for (index = 0; index < domList.length; index++) {
		domList[index].style.backgroundColor = "";
	}
	for (index = 0; index < arr.length; index++) {
		domList[arr[index]].style.backgroundColor = "#c3c";
	}
}

/**
 * 列表元素的点击事件
 */
domTag.onclick = function (ev) {
	var item = ev.target,
		index;

	if (item.nodeName.toLocaleLowerCase() === "span") {
		index = [].indexOf.call(domTag.children, ev.target);
		listTag.remove(index);
	}
}
// domHobby.onclick = function (ev) {
// 	var item = ev.target,
// 		index;

// 	if (item.nodeName.toLocaleLowerCase() === "span") {
// 		index = [].indexOf.call(domHobby.children, ev.target);
// 		listHobby.remove(index);
// 	}
// }

/**
 * 输入标签事件
 */
inputTag.oninput = function () {
	var val = getId("list-tag-input").value,
		index;

	// 根据逗号空格等字符切分字符串
	if (val) {
		val = val.split(/[\r\n,，、\s]+/);
	}
	// 去除空字符串，但忽略最后一个值（当前输入或空字符串）
	for (index = 0; index < val.length - 1; index++) {
		!val[index] && val.splice(index, 1);
	}
	// 将切分好的字符串插入队列中，除了最后一个值
	for (index = 0; index < val.length - 1; index++) {
		!listTag.isExist(val[index]) && listTag.push(val[index]);
	}
	// 如果获取到可插入队列的字符串，清空输入，只保留最后一个值
	if (val.length > 1 || !val[1]) {
		getId("list-tag-input").value = val[val.length - 1];
	}

	// 限制队列元素在10个以内
	listTag.fixed(10);
}
inputTag.onkeydown = function (ev) {
	// 按下回车时当作输入空格处理
	if (ev.keyCode === 13) {
		getId("list-tag-input").value += " ";
		inputTag.oninput();
	}
}

/**
 * 按钮元素的点击事件
 */
btnPush.onclick = function () {
	var val = getInputVal("list-input"),
		index;

	if (val) {
		val = listHobby.sliceWord(val);
	}
	for (index = 0; index < val.length; index++) {
		!listHobby.isExist(val[index]) && listHobby.push(val[index]);
	}

	listHobby.fixed(10);
}

// 渲染页面
listTag.render();
listHobby.render();
