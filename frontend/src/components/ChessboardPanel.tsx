import { type Dispatch, type SetStateAction } from 'react';
import { useState } from 'react';
import { Chessboard, type PieceDropHandlerArgs, type SquareHandlerArgs } from 'react-chessboard';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js'
import './ChessboardPanel.css'
import EvalBar from './EvalBar.tsx';

type ChessboardProps = {
	gameFen: string;
	chessGame: Chess;
	setGameFen: Dispatch<SetStateAction<string>>;
	setBestMove: Dispatch<SetStateAction<string | null>>;
};

const ChessboardPanel = ( {gameFen, chessGame, setGameFen, setBestMove}: ChessboardProps ) => { 
	const [moveFrom, setMoveFrom] = useState<string>('');
	const [optionSquares, setOptionSquares] = useState<Record<string, React.CSSProperties>>({});

	function getMoveOptions(square: Square) {
		const moves = chessGame.moves({
			square,
			verbose: true
		});

		if (moves.length === 0) {
			setOptionSquares({});
			return false;
		}

		const newSquares: Record<string, React.CSSProperties> = {};

		for (const move of moves) {
        newSquares[move.to] = {
          background:
            chessGame.get(move.to) &&
            chessGame.get(move.to)?.color !== chessGame.get(square)?.color
              ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)' // larger circle for capturing
              : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)', // smaller circle for moving
          borderRadius: '50%',
        };
      }

			newSquares[square] = {
        background: 'rgba(255, 255, 0, 0.4)',
      };

			// set the option squares
      setOptionSquares(newSquares);

      // return true to indicate that there are move options
      return true;
	}
	
	function onSquareClick({ square, piece }: SquareHandlerArgs) {
		if(!moveFrom && piece) {
			const hasMoveOptions = getMoveOptions(square as Square);

			if (hasMoveOptions) {
				setMoveFrom(square);
			}

			return;
		}

		const moves = chessGame.moves({
			square: moveFrom as Square,
			verbose: true,
		});

		const foundMove = moves.find(
			(m) => m.from === moveFrom && m.to === square,
		);

		if (!foundMove) {
			const hasMoveOptions = getMoveOptions(square as Square);

			setMoveFrom(hasMoveOptions ? square : '');

			return;
		}

		try {
			chessGame.move({
				from: moveFrom,
				to: square,
				promotion: 'q',
			});
		} catch {
			const hasMoveOptions = getMoveOptions(square as Square);

			if (hasMoveOptions) {
				setMoveFrom(square);
			}

			return;
		}

		setGameFen(chessGame.fen());

		setMoveFrom('');
		setOptionSquares({});
	}

	function onPieceDrop({ sourceSquare, targetSquare}: PieceDropHandlerArgs) {
		if (!targetSquare) {
			return false;
		}

		try {
			chessGame.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: 'q',
			});

			setGameFen(chessGame.fen());

			setMoveFrom('');
			setOptionSquares({});

			return true;
		} catch {
			return false;
		}
	}

	const chessboardOptions = {
		onPieceDrop,
		onSquareClick,
		position: gameFen,
		squareStyles: optionSquares,
		id: 'position'
	};

	return (
	<div className='chessboard-container'>
		<div className='chessboard-align'>
			<div className='eval-bar-container'>
				<EvalBar gameFen={gameFen} setBestMove={setBestMove}/>
			</div>

			<div className='chessboard'>
				<Chessboard options={chessboardOptions} />
			</div>
		</div>
	</div>
)}
export default ChessboardPanel
