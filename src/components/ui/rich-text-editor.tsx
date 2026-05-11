"use client";

import React from "react";
import QuillEditor from "./quill-editor";

export interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string | number;
  readOnly?: boolean;
}

export function RichTextEditor({ value, onChange, placeholder, height = "300px", readOnly = false }: RichTextEditorProps) {
  return (
    <div className="w-full">
      <QuillEditor
        value={value}
        onChange={({ html }) => onChange(html)}
        placeholder={placeholder}
        height={height}
        readOnly={readOnly}
        className="border-none"
      />
    </div>
  );
}
