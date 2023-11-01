import { FC, useState } from 'react';

import AccordionSection from './AccordionSection';
import Mapping from './Mapping';
import messageIds from 'features/import/l10n/messageIds';
import { useMessages } from 'core/i18n';
import SheetSettings, { ExperimentSheet } from './SheetSettings';

interface ConfigureProps {
  sheets: ExperimentSheet[];
}

const Configure: FC<ConfigureProps> = ({ sheets }) => {
  const messages = useMessages(messageIds);
  const [firstRowIsHeaders, setFirstRowIsHeaders] = useState(true);
  const [selectedSheetId, setSelectedSheetId] = useState(sheets[0].id);

  const selectedSheet = sheets.find((sheet) => {
    return sheet.id == selectedSheetId;
  });

  return (
    <>
      <AccordionSection header={messages.configuration.settings.header()}>
        <SheetSettings
          firstRowIsHeaders={firstRowIsHeaders}
          onChangeFirstRowIsHeaders={() =>
            setFirstRowIsHeaders(!firstRowIsHeaders)
          }
          onChangeSelectedSheet={(id: number) => setSelectedSheetId(id)}
          selectedSheet={selectedSheetId}
          sheets={sheets}
        />
      </AccordionSection>
      <AccordionSection header={messages.configuration.mapping.header()}>
        <Mapping
          firstRowIsHeaders={firstRowIsHeaders}
          rows={selectedSheet?.data}
        />
      </AccordionSection>
    </>
  );
};

export default Configure;
