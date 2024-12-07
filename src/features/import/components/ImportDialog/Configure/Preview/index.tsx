import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

import DatePreview from './DatePreview';
import EmptyPreview from './EmptyPreview';
import FieldsPreview from './FieldsPreview';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import OrgsPreview from './OrgsPreview';
import TagsPreview from './TagsPreview';
import { useNumericRouteParams } from 'core/hooks';
import usePersonPreview from 'features/import/hooks/usePersonPreview';
import useSheets from 'features/import/hooks/useSheets';
import { ColumnKind, Sheet } from 'features/import/utils/types';
import EnumPreview from './EnumPreview';

const Preview = () => {
  const theme = useTheme();
  const { sheets, selectedSheetIndex, firstRowIsHeaders } = useSheets();
  const [personIndex, setPersonIndex] = useState(0);
  const currentSheet: Sheet = sheets[selectedSheetIndex];
  const { orgId } = useNumericRouteParams();
  const { fields, orgs, tags } = usePersonPreview(
    currentSheet,
    firstRowIsHeaders ? personIndex + 1 : personIndex,
    orgId
  );

  const previewIsEmpty = currentSheet.columns.every(
    (item) => item.selected === false
  );

  const tagColumnSelected = currentSheet.columns.some(
    (column) => column.kind === ColumnKind.TAG && column.selected
  );

  const orgColumnSelected = currentSheet.columns.some(
    (column) => column.kind === ColumnKind.ORGANIZATION && column.selected
  );

  useEffect(() => {
    setPersonIndex(0);
  }, [selectedSheetIndex]);

  return (
    <Box paddingLeft={1} paddingY={1}>
      <Box alignItems="center" display="flex" marginBottom={1}>
        <Typography
          sx={{ marginRight: 2, opacity: previewIsEmpty ? '50%' : '' }}
          variant="h5"
        >
          <Msg id={messageIds.configuration.preview.title} />
        </Typography>
        <Button
          disabled={personIndex === 0 || previewIsEmpty}
          onClick={() =>
            setPersonIndex((prev) => (prev !== 0 ? prev - 1 : prev))
          }
          startIcon={<ArrowBackIos />}
        >
          <Msg id={messageIds.configuration.preview.previous} />
        </Button>
        <Button
          disabled={
            personIndex ===
              currentSheet.rows.length - (firstRowIsHeaders ? 2 : 1) ||
            previewIsEmpty
          }
          endIcon={<ArrowForwardIos />}
          onClick={() =>
            setPersonIndex((prev) =>
              prev < currentSheet.rows.length - 1 ? prev + 1 : prev
            )
          }
        >
          <Msg id={messageIds.configuration.preview.next} />
        </Button>
      </Box>
      <Box
        alignItems="center"
        border={1}
        borderColor={theme.palette.grey[300]}
        borderRadius={1}
        display="flex"
        justifyContent="space-between"
        minHeight="5em"
        sx={{
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        {previewIsEmpty &&
          Array(currentSheet.columns.length)
            .fill(null)
            .map((_, index) => {
              return (
                <Box
                  key={`empty-preview-${index}`}
                  bgcolor={theme.palette.transparentGrey.light}
                  flexGrow={1}
                  height="14px"
                  margin={2}
                />
              );
            })}
        {!previewIsEmpty && (
          <>
            {currentSheet.columns.map((column, columnIdx) => {
              if (column.selected) {
                if (column.kind === ColumnKind.UNKNOWN) {
                  const rowValue =
                    currentSheet.rows[
                      firstRowIsHeaders ? personIndex + 1 : personIndex
                    ].data[columnIdx];
                  return <EmptyPreview key={columnIdx} rowValue={rowValue} />;
                }

                if (
                  column.kind === ColumnKind.FIELD ||
                  column.kind === ColumnKind.ID_FIELD
                ) {
                  return (
                    <FieldsPreview
                      key={columnIdx}
                      fieldKey={
                        column.kind === ColumnKind.FIELD
                          ? column.field
                          : column.idField
                      }
                      fields={fields}
                      kind={column.kind}
                    />
                  );
                }

                if (column.kind === ColumnKind.DATE) {
                  return (
                    <DatePreview
                      key={columnIdx}
                      fieldKey={column.field}
                      fields={fields}
                      orgId={orgId}
                    />
                  );
                }

                if (column.kind === ColumnKind.ENUM) {
                  return (
                    <EnumPreview
                      key={columnIdx}
                      currentSheet={currentSheet}
                      fieldKey={column.field}
                      fields={fields}
                    />
                  );
                }
              }
            })}
            {orgColumnSelected && (
              <OrgsPreview currentSheet={currentSheet} orgs={orgs} />
            )}
            {tagColumnSelected && (
              <TagsPreview currentSheet={currentSheet} tags={tags} />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Preview;
