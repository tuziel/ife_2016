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
	}
}

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
					traverse(node[i]);;
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
	}
}


/* main */
var searchInput = document.getElementById("search-input"),
	traverseBar = document.getElementById("traverse-bar"),
	tree = new BST(),
	timer = null;

// 添加DOM节点
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
			})
			break;
		}
	}

	return domQueue;
}


/**
 * 清除对应的className
 * @param {array} domList DOM元素列表
 * @param {string} cName className
 */
function removeClass(domList, cName) {
	var CNANES = {
		"act": /\s*act/g,
		".all": /\s*(?:act|tag)/g
	},
		j = domList.length,
		reg;

	// 默认使用".all"中的正则
	reg = CNANES[(cName || ".all")];

	if (!reg) {
		return;
	}

	while (j--) {
		domList[j].className = domList[j].className.replace(reg, "");
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
	removeClass(queue);

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
			if (searchTag && searchTag === elm.childNodes[0].textContent.trim()) {
				elm.className += " tag";
			}
		} else if (i > length) {
			clearInterval(timer);
		}
		i++;

	}, 500);
}

// 按钮点击事件
traverseBar.onclick = function (ev) {
	var elm = ev.target;
	if (elm.nodeName.toLowerCase() === "input" && elm.value) {
		renderDomTree(traverseDomTree(elm.value));
	}
}

// 根据HTML文档生成二叉树
tree.root = new Node(null, document.getElementById("tree"));
addDomNode(tree.root);