var game = null;

$(document).ready(initializeApp);

function initializeApp(){
    game = new CheckerGame();
    game.startUp();
    $('.row > *').click(game.checkMoves);
}

class CheckerGame{
    constructor(){
        this.checkMoves = this.checkMoves.bind(this);
        this.gameBoardReference = null;
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
        this.gameBoardReference = $('#game-board div');
        for(var i = 2; i < this.gameBoardReference.length/2 - 8; i+=2){
            $(this.gameBoardReference[i]).addClass('imgPlayer1');
        }
    }

    populatePlayer2Chips(){
        this.gameBoardReference = $('#game-board div');
        for(var i = this.gameBoardReference.length; i > this.gameBoardReference.length/2 + 8; i-=2){
            $(this.gameBoardReference[i]).addClass('imgPlayer2');
        }
    }

    checkMoves(event){
        var classes = $(event.target).attr('class');
        var player1 = classes.includes('imgPlayer1');
        var player2 = classes.includes('imgPlayer2');

        var pieceLocation = $(event.target).attr('id');
        pieceLocation = pieceLocation.split('');
        var nextLocation = '';

        if(player1){
            // debugger;
            $(event.target).toggleClass('selected');
            // ()=>this.possibleSquare(pieceLocation, player1);
            nextLocation = this.possibleSquare(pieceLocation, 'player1');
            console.log("nextLocation", nextLocation);
            this.highlightBoard(nextLocation);
        } else if(player2){
            // debugger;
            $(event.target).toggleClass('selected');
            nextLocation = this.possibleSquare(pieceLocation, 'player2');
            this.highlightBoard(nextLocation);
        }
    }

    possibleSquare(location ,player){
        var i = parseInt(location[0]);
        var j = parseInt((location[1]));
        if(player === 'player1'){
            var rightBox = ([i + 1, j + 1]).join('');
            var leftBox = ([i + 1, j - 1]).join('');

        }
        return [rightBox, leftBox];
    }

    highlightBoard(nextLocation){
        console.log("nextLocation", nextLocation);
        console.log(this.gameBoardReference);
        $("#"+ nextLocation[0]).css('border', '7px solid pink');
        $("#"+ nextLocation[1]).css('border', '7px solid pink');
    }

}
