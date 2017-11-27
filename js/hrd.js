window.addEventListener('load',function(){
	var solution ={0:{"HuangZhong" :"DOWN"},
	1:{"GuanYu"     :"RIGHT"},
	2:{"Zu1"        :"LEFT"},
	3:{"Zu2"        :"LEFT"},
	4:{"Zu3"        :"DOWN"},
	5:{"Zu4"        :"LEFT"},
	6:{"MaChao"     :"LEFT"},
	7:{"ZhaoYun"    :"DOWN"},
	8:{"ZhaoYun"    :"DOWN"},
	9:{"CaoCao"     :"RIGHT"},
	10:{"Zu2"        :"UP"},
	11:{"Zu1"        :"RIGHT"},
	12:{"HuangZhong" :"UP"},
	13:{"Zu2"        :"UP"},
	14:{"Zu1"        :"UP"},
	15:{"Zu4"        :"UP"},
	16:{"Zu3"        :"UP"},
	17:{"GuanYu"     :"LEFT"},
	18:{"ZhaoYun"    :"DOWN"},
	19:{"GuanYu"     :"LEFT"},
	20:{"MaChao"     :"DOWN"},
	21:{"CaoCao"     :"DOWN"},
	22:{"Zu2"        :"RIGHT"},
	23:{"Zu1"        :"UP"},
	24:{"Zu2"        :"RIGHT"},
	25:{"Zu1"        :"RIGHT"},
	26:{"Zu4"        :"UP"},
	27:{"Zu4"        :"UP"},
	28:{"CaoCao"     :"LEFT"},
	29:{"ZhaoYun"    :"UP"},
	30:{"ZhaoYun"    :"UP"},
	31:{"MaChao"     :"RIGHT"},
	32:{"Zu3"        :"RIGHT"},
	33:{"Zu3"        :"DOWN"},
	34:{"CaoCao"     :"DOWN"},
	35:{"Zu1"        :"DOWN"},
	36:{"Zu4"        :"RIGHT"},
	37:{"ZhangFei"   :"RIGHT"},
	38:{"HuangZhong" :"UP"},
	39:{"HuangZhong" :"UP"},
	40:{"CaoCao"     :"LEFT"},
	41:{"Zu1"        :"DOWN"},
	42:{"Zu1"        :"DOWN"},
	43:{"Zu4"        :"DOWN"},
	44:{"Zu2"        :"LEFT"},
	45:{"ZhaoYun"    :"UP"},
	46:{"MaChao"     :"UP"},
	47:{"Zu3"        :"RIGHT"},
	48:{"Zu1"        :"DOWN"},
	49:{"CaoCao"     :"RIGHT"},
	50:{"HuangZhong" :"DOWN"},
	51:{"HuangZhong" :"DOWN"},
	52:{"ZhangFei"   :"LEFT"},
	53:{"Zu2"        :"LEFT"},
	54:{"Zu4"        :"LEFT"},
	55:{"ZhaoYun"    :"LEFT"},
	56:{"MaChao"     :"UP"},
	57:{"MaChao"     :"UP"},
	58:{"CaoCao"     :"RIGHT"},
	59:{"HuangZhong" :"RIGHT"},
	60:{"ZhangFei"   :"DOWN"},
	61:{"Zu2"        :"LEFT"},
	62:{"Zu4"        :"UP"},
	63:{"HuangZhong" :"UP"},
	64:{"GuanYu"     :"UP"},
	65:{"Zu1"        :"LEFT"},
	66:{"Zu1"        :"LEFT"},
	67:{"Zu3"        :"LEFT"},
	68:{"Zu3"        :"LEFT"},
	69:{"CaoCao"     :"DOWN"},
	70:{"ZhaoYun"    :"DOWN"},
	71:{"MaChao"     :"DOWN"},
	72:{"Zu4"        :"RIGHT"},
	73:{"Zu2"        :"RIGHT"},
	74:{"ZhangFei"   :"UP"},
	75:{"Zu4"        :"RIGHT"},
	76:{"Zu2"        :"RIGHT"},
	77:{"HuangZhong" :"UP"},
	78:{"GuanYu"     :"UP"},
	79:{"Zu1"        :"UP"},
	80:{"Zu3"        :"LEFT"},
	81:{"CaoCao"     :"LEFT"}};

	var stepNumber = 0;
	var AutoMoveTimer;
	reset();
	var resetButton = document.getElementById("reset");
	var nextButton = document.getElementById('nextStep');
	var preButton = document.getElementById('preStep');
	var autoButton = document.getElementById('auto');
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

	function addPiece(id,x,y){
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
		var board = document.getElementById("board");
		var newPiece = document.createElement("img");
		newPiece.setAttribute("class","piece");
		newPiece.setAttribute("x",x);
		newPiece.setAttribute("y",y);
		newPiece.setAttribute("rowspan",rowspan);
		newPiece.setAttribute("colspan",colspan);
		newPiece.setAttribute("id",id);
		newPiece.setAttribute("src","img/"+id+".jpg");
		board.appendChild(newPiece);
	}
	function addPiecs(){
		addPiece("CaoCao",1,0);
		addPiece("GuanYu",1,4);
		addPiece("ZhaoYun",3,0);
		addPiece("HuangZhong",0,2);
		addPiece("ZhangFei",0,0);
		addPiece("MaChao",3,2);
		addPiece("Zu1",1,2);
		addPiece("Zu2",2,2);
		addPiece("Zu3",1,3);
		addPiece("Zu4",2,3);
	}
	function reset(){
		var board = document.getElementById("board");
		var childs = board.childNodes; 
		for(var i = childs.length - 1; i >= 0; i--) { 
		  board.removeChild(childs[i]); 
		}
		removeAutoMoveTimer();
		addPiecs();
		stepNumber = 0;

	}
	function move(id,direction){
		var piece = document.getElementById(id);
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
				default:console.log("error 1:function move("+id+","+direction+"):Unable to move!");
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
	function autoMove(){
		if(solution[stepNumber]){
			for(var key in solution[stepNumber]){
		 		move(key,solution[stepNumber][key]);
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
		 		move(key,direction);
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
		},100);
	}
	function removeAutoMoveTimer(){
		console.log("clearInterval(AutoMoveTimer)!");
		window.clearInterval(AutoMoveTimer); 
	}
});
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