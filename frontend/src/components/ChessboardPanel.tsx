import { type Dispatch, type SetStateAction } from 'react';
import { Chessboard } from 'react-chessboard';
// import { Chess } from 'chess.js';
import './ChessboardPanel.css'
import EvalBar from './EvalBar.tsx';

type ChessboardProps = {
	gameFen: string;
	setGameFen: Dispatch<SetStateAction<string>>;
};

const ChessboardPanel = ( {gameFen, setGameFen}: ChessboardProps ) => { 

	const chessboardOptions = {
		gameFen,
		id: 'position'
	};

	return (
	<div className='chessboard-container'>
		<div className='chessboard-align'>
			<div className='eval-bar-container'>
				<EvalBar gameFen={gameFen}/>
			</div>

			<div className='chessboard'>
				<Chessboard options={chessboardOptions} />
			</div>
		</div>
	</div>
)}
export default ChessboardPanel
