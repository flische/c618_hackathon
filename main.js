var game = null;

$(document).ready(initializeApp);

function initializeApp(){
    game = new CheckerGame();
    game.startUp();
    game.applyClickHandlers();
}

class CheckerGame{
    constructor(){
        this.i = null;
        this.j = null;
        this.checkMoves = this.checkMoves.bind(this);
        this.gameBoardReference = null;
        this.currentMode = 'checkmove';
        this.kingP1Array = ['70', '72', '74', '76'];
        this.kingP2Array = ['01', '03','05', '07'];
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
       /* if(this.currentMode!=='checkmove'){
            return;
        }*/
        var classes = $(event.target).attr('class');
        var player1 = classes.includes('imgPlayer1');
        var player2 = classes.includes('imgPlayer2');

        var currentLocation = $(event.target).attr('id');
        var pieceLocation = currentLocation.split('');
        var nextLocation = '';

        // changed player1 and player2 to select and deselect

        if(player1){
            if($(event.target).hasClass('selected')){
                $('#game-board div').removeClass('selected');
                $('#game-board div').removeClass('selectedToMove');
                $(event.target).addClass('selected');
            } else {
                $('#game-board div').removeClass('selected');
                $('#game-board div').removeClass('selectedToMove');
                $(event.target).addClass('selected');
            }
            nextLocation = this.possibleSquare(pieceLocation, 'player1');
            this.highlightBoard(currentLocation, nextLocation, 'imgPlayer1');

        } else if(player2){
            if($(event.target).hasClass('selected')){
                $('#game-board div').removeClass('selected');
                $('#game-board div').removeClass('selectedToMove');
                $(event.target).addClass('selected');
            } else {
                $('#game-board div').removeClass('selected');
                $('#game-board div').removeClass('selectedToMove');
                $(event.target).addClass('selected');
            }
            nextLocation = this.possibleSquare(pieceLocation, 'player2');
            this.highlightBoard(currentLocation, nextLocation, 'imgPlayer2');
        }
    }


    possibleSquare(location ,player){
        this.i = parseInt(location[0]);
        this.j = parseInt((location[1]));
        if(player === 'player1'){
            var rightBox = ([this.i + 1, this.j + 1]).join('');
            var leftBox = ([this.i + 1, this.j - 1]).join('');
        }
        if(player === 'player2'){
            var rightBox = ([this.i - 1, this.j + 1]).join('');
            var leftBox = ([this.i - 1, this.j - 1]).join('');
        }
        return [rightBox, leftBox];
    }
    updatePlayerBoardPosition( newCellID, currentLocation, leftMove, rightMove, player ){
            /*this.currentMode='checkMove'*/
            if(!$("#" + newCellID).hasClass('imgPlayer1') && !$("#" + newCellID).hasClass('imgPlayer2')){
                // debugger;
                $("#"+ newCellID).addClass(player);
                $("#" + currentLocation).removeClass(player);
                // debugger;
                if(this.kingP1Array.includes(newCellID)){
                    $("#"+ newCellID).addClass('kingPiecePlayer1');
                }
                if(this.kingP2Array.includes(newCellID)){
                    $("#"+ newCellID).addClass('kingPiecePlayer2');
                }
            }

            $("#" + currentLocation).removeClass('selected');
            $("#"+ leftMove).removeClass('selectedToMove');
            $("#"+ rightMove).removeClass('selectedToMove');
            this.removeClickHandlers();
            this.applyClickHandlers();
    }

    highlightBoard(currentLocation, nextLocation, player) {

        var rightMove = nextLocation[0];
        var leftMove = nextLocation[1];

        // check for possible jump with Squirtle
        if (player === 'imgPlayer1') {
            if ($('#' + nextLocation[0]).hasClass('imgPlayer2')) {
                nextLocation[0] = ([this.i + 2, this.j + 2]).join('');
                if ($('#' + nextLocation[0]).hasClass('imgPlayer2') || $('#' + nextLocation[0]).hasClass('imgPlayer1')) {
                    $("#" + rightMove).removeClass('selectedToMove');
                } else {
                    rightMove = nextLocation[0];
                    $("#" + nextLocation[0]).addClass('selectedToMove');
                }
            }
            if ($('#' + nextLocation[1]).hasClass('imgPlayer2')) {
                nextLocation[1] = ([this.i + 2, this.j - 2]).join('');
                if ($(nextLocation[1]).hasClass('imgPlayer2') || $(nextLocation[1]).hasClass('imgPlayer1')) {
                    $("#" + leftMove).removeClass('selectedToMove');
                } else {
                    leftMove = nextLocation[1];
                    $("#" + nextLocation[1]).addClass('selectedToMove');
                }
            }
            $("#" + rightMove).removeClass('selectedToMove');
            $("#" + leftMove).removeClass('selectedToMove');
        }

        //check for possible jump with charmander
        if (player === 'imgPlayer2') {
            if ($('#' + nextLocation[0]).hasClass('imgPlayer1')) {
                nextLocation[0] = ([this.i - 2, this.j + 2]).join('');
                if ($('#' + nextLocation[0]).hasClass('imgPlayer1') || $('#' + nextLocation[0]).hasClass('imgPlayer2')){
                    $("#" + rightMove).removeClass('selectedToMove');
                } else {
                    rightMove = nextLocation[0];
                    $("#" + nextLocation[0]).addClass('selectedToMove');
                }
            }
            if ($('#' + nextLocation[1]).hasClass('imgPlayer1')) {
                nextLocation[1] = ([this.i - 2, this.j - 2]).join('');
                if ($('#' + nextLocation[1]).hasClass('imgPlayer1') || $('#' + nextLocation[1]).hasClass('imgPlayer2')) {
                    $("#" + leftMove).removeClass('selectedToMove');
                } else {
                    leftMove = nextLocation[1];
                    $("#" + nextLocation[1]).addClass('selectedToMove');
                }
            }
            $("#" + rightMove).removeClass('selectedToMove');
            $("#" + leftMove).removeClass('selectedToMove');
        }


        if (!$('#' + nextLocation[0]).hasClass('imgPlayer1') && !$('#' + nextLocation[0]).hasClass('imgPlayer2')){
                $("#" + nextLocation[0]).addClass('selectedToMove');
        }
        if (!$('#' + nextLocation[1]).hasClass('imgPlayer1') && !$('#' + nextLocation[1]).hasClass('imgPlayer2')){
                $("#" + nextLocation[1]).addClass('selectedToMove');
        }

        $("#"+ rightMove).click(function(){
            this.updatePlayerBoardPosition(rightMove, currentLocation, leftMove, rightMove, player)
        }.bind(this));

        $("#"+ leftMove).click(function(){
            this.updatePlayerBoardPosition(leftMove, currentLocation, leftMove, rightMove, player)
        }.bind(this));
            /*this.currentMode = 'possibleMove'*/
        }

    kingMe(event, player){
        //add kingPieceOf... to players accordingly
        $(event.target).addClass('kingPieceOf' + player);
    }
}





