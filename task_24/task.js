/**
 * 节点类
 * 用于保存数据和与其他节点的链接
 * @param {Node} parent 父节点
 * @param {any} [data] 存放的数据
 */
function Node(parent, data) {
	this.parent = parent;
	this.data = data;
	this.length = 0;
}

Node.prototype = {
	constructor: Node,

	/**
	 * 返回保存在节点中的数据
	 */
	getData: function () {
		return this.data;
	},

	push: function (node) {
		if (!node) {
			return false;
		}

		return [].push.call(this, node);
	},

	/**
	 * 从父节点中删除当前节点
	 */
	remove: function () {
		if (!this.parent) {
			return false;
		}

		var index = [].indexOf.call(this.parent, this);
		return [].splice.call(this.parent, index, 1);
	}
};

/**
 * 树类
 */
function BST() {
	this.root = null;
}

BST.prototype = {
	constructor: BST,

	/**
	 * 深度优先遍历
	 * @param {function} callback
	 */
	dfs: function (callback) {
		(function traverse(node) {
			if (node !== null) {
				callback && callback(node.data, node);

				for (var i = 0, l = node.length; i < l; i++) {
					traverse(node[i]);
				}
			}
		})(this.root);
	},

	/**
	 * 广度优先遍历
	 * @param {function} callback
	 */
	bfs: function (callback) {
		var queue = [this.root],
			node, child;

		while (queue.length) {
			node = queue.shift();
			callback && callback(node.data, node);

			for (var i = 0, l = node.length; i < l; i++) {
				if ((child = node[i]) !== null) {
					queue.push(child);
				}
			}
		}
	},

	/**
	 * 寻找元素
	 *
	 */
	find: function (data, method) {
		var target = null;

		method = method || "dfs";
		this[method](function (current, node) {
			if (data === current) {
				target = node;
			}
		});

		return target;
	}
};


/* main */
var treeDom = document.getElementById("tree"),
	searchInput = document.getElementById("search-input"),
	traverseBar = document.getElementById("traverse-bar"),
	btnRemove = document.getElementById("remove"),
	btnAdd = document.getElementById("add"),
	tree = new BST(),
	elmQueue = [],
	timer = null;

/**
 * 添加DOM节点
 * @param {Node} node
 */
function addDomNode(node) {
	var elms = node.data.children,
		child, data;

	for (var i = 0, l = (node.length = elms.length); i < l; i++) {
		data = elms[i];
		child = new Node(node, data);
		node[i] = child;
		addDomNode(node[i]);
	}
}

/**
 * 获取第一个文本节点的文本
 * @param {HTMLElement} elm
 */
function getFirstText(elm) {
	return elm.childNodes[0].textContent.trim();
}

/**
 * 遍历二叉树
 * 返回遍历结果队列
 * @param {string} method 遍历顺序
 */
function traverseDomTree(method) {
	var METHODS = {
			"dfs": "深度优先",
			"bfs": "广度优先"
		},
		domQueue = [],
		i;

	for (i in METHODS) {
		if (method === i || method === METHODS[i]) {
			tree[i](function (data) {
				domQueue.push(data);
			});
			break;
		}
	}

	return domQueue;
}

/**
 *
 * 添加className
 * @param {array} domList DOM元素列表
 * @param {string} cName className
 */
function addClass(domList, cName) {
	var cList = cName.split(/\s+/),
		length = domList.length,
		elm,
		elmCList,
		rList;

	while (length--) {
		elm = domList[length];
		elmCList = elm.className ? elm.className.split(/\s+/) : [];
		rList = [];
		elmCList.forEach(function (val) {
			rList.push(val);
		});
		cList.forEach(function (val) {
			if (rList.indexOf(val) < 0) {
				rList.push(val);
			}
		});
		elm.className = rList.join(" ");
	}
}

/**
 * 清除对应的className
 * @param {array} domList DOM元素列表
 * @param {string} cName className
 */
function removeClass(domList, cName) {
	var cList = cName.split(/\s+/),
		length = domList.length,
		elm,
		elmCList,
		rList,
		index;

	while (length--) {
		elm = domList[length];
		elmCList = elm.className ? elm.className.split(/\s+/) : [];
		rList = [];
		elmCList.forEach(function (val) {
			rList.push(val);
		});
		cList.forEach(function (val) {
			index = rList.indexOf(val);
			if (index > -1) {
				rList.splice(index, 1);
			}
		});
		elm.className = rList.join(" ");
	}
}

/**
 * 遍历渲染DOM树
 * @param {array} queue 遍历顺序的队列
 */
function renderDomTree(queue) {
	var searchTag = searchInput.value.trim(),
		i = 0;

	// 清除旧操作
	clearInterval(timer);
	removeClass(queue, "act tag select");
	elmQueue.length = 0;

	timer = setInterval(function () {
		var length = queue.length,
			elm,
			cName;

		removeClass(queue, "act");

		if (i < length) {
			elm = queue[i];
			cName = elm.className;

			elm.className = cName ? cName + " act" : "act";

			// 匹配搜索内容
			if (searchTag && searchTag === getFirstText(elm)) {
				elm.className += " tag";
			}
		} else if (i > length) {
			clearInterval(timer);
		}
		i++;

	}, 500);
}

// 树元素点击事件
treeDom.onclick = function (ev) {
	var elm = ev.target,
		index = elmQueue.indexOf(elm);

	if (index < 0) {
		addClass([elm], "select");
		elmQueue.push(elm);
	} else {
		removeClass([elm], "select");
		elmQueue.splice(index, 1);
	}
};

// 按钮点击事件
traverseBar.onclick = function (ev) {
	var elm = ev.target;

	if (elm.nodeName.toLowerCase() === "input" && elm.value) {
		renderDomTree(traverseDomTree(elm.value));
	}
};

btnRemove.onclick = function () {
	var hasRoot = 0,
		elm;

	while ((elm = elmQueue.pop())) {
		if (elm !== treeDom) {
			tree.find(elm).remove();
			elm.parentNode.removeChild(elm);
		} else {
			hasRoot = 1;
		}
	}

	hasRoot && elmQueue.push(treeDom);
};

btnAdd.onclick = function () {
	var value = document.getElementById("node-input").value,
		data,
		node;

	value &&
		elmQueue.forEach(function (elm) {
			data = document.createElement("div");
			data.innerHTML = value;
			node = new Node(null, data);
			tree.find(elm).push(node);
			elm.appendChild(data);
		});
};

// 根据HTML文档生成二叉树
tree.root = new Node(null, treeDom);
addDomNode(tree.root);