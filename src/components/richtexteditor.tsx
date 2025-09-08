import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Link } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  immediatelyRender: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter description...',
}: RichTextEditorProps) {
  const [viewMode, setViewMode] = useState<'visual' | 'html'>('visual');
  const [htmlContent, setHtmlContent] = useState(value);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-slate-600 hover:text-slate-800 underline',
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlContent(html);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none p-4',
      },
    },
  });

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  const handleHtmlChange = (newHtml: string) => {
    setHtmlContent(newHtml);
    editor?.commands.setContent(newHtml);
    onChange(newHtml);
  };

  const toggleViewMode = () => {
    if (viewMode === 'visual') {
      // Switching to HTML mode - sync the current editor content
      const currentHtml = editor?.getHTML() || '';
      setHtmlContent(currentHtml);
      setViewMode('html');
    } else {
      // Switching to visual mode - update editor with HTML content
      editor?.commands.setContent(htmlContent);
      setViewMode('visual');
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md flex flex-col h-full">
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1 justify-between flex-shrink-0">
        <div className="flex flex-wrap gap-1">
          {viewMode === 'visual' && (
            <>
              <Button
                type="button"
                variant={editor.isActive('bold') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant={editor.isActive('italic') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <Italic className="w-4 h-4" />
              </Button>
              <div className="w-px bg-border mx-1" />
              <Button
                type="button"
                variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
              <div className="w-px bg-border mx-1" />
              <Button
                type="button"
                variant={editor.isActive('link') ? 'default' : 'ghost'}
                size="sm"
                onClick={editor.isActive('link') ? removeLink : addLink}
              >
                <Link className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant={viewMode === 'visual' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => viewMode !== 'visual' && toggleViewMode()}
          >
            Visual
          </Button>
          <Button
            type="button"
            variant={viewMode === 'html' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => viewMode !== 'html' && toggleViewMode()}
          >
            HTML
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative bg-red-100">
        {viewMode === 'visual' ? (
          <div className="absolute inset-0 overflow-y-auto">
            <EditorContent
              editor={editor}
              className="[&_.ProseMirror]:outline-none [&_.ProseMirror]:p-4"
            />
            {/* Placeholder when empty */}
            {editor.isEmpty && (
              <p className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
                {placeholder}
              </p>
            )}
          </div>
        ) : (
          <textarea
            value={htmlContent}
            onChange={(e) => handleHtmlChange(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm resize-none border-0 focus:outline-none focus:ring-0"
            placeholder="<p>Enter HTML here...</p>"
          />
        )}
      </div>
    </div>
  );
}
