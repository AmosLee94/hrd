//类：
// 	Layout布局：	记录：棋子的大小，位置，名字，等信息
// 					函数：1、获取棋子位置；2、改变棋子位置
// 	Game游戏：		记录：布局
// 					函数：1、判断等否移动并移动
class Layout{
    public piecesCoords = new Array();//棋子，十个坐标，代表十个棋子和两个空白的坐标，从0-9，分别是，Zu1-Zu4，ZhangFei，MaChao，HuangZhong，ZhaoYun，GuanYu，CaoCao
    public piecesName = ["Zu1","Zu2","Zu3","Zu4","ZhangFei","MaChao","HuangZhong","ZhaoYun","GuanYu","CaoCao","blank1","blank2"];
    public piecesSize = [[1,1],[1,1],[1,1],[1,1],[1,2],[1,2],[1,2],[1,2],[2,1],[2,2],[1,1],[1,1]];
    constructor(coords:number[][] = [[1,2],[2,2],[1,3],[2,3],[0,0],[0,2],[3,0],[3,2],[1,4],[1,0],[0,4],[3,4]]){
        if(coords.length != 12 ){
            return ;
        }
        for(let i = 0;i < 12;i ++){
            this.piecesCoords.push([coords[i][0],coords[i][1]]);
        }
    }
    public moveTo(id:number,x:number,y:number){
        this.piecesCoords[id] = [x,y];
    }
    public moveByDelta(id:number,x:number,y:number){
		this.piecesCoords[id][0] += x;
		this.piecesCoords[id][1] += y;
    }

