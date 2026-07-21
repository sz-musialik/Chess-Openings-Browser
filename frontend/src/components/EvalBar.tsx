import { type Dispatch, type SetStateAction } from 'react';
import { useState, useEffect, useMemo } from "react";
import './EvalBar.css';
import Engine from './Engine';

interface LichessPVS {
	moves: string;
	cp: number;			// centipawns
}

interface LichessEval {
	fen: string;
	knodes: number;
	depth: number;
	pvs: LichessPVS[];
}

type ChessboardProps = {
	gameFen: string;
	positionEvaluation: number;
	setPositionEvaluation: Dispatch<SetStateAction<number>>;
	setBestMove: Dispatch<SetStateAction<string | null>>;
};

const EvalBar = ({gameFen, positionEvaluation, setPositionEvaluation, setBestMove}: ChessboardProps) => { 
	const engine = useMemo(() => new Engine(), []);
	
	const [depth, setDepth] = useState<number>(10);
	const [bestLine, setBestLine] = useState<string>('');
	const [possibleMate, setPossibleMate] = useState<string>('');

	const whiteMove = gameFen.split(' ')[1] === 'w';

	const findBestMove = () => {
		engine.evaluatePosition(gameFen, 25);
		engine.onMessage(({
			positionEvaluation,
			possibleMate,
			pv,
			depth
		}) => {
			if (depth && depth < 10) {
				return;
			}

			if (positionEvaluation) {
				setPositionEvaluation((gameFen.split(' ')[1] === 'w' ? 1 : -1) * Number(positionEvaluation) / 100);
			}

			if (possibleMate) {
				setPossibleMate(possibleMate);
			}

			if (depth) {
				setDepth(depth);
			}

			if (pv) {
				setBestLine(pv);
			}
		});
	};

	useEffect(() => {
		if(!gameFen) {
			return;
		}

		findBestMove();
	}, [gameFen]);

	const scoreToPercent = (): number => {
		if (possibleMate) {
			// Game ended
			if (movesToMateNormalized() === 0 && positionEvaluation > 0.0) {
				return 100;
			}

			if (movesToMateNormalized() === 0 && positionEvaluation < 0.0) {
				return 0;
			}

			// console.log("white? : ", whiteMove, " movesToMateNormalized: ", movesToMateNormalized());

			// White mate
			if (whiteMove && movesToMateNormalized() > 0) {
				return 100;
			} else if (!whiteMove && movesToMateNormalized() > 0) {
				return 0;
			}

			// Black mate
			return 0;
		}

		const normalized = Math.tanh(positionEvaluation / 4);

		return ((normalized + 1) / 2) * 100;
	};

	// console.log("Depth: ", depth);
	// console.log("Evaluation: ", positionEvaluation);
	// console.log("Mate? ", possibleMate);

	// 0 - end of game
	// > 0 - white mating
	// < 0 - black mating
	const movesToMateNormalized = (): number => {
		var mateIn: number;

		try {
			mateIn = Number(possibleMate);
		} catch (error) {
			console.error("Error fetching data: ", error);
			return 9999;
		}

		// white move &	possibleMate < 0	=> black mating
		// black move &	possibleMate < 0	=> white mating
		// black move & possibleMate > 0 	=> black mating
		// white move &	possibleMate > 0	=> white mating

		if (mateIn < 0) {
			if (whiteMove) {
				return (-1 * mateIn);
			}

			return mateIn;
		}

		return mateIn;
	}


	const renderStatusTop = () => {
		// Mate, black to move
		if (possibleMate && positionEvaluation < 0.0) {
			if (movesToMateNormalized() < 0) {
				return (
					<span>M{movesToMateNormalized()}</span>
				);
			}

			if (movesToMateNormalized() === 0) {
				return (
					<span>#</span>
				);
			}
		}

		// No mate, eval < 0.0
		if (!possibleMate && positionEvaluation < 0.0) {
			return (
				<span>{positionEvaluation}</span>
			);
		}

		return <span></span>
	}


	const renderStatusBottom = () => {
		// Mate, white to move
		if (possibleMate && positionEvaluation > 0.0) {
			if(movesToMateNormalized() > 0) {
				return (
					<span>M{possibleMate}</span>
				);
			}

			if (movesToMateNormalized() === 0) {
				return (
					<span>#</span>
				);
			}
		}

		// No mate, eval >= 0.0
		if (!possibleMate && positionEvaluation >= 0.0) {
			return (
				<span>{positionEvaluation}</span>
			);
		}

		return <span></span>
	}

	// Assign the best move
	const bestMove = bestLine.split(' ')?.[0];

	useEffect(() => {
		setBestMove(bestMove);
	}, [bestMove]);

	return (
	<div className='eval-bar-box'>
		<div
			className="eval-bar-range" 
			style={{ height: `${scoreToPercent()}%`}}
		></div>

		<div className="eval-top-text">{renderStatusTop()}</div>
		<div className="eval-bottom-text">{renderStatusBottom()}</div>
	</div>
)}
export default EvalBar
