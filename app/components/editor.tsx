"use client";

import { useEffect, useState } from "react";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [CKEditor, setCKEditor] = useState<any>(null);
  const [ClassicEditor, setClassicEditor] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const CKEditorModule = await import("@ckeditor/ckeditor5-react");
        const ClassicEditorModule = await import(
          "@ckeditor/ckeditor5-build-classic"
        );

        setCKEditor(() => CKEditorModule.CKEditor);
        setClassicEditor(() => ClassicEditorModule.default);
        setEditorLoaded(true);
      } catch (error) {
        console.error("CKEditor krovimo klaida:", error);
      }
    })();
  }, []);

  const editorConfig = {
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "outdent",
      "indent",
      "|",
      "blockQuote",
      "insertTable",
      "undo",
      "redo",
    ],

    licenseKey: "DISABLE-EDITOR-LICENSING",
  };

  return (
    <div>
      {editorLoaded ? (
        <CKEditor
          editor={ClassicEditor}
          data={value}
          onChange={(_event: any, editor: any) => {
            const data = editor.getData();
            onChange(data);
          }}
          config={editorConfig}
        />
      ) : (
        <div className="p-4 text-center text-gray-500">
          Kraunamas redaktorius...
        </div>
      )}
    </div>
  );
}
