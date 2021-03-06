var game = null;

$(document).ready(initializeApp);

var board2DArray = [
    [0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [2,0,2,0,2,0,2,0],
    [0,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,0]
];

function initializeApp(){
    game = new CheckerGame();
    game.startUp();
}


class CheckerGame{
    constructor(){
        this.currentPlayer = 0;

        this.player1turn = true;
        this.player2turn = false;
        this.rowIndex = null;
        this.colIndex = null;
        this.checkMoves = this.checkMoves.bind(this);
        this.gameBoardReference = null;
        this.currentMode = 'checkMove';
        this.kingP1Array = ['70', '72', '74', '76'];
        this.kingP2Array = ['01', '03','05', '07'];

        this.player2pieces;
        this.player2kings;
        this.player1pieces;
        this.player1kings;
    }
    applyClickHandlers(){
        $('.row > *').click(this.checkMoves);
    }
    removeClickHandlers(){
        $('.row > *').off();
    }
    startUp(){
        this.buildGameBoard();
        this.populatePlayer1Chips();
        this.populatePlayer2Chips();
        this.applyClickHandlers();
        this.disablePlayer2ClickOnGameLoad();
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

    populatePlayer1Chips(){
        this.gameBoardReference = $('#game-board div');
        for(var i = 2; i < this.gameBoardReference.length / 2 - 8; i+=2){
            $(this.gameBoardReference[i]).addClass('imgPlayer1');
        }
    }

    populatePlayer2Chips(){
        this.gameBoardReference = $('#game-board div');
        for(var i = this.gameBoardReference.length; i > this.gameBoardReference.length / 2 + 8; i-=2){
            $(this.gameBoardReference[i]).addClass('imgPlayer2');
        }
    }
    disablePlayer2ClickOnGameLoad(){
        this.player2pieces = $('.imgPlayer2');
        this.player2kings = $('.imgKingPlayer2');
        $(this.player2pieces).css("pointer-events", 'none');
        $(this.player2kings).css("pointer-events", 'none');
    }
    switchPlayer() {
        this.currentPlayer = 1 - this.currentPlayer;
        if (this.currentPlayer === 0) {
            $('.playerTurnDisplay').text('Squirtles Turn');
            $('.playerTurnDisplay').css('border', '3px solid blue');
            $('.playerTurnDisplay').css('color', 'blue');
            this.player2pieces = $('.imgPlayer2');
            this.player2kings = $('.imgKingPlayer2');
            $(this.player2pieces).css("pointer-events", 'none');
            $(this.player2kings).css("pointer-events", 'none');

            $(this.player1pieces).css("pointer-events", 'auto');
            $(this.player1kings).css("pointer-events", 'auto');

        }
        if (this.currentPlayer === 1) {
            $('.playerTurnDisplay').text('Charmanders Turn');
            $('.playerTurnDisplay').css('border', '3px solid red');
            $('.playerTurnDisplay').css('color', 'red');
            this.player1pieces = $('.imgPlayer1');
            this.player1kings = $('.imgKingPlayer1');
            $(this.player1pieces).css("pointer-events", 'none');
            $(this.player1kings).css("pointer-events", 'none');

            $(this.player2pieces).css("pointer-events", 'auto');
            $(this.player2kings).css("pointer-events", 'auto');
        }
       
    }
    checkMoves(event){
        var classes = $(event.target).attr('class');
        var player1 = classes.includes('imgPlayer1');
        var player2 = classes.includes('imgPlayer2');
        var currentLocation = $(event.target).attr('id');
        var pieceLocation = currentLocation.split('');
        var nextLocation = '';

        if(player1){
            if($(event.target).hasClass('selected')){
                $('#game-board div').removeClass('selected');
                $('#game-board div').removeClass('selectedToMove');
                $(event.target).addClass('selected');
            } 
            else {
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
        this.rowIndex = parseInt(location[0]);
        this.colIndex = parseInt((location[1]));
        if(player === 'player1'){

            var rightBox = ([Math.abs(this.rowIndex + 1), Math.abs(this.colIndex + 1)]).join('');
            var leftBox = ([Math.abs(this.rowIndex + 1), Math.abs(this.colIndex - 1)]).join('');
        }
        if(player === 'player2'){
            var rightBox = ([Math.abs(this.rowIndex - 1), Math.abs(this.colIndex + 1)]).join('');
            var leftBox = ([Math.abs(this.rowIndex - 1), Math.abs(this.colIndex - 1)]).join('');
        }
        return [rightBox, leftBox];
    }
    updatePlayerBoardPosition( newCellID, currentLocation, leftMove, rightMove, player, downRightKing, downLeftKing){

        var locationBeforeJump =  currentLocation.split('');
        debugger;
        var locationAfterJump = newCellID.split('');
        var positionOfEnemyToken = [];
        var classes = $(event.target).attr('class');
        var player1 = classes.includes('imgPlayer1');
        var player2 = classes.includes('imgPlayer2');

        if (parseInt(locationAfterJump[0]) - parseInt(locationBeforeJump[0]) < 0) {
            positionOfEnemyToken.push(parseInt(locationBeforeJump[0]) - 1);
        } else {
            positionOfEnemyToken.push(parseInt(locationBeforeJump[0]) + 1)
        }

        if (parseInt(locationAfterJump[1]) - parseInt(locationBeforeJump[1]) < 0) {
            positionOfEnemyToken.push(parseInt(locationBeforeJump[1]) - 1);
        } else {
            positionOfEnemyToken.push(parseInt(locationBeforeJump[1]) + 1)
        }

        positionOfEnemyToken = positionOfEnemyToken.join('');

        $('#' + positionOfEnemyToken).removeClass('imgPlayer1 imgPlayer2');
        console.log(locationBeforeJump);
        console.log(locationAfterJump);
     
            if(!$("#" + newCellID).hasClass('imgPlayer1') && !$("#" + newCellID).hasClass('imgPlayer2')){

                if(player === 'imgKingPlayer1'){

                    $("#" + newCellID).addClass(player);
                    $("#" + newCellID).addClass('imgPlayer1');
                    $("#" + currentLocation).removeClass(player);
                    $("#" + currentLocation).removeClass('imgPlayer1');
                }else {

                    $("#" + newCellID).addClass(player);
                    $("#" + currentLocation).removeClass(player);
                }
                if(player === 'imgKingPlayer2'){

                    $("#" + newCellID).addClass(player);
                    $("#" + newCellID).addClass('imgPlayer2');
                    $("#" + currentLocation).removeClass(player);
                    $("#" + currentLocation).removeClass('imgPlayer2');
                }else {
                    $("#" + newCellID).addClass(player);
                    $("#" + currentLocation).removeClass(player);
                }
                // debugger;
                if(this.kingP1Array.includes(newCellID)){
                    $("#" + newCellID).addClass('imgKingPlayer1');
                }
                if(this.kingP2Array.includes(newCellID)){
                    $("#" + newCellID).addClass('imgKingPlayer2');
                }
            }

            $("#" + currentLocation).removeClass('selected');
            $("#"+ leftMove).removeClass('selectedToMove');
            $("#"+ rightMove).removeClass('selectedToMove');

            this.switchPlayer();

            $("#"+ downRightKing).removeClass('selectedToMove');
            $("#"+ downLeftKing).removeClass('selectedToMove');

            this.removeClickHandlers();
            this.applyClickHandlers();
    }

    highlightBoard(currentLocation, nextLocation, player) {

        var rightMove = nextLocation[0];
        var leftMove = nextLocation[1];

        var kingOrNot = $("." + player).hasClass('imgKingPlayer1');
        if(kingOrNot){
            this.kingMe(currentLocation, nextLocation,'imgKingPlayer1');
        }

        var kingOrNot = $("." + player).hasClass('imgKingPlayer2');
        if(kingOrNot){
            this.kingMe(currentLocation, nextLocation,'imgKingPlayer2');
        }

        if (player === 'imgPlayer1') {
            if ($('#' + nextLocation[0]).hasClass('imgPlayer2')) {

                nextLocation[0] = ([this.rowIndex + 2, this.colIndex + 2]).join('');
                if ($('#' + nextLocation[0]).hasClass('imgPlayer2') || $('#' + nextLocation[0]).hasClass('imgPlayer1')) {
                    $("#" + rightMove).removeClass('selectedToMove');
                } else {
                    rightMove = nextLocation[0];
                    $("#" + nextLocation[0]).addClass('selectedToMove');
                }
            }
            if ($('#' + nextLocation[1]).hasClass('imgPlayer2')) {
                nextLocation[1] = ([this.rowIndex + 2, this.colIndex - 2]).join('');
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

        if (player === 'imgPlayer2') {
            if ($('#' + nextLocation[0]).hasClass('imgPlayer1')) {
                nextLocation[0] = ([this.rowIndex - 2, this.colIndex + 2]).join('');
                if ($('#' + nextLocation[0]).hasClass('imgPlayer1') || $('#' + nextLocation[0]).hasClass('imgPlayer2')){
                    $("#" + rightMove).removeClass('selectedToMove');
                } else {
                    rightMove = nextLocation[0];
                    $("#" + nextLocation[0]).addClass('selectedToMove');
                }
            }
            if ($('#' + nextLocation[1]).hasClass('imgPlayer1')) {
                nextLocation[1] = ([this.rowIndex - 2, this.colIndex - 2]).join('');
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
        }

    kingMe(currentLocation, nextLocation, player) {

        var upRightKing = ([Math.abs(this.rowIndex - 1), Math.abs(this.colIndex + 1)]).join('');
        var upLeftKing = ([Math.abs(this.rowIndex - 1), Math.abs(this.colIndex - 1)]).join('');
        var downRightKing = ([Math.abs(this.rowIndex + 1), Math.abs(this.colIndex + 1)]).join('');
        var downLeftKing = ([Math.abs(this.rowIndex + 1), Math.abs(this.colIndex - 1)]).join('');

        console.log(nextLocation);

        $("#"+ upRightKing).click(function(){
            this.updatePlayerBoardPosition(upRightKing, currentLocation, upRightKing, upLeftKing, player, downRightKing, downLeftKing)
        }.bind(this));

        $("#"+ upLeftKing).click(function(){
            this.updatePlayerBoardPosition(upLeftKing, currentLocation, upRightKing, upLeftKing, player, downRightKing, downLeftKing)
        }.bind(this));

        $("#"+ downRightKing).click(function(){
            this.updatePlayerBoardPosition(downRightKing, currentLocation, upRightKing, upLeftKing, player, downRightKing, downLeftKing)
        }.bind(this));

        $("#"+ downLeftKing).click(function(){
            this.updatePlayerBoardPosition(downLeftKing, currentLocation, upRightKing, upLeftKing, player, downRightKing, downLeftKing)
        }.bind(this));
     }
}
