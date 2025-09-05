import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import toast, { Toaster } from "react-hot-toast";

interface TypingProps {
  content: string; // the AI response, may include code markdown
  onFinish?: () => void;
}

const TypingEffect: React.FC<TypingProps> = ({ content, onFinish }) => {
  const [displayed, setDisplayed] = useState("");

  // Custom fully dark style based on oneDark
  const darkTheme = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: "#0d0d0d", // fully black background
    },
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      background: "#0d0d0d", // fully black background for inline code if needed
    },
  };

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayed(content.slice(0, index));
      if (index >= content.length) {
        clearInterval(interval);
        onFinish?.();
      }
    }, 15);

    return () => clearInterval(interval);
  }, [content, onFinish]);

  return (
    <div className="prose prose-invert">
      <Toaster position="top-center" reverseOrder={false} />
      <ReactMarkdown
        children={displayed}
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node, ...props }) => (
            <table
              className="w-full border-collapse border border-gray-700 my-4 text-sm"
              {...props}
            />
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-800 text-gray-200" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="bg-gray-900 text-gray-300" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr
              className="border-b border-gray-700 hover:bg-gray-800/50"
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-4 py-2 text-left font-semibold border border-gray-700"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-2 border border-gray-700" {...props} />
          ),
          p: ({ node, ...props }) => <p className=" mb-3" {...props} />,
          li: ({ node, ...props }) => (
            <li className="ml-5 list-disc text-gray-600 mb-1" {...props} />
          ),
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <div className="relative my-5">
                <button
                  onClick={() => {
                    // Copy exact code as string
                    navigator.clipboard.writeText(
                      String(children).replace(/\n$/, "")
                    );
                    toast.success("Code copied!");
                  }}
                  className="absolute top-2 right-2 bg-gray-700/80  px-2 py-1 text-xs rounded hover:bg-gray-600 z-10"
                >
                  Copy
                </button>
                <SyntaxHighlighter
                  style={darkTheme}
                  language={match[1]}
                  PreTag="div"
                  wrapLines={true}
                  lineProps={{
                    style: {
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                      fontSize: "1.2rem",
                    },
                  }}
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
};

export default TypingEffect;
