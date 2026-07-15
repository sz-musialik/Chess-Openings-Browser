import './MoveBrowser.css';
import './MoveCard.tsx';
import EloSelector from './EloSelector.tsx';
import { getRatingsInRange } from './EloSelector.tsx';
import MoveCard from './MoveCard.tsx';
import { useState, useEffect, type Dispatch, type SetStateAction, useMemo } from 'react';
import { Button } from '@mui/material';

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
	setGameFen: Dispatch<SetStateAction<string>>;
};

const MoveBrowser = ( {gameFen, setGameFen}: MoveBrowserProps ) => { 
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


	// useEffect(() => {
	// 	if (!eloValue) {
	// 		return;
	// 	}
	//
	// 	setRatings(getRatingsInRange(eloValue));
	// }, [eloValue]);

	return (
	<div className='move-browser-container'>
		<div className='move-browser-align'>
			<Button onClick={getMoves}>Kliknij mnie</Button>

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
