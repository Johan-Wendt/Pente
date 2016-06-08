/**
 * Created by johanwendt on 2016-06-05.
 */

var visibleGrid, invisibleGrid, playerTurn, playerOne, playerTwo, notPlayerTurn, middleSquares, playerOneImage, playerTwoImage;
var firstTurn = true;
var secondTurnOver = false;


$(document).ready(function () {

    loadImages();
    createVisibleGrid();
    createInvisibleGrid();
    createPlayers();
    createMiddleSquare();


    playerTurn = playerOne;



});

function gamegrid(rows, cols, clickable, callback) {
    var i = 0;
    var grid = document.createElement('table');

    for (var r = 0; r < rows; ++r) {
        var tr = grid.appendChild(document.createElement('tr'));
        for (var c = 0; c < cols; ++c) {
            var cell = tr.appendChild(document.createElement('td'));
            ++i;
            if (clickable) {

                cell.addEventListener('click', (function (el, r, c, i) {
                    return function () {
                        callback(el, r, c, i);
                    }
                })(cell, r, c, i), false);
            }
        }
    }
    return grid;
}

function createInvisibleGrid() {
    invisibleGrid = gamegrid(19, 19, true, function (el, row, col, i) {
        occupyCell(row, col, el);
    //    el.style.backgroundColor = playerTurn.token;
      //  console.log("added cell in row" + playerTurn.cells[(playerTurn.cells.length - 1)].row);

      //  el.className = 'clicked';
      //  if (lastClicked) lastClicked.className = '';
      //  lastClicked = el;


    });
    $("#invisibleGridDiv").append(invisibleGrid);
    invisibleGrid.id = 'invisibleGrid';
    invisibleGrid.className = 'grid';
}

function createVisibleGrid() {
    visibleGrid = gamegrid(18, 18, false);
    $("#visibleGridDiv").append(visibleGrid);
    visibleGrid.id = 'visibleGrid';
    visibleGrid.className = 'grid';
}

function createMiddleSquare() {
    middleSquares = [];
    var xPos = 7;

    while(xPos <= 11) {
        var yPos = 7;
        while(yPos <= 11) {

            middleSquares.push(new cell(xPos, yPos));
            yPos ++;
        }
        xPos ++;
    }
    colorMiddleSquares();
}

function colorMiddleSquares() {
    var table = $("#visibleGrid")[0];

    var xPos = 7;

    while(xPos <= 10) {
        var yPos = 7;
        while(yPos <= 10) {

            var cell = table.rows[yPos].cells[xPos];
            $(cell).css("border","red solid 1px");
            yPos ++;
        }
        xPos ++;
    }

    xPos = 7;
    yPos = 6;

    while (xPos < 11) {
        var cell = table.rows[yPos].cells[xPos];
        $(cell).css("border-bottom-color","red");
        xPos++;
    }

    xPos = 6;
    yPos = 7;

    while (yPos < 11) {
        var cell = table.rows[yPos].cells[xPos];
        $(cell).css("border-right-color","red");
        yPos++;
    }

}

function loadImages() {
    playerOneImage = "url('Pictures/emerald.png')";
    playerTwoImage = "url('Pictures/ruby.png')";
}

var cell = function (row, column, element) {
    var row, column, element;

    this.row = row;
    this.column = column;
    this.element = element;
}

