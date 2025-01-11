import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { useEffect } from 'react';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [content]);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          const code = String(children).replace(/\n$/, '');

          if (inline) {
            const isPath = code.includes('/') || code.includes('\\');
            const isGitCommand = /^git\s+\w+/.test(code);
            const isCommand = isGitCommand || code.includes('-');
            
            return (
              <code
                className={`font-mono ${
                  isPath || isCommand
                    ? 'px-1.5 py-0.5 bg-blue-100 text-blue-800'
                    : 'px-1.5 py-0.5 bg-gray-100 text-gray-800'
                } rounded text-[0.9em]`}
                {...props}
              >
                {code}
              </code>
            );
          }

          let detectedLanguage = language;
          if (!detectedLanguage) {
            try {
              const result = hljs.highlightAuto(code);
              detectedLanguage = result.language || '';
            } catch (e) {
              console.warn('Failed to auto-detect code language:', e);
            }
          }

          return (
            <div className="relative group my-4">
              {detectedLanguage && (
                <div className="absolute right-2 top-2 text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded opacity-90">
                  {detectedLanguage}
                </div>
              )}
              <pre className="!mt-0 bg-gray-900 rounded-lg overflow-hidden">
                <code
                  className={`block overflow-x-auto p-4 text-[0.95em] text-gray-100 ${
                    detectedLanguage ? `language-${detectedLanguage}` : ''
                  }`}
                  {...props}
                >
                  {code}
                </code>
              </pre>
            </div>
          );
        },
        table({ children }) {
          return (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                {children}
              </table>
            </div>
          );
        },
        thead({ children }) {
          return <thead className="bg-blue-50">{children}</thead>;
        },
        th({ children }) {
          return (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border">
              {children}
            </td>
          );
        },
        ul({ children }) {
          return <ul className="list-disc list-inside space-y-1 my-4 text-gray-900">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal list-inside space-y-1 my-4 text-gray-900">{children}</ol>;
        },
        a({ children, href }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              {children}
            </a>
          );
        },
        h1({ children }) {
          return <h1 className="text-2xl font-bold my-4 text-gray-900">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-xl font-bold my-3 text-gray-900">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-lg font-bold my-2 text-gray-900">{children}</h3>;
        },
        p({ children }) {
          return <p className="my-4 leading-relaxed text-gray-900">{children}</p>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-blue-200 pl-4 py-2 my-4 italic bg-blue-50 text-gray-800">
              {children}
            </blockquote>
          );
        },
        em({ children }) {
          return <em className="italic text-gray-800">{children}</em>;
        },
        strong({ children }) {
          return <strong className="font-bold text-gray-900">{children}</strong>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
