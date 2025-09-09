import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

export function CodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <pre className={`language-${language}`}>
      <code
        dangerouslySetInnerHTML={{ __html: Prism.highlight(code, Prism.languages[language], language) }}
      />
    </pre>
  );
}
