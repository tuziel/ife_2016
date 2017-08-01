
(function () {

	// 创建表格
	var bg = document.getElementById("background");
	var bg_tr = [];
	for (var i = 0; i < 11; i++) {
		bg_tr[i] = document.createElement("tr");	// 创建11行tr
		bg.appendChild(bg_tr[i]);
		var bg_td = [];
		for (var j = 0; j < 11; j++) {
			bg_td[j] = document.createElement("td");	// 创建11列td
			if (i === 0 && j > 0) {
				bg_td[j].innerHTML = j;	// 标注列数
			}
			if (i > 0 && j === 0) {
				bg_td[j].innerHTML = i;	// 标注行数
			}
			bg_tr[i].appendChild(bg_td[j]);
		}
	}

	// 获取HTLM元素
	var square = document.getElementById("square");
	var btnRun = document.getElementById("run");
	var btnGo = document.getElementById("go");
	var btnLef = document.getElementById("tunLef");
	var btnRig = document.getElementById("tunRig");
	var btnBac = document.getElementById("tunBac");
	var pos = {
		X: 6,	// X坐标 1-10
		Y: 6,	// Y坐标 1-10
		face: 0	// 方向 0: 上, 1: 右, 2: 下, 3: 左;
	}
	btnRun.onclick = function () {
		var cmd = document.getElementById("cmd").value;	//获取输入框的值
		move(cmd);
	}
	btnGo.onclick = function () {
		move("GO");
	}
	btnLef.onclick = function () {
		move("TUN LEF");
	}
	btnRig.onclick = function () {
		move("TUN RIG");
	}
	btnBac.onclick = function () {
		move("TUN BAC");
	}

	// 主函数
	function move(cmd) {
		if (cmd === "GO") {
			go();
		}
		else if (cmd === "TUN LEF") {
			tunLef();
		}
		else if (cmd === "TUN RIG") {
			tunRig();
		}
		else if (cmd === "TUN BAC") {
			tunRig();
			tunRig();	// 执行两次向右转
		}
		else {
			alert("请输入正确的指令\nGO：前进一格\nTUN LEF：向左转\nTUN RIG：向右转\nTUN BAC：向后转");
			return false;
		}
		draw();
	}

	// 前进一格
	function go() {
		var face_ = pos.face;	// pos.face不能在square过渡完成前设置为0~3，因此创建face_临时值计算方向
		face_ = face_ % 4 + (face_ % 4 < 0 ? 4 : 0);	// 计算face_的方向
		if (face_ === 0 && pos.Y > 1) {
			pos.Y--;	// square上移
		}
		else if (face_ === 1 && pos.X < 10) {
			pos.X++;	// square右移
		}
		else if (face_ === 2 && pos.Y < 10) {
			pos.Y++;	// square下移
		}
		else if (face_ === 3 && pos.X > 1) {
			pos.X--;	// square左移
		}
		else {
			return false;
		}
	}

	// 左转
	function tunLef() {
		pos.face--;
	}

	// 右转
	function tunRig() {
		pos.face++;
	}

	// 设置样式
	function draw() {
		square.style.top = pos.Y * 50 + "px";
		square.style.left = pos.X * 50 + "px";
		square.style.transform = square.style.webkitTransform = square.style.msTransform = "rotate(" + (pos.face * 90) + "deg)";
	}
})();