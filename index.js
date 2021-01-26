import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
Render only React component can be simplified into a single function.
*/
function Square(props)
{
	return (
		<button className="square" onClick={ props.onClick}>
			{ props.value }
		</button>
	);
}

/*
* BOARD
*/
class Board extends React.Component
{
	renderSquare(i)
	{
		return (
			<Square
				value={ this.props.squares[i] }
				onClick={ () => this.props.onClick(i) } 
			/>
		);
	}

  	/*
  	* Built-in React.
  	*/
	render()
	{
		// Board Display.
		return (
	    	<div>
	        	<div className="status">{ this.props.status }</div>
	        	<div className="board-row">
	          		{ this.renderSquare(0) }
	          		{ this.renderSquare(1) }
	          		{ this.renderSquare(2) }
	        	</div>
		        <div className="board-row">
		        	{ this.renderSquare(3) }
		        	{ this.renderSquare(4) }
		        	{ this.renderSquare(5) }
		        </div>
		      	<div className="board-row">
	          		{ this.renderSquare(6) }
	          		{ this.renderSquare(7) }
	          		{ this.renderSquare(8) }
	        	</div>
	      </div>
	    );
	}

}

class Game extends React.Component
{
 	constructor(props)
 	{
 		super(props);
 		this.state =
 		{
 			history: [ { squares: Array(9).fill(null)} ],
 			xIsNext: true,
 			turn: 0,
 		}; 
 	}

 	handleClickOnSquare(i)
 	{
 		const history = this.state.history.slice(0, this.state.turn + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();

		// Cancel methods if there is a winner already.
		if (checkForWinner(squares))
		{
			return;
		}

		// Cancel methods if the square was already played.
		if (squares[i])
		{
			return;
		}

		// Update square state, i.e. player action.
		squares[i] = (this.state.xIsNext ? 'X' : 'O');

		// Saving new state in the history.
		this.setState({
		// Concat <=> push without modif on the original array.
			history: history.concat([ 
				{ squares: squares, }
			]),
			xIsNext: !this.state.xIsNext,
			turn: history.length,
		});
 	}

 	/*
 	* Jump from current State to a previous one.
 	*/
 	jumpTo(step)
 	{
 		this.setState( {
 			turn: step,
 			xIsNext: ((step % 2) === 0),
 		});
 	}

 	getWinStatus(state)
 	{
		const winner = checkForWinner(state.squares);
		
		let status = null;

		if (winner)
		{
			status = (winner
				+ ' have won.');
		}
		else
		{
			status = ('Next player: '
				+ (state.xIsNext ? 'X' : 'O'));
		}
 	
		return status;
 	}

    /*
	* Built-in React.
	*/
	render()
	{
	    const history = this.state.history;
	    const current = history[this.state.turn];

	    const moves = history.map( (step, move) => 
	    {
	    	const desc = move ?
	    	'Revenir au tour n°' + move :
	    	'Revenir au début de la partie';

	    	return (
	    		<li key={ move }>
	    			<button onClick={ () => this.jumpTo(move) }>
	    				{ desc }
	    			</button>
	    		</li>
	    	);
	    });

	    let status = this.getWinStatus(current);

	    return (
	    	<div className="game">
	        	<div className="game-board">
	        		<Board squares={ current.squares }
	        		onClick={ (i) => this.handleClickOnSquare(i) }/>
	        	</div>
	        	<div className="game-info">
	        		<div>{ status }</div>
	        		<ol>{ moves }</ol>
	        	</div>
	      	</div>
	    );
	}
}

// Tool
function checkForWinner(squares)
{
	const lines = [
    	[0, 1, 2],
    	[3, 4, 5],
	    [6, 7, 8],
	    [0, 3, 6],
	    [1, 4, 7],
	    [2, 5, 8],
	    [0, 4, 8],
	    [2, 4, 6],
  	];

	for (let i = 0; i < lines.length; i++)
	{
    	const [a, b, c] = lines[i];
	  	if (squares[a]
	  		&& squares[a] === squares[b]
	  		&& squares[a] === squares[c]) 
	  	{
	     	return squares[a];
	    }
	}
	return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