    public move(pieceId:number,direction:string){
		let moveDistance = {"UP":[0,-1],"DOWN":[0,1],"LEFT":[-1,0],"RIGHT":[1,0]}

		let pieceSize = this.piecesSize[pieceId];
		let pieceWidth = pieceSize[0];
		let pieceHeight = pieceSize[1];

		let moveDistance2 = {"UP":[0,-1],"DOWN":[0,pieceHeight],"LEFT":[-1,0],"RIGHT":[pieceWidth,0]}

		let blankId = (this.piecesCoords[pieceId][0] + moveDistance2[direction][0] == this.piecesCoords[10][0] && this.piecesCoords[pieceId][1] + moveDistance2[direction][1] == this.piecesCoords[10][1])? 10 : 11;
		let anotherBliankId = blankId == 10?11:10;
		this.moveByDelta(pieceId,moveDistance[direction][0],moveDistance[direction][1]);
		this.moveByDelta(blankId,- moveDistance[direction][0] * pieceWidth,- moveDistance[direction][1] * pieceHeight);

		if(pieceSize[{"UP":0,"DOWN":0,"LEFT":1,"RIGHT":1}[direction]] == 2)//需要考虑宽度或者高度，
			this.moveByDelta(anotherBliankId,- moveDistance[direction][0] * pieceWidth,- moveDistance[direction][1] * pieceHeight);
    }
}
class Game {
	public layout:Layout;
	private planId = 0;
	private plans = [
		[[1,2],[2,2],[1,3],[2,3],[0,0],[0,2],[3,0],[3,2],[1,4],[1,0],[0,4],[3,4]],
		[[0,4],[1,3],[2,3],[3,4],[0,0],[3,0],[0,2],[3,2],[1,2],[1,0],[1,4],[2,4]],
		[[0,2],[3,2],[1,3],[2,3],[0,0],[3,0],[0,3],[3,3],[1,2],[1,0],[1,4],[2,4]],
		[[0,2],[1,2],[2,2],[3,2],[0,0],[3,0],[0,3],[3,3],[1,3],[1,0],[1,4],[2,4]],
		[[0,0],[3,0],[1,3],[2,3],[0,1],[3,1],[0,3],[3,3],[1,2],[1,0],[1,4],[2,4]],
		[[2,2],[3,2],[2,3],[3,3],[2,0],[3,0],[0,3],[1,3],[0,2],[0,0],[2,4],[3,4]]
		// [[,],[,],[,],[,],[,],[,],[,],[,],[,],[,],[,],[,]],
	];
	public planName = ["不知道","横刀立马1","横刀立马2","齐头并进","兵分三路","兵屯东路"];
	constructor() {
		this.layout = new Layout([[1,2],[2,2],[1,3],[2,3],[0,0],[0,2],[3,0],[3,2],[1,4],[1,0],[0,4],[3,4]]);
	}
	public reset(){
		this.layout = new Layout(this.plans[this.planId]);
	}
	public changePlan(planId:number = -1){
		if (planId == -1) {
			planId= Math.floor(Math.random() * (this.plans.length - 1));
			if(planId >= this.planId) planId ++;
			console.log(planId);
		}
		this.planId = planId;
		console.log(planId);

	}
	private checkAttach(pieceId:number,blankId:number) {	//判断空白是否贴着棋子，是的话，返回方向,否则返回false
		let direction:any = false;	

		let pieceSize = this.layout.piecesSize[pieceId];
		let pieceCoords = this.layout.piecesCoords[pieceId];
		let pieceX = pieceCoords[0];
		let pieceY = pieceCoords[1];
		let pieceWidth = pieceSize[0];
		let pieceHeight = pieceSize[1];

		let blankCoords = this.layout.piecesCoords[blankId];
		let blankX = blankCoords[0];
		let blankY = blankCoords[1];

		
		if(blankX >= pieceX && blankX < pieceX + pieceWidth){	//x坐标上看，空白在范围内
			if(pieceY - 1 == blankY)direction = "UP";
			else if(pieceY + pieceHeight == blankY)direction = "DOWN";
		}
		if(blankY >= pieceY && blankY < pieceY + pieceHeight){	//y坐标上看，空白在范围内
			if(pieceX - 1 == blankX)direction = "LEFT";
			else if(pieceX + pieceWidth == blankX)direction = "RIGHT";
		}
		return direction;
	}
	private checkGO(pieceId:number,blankId:number){	//检查能否行走
		let anotherBlankId = blankId == 10?11:10;
		let pieceSize = this.layout.piecesSize[pieceId] , pieceWidth = pieceSize[0] , pieceHeight = pieceSize[1];
		let direction = this.checkAttach(pieceId,blankId);

		if(direction == "UP" || direction == "DOWN"){
			if (pieceWidth == 2){
				let anotherDirection = this.checkAttach(pieceId,anotherBlankId);
				if(anotherDirection == direction) return direction;
			}else if (pieceWidth == 1){
				return direction;
			}
		}else if(direction == "RIGHT" || direction == "LEFT"){
			if (pieceHeight == 2){
				let anotherDirection = this.checkAttach(pieceId,anotherBlankId);
				if(anotherDirection == direction) return direction;
			}else if (pieceHeight == 1){
				return direction;
			}
		}
	}
	private findPath(pieceId:number,blankId:number):string[]{	//查找路线
		let direction = this.checkGO(pieceId,blankId);
		if(direction){
			return [direction];
		}else{
			let anotherBlankId = blankId == 10?11:10;
			let anotherDirection = this.checkGO(pieceId,anotherBlankId);
			if(anotherDirection){//另一快空白贴着棋子
				let blankDirection = this.checkGO(anotherBlankId,blankId);
				if(blankDirection){//目标空白贴着空白
					if(anotherDirection == blankDirection){	//两个方向相同
						return [anotherDirection,anotherDirection];
					}else{
						let piecesSize = this.layout.piecesSize[pieceId];
						if(piecesSize[0] == 1 && piecesSize[1] == 1){
							return [anotherDirection,blankDirection];
						}
					}
				}
			}
		}
		return [];
	}
	public moveTo(pieceId:number,blankId:number){
		let path = this.findPath(pieceId,blankId);
		for(let direction of path){
			this.layout.move(pieceId,direction);
		}
	}
	public autoMove(pieceId:number){
		//	函数目的：有移动的可能，则移动（最长路径移动）
		//	情况分析:	1,	不能移动
		// 				2，	对一个空白能移动一格，对另一个不移动
		// 				3，	对一个空白能移动两格，对另一个能移动一格
		// 				4， 都能移动，且相等
		// 					-1	这是两个是两个路径
		// 					-2	这次移动的棋子占用需要两个位置
		let path1 = this.findPath(pieceId,10);
		let path2 = this.findPath(pieceId,11);
		let path = [];
		path1.length > path2.length ? path = path1 : false;
		path1.length < path2.length ? path = path2 : false;
		(path1.length == 1 && path1.length ==  path2.length && path1[0] == path2[0]) ? path = path1 : false;
		for(let direction of path){
			this.layout.move(pieceId,direction);
		}
	}
}
// function main() {
// 	let game = new Game();
// 	game.reset();
// }
// main();
