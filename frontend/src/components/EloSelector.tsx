import './EloSelector.css';
import { type Dispatch, type SetStateAction } from 'react';
import { Box } from '@mui/material';
import Slider from '@mui/material/Slider';

type EloSelectorProps = {
	eloValue: number[];
	setEloValue: Dispatch<SetStateAction<number[]>>;
};

export const marks = [
	{ value: 0, label: '0'},
	{ value: 1000, label: '1000'},
	{ value: 1200, label: '1200'},
	{ value: 1400, label: '1400'},
	{ value: 1600, label: '1600'},
	{ value: 1800, label: '1800'},
	{ value: 2000, label: '2000'},
	{ value: 2200, label: '2200'},
	{ value: 2500, label: '2500'},
];

export function getRatingsInRange(range: number[]): number[] {
	const minRange = range[0];
	const maxRange = range[1]

	return marks
		.filter(mark => mark.value >= minRange && mark.value <= maxRange)
		.map(mark => mark.value);
}

const EloSelector = ( {eloValue, setEloValue}: EloSelectorProps) => { 
	const handleChange = ( event: Event, newValue: number[]) => {
		console.log(`Event: ${event}, newValue: ${newValue}`);
		setEloValue(newValue);
	};

	function valuetext(value: number) {
		return `${value}`;
	}

	return (
	<div className='elo-selector-container'>
		<Box className='slider-box'>
      <Slider
        getAriaLabel={() => 'EloSelector'}
				getAriaValueText={valuetext}
				min={0}
				step={null}
				max={2500}
        value={eloValue}
        onChange={handleChange}
        valueLabelDisplay="auto"
				marks={marks}
      />
    </Box>
	</div>
)}
export default EloSelector
