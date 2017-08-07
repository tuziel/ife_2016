/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
	var y = dat.getFullYear();
	var m = dat.getMonth() + 1;
	m = m < 10 ? '0' + m : m;
	var d = dat.getDate();
	d = d < 10 ? '0' + d : d;
	return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
	var returnData = {};
	var dat = new Date("2016-01-01");
	var datStr = ''
	for (var i = 1; i < 92; i++) {
		datStr = getDateStr(dat);
		returnData[datStr] = Math.ceil(Math.random() * seed);
		dat.setDate(dat.getDate() + 1);
	}
	return returnData;
}

var aqiSourceData = {
	"北京": randomBuildData(500),
	"上海": randomBuildData(300),
	"广州": randomBuildData(200),
	"深圳": randomBuildData(100),
	"成都": randomBuildData(300),
	"西安": randomBuildData(500),
	"福州": randomBuildData(100),
	"厦门": randomBuildData(100),
	"沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
	nowSelectCity: -1,
	nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
	var chart = document.getElementsByClassName("aqi-chart-wrap")[0],
		frag = document.createDocumentFragment(),
		dataElm,	// 矩形元素
		width,	// 矩形宽度
		proportion,	// 当前降雨量占比
		i;

	// 计算宽度
	width = pageState.nowGraTime === "month" ? "100px" :
		pageState.nowGraTime === "week" ? "40px" :
			"10px";

	// 构造矩形
	for (i in chartData) {
		// 当前降雨量占比，最大值取500，超出范围取1
		proportion = chartData[i] / 500;
		proportion > 1 && (proportion = 1);

		// 创建矩形元素并添加样式与title信息
		dataElm = document.createElement("span");
		dataElm.style.width = width;
		dataElm.style.height = 500 * proportion + "px";
		// 颜色变化为 rgb(64,191,64) -> rgb(64,191,191) -> rgb(64,64,191)
		dataElm.style.backgroundColor = "rgb(64," +
			(proportion <= 0.5 ? 191 : Math.floor(191 - 127 * proportion)) + "," +
			(proportion >= 0.5 ? 191 : Math.floor(191 - 127 * proportion)) +
			")";
		dataElm.title = "日期: " + i + "\n降雨量: " + chartData[i];

		// 插入DOM片段中缓存
		frag.appendChild(dataElm);
	}

	//插入页面
	chart.innerHTML = "";
	chart.appendChild(frag);
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
	var times = document.getElementsByName("gra-time"),
		value,
		i;

	for (i = 0; i < times.length; i++) {
		if (times[i].checked) {
			value = times[i].value;
			break;
		}
	}

	// 确定是否选项发生了变化
	if (pageState.nowGraTime === value) {
		return false;
	}

	// 设置对应数据
	pageState.nowGraTime = value;

	// 调用图表渲染函数
	initAqiChartData();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
	var select = document.getElementById("city-select"),
		city = select.value;

	// 确定是否选项发生了变化
	if (pageState.nowSelectCity === city) {
		return false;
	}

	// 设置对应数据
	pageState.nowSelectCity = city;

	// 调用图表渲染函数
	initAqiChartData();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
	var times = document.getElementsByName("gra-time"),
		i;
	for (i = 0; i < times.length; i++) {
		times[i].onclick = graTimeChange;
	}
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
	var select = document.getElementById("city-select"),
		frag = document.createDocumentFragment(),
		option, city;

	// 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
	for (city in aqiSourceData) {
		option = document.createElement("option");
		option.value = option.innerHTML = city;
		frag.appendChild(option);
	}
	select.innerHTML = "";
	select.appendChild(frag);
	pageState.nowSelectCity = select.value;

	// 给select设置事件，当选项发生变化时调用函数citySelectChange
	select.onchange = citySelectChange;
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
	var city = pageState.nowSelectCity,
		time = pageState.nowGraTime,
		data = aqiSourceData[city],
		// 计算周期数据总和
		total = 0,
		// 计算周期数据个数
		count = 0,
		// 当前周期开始时间
		startTime = "",
		// 当前周期结束时间
		endTime = "",
		i;

	// 将原始的源数据处理成图表需要的数据格式
	// 处理好的数据存到 chartData 中
	chartData = {};
	if (time === "month") {
		for (i in data) {
			// 如果开始时间不存在则从本次循环开始
			if (!startTime) {
				startTime = i;
			}
			// 如果到达下一个周期
			else if (new Date(i).getDate() === 1) {
				// 结算上一周期的数据
				chartData[startTime + (endTime !== startTime ? " - " + endTime : "")] = total / count;
				// 重置周期参数
				total = count = 0;
				// 重新开始计算周期
				startTime = i;
			}
			// 累计数据
			total += data[i];
			count++;
			endTime = i;
		}
		chartData[startTime + (endTime !== startTime ? " - " + endTime : "")] = total / count;
	} else if (time === "week") {
		for (i in data) {
			if (!startTime) {
				startTime = i;
			} else if (new Date(i).getDay() === 0) {
				chartData[startTime + (endTime !== startTime ? " - " + endTime : "")] = total / count;
				total = count = 0;
				startTime = i;
			}
			total += data[i];
			count++;
			endTime = i;
		}
		chartData[startTime + (endTime !== startTime ? " - " + endTime : "")] = total / count;
	} else {
		for (i in data) {
			chartData[i] = data[i];
		}
	}
	renderChart();
}

/**
 * 初始化函数
 */
function init() {
	initGraTimeForm()
	initCitySelector();
	initAqiChartData();
}

init();