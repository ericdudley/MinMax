function Game(board, players)
{
        this.board = board;
        this.origBoard = board.clone();
        this.players = players;
}

Game.prototype.play = function()
{
        this.board.reset();
        var have_winner = false;
        while(have_winner == false){
                for(let i = 0; i<this.players.length; i++){
                        //console.log(this.board);
                        let player = this.players[i];
                        do{
                                var move = player.getMove(this.board.clone());
                        //        console.log(move);
                        }
                        while(this.board.isValidMove(move) == false);
                        this.board.applyMove(move);
                        var winner = this.board.getWinner();
                        if(winner){
                                have_winner = true;
                                console.log(winner);
                                break;
                        }

                        if(this.board.getAllMoves(this.players[i]).length == 0){
                                have_winner = true;
                                break;
                        }
                }
        }
}
