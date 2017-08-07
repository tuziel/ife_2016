var list = (function (data, elm) {
	var data = data || [];
	var elm = elm || null;

	return {
		push: function (val) {
			var item = document.createElement("span");
			item.innerHTML = val;
			elm.appendChild(item);
			console.log(data);
			return data.push(val);
		},
		pop: function () {
			var lastItem = elm.lastElementChild;
			lastItem && elm.removeChild(lastItem);
			console.log(data);
			return data.pop();
		},
		unshift: function (val) {
			var item = document.createElement("span"),
				firstItem = elm.firstElementChild;
			item.innerHTML = val;
			elm.insertBefore(item, firstItem);
			console.log(data);
			return data.unshift(val);
		},
		shift: function () {
			var firstItem = elm.firstElementChild;
			firstItem && elm.removeChild(firstItem);
			console.log(data);
			return data.shift();
		},
		remove(i) {
			var item = elm.children[i];
			elm.removeChild(item);
			return data.splice(i, 1);
		},
		splice: function () {

		},
		render: function () {
			elm.innerHTML = "";
			data_ = data;
			data = [];
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

	function getInputVal() {
		var val = document.getElementById("list-input").value;
		if (!val) {
			alert("请输入数值");
			return false;
		}
		return val;
	}

	dom.onclick = function (ev) {
		var item = ev.target,
			index;

		if (item.nodeName.toLocaleLowerCase() === "span") {
			index = [].indexOf.call(dom.children, ev.target);
			list.remove(index);
		}
	}

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

	list.render();

})();