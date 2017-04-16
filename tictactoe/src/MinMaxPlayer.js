function MinMaxPlayer(id, enemy_id)
{
        this.id = id;
        this.enemy_id = enemy_id;
}

MinMaxPlayer.prototype.getMove = function(board){
        console.log("get move");
        var best_move = this.get_max_move(board.clone());
        return best_move;
};

MinMaxPlayer.prototype.get_max_move = function(board)
{
        var max_move = {minmax:0};
        for(let move of board.getAllMoves(this.id)){
                var nboard = board.clone();
                nboard.applyMove(move);
                var terminal = this.terminalValue(nboard);
                if(terminal != false){
                        move.minmax = terminal;
                        return move;
                }
                var nmove = this.get_min_move(nboard);
                if(nmove.minmax > max_move.minmax){
                        max_move = move.clone();
                        max_move.minmax = nmove.minmax;
                }
        }
        return max_move;
}

MinMaxPlayer.prototype.get_min_move = function(board)
{
        var min_move = {minmax:4};
        for(let move of board.getAllMoves(this.enemy_id)){
                var nboard = board.clone();
                nboard.applyMove(move);
                var terminal = this.terminalValue(nboard);
                if(terminal != false){
                        move.minmax = terminal;
                        return move;
                }
                var nmove = this.get_max_move(nboard);
                if(nmove.minmax < min_move.minmax){
                        min_move = move.clone();
                        min_move.minmax = nmove.minmax;
                }
        }
        return min_move;
}

MinMaxPlayer.prototype.terminalValue = function(board)
{
        var winner = board.getWinner();
        if(winner != false){
                if(winner == this.id){
                        return 3;
                }
                else{
                        return 1;
                }
        }
        if(winner == false && board.getAllMoves(this.id).length == 0){
                return 2;
        }
        return false;
}
