import { Highlight, themes } from "prism-react-renderer";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "cpp" }: CodeBlockProps) {
  return (
    <Highlight theme={themes.vsDark} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} p-6 m-0 w-full h-full overflow-auto code-scrollbar font-mono text-sm md:text-[15px] leading-relaxed tracking-wide shadow-inner`}
          style={{ ...style, backgroundColor: '#0d1117' }} // Enforcing dark GitHub-like theme
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })} className="table-row">
              <span className="table-cell text-right pr-6 select-none opacity-40 text-xs">
                {i + 1}
              </span>
              <span className="table-cell">
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
