import { useState, useEffect } from "react";
import './EvalBar.css'

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
	const [evalScore, setEvalScore] = useState<number>(0.0);

	const evaluatePosition = async (currentFen: string) => {
		setLoading(true);

		try {
			const response = await fetch('http://127.0.0.1:8000/api/position/evaluation', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ fen: currentFen })
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Status: ${response.status} - ${errorText}`);
			}

			const result: LichessEval = await response.json();

			if (result.pvs && result.pvs.length > 0) {
				const firstMove = result.pvs[0];
				console.log(firstMove);

				if (firstMove.cp !== undefined) {
					setEvalScore(firstMove.cp / 100);
					console.log(firstMove.cp / 100);
				}
			} else {
				console.log("FEN: " + currentFen);
				console.log("result.pvs: " + result.pvs);
				console.log("result.pvs.length: " + result.pvs.length);
			}

		} catch (error) {
			console.error("Error fetching data: ", error);
		} finally {
			setLoading(false);
		}
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

		evaluatePosition(gameFen);
	}, [gameFen]);

	return (
	<div className='eval-bar-box'>
		<div className='eval-bar-black'>
			{ loading ? (
				<span>0.0</span>
			) : evalScore >= 0 ? (
				<span></span>
			) : (
				<span>{formatScore(evalScore)}</span>
				)
			}
		</div>

		<div className='eval-bar-range'>
		</div>

		<div className='eval-bar-white test'>
			{ loading ? (
				<span>0.0</span>
			) : evalScore>= 0 ? (
				<span>{formatScore(evalScore)}</span>
			) : (
				<span></span>
				)
			}
		</div>
	</div>
)}
export default EvalBar
