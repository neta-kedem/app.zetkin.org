import { range } from 'lodash';
import { Box, Button, CircularProgress, Slide } from '@mui/material';
import { FC, useCallback, useState } from 'react';
import { DoorFrontOutlined } from '@mui/icons-material';

import PageBase from './PageBase';
import usePlaceMutations from 'features/canvassAssignments/hooks/usePlaceMutations';
import IntInput from '../IntInput';

type Props = {
  onBack: () => void;
  onClose: () => void;
  orgId: number;
  placeId: string;
};

const CreateHouseholdsPage: FC<Props> = ({
  onBack,
  onClose,
  orgId,
  placeId,
}) => {
  const [numFloors, setNumFloors] = useState(2);
  const [numAptsPerFloor, setNumAptsPerFloor] = useState(3);
  const [creating, setCreating] = useState(false);
  const [scale, setScale] = useState(1);
  const { addHouseholds } = usePlaceMutations(orgId, placeId);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const updateSize = useCallback(
    (newNumFloors: number, newNumAptsPerFloor: number) => {
      const widthPerHousehold = 32;
      const heightPerFloor = 42;

      const rect = container?.getBoundingClientRect() ?? {
        height: heightPerFloor * 5,
        width: widthPerHousehold * 5,
      };

      const maxHeight = rect.height / (heightPerFloor - 1);
      const maxWidth = rect.width / (widthPerHousehold - 1);
      const scaleX = Math.min(1.0, maxWidth / newNumAptsPerFloor);
      const scaleY = Math.min(1.0, maxHeight / newNumFloors);
      const newScale = Math.min(scaleX, scaleY);

      setNumFloors(newNumFloors);
      setNumAptsPerFloor(newNumAptsPerFloor);

      if (newScale != scale) {
        setScale(newScale);
      }
    },
    [setNumFloors, setNumAptsPerFloor, container]
  );

  const numTotal =
    numFloors > 0 && numAptsPerFloor > 0 ? numFloors * numAptsPerFloor : 0;

  const isEmpty = numTotal <= 0;

  return (
    <PageBase
      actions={
        <Button
          disabled={isEmpty || creating}
          onClick={async () => {
            setCreating(true);

            await addHouseholds(
              range(numFloors).flatMap((floorIndex) =>
                range(numAptsPerFloor).map((aptIndex) => ({
                  floor: floorIndex + 1,
                  title: 'Household ' + (aptIndex + 1),
                }))
              )
            );

            setCreating(false);
            onBack();
          }}
          startIcon={
            creating ? <CircularProgress color="secondary" size="20px" /> : null
          }
          variant="contained"
        >
          Create {numTotal} households
        </Button>
      }
      onBack={onBack}
      onClose={onClose}
      title="Create households"
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={4}
        height="100%"
        justifyContent="stretch"
      >
        <Box
          ref={setContainer}
          alignItems="center"
          display="flex"
          flexDirection="column"
          flexGrow={1}
          height="calc(100% - 6rem)"
          justifyContent="end"
        >
          {!isEmpty && (
            <Box
              display="flex"
              flexDirection="column-reverse"
              gap={1}
              sx={{
                transform: `scale(${scale})`,
                transformOrigin: 'bottom center',
                transition: 'transform 0.3s',
              }}
            >
              {range(0, numFloors).map((floor) => {
                return (
                  <Slide key={floor} in={true}>
                    <Box
                      key={floor}
                      borderBottom="2px solid black"
                      display="flex"
                      gap={1}
                    >
                      {range(0, numAptsPerFloor).map((apt) => {
                        return (
                          <Box
                            key={apt}
                            bottom="-12px"
                            flexGrow={1}
                            flexShrink={1}
                            position="relative"
                          >
                            <DoorFrontOutlined />
                          </Box>
                        );
                      })}
                    </Box>
                  </Slide>
                );
              })}
            </Box>
          )}
        </Box>
        <Box display="flex" justifyContent="space-around">
          <IntInput
            label="Number of floors"
            onChange={(value) => updateSize(value, numAptsPerFloor)}
            value={numFloors}
          />
          <IntInput
            label="Households per floor"
            onChange={(value) => updateSize(numFloors, value)}
            value={numAptsPerFloor}
          />
        </Box>
      </Box>
    </PageBase>
  );
};

export default CreateHouseholdsPage;
