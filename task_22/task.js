/**
 * 节点类
 * 用于保存数据和与其他节点的链接
 * @param {Node} parent 父节点
 * @param {any} [data] 存放的数据
 */
function Node(parent, data) {
	this.parent = parent;
	this.data = data;
	this.left = null;
	this.right = null;
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
	 * 中序遍历
	 * @param {function} callback
	 */
	inOrder: function (callback) {
		(function traverse(node) {
			if (node !== null) {
				traverse(node.left);
				callback && callback(node.data, node);
				traverse(node.right);
			}
		})(this.root);
	},

	/**
	 * 先序遍历
	 * @param {function} callback
	 */
	preOrder: function (callback) {
		(function traverse(node) {
			if (node !== null) {
				callback && callback(node.data, node);
				traverse(node.left);
				traverse(node.right);
			}
		})(this.root);
	},

	/**
	 * 后序遍历
	 * @param {function} callback
	 */
	postOrder: function (callback) {
		(function traverse(node) {
			if (node !== null) {
				traverse(node.left);
				traverse(node.right);
				callback && callback(node.data, node);
			}
		})(this.root);
	},


	/**
	 * 广度优先遍历
	 * @param {function} callback
	 */
	bfs: function (callback) {
		var queue = [this.root],
			node, left, right;

		while (queue.length) {
			node = queue.shift();
			callback && callback(node.data, node);

			if ((left = node.left) !== null) {
				queue.push(left);
			}
			if ((right = node.right) !== null) {
				queue.push(right);
			}
		}
	}
}


/* main */
var controlBar = document.getElementById("control-bar"),
	tree = new BST(),
	timer = null;

// 添加DOM节点
function addDomNode(node) {
	var elms = node.data.children,
		left, right, data;

	// 添加第一个子元素到左节点
	if (elms[0]) {
		data = elms[0];
		left = new Node(node, data);
		node.left = left;
		// 递归添加节点
		addDomNode(node.left);
	}
	// 添加最后一个子元素到右节点
	if (elms.length > 1) {
		data = elms[elms.length - 1];
		right = new Node(node, data);
		node.right = right;
		addDomNode(node.right);
	}
}

/**
 * 遍历二叉树
 * 返回遍历结果队列
 * @param {string} method 遍历顺序
 */
function traverseDomTree(method) {
	var METHODS = {
		"inOrder": "中序遍历",
		"preOrder": "先序遍历",
		"postOrder": "后序遍历",
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
 * 遍历渲染DOM树
 * @param {array} queue 遍历顺序的队列
 */
function renderDomTree(queue) {
	// 清除背景色
	function clearBgc() {
		var j = queue.length;
		while (j--) {
			queue[j].className = queue[j].className.replace(/\s*act/g, "");
		}
	}

	var i = 0;

	// 清除旧操作
	clearInterval(timer);
	clearBgc();

	timer = setInterval(function () {
		var length = queue.length,
			cName;

		clearBgc();
		if (i < length) {
			cName = queue[i].className;
			queue[i].className = cName ? cName + " act" : "act";
		} else if (i > length) {
			clearInterval(timer);
		}
		i++;

	}, 500);
}

// 按钮点击事件
controlBar.onclick = function (ev) {
	var elm = ev.target;
	if (elm.nodeName.toLowerCase() === "input" && elm.value) {
		renderDomTree(traverseDomTree(elm.value));
	}
}

// 根据HTML文档生成二叉树
tree.root = new Node(null, document.getElementById("tree"));
addDomNode(tree.root);