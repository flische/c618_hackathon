var game = null;

$(document).ready(initializeApp);

function initializeApp(){
    game = new CheckerGame();
    game.startUp();
}

class CheckerGame{
    constructor(){

    }
    startUp(){
        this.buildGameBoard();
        // this.displayInitialModal();
        this.populatePlayer1Chips();
        this.populatePlayer2Chips();
    }

    buildGameBoard(){
        var boardSize = { rows: 8, squares: 8 };
        var gameBoard = $('#game-board');

        var len = boardSize.rows;

        var index = 0;
        for(var i = 0; i < len; i++){
            var outerDiv = $('<div>').addClass('row');
            for( var j = 0; j < len; j++){
                var classArray = ['light', 'dark'];
                var innerDiv = $('<div>').addClass('square');
                innerDiv.addClass(classArray[index]);
                innerDiv.attr('id', i + '' + j);
                outerDiv.append(innerDiv);
                index = 1 - index;
            }
            gameBoard.append(outerDiv);
            index = 1 - index;
        }
    }
    displayInitialModal() {
        $('#myModal').modal('show');
    }
    displayWinModal() {
        $('#myWinModalModal').modal('show');
    }

    populatePlayer1Chips(){
        var divArr = $('#game-board div');
        for(var i = 2; i < divArr.length/2 - 8; i+=2){
            $(divArr[i]).addClass('imgPlayer1');
        }
    }

    populatePlayer2Chips(){
        var divArr = $('#game-board div');
        for(var i = divArr.length; i > divArr.length/2 + 8; i-=2){
            $(divArr[i]).addClass('imgPlayer2');
            console.log(divArr[i]);
        }
    }

}
