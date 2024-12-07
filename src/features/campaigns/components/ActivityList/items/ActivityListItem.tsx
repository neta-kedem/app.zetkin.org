import makeStyles from '@mui/styles/makeStyles';
import NextLink from 'next/link';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { Box, SvgIconTypeMap, Theme, Tooltip, Typography } from '@mui/material';

import getStatusDotLabel from 'features/events/utils/getStatusDotLabel';
import theme from 'theme';
import ZUIIconLabel, { ZUIIconLabelProps } from 'zui/ZUIIconLabel';
import { getSubtitles } from '../../../utils/subtitles';

interface StyleProps {
  color: STATUS_COLORS;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  container: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1.0em 0.5em',
  },
  dot: {
    backgroundColor: ({ color }) => theme.palette.statusColors[color],
    borderRadius: '100%',
    flexShrink: 0,
    height: '10px',
    marginLeft: '0.5em',
    marginRight: '0.5em',
    marginTop: '0.2em',
    width: '10px',
  },
  endNumber: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
    width: '7em',
  },
  left: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 0',
    gap: '1em',
  },
  meta: {
    width: '8em',
  },
  primaryIcon: {
    color: theme.palette.grey[500],
    fontSize: '28px',
  },
  right: {
    alignItems: 'center',
    display: 'flex',
  },
  secondaryIcon: {
    color: theme.palette.grey[700],
    margin: '0 0.5em',
  },
}));

export enum STATUS_COLORS {
  BLUE = 'blue',
  GREEN = 'green',
  GRAY = 'gray',
  ORANGE = 'orange',
  RED = 'red',
}

export type ActivityListItemProps = {
  PrimaryIcon: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;
  SecondaryIcon: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;
  color: STATUS_COLORS;
  endDate?: string | null;
  endNumber: string | number;
  endNumberColor?: ZUIIconLabelProps['color'];
  href: string;
  meta?: JSX.Element;
  onEventItemClick?: (x: number, y: number) => void;
  startDate?: string | null;
  subtitle?: JSX.Element;
  title: string;
};

const ActivityListItem = ({
  PrimaryIcon,
  SecondaryIcon,
  href,
  color,
  meta,
  onEventItemClick,
  subtitle,
  title,
  endNumber,
  endNumberColor = 'secondary',
  endDate,
  startDate,
}: ActivityListItemProps) => {
  const classes = useStyles({ color });
  return (
    <NextLink href={href} passHref style={{ textDecoration: 'none' }}>
      <Box
        className={classes.container}
        onClick={(evt) => {
          if (onEventItemClick) {
            evt.preventDefault();
            onEventItemClick(evt.clientX, evt.clientY);
          }
        }}
      >
        <Box className={classes.left}>
          <Box>
            <Box className={classes.left}>
              <PrimaryIcon className={classes.primaryIcon} />
              <Typography color={theme.palette.text.primary}>
                {title}
              </Typography>
            </Box>
            <Box className={classes.left}>
              <Tooltip title={getStatusDotLabel({ color })}>
                <Box className={classes.dot} />
              </Tooltip>
              <Typography color={theme.palette.grey[500]} variant="body2">
                {getSubtitles(subtitle, startDate, endDate)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className={classes.meta}>{meta}</Box>
        <Box>
          <Box className={classes.endNumber}>
            <ZUIIconLabel
              color={endNumberColor}
              icon={<SecondaryIcon color={endNumberColor} />}
              label={endNumber.toString()}
            />
          </Box>
        </Box>
      </Box>
    </NextLink>
  );
};

export default ActivityListItem;
