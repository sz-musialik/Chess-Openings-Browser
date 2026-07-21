import './MoveCard.css';

interface LichessMove {
	san: string;	// Algebraic Notation
	white: number;	// White wins
	black: number;	// Black wins
	draws: number;	// Draws
};

type MoveCardProps = {
	move: LichessMove;
	positionEvaluation: number;
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

const MoveCard = ( {move, positionEvaluation}: MoveCardProps ) => { 
	const colorEvalContainer = (): string => {
		return positionEvaluation < 0.0 ? "#000000" : "#FFFFFF";
	};

	const fontColorEvalContainer = (): string => {
		return positionEvaluation < 0.0 ? "#FFFFFF" : "#000000";
	};

	// TODO:
	// Currently only works for the current position
	// Later will have to positions with lines from api to the engine to get their eval
	return (
	<div className='move-card-container'>
		<div className='move-card-left'>
			<div className='move-card'>
				<span>{move.san}</span>
			</div>

			<div className='line-attribute'>
				<span>✓</span>
			</div>

			<div
				className='eval-container'
				style={{
					backgroundColor: colorEvalContainer(),
					color: fontColorEvalContainer()
				}}
			><span>{positionEvaluation}</span></div>
		</div>


		<div className='move-card-right'>
			<div className='win-percentage-container'>
				<div className='white-win'>
					<span>
					{winPercentage(move.white, move.black, move.draws).white.toFixed(2)} %
					</span>
				</div>

				<div className='winrate-range'>
					<div
						className='winrate-range-white'
						style={{ width: `${winPercentage(move.white, move.black, move.draws).white}%`}}
					></div>
					<div
						className='winrate-range-draws'
						style={{ width: `${winPercentage(move.white, move.black, move.draws).draw}%`}}
					></div>
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
