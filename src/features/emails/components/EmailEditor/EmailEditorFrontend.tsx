import LibraryImage from './tools/LibraryImage';
import EditorJS, { EditorConfig, OutputData } from '@editorjs/editorjs';
import { FC, useEffect, useRef } from 'react';

export type EditorProps = {
  onSave?: (data: OutputData) => void;
};

const EmailEditorFrontend: FC<EditorProps> = ({ onSave }) => {
  const editorInstance = useRef<EditorJS | null>(null);

  const saved = async () => {
    try {
      const savedData = await editorInstance.current?.save();
      if (savedData && onSave) {
        onSave(savedData);
      }
    } catch (error) {
      //TODO: handle error
    }
  };

  useEffect(() => {
    const editorConfig: EditorConfig = {
      // TODO: Find way to make unique IDs
      holder: 'ClientOnlyEditor-container',
      inlineToolbar: ['bold', 'link', 'italic'],
      onChange: () => {
        saved();
      },
      tools: {
        image: LibraryImage,
      },
    };

    // Create the EditorJS instance
    editorInstance.current = new EditorJS(editorConfig);

    return () => {
      // Cleanup when the component is unmounted
      if (editorInstance.current) {
        editorInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div
      id="ClientOnlyEditor-container"
      style={{ backgroundColor: 'white', border: '1px solid black' }}
    />
  );
};

export default EmailEditorFrontend;
