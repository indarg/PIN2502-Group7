import { Stack } from '@mui/material';
import React from 'react';
import ReactQuill, { UnprivilegedEditor } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UtilService from 'src/services/UtilService';
import './RichtextEditor.css'

interface RichtextEditorProps {
  maxLength?: number,
  sendData?: (data: string) => void;
  initialValue?: string;
  onChange?: (value:string) => void
  height?: number,
  setError?: any,
  clearErrors?: any,
  fieldName?: string,
  placeholder?: string,
  maxWidth?:string
}

const RichtextEditor: React.FC<RichtextEditorProps> = ({ sendData, initialValue = "", onChange, maxLength = 800, height = 150, setError, fieldName, clearErrors, placeholder = "Ingrese texto",maxWidth="auto" }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
  ];


  const handleQuillChange = (value: string, delta: any, source: any, editor: UnprivilegedEditor) => {
    const plainTextLength = editor.getText().trimEnd().length;

    if (plainTextLength <= maxLength) {
      if (onChange) {
        onChange(UtilService.encodeBase64Unicode(value));
      }
      if (clearErrors && fieldName) clearErrors(fieldName);
    } else {
      if (setError && fieldName) {
        setError(fieldName, {
          type: "maxLength", // Usar un tipo más específico
          message: `Solo se admiten ${maxLength} caracteres como máximo`,
        });
      }
    }
  };

  
  return <>
    <Stack className='rich-text-editor' sx={{ width: '100%', height, marginBottom: 10, minWidth: "var(--m-w)",maxWidth }}>
      <Stack>
        <ReactQuill
          placeholder={placeholder}
          theme="snow"
          value={UtilService.decodeBase64Unicode(initialValue)}
          onChange={handleQuillChange}
          modules={modules}
          formats={formats}
          style={{ minWidth: '100%', color: "black", height }}
        />
      </Stack>

    </Stack>
  </>
    ;
};

export default RichtextEditor;