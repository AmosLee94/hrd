(function(){
// 全局变量：
	var board = document.getElementById("board");
	var pieces = new Array;//棋子，一个字符数组，包含七个棋子和两个空位
	var blankPieces = new Array;
	var subsistentPiece = new Array;
	var activePiece;//当前被选中的棋子
	// 按钮
	var resetButton = document.getElementById("reset");
	var nextButton = document.getElementById('nextStep');
	var preButton = document.getElementById('preStep');
	var autoButton = document.getElementById('auto');
	resetButton.addEventListener("click",reset);
//解决方法
	var solution ={0:{"HuangZhong":"DOWN"},1:{"GuanYu" :"RIGHT"},2:{"Zu1" :"LEFT"},3:{"Zu2" :"LEFT"},4:{"Zu3" :"DOWN"},5:{"Zu4" :"LEFT"},6:{"MaChao" :"LEFT"},7:{"ZhaoYun" :"DOWN"},8:{"ZhaoYun" :"DOWN"},9:{"CaoCao" :"RIGHT"},10:{"Zu2" :"UP"},11:{"Zu1" :"RIGHT"},12:{"HuangZhong":"UP"},13:{"Zu2" :"UP"},14:{"Zu1" :"UP"},15:{"Zu4" :"UP"},16:{"Zu3" :"UP"},17:{"GuanYu" :"LEFT"},18:{"ZhaoYun" :"DOWN"},19:{"GuanYu" :"LEFT"},20:{"MaChao" :"DOWN"},21:{"CaoCao" :"DOWN"},22:{"Zu2" :"RIGHT"},23:{"Zu1" :"UP"},24:{"Zu2" :"RIGHT"},25:{"Zu1" :"RIGHT"},26:{"Zu4" :"UP"},27:{"Zu4" :"UP"},28:{"CaoCao" :"LEFT"},29:{"ZhaoYun" :"UP"},30:{"ZhaoYun" :"UP"},31:{"MaChao" :"RIGHT"},32:{"Zu3" :"RIGHT"},33:{"Zu3" :"DOWN"},34:{"CaoCao" :"DOWN"},35:{"Zu1" :"DOWN"},36:{"Zu4" :"RIGHT"},37:{"ZhangFei" :"RIGHT"},38:{"HuangZhong":"UP"},39:{"HuangZhong":"UP"},40:{"CaoCao" :"LEFT"},41:{"Zu1" :"DOWN"},42:{"Zu1" :"DOWN"},43:{"Zu4" :"DOWN"},44:{"Zu2" :"LEFT"},45:{"ZhaoYun" :"UP"},46:{"MaChao" :"UP"},47:{"Zu3" :"RIGHT"},48:{"Zu1" :"DOWN"},49:{"CaoCao" :"RIGHT"},50:{"HuangZhong":"DOWN"},51:{"HuangZhong":"DOWN"},52:{"ZhangFei" :"LEFT"},53:{"Zu2" :"LEFT"},54:{"Zu4" :"LEFT"},55:{"ZhaoYun" :"LEFT"},56:{"MaChao" :"UP"},57:{"MaChao" :"UP"},58:{"CaoCao" :"RIGHT"},59:{"HuangZhong":"RIGHT"},60:{"ZhangFei" :"DOWN"},61:{"Zu2" :"LEFT"},62:{"Zu4" :"UP"},63:{"HuangZhong":"UP"},64:{"GuanYu" :"UP"},65:{"Zu1" :"LEFT"},66:{"Zu1" :"LEFT"},67:{"Zu3" :"LEFT"},68:{"Zu3" :"LEFT"},69:{"CaoCao" :"DOWN"},70:{"ZhaoYun" :"DOWN"},71:{"MaChao" :"DOWN"},72:{"Zu4" :"RIGHT"},73:{"Zu2" :"RIGHT"},74:{"ZhangFei" :"UP"},75:{"Zu4" :"RIGHT"},76:{"Zu2" :"RIGHT"},77:{"HuangZhong":"UP"},78:{"GuanYu" :"UP"},79:{"Zu1" :"UP"},80:{"Zu3" :"LEFT"},81:{"CaoCao" :"LEFT"}};
//自动行走
	var stepNumber = 0;
	var AutoMoveTimer;
//函数：
//init() 	//添加方块，并按方案进行排列，再把节点都存进pieces变量中
//reset()	//按照方案重新排列
//moveByDirection()	//移动一个方块



	init();
	console.log(blankPieces);

	resetButton.addEventListener("click",reset);
	nextButton.addEventListener("click",autoMove);
	preButton.addEventListener("click",revokeAutoMove);
	autoButton.addEventListener("click",addAutoMoveTimer);
	document.addEventListener("keydown",function(event){
		switch(event.keyCode){
			case 40:autoMove();break;
			case 38:revokeAutoMove();break;
		}
	});



// 函数
	function init() {
		function addPiece(id){
			switch(id){
				case "ZhaoYun":case "HuangZhong":case "ZhangFei":case "MaChao":
					rowspan = 2;colspan = 1;break;
				case "Zu1":case "Zu2":case "Zu3":case "Zu4":
					rowspan = 1;colspan = 1;break;
				case "CaoCao":
					rowspan = 2;colspan = 2;break;
				case "GuanYu":
					rowspan = 1;colspan = 2;break;
			}
			var newPiece = document.createElement("img");
			newPiece.setAttribute("class","piece");
			newPiece.setAttribute("x",0);
			newPiece.setAttribute("y",0);
			newPiece.setAttribute("colspan",colspan);
			newPiece.setAttribute("rowspan",rowspan);
			newPiece.setAttribute("id",id);
			newPiece.setAttribute("src","img/"+id+".jpg");
			board.appendChild(newPiece);
			pieces[id] = newPiece;
			subsistentPiece[id] = newPiece;
		}
		function addBlank(number){
			id = "blank_"+number;
			var newBlank = document.createElement("div");
			newBlank.setAttribute("class","piece");
			newBlank.setAttribute("x",0);
			newBlank.setAttribute("y",0);
			newBlank.setAttribute("colspan",1);
			newBlank.setAttribute("rowspan",1);
			newBlank.setAttribute("id",id);
			newBlank.setAttribute("src","img/"+id+".jpg");
			newBlank.innerHTML = '空';
			board.appendChild(newBlank);
			pieces[id] = newBlank;
			blankPieces[number] = newBlank;
		}
		addPiece("CaoCao");
		addPiece("GuanYu");
		addPiece("ZhaoYun");
		addPiece("HuangZhong");
		addPiece("ZhangFei");
		addPiece("MaChao");
		addPiece("Zu1");
		addPiece("Zu2");
		addPiece("Zu3");
		addPiece("Zu4");
		addBlank(0);
		addBlank(1);
		reset(1);
	}
	function reset(plan){//按照方案重新排列
		moveByXY("CaoCao",1,0);
		moveByXY("GuanYu",1,4);
		moveByXY("ZhaoYun",3,0);
		moveByXY("HuangZhong",0,2);
		moveByXY("ZhangFei",0,0);
		moveByXY("MaChao",3,2);
		moveByXY("Zu1",1,2);
		moveByXY("Zu2",2,2);
		moveByXY("Zu3",1,3);
		moveByXY("Zu4",2,3);
		moveByXY("blank_0",0,4);
		moveByXY("blank_1",3,4);
		stepNumber= 0;
		removeAutoMoveTimer();
	}
	function moveByDirection(id,direction){//移动一个方块
		var piece = pieces[id];
		if(!piece){
			console.log("error 0:function move("+id+","+direction+"):Unable to find!");
			return;
		}else{
			x = parseInt(piece.getAttribute("x"));
			y = parseInt(piece.getAttribute("y"));
			rowspan = parseInt(piece.getAttribute("rowspan"));
			colspan = parseInt(piece.getAttribute("colspan"));
			switch(direction){
				case "UP":y -=1;break;
				case "DOWN":y +=1;break;
				case "LEFT":x -=1;break;
				case "RIGHT":x +=1;break;
			}
			if(x>=0 && x+colspan<5 && y>=0 &&y+rowspan<6){
				piece.setAttribute("x",x);
				piece.setAttribute("y",y);
				return true;
			}else{
				console.log("error 2:function move("+id+","+direction+"):Unable to move!("+"X="+x+";y="+y+")");
				return false;
			}
		}
	}
	function moveByXY(id,x,y){//移动一个方块
		var piece = pieces[id];
		piece.setAttribute("x",x);
		piece.setAttribute("y",y);
	}
	for (var key in subsistentPiece) {
		subsistentPiece[key].addEventListener("click",function(e){
			if(activePiece&&activePiece.getAttribute("active")) activePiece.removeAttribute("active");
			activePiece = this;
			activePiece.setAttribute("active",1);
			if ( e && e.stopPropagation ) e.stopPropagation();else window.event.cancelBubble = true; 
		});
	}
	for(var key in blankPieces){
		blankPieces[key].addEventListener("click",function(e){
			if(activePiece){
				// var endX=parseInt(e.offsetX/this.clientWidth*4);
				// var endY=parseInt(e.offsetY/this.clientHeight*5);
				var endX=parseInt(this.getAttribute("x"));
				var endY=parseInt(this.getAttribute("y"));
				var startX=parseInt(activePiece.getAttribute("x"));
				var startY=parseInt(activePiece.getAttribute("y"));
				var colspan=parseInt(activePiece.getAttribute("colspan"));
				var rowspan=parseInt(activePiece.getAttribute("rowspan"));
				var direction;
				console.log("activePiece = "+activePiece.id+";startX="+startX+";startY="+startY+";endX="+endX+";endY="+endY+";colspan="+colspan+";rowspan="+rowspan+";");
				if(startX + colspan == endX && endY >= startY && endY < startY + rowspan)direction = "RIGHT";
				if(startX - 1 		== endX && endY >= startY && endY < startY + rowspan)direction = "LEFT";
				if(startY + rowspan == endY && endX >= startX && endX < startX + colspan)direction = "DOWN";
				if(startY - 1 		== endY && endX >= startX && endX < startX + colspan)direction = "UP";
				moveByDirection(activePiece.id,direction);
				//需要记录空白处，否则高为2的块向左或向右移动切只有一个空白时，就会出错
			}
		});
	}
	function autoMove(){
		if(solution[stepNumber]){
			for(var key in solution[stepNumber]){
		 		moveByDirection(key,solution[stepNumber][key]);
		 	}
		 	stepNumber++;
		 	return true;
		}else{
			console.log("error[autoMove()]:solution[stepNumber] = "+solution[stepNumber]+";stepNumber = "+stepNumber);
		 	return false;
		}
	}
	function revokeAutoMove(){
		var direction;
		if(stepNumber>0){
		 	stepNumber--;
			for(var key in solution[stepNumber]){
				switch(solution[stepNumber][key]){
					case "UP" : direction = "DOWN";break;
					case "DOWN" : direction = "UP";break;
					case "LEFT" : direction = "RIGHT";break;
					case "RIGHT" : direction = "LEFT";break;
				}
		 		moveByDirection(key,direction);
		 	}	
		}
	}
	function addAutoMoveTimer(){
		AutoMoveTimer = window.setInterval(function(){
			if(solution[stepNumber]){
				autoMove();
			}else{
				removeAutoMoveTimer();
			}
		},500);
	}
	function removeAutoMoveTimer(){
		console.log("clearInterval(AutoMoveTimer)!");
		window.clearInterval(AutoMoveTimer); 
	}
})();
















// meta移动端缩放
(function(){
	var oMeta = document.createElement('meta');
	oMeta.name="viewport"
	oMeta.content = 'width=device-width,initial-scale='+document.documentElement.clientWidth/400+',maximum-scale='+document.documentElement.clientWidth/400+', user-scalable=no';
	document.getElementsByTagName('head')[0].appendChild(oMeta);
})();
// 修改手机端click（没有成功T_T）
(function(){
	var buttons = document.getElementsByTagName('button');
	for (var i = buttons.length - 1; i >= 0; i--) {
		buttons[i].addEventListener("tap",function(){
			this.onclick();
			alert(this.innerHTML);
		});
	}
})();

