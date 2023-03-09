import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Theme } from '@mui/material';

const FONT_SIZES = {
  lg: '1.2em',
  md: '1em',
  sm: '0.9em',
} as const;

const useStyles = makeStyles<Theme, { size: keyof typeof FONT_SIZES }>(
  (theme) => ({
    blue: {
      borderColor: theme.palette.statusColors.blue,
      borderStyle: 'solid none solid solid',
      color: theme.palette.statusColors.blue,
      padding: '3px 5px',
    },
    chip: {
      borderWidth: '2px',
      fontSize: ({ size }) => FONT_SIZES[size],
    },
    green: {
      borderColor: theme.palette.statusColors.green,
      borderRadius: '0 50em 50em 0',
      borderStyle: 'solid',
      color: theme.palette.statusColors.green,
      padding: '3px 7px 3px 5px',
    },
    orange: {
      borderColor: theme.palette.statusColors.orange,
      borderRadius: '50em 0 0 50em',
      borderStyle: 'solid none solid solid',
      color: theme.palette.statusColors.orange,
      padding: '3px 5px 3px 7px',
    },
  })
);

interface ZUIMultiNumberChipProps {
  blueValue?: number | string;
  greenValue: number | string;
  orangeValue: number | string;
  size?: keyof typeof FONT_SIZES;
}

const ZUIMultiNumberChip: FC<ZUIMultiNumberChipProps> = ({
  blueValue,
  greenValue,
  orangeValue,
  size = 'sm',
}) => {
  const classes = useStyles({ size });

  //We want to be able to render a 0 as the blue value, so
  //this is used to render no blue value
  //only if it's undefined or an empty string
  const hasBlueValue =
    typeof blueValue === 'number' ||
    (typeof blueValue === 'string' && blueValue !== '');

  return (
    <Box display="flex">
      <Box className={`${classes.orange} ${classes.chip}`}>{orangeValue}</Box>
      {typeof blueValue === 'undefined' ||
        (hasBlueValue && (
          <Box className={`${classes.blue} ${classes.chip}`}>{blueValue}</Box>
        ))}
      <Box className={`${classes.green} ${classes.chip}`}>{greenValue}</Box>
    </Box>
  );
};

export default ZUIMultiNumberChip;
