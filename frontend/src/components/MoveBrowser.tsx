import './MoveBrowser.css';
import './MoveCard.tsx';
import EloSelector from './EloSelector.tsx';
import { getRatingsInRange } from './EloSelector.tsx';
import MoveCard from './MoveCard.tsx';
import { useState, useEffect, type Dispatch, type SetStateAction, useMemo } from 'react';
import { Button } from '@mui/material';
import { Chess } from 'chess.js';

interface LichessMove {
	san: string;	// Algebraic Notation
	white: number;	// White wins
	black: number;	// Black wins
	draws: number;	// Draws
}

interface LichessExplorerData {
	white: number;
	black: number;
	draws: number;
	moves: LichessMove[];
}

type MoveBrowserProps = {
	gameFen: string;
	bestMove: string | null;
	chessGame: Chess;
	setGameFen: Dispatch<SetStateAction<string>>;
};

const MoveBrowser = ( {gameFen, bestMove, chessGame, setGameFen}: MoveBrowserProps ) => { 
	const [eloValue, setEloValue] = useState<number[]>([1600, 1800]);
	const [loading, setLoading] = useState<boolean>(false);
	const [lichessData, setLichessData] = useState<LichessExplorerData | null>(null);

	const ratings = useMemo(() => getRatingsInRange(eloValue), [eloValue]);

	const getMoves = async () => {
		setLoading(true);

		try {
			const response = await fetch('http://127.0.0.1:8000/api/openings/position', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					fen: gameFen,
					ratings: ratings
				})
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Status: ${response.status} - ${errorText}`);
			}

			const result: LichessExplorerData = await response.json();
			setLichessData(result);

			// Works
			console.log(result);
		} catch (error) {
			console.error("Error fetching data: ", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if(!gameFen) {
			return;
		}

		// getMoves();
	}, [gameFen]);
	
	// Constructing new position using the best engine move
	const localGame = new Chess(chessGame.fen());

	const applyEngineMove = () => {
		if (!bestMove) {
			return null;
		}

		return localGame.move({
			from: bestMove?.slice(0,2),
			to: bestMove?.slice(2, 4),
			promotion: bestMove.length === 5 ? bestMove[4] : undefined,
		});
	};

	const getEngineWinrate = async () => {
		const fenEngine = applyEngineMove();

		if (fenEngine === null) {
			return;
		}

		setLoading(true);

		try {
			const response = await fetch('http://127.0.0.1:8000/api/openings/engine', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					fen: gameFen,
					ratings: ratings
				})
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Status: ${response.status} - ${errorText}`);
			}

			const result: LichessExplorerData = await response.json();
			setLichessData(result);

			// Works
			console.log(result);
		} catch (error) {
			console.error("Error fetching data: ", error);
		} finally {
			setLoading(false);
		}
	};

	// TODO:
	// Add input debouncing to offload the API - attempt every time position changes
	// but actually call only if no next moves are made
	// Currently it's called using a button

	return (
	<div className='move-browser-container'>
		<div className='move-browser-align'>
			<Button onClick={getEngineWinrate}>Kliknij mnie</Button>

			<EloSelector eloValue={eloValue} setEloValue={setEloValue}/>

			{ loading ? (
				<p>Loading...</p>
			) : (
				lichessData?.moves.map((move) => (
					<MoveCard 
						key={move.san}
						move={move}
					/>
				))
			)}





		</div>
	</div>
)}
export default MoveBrowser
