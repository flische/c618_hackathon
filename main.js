var game = null;

$(document).ready(initializeApp);

function initializeApp(){
    game = new CheckerGame();
    game.startUp();
    game.applyClickHandlers();
    game.disablePlayer2ClickOnGameLoad();
}

class CheckerGame{
    //all global variables inside constructor
    constructor(){
        this.currentPlayer = 0;
        console.log('current player', this.currentPlayer);

        this.player1turn = true;
        this.player2turn = false;
        this.rowIndex = null;
        this.colIndex = null;
        this.checkMoves = this.checkMoves.bind(this);
        this.gameBoardReference = null;
        this.currentMode = 'checkMove';
        // these are the locations of where a piece could land to be converted to a king piece
        this.kingP1Array = ['70', '72', '74', '76'];
        this.kingP2Array = ['01', '03','05', '07'];

        this.player2pieces;
        this.player2kings;
        this.player1pieces;
        this.player1kings;
    }
    applyClickHandlers(){
        // for any child inside of elements with class of 'row', run the checkMoves function
        $('.row > *').click(this.checkMoves);
    }
    removeClickHandlers(){
        // turn off all handlers for any child of elements with class of 'row'
        $('.row > *').off();
    }
    // in this function, we call all the functions inside the checkerGame object that we want to run        on game startup
    startUp(){
        this.buildGameBoard();
        // this.displayInitialModal();
        this.populatePlayer1Chips();
        this.populatePlayer2Chips();
    }
    // this function builds the gameboard and appends it dynamically
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
    // displayInitialModal() {
    //     $('#myModal').modal('show');
    // }
    // displayWinModal() {
    //     $('#myWinModalModal').modal('show');
    // }

    populatePlayer1Chips(){
        this.gameBoardReference = $('#game-board div');
        // use a for loop to populate the first 3 rows with player1 chips
        for(var i = 2; i < this.gameBoardReference.length / 2 - 8; i+=2){
            $(this.gameBoardReference[i]).addClass('imgPlayer1');
        }
    }

