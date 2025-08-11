'use client';

import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { SupportedLanguage } from '@/lib/judge0';

interface CodeEditorProps {
  language: SupportedLanguage;
  value: string;
  onChange: (value: string) => void;
  defaultCode?: string;
}

export default function CodeEditor({ language, value, onChange, defaultCode }: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const getLanguageId = (lang: string) => {
    switch (lang) {
      case 'python': return 'python';
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'python';
    }
  };

  const getDefaultValue = () => {
    if (value) return value;
    return defaultCode || `// Write your code here for ${language}`;
  };

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage={getLanguageId(language)}
        language={getLanguageId(language)}
        value={getDefaultValue()}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: false,
        }}
      />
    </div>
  );
}
