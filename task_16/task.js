/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	// 获取输入框的值
	var city = document.getElementById("aqi-city-input").value,
		score = document.getElementById("aqi-value-input").value;

	// 检测值不为空
	if (!city) {
		alert("请输入城市名");
		return false;
	} else if (!score) {
		alert("请输入空气质量指数");
		return false;
	}

	// 裁剪空格
	city = city.trim();
	score = score.trim();

	// 判断输入合法性
	if (/[^a-zA-Z\u4E00-\u9FFF]/.test(city)) {
		alert("城市名必须为中英文字符");
		return false;
	} else if (/[0-9]/.test.score) {
		alert("空气质量指数必须为整数");
		return false;
	}

	aqiData[city] = score;
}

/**
 * formatStr
 * 文本格式化
 * 用args中的文本替换字符串中的"%s"
 */
function formatStr(str, args) {
	for (var i = 1; i < arguments.length; i++) {
		str = str.replace("%s", arguments[i]);
	}
	return str;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var aqiTable = document.getElementById("aqi-table"),
		tbody = document.createElement("tbody"),
		thead = document.createElement("tr"),
		city;

	// 添加表头
	aqiTable.innerHTML = "";
	thead.innerHTML = "<td>城市</td><td>空气质量</td><td>操作</td>";
	tbody.appendChild(thead);

	// 遍历aqiData添加到表格
	for (city in aqiData) {
		var tr = document.createElement("tr");
		tr.innerHTML = formatStr("<td>%s</td><td>%s</td><td><button>删除</button></td>", city, aqiData[city]);
		tbody.appendChild(tr);
	}

	aqiTable.appendChild(tbody);
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
	addAqiData();
	renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(ev) {
	// do sth.

	var
		// 事件委托，捕获被点击的元素
		target = ev.target,
		city;

	// 如果被点击的是button
	if (target.nodeName.toLocaleLowerCase() == "button") {

		// 获取城市名所在元素的文本内容
		city = target
			.parentNode
			.parentNode
			.getElementsByTagName("td")[0]
			.innerHTML;

		// 删除aqiData中对应的属性
		delete aqiData[city];

		renderAqiList();
	}
}

function init() {
	// 等待文档加载完成后执行
	window.onload = function () {

		var btnAdd = document.getElementById("add-btn"),
			aqiTable = document.getElementById("aqi-table");

		// 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
		btnAdd.onclick = addBtnHandle;

		// 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
		aqiTable.onclick = delBtnHandle;
	}
}

init();