var player = function (name, token) {
    var name, token, cells, points;
    var me = this;
    var isWinner = false;


    this.points = 0;
    this.name = name;
    this.token = token;

    this.cells = [];

    this.occupiesCell = function (row, column) {
        var taken = false;
        this.cells.forEach(function (value) {
            if(value.row == row && value.column == column) {
                taken = true;
            }
        });
        return taken;
    };

    this.hasFiveInARow = function() {
        var winner = false
        this.cells.forEach(function (value) {
            var yDir = -1;
            while(yDir < 2) {
                var xDir = -1;
                while (xDir < 2) {
                    var inARow = 0;
                    var opponnentPieces = [];
                    var currentY = value.row;
                    var currentX = value.column;
                    var searching = true;
                    while (searching) {
                        inARow++;
                        currentY += yDir;
                        currentX += xDir;
                        if (inARow == 5) {
                            winner = true;
                            searching = false;
                        }
                        if(!playerOne.occupiesCell(currentY, currentX) && !playerTwo.occupiesCell(currentY, currentX)) {
                            searching = false;
                        }
                        else if(!me.occupiesCell(currentY, currentX)) {
                            opponnentPieces.push(new cell(currentY, currentX));
                        }
                        if(inARow == 3) {
                            console.log(opponnentPieces.length);
                            if(opponnentPieces.length == 2 && me.occupiesCell(currentY, currentX)) {
                                var oppponent = getOpponent(me);
                                oppponent.removeFromCells(opponnentPieces[0].row, opponnentPieces[0].column);
                                oppponent.removeFromCells(opponnentPieces[1].row, opponnentPieces[1].column);
                                me.points ++;
                                if(me.points == 5) {
                                    winner = true;
                                }

                            }
                            if(opponnentPieces.length > 0) {
                                searching = false;
                            }
                        }
                    }
                    xDir ++;
                    if(xDir == 0 && yDir == 0) {
                        xDir ++;
                    }
                }
                yDir ++;
            }
        });
        console.log("winner: " + winner);
        return winner;


    }
    this.wins = function() {
        if(me.hasFiveInARow()) {
            me.isWinner = true;
        }
        return me.isWinner;
    }
    this.removeFromCells = function(row, column) {
        this.cells.forEach(function(value, index, object) {
            if (value.row == row && value.column == column) {
                value.element.style.backgroundImage = "";
                console.log("Removed");
                object.splice(index, 1);

            }
        });

    }

}

function createPlayers() {
    playerOne = new player(1, playerOneImage);
    playerTwo = new player(2, playerTwoImage);
}

function changeTurn() {
    if (playerTurn == playerOne) {
        playerTurn = playerTwo;
        notPlayerTurn = playerOne;
    }
    else {
        playerTurn = playerOne;
        notPlayerTurn = playerTwo;
        if(firstTurn == false) {
            secondTurnOver = true;
        }
        firstTurn = false;
    }
}

function occupyCell(row, column, el) {
    var alreadytaken =  cellTaken(row, column);
    if(!alreadytaken && (!(firstTurn && !isCorrectFirstMove(row, column)))) {
        if(firstTurn || !(!secondTurnOver && !isCorrectSecondMove(row, column))) {
            playerTurn.cells.push(new cell(row, column, el));
            console.log(playerTurn.token);
            el.style.backgroundImage = playerTurn.token;
            if(playerTurn.wins() == true) {

            }



            else {
                changeTurn();
            }
        }


    }
}

function cellTaken(row, column) {
    var taken = false;
    if(playerOne.occupiesCell(row, column) || playerTwo.occupiesCell(row, column)) {
        taken = true;
    }
    return taken;
}

function getOpponent(player) {
    if(player == playerOne) {
        return playerTwo;
    }
    else {
        return playerOne;
    }
}

function isInMiddleSquares(row, column) {
    var isInMiddle = false;
    middleSquares.forEach(function (value) {
        if(value.row == row && value.column == column) {
            isInMiddle = true;
        }
    });
    return isInMiddle;
}
function isCorrectFirstMove(row, column) {
    var allowed = false;
    var inMiddle = isInMiddleSquares(row, column);

    if((playerTurn == playerOne && inMiddle) || (playerTurn == playerTwo)) {
        allowed =true;
    }


    return allowed;
}
function isCorrectSecondMove(row, column) {
    var allowed = false;
    var inMiddle = isInMiddleSquares(row, column);

    if((playerTurn == playerOne && !inMiddle) || (playerTurn == playerTwo)) {
        allowed =true;
    }


    return allowed;
}