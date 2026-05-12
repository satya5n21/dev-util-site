import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { python } from '@codemirror/lang-python';
import { EditorView } from '@codemirror/view';
import { HighlightStyle, tags } from '@codemirror/highlight';

const customTheme = EditorView.theme({
  "&": {
    backgroundColor: "#1e3a8a",  // dark blue
    color: "white",
    height: "100%",
  },
  ".cm-scroller": {
    overflow: "auto",
  },
  ".cm-gutters": {
    backgroundColor: "#1e3a8a",
    color: "white",
    border: "none",
  },
}, { dark: true });

const customHighlightStyle = HighlightStyle.define([
  { tag: tags.string, color: "#bae6fd" },
  { tag: tags.number, color: "#facc15" },
  { tag: tags.bool, color: "#f87171" },
  { tag: tags.null, color: "#f472b6" },
  { tag: tags.propertyName, color: "#38bdf8" },
]);

export default function Editor({ value, onChange, title, wrap = false, language = 'json' }) {
  const extensions = [];
  if (language === 'json') {
    extensions.push(json());
  } else if (language === 'python') {
    extensions.push(python());
  }
  if (wrap) extensions.push(EditorView.lineWrapping);

  return (
    <div className='flex flex-col w-1/2 p-2 h-full'>
      <h3 className='text-lg font-medium mb-2'>{title}</h3>
      <div className='flex-1 border rounded overflow-auto scroll-auto'>
        <CodeMirror
          value={value}
          extensions={extensions}
          onChange={(val) => onChange(val)}
          theme={'dark'}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
          }}
        />
      </div>
    </div>
  );
}
