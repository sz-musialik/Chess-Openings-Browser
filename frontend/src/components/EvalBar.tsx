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
};

const EvalBar = ({gameFen}: ChessboardProps) => { 
	const [loading, setLoading] = useState<boolean>(false);

	const engine = useMemo(() => new Engine(), []);
	
	const [positionEvaluation, setPositionEvaluation] = useState<number>(0);
	const [depth, setDepth] = useState<number>(10);
	const [bestLine, setBestLine] = useState<string>('');
	const [possibleMate, setPossibleMate] = useState<string>('');

	const findBestMove = () => {
		engine.evaluatePosition(gameFen, 75);
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

	const formatScore = (score: number) => {
		if (score > 0) return `+${score.toFixed(2)}`;
		if (score < 0) return `${score.toFixed(2)}`;
		return "0.00";
	}

	useEffect(() => {
		if(!gameFen) {
			return;
		}

		findBestMove();
	}, [gameFen]);

	return (
	<div className='eval-bar-box'>
		<div className='eval-bar-black'>
			{ loading ? (
				<span>0.0</span>
			) : positionEvaluation >= 0 ? (
				<span></span>
			) : (
				<span>{formatScore(positionEvaluation)}</span>
				)
			}
		</div>

		<div className='eval-bar-range'>
		</div>

		<div className='eval-bar-white test'>
			{ loading ? (
				<span>0.0</span>
			) : positionEvaluation>= 0 ? (
				<span>{formatScore(positionEvaluation)}</span>
			) : (
				<span></span>
				)
			}
		</div>
	</div>
)}
export default EvalBar
