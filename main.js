var game = null;

$(document).ready(initializeApp);

function initializeApp(){
    game = new CheckerGame();
    game.startUp();
    game.applyClickHandlers();
}

class CheckerGame{
    constructor(){
        this.checkMoves = this.checkMoves.bind(this);
        this.gameBoardReference = null;
        this.currentMode = 'checkmove'
    }
    applyClickHandlers(){
        $('.row > *').click(this.checkMoves);
    }
    removeClickHandlers(){
        $('.row > *').off();
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
        if(this.currentMode!=='checkmove'){
            return;
        }
        var classes = $(event.target).attr('class');
        var player1 = classes.includes('imgPlayer1');
        var player2 = classes.includes('imgPlayer2');

        var currentLocation = $(event.target).attr('id');
        var pieceLocation = currentLocation.split('');
        var nextLocation = '';

        if(player1){
            // debugger;
            $(event.target).toggleClass('selected');
            // ()=>this.possibleSquare(pieceLocation, player1);
            nextLocation = this.possibleSquare(pieceLocation, 'player1');
            this.highlightBoard(currentLocation, nextLocation, 'imgPlayer1');
        } else if(player2){
            // debugger;
            $(event.target).toggleClass('selected');
            nextLocation = this.possibleSquare(pieceLocation, 'player2');

            this.highlightBoard(currentLocation, nextLocation, 'imgPlayer1');
            
        }
    }


    possibleSquare(location ,player){
        var i = parseInt(location[0]);
        var j = parseInt((location[1]));
        if(player === 'player1'){
            var rightBox = ([i + 1, j + 1]).join('');
            var leftBox = ([i + 1, j - 1]).join('');
        }
        if(player === 'player2'){
            var rightBox = ([i - 1, j + 1]).join('');
            var leftBox = ([i - 1, j - 1]).join('');
        }
        return [rightBox, leftBox];
    }
    updatePlayerBoardPosition( newCellID, currentLocation, leftMove, rightMove, player ){
        this.currentMode='checkmove'
        $("#"+ newCellID).addClass(player);
        $("#" + currentLocation).removeClass(player);
        $("#" + currentLocation).removeClass('selected');
        $("#"+ leftMove).removeClass('selectedToMove');
        $("#"+ rightMove).removeClass('selectedToMove');
        this.removeClickHandlers();
        this.applyClickHandlers();
    }
    highlightBoard(currentLocation, nextLocation, player){
        console.log('current', currentLocation);
        var rightMove = nextLocation[0];
        var leftMove = nextLocation[1];
        $("#"+ rightMove).addClass('selectedToMove');
        $("#"+ leftMove).addClass('selectedToMove');

        $("#"+ rightMove).click(function(){
            this.updatePlayerBoardPosition(rightMove, currentLocation, leftMove, rightMove, player)
        }.bind(this));
        $("#"+ leftMove).click(function(){
            this.updatePlayerBoardPosition(leftMove, currentLocation, leftMove, rightMove, player)
        }.bind(this));
        this.currentMode = 'possibleMove'
    }

    movePieces(){

    checkForPieceOnSquare(nextLocation){
        if($('#' + nextLocation[0]).hasClass('imgPlayer1') || $('#' + nextLocation[0]).hasClass('imgPlayer2')){
            $("#"+ nextLocation[0]).css('border','none');
        }
        if($('#' + nextLocation[0]).hasClass('imgPlayer1') || $('#' + nextLocation[0]).hasClass('imgPlayer2')){
            $("#"+ nextLocation[1]).css('border','none');
        }
    }

    highlightBoard(nextLocation){
        console.log("nextLocation", nextLocation);
        console.log(this.gameBoardReference);
        $("#"+ nextLocation[0]).css('border', '7px solid pink');
        $("#"+ nextLocation[1]).css('border', '7px solid pink');
        this.checkForPieceOnSquare(nextLocation);

    }

}
