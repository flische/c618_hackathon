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
        this.rowIndex = null;
        this.colIndex = null;
        this.checkMoves = this.checkMoves.bind(this);
        this.gameBoardReference = null;
        this.currentMode = 'checkMove';
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
        this.rowIndex = parseInt(location[0]);
        this.colIndex = parseInt((location[1]));
        if(player === 'player1'){
            var rightBox = ([this.rowIndex + 1, this.colIndex + 1]).join('');
            var leftBox = ([this.rowIndex + 1, this.colIndex - 1]).join('');
        }
        if(player === 'player2'){
            var rightBox = ([this.rowIndex - 1, this.colIndex + 1]).join('');
            var leftBox = ([this.rowIndex - 1, this.colIndex - 1]).join('');
        }
        return [rightBox, leftBox];
    }
    updatePlayerBoardPosition( newCellID, currentLocation, leftMove, rightMove, player ){
        var locationBeforeJump =  currentLocation.split('');
        var locationAfterJump = newCellID.split('');
        var positionOfEnemyToken = [];

        if(parseInt(locationAfterJump[0]) - parseInt(locationBeforeJump[0]) < 0){
            positionOfEnemyToken.push(parseInt(locationBeforeJump[0]) - 1);
        } else {
            positionOfEnemyToken.push(parseInt(locationBeforeJump[0]) + 1)
        }

        if(parseInt(locationAfterJump[1]) - parseInt(locationBeforeJump[1]) < 0){
            positionOfEnemyToken.push(parseInt(locationBeforeJump[1]) - 1);
        } else {
            positionOfEnemyToken.push(parseInt(locationBeforeJump[1]) + 1)
        }

        positionOfEnemyToken = positionOfEnemyToken.join('');

        // console.log('pos', positionOfEnemyToken);

        $('#' + positionOfEnemyToken).removeClass('imgPlayer1 imgPlayer2');

        console.log(locationBeforeJump);
        console.log(locationAfterJump);
        // var currentColIndex =
            /*this.currentMode='checkMove'*/
            if(!$("#" + newCellID).hasClass('imgPlayer1') && !$("#" + newCellID).hasClass('imgPlayer2')){
                // debugger;
                $("#"+ newCellID).addClass(player);
                $("#" + currentLocation).removeClass(player);
                // debugger;
                if(this.kingP1Array.includes(newCellID)){
                    $("#"+ newCellID).addClass('imgKingPlayer1');
                }
                if(this.kingP2Array.includes(newCellID)){
                    $("#"+ newCellID).addClass('imgKingPlayer2');
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

        // debugger;
        var kingOrNot = $("." + player).hasClass('imgKingPlayer1');
        if(kingOrNot){
            this.kingMe(currentLocation, nextLocation,'imgKingPlayer1');
        }

        var kingOrNot = $("." + player).hasClass('imgKingPlayer2');
        if(kingOrNot){
            this.kingMe(currentLocation, nextLocation,'imgKingPlayer2');
        }

        // check for possible jump with Squirtle
        // debugger;
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

        //check for possible jump with charmander
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
            /*this.currentMode = 'possibleMove'*/
        }

    kingMe(currentLocation, nextLocation, player) {
        var rightMove = nextLocation[0];
        var leftMove = nextLocation[1];
        // debugger;
        console.log(nextLocation);
        if (player === 'imgKingPlayer1') {
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
        if (!$('#' + nextLocation[0]).hasClass('imgPlayer1') && !$('#' + nextLocation[0]).hasClass('imgPlayer2')) {
            $("#" + nextLocation[0]).addClass('selectedToMove');
        }
        if (!$('#' + nextLocation[1]).hasClass('imgPlayer1') && !$('#' + nextLocation[1]).hasClass('imgPlayer2')) {
            $("#" + nextLocation[1]).addClass('selectedToMove');
        }
    }
}