    populatePlayer2Chips(){
        this.gameBoardReference = $('#game-board div');
        // use a for loop to populate the last 3 rows with player2 chips
        for(var i = this.gameBoardReference.length; i > this.gameBoardReference.length / 2 + 8; i-=2){
            $(this.gameBoardReference[i]).addClass('imgPlayer2');
        }
    }
    // function to run on game load to turn off all click/pointer events for player 2 pieces
    disablePlayer2ClickOnGameLoad(){
        // create a local variable to grab the player 2 pieces
        this.player2pieces = $('.imgPlayer2');
        // create a local variable to grab the player 2 king pieces
        this.player2kings = $('.imgKingPlayer2');
        // turn off pointer events on all player 2 pieces
        $(this.player2pieces).css("pointer-events", 'none');
        $(this.player2kings).css("pointer-events", 'none');
    }
    // function to run to switch player turns between 1 and 2. it is first once player1 has finished making their first move //
    switchPlayer() {
    // in constructor, this.currentPlayer is set to 0. player 1 is set to 0 on default.
     // once switchPlayer runs, it switches currentPLayer from player1 to player2 (which is set to          value of '1') //
        this.currentPlayer = 1 - this.currentPlayer;
        if (this.currentPlayer === 0) {

            this.player2pieces = $('.imgPlayer2');
            this.player2kings = $('.imgKingPlayer2');
            $(this.player2pieces).css("pointer-events", 'none');
            $(this.player2kings).css("pointer-events", 'none');

            $(this.player1pieces).css("pointer-events", 'auto');
            $(this.player1kings).css("pointer-events", 'auto');

        }
        if (this.currentPlayer === 1) {
            this.player1pieces = $('.imgPlayer1');
            this.player1kings = $('.imgKingPlayer1');
            $(this.player1pieces).css("pointer-events", 'none');
            $(this.player1kings).css("pointer-events", 'none');

            $(this.player2pieces).css("pointer-events", 'auto');
            $(this.player2kings).css("pointer-events", 'auto');
        }
        // if (this.player1turn) {
            // this.player1turn = false;
            // this.player2turn = true;
        // }
        // if (this.player2turn) {
        //     this.player2turn = false;
        //     this.player1turn = true;
        // }
    }
    // this function creates classes
    checkMoves(event){
        //
        var classes = $(event.target).attr('class');
        // we are targeting any elements that have a class of 'imgPlayer1' and assigning a variable             called 'player1' // this variable is a boolean that will return true or false later on //
        var player1 = classes.includes('imgPlayer1');
        // we are targeting any elements that have a class of 'imgPlayer2' and assigning a variable             called 'player2' // this variable is a boolean that will return true or false later on //
        var player2 = classes.includes('imgPlayer2');
        // now we grab the ID of the clicked element and store it into var currentLocation
        var currentLocation = $(event.target).attr('id');
        // we take that ID, split into two integers and store into var pieceLocation
        var pieceLocation = currentLocation.split('');
        // we declare var nextLocation to be used later
        var nextLocation = '';

        // changed player1 and player2 to select and deselect


        // if player1 returns true...
        if(player1){
            // if clicked event target has class of 'selected' ....
            if($(event.target).hasClass('selected')){
                //it removes the classes of 'selected' and 'selectedToMove' to from ALL squares...
                $('#game-board div').removeClass('selected');
                $('#game-board div').removeClass('selectedToMove');
                // then it adds a class of 'selected' to the current event target
                $(event.target).addClass('selected');
            } //the below else statement was deemed useless after implementing the player turn function
            else {
                $('#game-board div').removeClass('selected');
                $('#game-board div').removeClass('selectedToMove');
                $(event.target).addClass('selected');
            }
            // we then call the function 'possibleSquare' and pass in the pieceLocation for player1 and store it                in var nextLocation
            nextLocation = this.possibleSquare(pieceLocation, 'player1');
            // we call the highlightBoard function and pass in both the currentLocation and nextLocation for player1 and highlights both locations
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
    // function passes in two params: location of clicked square and the current player //
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
        // newCellID is the passed in location of where the piece is moving to
        // currentLocation is the location of where the piece currently is
        // leftMove is the possible location if piece were to move to its left
        // rightMove is the possible location if the piece were to move its right

        var locationBeforeJump =  currentLocation.split('');
        debugger;
        var locationAfterJump = newCellID.split('');
        var positionOfEnemyToken = [];
        var classes = $(event.target).attr('class');
        var player1 = classes.includes('imgPlayer1');
        var player2 = classes.includes('imgPlayer2');

        // subtract location after jump at first index from the original location at first index...
            // if sum is less than zero...
        if (parseInt(locationAfterJump[0]) - parseInt(locationBeforeJump[0]) < 0) {
            // assign first index for position of enemy player that was jumped to
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

        // console.log('pos', positionOfEnemyToken);

        $('#' + positionOfEnemyToken).removeClass('imgPlayer1 imgPlayer2');
        console.log(locationBeforeJump);
        console.log(locationAfterJump);
        // var currentColIndex =
            /*this.currentMode='checkMove'*/
            if(!$("#" + newCellID).hasClass('imgPlayer1') && !$("#" + newCellID).hasClass('imgPlayer2')){

                if(player === 'imgKingPlayer1'){

                    $("#" + newCellID).addClass(player);
                    $("#" + newCellID).addClass('imgPlayer1');
                    $("#" + currentLocation).removeClass(player);
                    $("#" + currentLocation).removeClass('imgPlayer1');
                }else {

                    $("#" + newCellID).addClass(player);
                    // $("#" + newCellID).addClass('imgPlayer2');
                    $("#" + currentLocation).removeClass(player);
                    // $("#" + currentLocation).removeClass('imgPlayer2');
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
            // need to call playerTurn function / flip player turn flag here //
            // if newCellID is player 1 //
            // if ($("#" + newCellID).hasClass('imgPlayer1') || $("#" + newCellID).hasClass('imgKingPlayer1')){
            //     this.switchPlayer();
            // }
            // else { // newCellID must be player 2 //
            //     // player 2 turn is over and switch to player 1 //
            // }

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





