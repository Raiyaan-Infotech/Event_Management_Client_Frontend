"use client";

import React, { useEffect, useRef } from "react";
import type { Delta } from "quill";

/**
 * Professional Quill.js Editor Component
 * Built for production with Next.js App Router support.
 */

interface QuillEditorProps {
  /** Initial HTML value or current state value */
  value: string;
  /** Callback returning both HTML string and Delta object for complex processing */
  onChange: (data: { html: string; delta: Delta }) => void;
  /** Editor placeholder text */
  placeholder?: string;
  /** Toggle read-only state */
  readOnly?: boolean;
  /** Custom wrapper class */
  className?: string;
  /** Editor height (CSS units) */
  height?: string | number;
}

const QuillEditor = ({
  value,
  onChange,
  placeholder = "Start writing your content...",
  readOnly = false,
  className = "",
  height = "300px",
}: QuillEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<import('quill').default | null>(null); // Properly typed ref
  const isUpdatingRef = useRef(false);
  const latestValueRef = useRef(value);
  useEffect(() => { latestValueRef.current = value; });

  // Initialize Quill instance on mount (Client-side only)
  useEffect(() => {
    let isComponentMounted = true;
    let quill: import('quill').default | null = null;

    const initQuill = async () => {
      // Dynamically import Quill only on the client
      const { default: QuillInstance } = await import("quill");

      if (!isComponentMounted || !containerRef.current) return;

      // Prevent double-initialization (common React 18 Strict Mode issue)
      if (containerRef.current.classList.contains("ql-container")) {
        return;
      }

      quill = new QuillInstance(containerRef.current, {
        theme: "snow",
        placeholder,
        readOnly,
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ["link", "image", "video"],
              ["blockquote", "code-block"],
              ["clean"],
            ],
          },
        },
      });

      quillRef.current = quill;

      // Set initial value — use latestValueRef so we get the current value
      // even if the prop changed while Quill was loading asynchronously
      if (latestValueRef.current) {
        quill.clipboard.dangerouslyPasteHTML(latestValueRef.current);
      }

      const editor = quill;

      // Listener for content changes
      const handleTextChange = () => {
        if (isUpdatingRef.current) return;
        if (!editor) return;
        
        const html = editor.root.innerHTML;
        const delta = editor.getContents();
        
        if (html !== value) {
          onChange({ html, delta });
        }
      };

      editor.on("text-change", handleTextChange);
    };

    initQuill();

      const container = containerRef.current;
      return () => {
        isComponentMounted = false;
        
        // Properly cleanup the editor and its toolbar
        if (quillRef.current) {
          quillRef.current.off("text-change");
          quillRef.current = null;
        }

        if (container) {
          // Quill Snow theme creates the toolbar as a sibling. 
          // We find it within the wrapper and remove it to prevent duplicates on remount.
          const wrapper = container.closest(".quill-editor-wrapper");
          if (wrapper) {
            const toolbars = wrapper.querySelectorAll(".ql-toolbar");
            toolbars.forEach(tb => tb.remove());
          }
          
          container.innerHTML = "";
          container.classList.remove("ql-container", "ql-snow");
        }
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Sync external value changes to the editor
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      isUpdatingRef.current = true;
      
      // Save cursor position to prevent jumping
      const selection = quillRef.current.getSelection();
      
      // Update content
      quillRef.current.root.innerHTML = value || "";
      
      // Restore cursor position if it was active
      if (selection) {
        quillRef.current.setSelection(selection);
      }
      
      isUpdatingRef.current = false;
    }
  }, [value]);

  // Sync readOnly prop changes
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!readOnly);
    }
  }, [readOnly]);

  return (
    <div className={`quill-editor-wrapper ${className}`}>
      <div 
        ref={containerRef} 
        style={{ height: height }}
        className="quill-editor-inner"
      />
    </div>
  );
};

export default QuillEditor;
