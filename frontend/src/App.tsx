import { useRef, useState } from 'react'
// import { Routes, Route } from 'react-router-dom'
// import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import './App.css'
import Navbar from './components/Navbar'
import ChessboardPanel from './components/ChessboardPanel'
import MoveBrowser from './components/MoveBrowser'

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

function App() {
	const chessGameRef = useRef(new Chess());
	const chessGame = chessGameRef.current;

	const [subSiteIndex, setSubSiteIndex] = useState<number>(0);
	const [lichessData, setLichessData] = useState<LichessExplorerData | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [gameFen, setGameFen] = useState<string>(chessGame.fen());

	const [bestMove, setBestMove] = useState<string | null>(null);

	const [positionEvaluation, setPositionEvaluation] = useState<number>(0);

	console.log("bestMove: ", bestMove);

	return (
		<main>
			<Navbar/>

			<div className='chessboard-panel'>
				<ChessboardPanel
					gameFen={gameFen}
					chessGame={chessGame}
					positionEvaluation={positionEvaluation}
					setPositionEvaluation={setPositionEvaluation}
					setGameFen={setGameFen}
					setBestMove={setBestMove}
				/>
			</div>

			<div className='move-browser-panel'>
				<MoveBrowser
					gameFen={gameFen}
					chessGame={chessGame}
					bestMove={bestMove}
					positionEvaluation={positionEvaluation}
					setPositionEvaluation={setPositionEvaluation}
					setGameFen={setGameFen}
				/>
			</div>
		</main>
	)
}

export default App
