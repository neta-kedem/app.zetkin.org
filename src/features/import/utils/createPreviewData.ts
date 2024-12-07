import getUniqueTags from './getUniqueTags';
import { ZetkinPersonImportOp } from './prepareImportOperations';
import { ColumnKind, Sheet } from './types';
import parserFactory from './dateParsing/parserFactory';

export default function createPreviewData(
  configuredSheet: Sheet,
  personIndex: number
) {
  const personPreviewOp: Partial<ZetkinPersonImportOp> = {};
  const row = configuredSheet.rows[personIndex].data;

  configuredSheet.columns.forEach((column, colIdx) => {
    if (column.selected) {
      //ID column and fields
      if (
        column.kind === ColumnKind.ID_FIELD ||
        column.kind === ColumnKind.FIELD
      ) {
        const fieldKey =
          column.kind === ColumnKind.ID_FIELD ? column.idField : column.field;

        if (row[colIdx]) {
          personPreviewOp.data = {
            ...personPreviewOp.data,
            [`${fieldKey}`]: row[colIdx],
          };
        }
      }
      //tags
      if (column.kind === ColumnKind.TAG) {
        column.mapping.forEach((mappedColumn) => {
          if (
            (!mappedColumn.value && !row[colIdx]) ||
            mappedColumn.value === row[colIdx]
          ) {
            if (!personPreviewOp.tags) {
              personPreviewOp.tags = [];
            }
            const allTags = personPreviewOp.tags.concat(
              mappedColumn.tags.map((t) => ({ id: t.id }))
            );

            personPreviewOp.tags = getUniqueTags(allTags);
          }
        });
      }
      //orgs
      if (column.kind === ColumnKind.ORGANIZATION) {
        column.mapping.forEach((mappedColumn) => {
          if (
            (!mappedColumn.value && !row[colIdx]) ||
            mappedColumn.value === row[colIdx]
          ) {
            if (!personPreviewOp.organizations) {
              personPreviewOp.organizations = [];
            }
            const allOrgs = personPreviewOp.organizations.concat(
              mappedColumn?.orgId as number
            );

            personPreviewOp.organizations = Array.from(
              new Set<number>(allOrgs)
            );
          }
        });
      }
      //enum
      if (column.kind === ColumnKind.ENUM) {
        column.mapping.forEach((mappedColumn) => {
          if (
            (!mappedColumn.value && !row[colIdx]) ||
            mappedColumn.value === row[colIdx]
          ) {
            personPreviewOp.data = {
              ...personPreviewOp.data,
              [`${column.field}`]: mappedColumn.key,
            };
          }
        });
      }

      if (column.kind === ColumnKind.DATE) {
        if (row[colIdx] && column.dateFormat) {
          const parser = parserFactory(column.dateFormat);
          const date = parser.parse(row[colIdx]?.toString() ?? '');
          personPreviewOp.data = {
            ...personPreviewOp.data,
            [`${column.field}`]: date,
          };
        }
      }
    }
  });

  return personPreviewOp;
}
