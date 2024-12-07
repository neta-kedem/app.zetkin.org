import { FC } from 'react';
import { useTheme } from '@mui/styles';
import { lighten } from '@mui/system';

import { ProgressState } from './getVisitState';

interface MarkerIconProps {
  dataToShow?: 'done' | 'visited';
  state?: ProgressState;
  selected: boolean;
}

const MarkerIcon: FC<MarkerIconProps> = ({
  dataToShow = 'visited',
  state = 'none',
  selected,
}) => {
  const theme = useTheme();

  const circleColors: Record<ProgressState, string> = {
    all:
      dataToShow == 'visited'
        ? theme.palette.primary.main
        : theme.palette.success.main,
    none: theme.palette.grey[400],
    some:
      dataToShow == 'visited'
        ? lighten(theme.palette.primary.main, 0.5)
        : lighten(theme.palette.success.main, 0.5),
  };

  return (
    <svg
      fill="none"
      height="30"
      viewBox="0 0 21 30"
      width="21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5 0C4.695 0 0 4.695 0 10.5C0 18.375 10.5 30 10.5 30C10.5 30 21 18.375 21 10.5C21 4.695 16.305 0 10.5 0Z"
        fill={selected ? '#ED1C55' : '#848484'}
      />
      <circle className="hole" cx="10.5" cy="10.5" fill="white" r="8.5" />
      <circle
        className="state-dot"
        cx="10.5"
        cy="10.5"
        fill={circleColors[state]}
        r="6.5"
      />
    </svg>
  );
};

export default MarkerIcon;
