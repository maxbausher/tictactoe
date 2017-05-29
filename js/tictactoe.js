
var knotsAndCrosses = {


  board: [null, null, null, null, null, null, null, null, null],
  resetGame: function(){

  },
  checkWinner: function(movesArray){
    // debugger;
    var board = this.board;

      if(board[0] === board[1] && board[0] === board[2] && board[0] !== null){return true;}
      if(board[3] === board[4] && board[3] === board[5] && board[3] !== null){return true;}
      if(board[6] === board[7] && board[6] === board[8] && board[6] !== null){return true;}
      if(board[0] === board[3] && board[0] === board[6] && board[0] !== null){return true;}
      if(board[1] === board[4] && board[1] === board[7] && board[1] !== null){return true;}
      if(board[2] === board[5] && board[2] === board[8] && board[2] !== null){return true;}
      if(board[0] === board[4] && board[0] === board[8] && board[0] !== null){return true;}
      if(board[2] === board[4] && board[2] === board[6] && board[2] !== null){return true;}
  } //checkWinner function
}; // var knotsAndCrosses



$( document ).ready(function() {

    var user = 'x';
    var turns = 0;

    $( "td" ).one('click', function() {

      var index = this.id;
      knotsAndCrosses.board[ index ] = user;
      console.log(index, user);
      $('#' + index).text(user);
      if( user === 'x' ){ user = 'o'}
      else { user = 'x'};
      turns += 1;
      if(knotsAndCrosses.checkWinner(knotsAndCrosses.board)){
        console.log("we won");
        $('h2').text(user + ' wins!');
        resetGame();
        return;
      }
      if (turns === 9){
        console.log('game is a draw');
        $('h2').text('Draw');
        resetGame()
        return ;
      }
    }) //on-click function
}); //doc.ready
