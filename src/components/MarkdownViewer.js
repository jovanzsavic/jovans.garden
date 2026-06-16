import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import './MarkdownViewer.css';

export default function MarkdownViewer({ src }) {
  const [md, setMd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!src) return;
    setLoading(true);
    setError(null);
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load ' + src + ' (' + r.status + ')');
        return r.text();
      })
      .then((text) => setMd(text))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [src]);

  if (!src) return null;
  if (loading) return <div className="MarkdownViewer">Loading…</div>;
  if (error) return <div className="MarkdownViewer MarkdownViewer--error">{error}</div>;

  return (
    <div className="MarkdownViewer">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
        {md}
      </ReactMarkdown>
    </div>
  );
}
