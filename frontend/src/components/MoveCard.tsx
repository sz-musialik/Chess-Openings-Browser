import './MoveCard.css';

interface LichessMove {
	san: string;	// Algebraic Notation
	white: number;	// White wins
	black: number;	// Black wins
	draws: number;	// Draws
};

type MoveCardProps = {
	move: LichessMove;
};

interface ResultPercentage {
	white: number;
	draw: number;
	black: number;
};

function winPercentage(white: number, black: number, draws: number) : ResultPercentage {
	const total: number = white + black + draws;

	const whitePct = (white * 100) / total;
	const blackPct = (black * 100) / total;
	const drawPct = 100 - whitePct - blackPct;
	
	return {white: whitePct, draw: drawPct, black: blackPct};
}

const MoveCard = ( {move}: MoveCardProps ) => { 
	return (
	<div className='move-card-container'>
		<div className='move-card-left'>
			<div className='move-card'>
				<span>{move.san}</span>
			</div>

			<div className='line-attribute'>
				<span>(!?)</span>
			</div>

			<div className='eval-container'>
				<span>(+0.1)</span>
			</div>
		</div>


		<div className='move-card-right'>
			<div className='win-percentage-container'>
				<div className='white-win'>
					<span>
					{winPercentage(move.white, move.black, move.draws).white.toFixed(2)} %
					</span>
				</div>

				<div className='win-bar'>
					<div className='win-bar-white'></div>
					<div className='win-bar-draw'></div>
					<div className='win-bar-black'></div>
				</div>

				<div className='black-win'>
					<span>
					{winPercentage(move.white, move.black, move.draws).black.toFixed(2)} %
					</span>
				</div>
			</div>
		</div>
	</div>
)}
export default MoveCard
