import './EvalBar.css'

type ChessboardProps = {
	gameFen: string;
};

const ChessboardPanel = ( {gameFen}: ChessboardProps ) => { 



	return (
	<div className='eval-bar-box'>
		<div className='eval-bar-black'>
		<span>0.1</span>
		</div>

		<div className='eval-bar-range'>
		</div>

		<div className='eval-bar-white'>
		<span>0.1</span>
		</div>

	</div>
)}
export default ChessboardPanel
