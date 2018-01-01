//类：
// 	Layout布局：	记录：棋子的大小，位置，名字，等信息
// 					函数：1、获取棋子位置；2、改变棋子位置
// 	Game游戏：		记录：布局
// 					函数：1、判断等否移动并移动
var Layout = /** @class */ (function () {
    function Layout(coords) {
        if (coords === void 0) { coords = [[1, 2], [2, 2], [1, 3], [2, 3], [0, 0], [0, 2], [3, 0], [3, 2], [1, 4], [1, 0], [0, 4], [3, 4]]; }
        this.piecesCoords = new Array(); //棋子，十个坐标，代表十个棋子和两个空白的坐标，从0-9，分别是，Zu1-Zu4，ZhangFei，MaChao，HuangZhong，ZhaoYun，GuanYu，CaoCao
        this.piecesName = ["Zu1", "Zu2", "Zu3", "Zu4", "ZhangFei", "MaChao", "HuangZhong", "ZhaoYun", "GuanYu", "CaoCao", "blank1", "blank2"];
        this.piecesSize = [[1, 1], [1, 1], [1, 1], [1, 1], [1, 2], [1, 2], [1, 2], [1, 2], [2, 1], [2, 2], [1, 1], [1, 1]];
        if (coords.length != 12) {
            // console.log("error![Layout.constructor]");
            return;
        }
        for (var i = 0; i < 12; i++) {
            this.piecesCoords.push([coords[i][0], coords[i][1]]);
        }
    }
    Layout.prototype.moveTo = function (id, x, y) {
        this.piecesCoords[id] = [x, y];
    };
    Layout.prototype.moveByDelta = function (id, x, y) {
        this.piecesCoords[id][0] += x;
        this.piecesCoords[id][1] += y;
    };
    Layout.prototype.move = function (pieceId, direction) {
        var moveDistance = { "UP": [0, -1], "DOWN": [0, 1], "LEFT": [-1, 0], "RIGHT": [1, 0] };
        var pieceSize = this.piecesSize[pieceId];
        var pieceWidth = pieceSize[0];
        var pieceHeight = pieceSize[1];
        var moveDistance2 = { "UP": [0, -1], "DOWN": [0, pieceHeight], "LEFT": [-1, 0], "RIGHT": [pieceWidth, 0] };
        var blankId = (this.piecesCoords[pieceId][0] + moveDistance2[direction][0] == this.piecesCoords[10][0] && this.piecesCoords[pieceId][1] + moveDistance2[direction][1] == this.piecesCoords[10][1]) ? 10 : 11;
        var anotherBliankId = blankId == 10 ? 11 : 10;
        this.moveByDelta(pieceId, moveDistance[direction][0], moveDistance[direction][1]);
        this.moveByDelta(blankId, -moveDistance[direction][0] * pieceWidth, -moveDistance[direction][1] * pieceHeight);
        if (pieceSize[{ "UP": 0, "DOWN": 0, "LEFT": 1, "RIGHT": 1 }[direction]] == 2)
            this.moveByDelta(anotherBliankId, -moveDistance[direction][0] * pieceWidth, -moveDistance[direction][1] * pieceHeight);
    };
    return Layout;
}());
var Game = /** @class */ (function () {
    function Game() {
        this.planId = 0;
        this.plans = [
            [[1, 2], [2, 2], [1, 3], [2, 3], [0, 0], [0, 2], [3, 0], [3, 2], [1, 4], [1, 0], [0, 4], [3, 4]],
            [[0, 4], [1, 3], [2, 3], [3, 4], [0, 0], [3, 0], [0, 2], [3, 2], [1, 2], [1, 0], [1, 4], [2, 4]],
            [[0, 2], [3, 2], [1, 3], [2, 3], [0, 0], [3, 0], [0, 3], [3, 3], [1, 2], [1, 0], [1, 4], [2, 4]],
            [[0, 2], [1, 2], [2, 2], [3, 2], [0, 0], [3, 0], [0, 3], [3, 3], [1, 3], [1, 0], [1, 4], [2, 4]],
            [[0, 0], [3, 0], [1, 3], [2, 3], [0, 1], [3, 1], [0, 3], [3, 3], [1, 2], [1, 0], [1, 4], [2, 4]],
            [[2, 2], [3, 2], [2, 3], [3, 3], [2, 0], [3, 0], [0, 3], [1, 3], [0, 2], [0, 0], [2, 4], [3, 4]]
            // [[,],[,],[,],[,],[,],[,],[,],[,],[,],[,],[,],[,]],
        ];
        this.planName = ["不知道", "横刀立马1", "横刀立马2", "齐头并进", "兵分三路", "兵屯东路"];
        this.layout = new Layout([[1, 2], [2, 2], [1, 3], [2, 3], [0, 0], [0, 2], [3, 0], [3, 2], [1, 4], [1, 0], [0, 4], [3, 4]]);
    }
    Game.prototype.reset = function () {
        this.layout = new Layout(this.plans[this.planId]);
    };
    Game.prototype.changePlan = function (planId) {
        this.planId++;
        if (this.planId > 5)
            this.planId = 0;
    };
    Game.prototype.checkAttach = function (pieceId, blankId) {
        var direction = false;
        var pieceSize = this.layout.piecesSize[pieceId];
        var pieceCoords = this.layout.piecesCoords[pieceId];
        var pieceX = pieceCoords[0];
        var pieceY = pieceCoords[1];
        var pieceWidth = pieceSize[0];
        var pieceHeight = pieceSize[1];
        var blankCoords = this.layout.piecesCoords[blankId];
        var blankX = blankCoords[0];
        var blankY = blankCoords[1];
        // console.log(this.layout.piecesName[pieceId]+"("+pieceX+","+pieceY+")"+" to "+this.layout.piecesName[blankId]+"("+blankX+","+blankY+")");
        if (blankX >= pieceX && blankX < pieceX + pieceWidth) {
            if (pieceY - 1 == blankY)
                direction = "UP";
            else if (pieceY + pieceHeight == blankY)
                direction = "DOWN";
        }
        if (blankY >= pieceY && blankY < pieceY + pieceHeight) {
            // console.log("direction --dd---");
            if (pieceX - 1 == blankX)
                direction = "LEFT";
            else if (pieceX + pieceWidth == blankX)
                direction = "RIGHT";
        }
        // console.log("direction -----"+direction);
        return direction;
    };
    Game.prototype.checkGO = function (pieceId, blankId) {
        var anotherBlankId = blankId == 10 ? 11 : 10;
        var pieceSize = this.layout.piecesSize[pieceId], pieceWidth = pieceSize[0], pieceHeight = pieceSize[1];
        var direction = this.checkAttach(pieceId, blankId);
        if (direction == "UP" || direction == "DOWN") {
            if (pieceWidth == 2) {
                var anotherDirection = this.checkAttach(pieceId, anotherBlankId);
                if (anotherDirection == direction)
                    return direction;
            }
            else if (pieceWidth == 1) {
                return direction;
            }
        }
        else if (direction == "RIGHT" || direction == "LEFT") {
            if (pieceHeight == 2) {
                var anotherDirection = this.checkAttach(pieceId, anotherBlankId);
                if (anotherDirection == direction)
                    return direction;
            }
            else if (pieceHeight == 1) {
                return direction;
            }
        }
    };
    Game.prototype.findPath = function (pieceId, blankId) {
        var direction = this.checkGO(pieceId, blankId);
        if (direction) {
            return [direction];
        }
        else {
            var anotherBlankId = blankId == 10 ? 11 : 10;
            var anotherDirection = this.checkGO(pieceId, anotherBlankId);
            if (anotherDirection) {
                var blankDirection = this.checkGO(anotherBlankId, blankId);
                if (blankDirection) {
                    if (anotherDirection == blankDirection) {
                        return [anotherDirection, anotherDirection];
                    }
                    else {
                        var piecesSize = this.layout.piecesSize[pieceId];
                        if (piecesSize[0] == 1 && piecesSize[1] == 1) {
                            return [anotherDirection, blankDirection];
                        }
                    }
                }
            }
        }
        return [];
    };
    Game.prototype.moveTo = function (pieceId, blankId) {
        var path = this.findPath(pieceId, blankId);
        for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
            var direction = path_1[_i];
            this.layout.move(pieceId, direction);
        }
    };
    Game.prototype.autoMove = function (pieceId) {
        //	函数目的：有移动的可能，则移动（最长路径移动）
        //	情况分析:	1,	不能移动
        // 				2，	对一个空白能移动一格，对另一个不移动
        // 				3，	对一个空白能移动两格，对另一个能移动一格
        // 				4， 都能移动，且相等
        // 					-1	是两个路径
        // 					-2	其实是移动需要两个空白
        var path1 = this.findPath(pieceId, 10);
        var path2 = this.findPath(pieceId, 11);
        var path = [];
        path1.length > path2.length ? path = path1 : false;
        path1.length < path2.length ? path = path2 : false;
        (path1.length == 1 && path1.length == path2.length && path1[0] == path2[0]) ? path = path1 : false;
        console.log(path);
        for (var _i = 0, path_2 = path; _i < path_2.length; _i++) {
            var direction = path_2[_i];
            this.layout.move(pieceId, direction);
            console.log("坐标:" + this.layout.piecesCoords[pieceId]);
        }
    };
    return Game;
}());
function main() {
    var game = new Game();
    game.reset();
}
main();
//# sourceMappingURL=hrd.js.map