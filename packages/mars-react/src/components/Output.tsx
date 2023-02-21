import { useEffect, useRef } from "react";
import styles from "../styles/tailwind.css?inline"


interface Props {
    output: string;
}

export default function Output({ output }: Props) {
    const iframe = useRef<HTMLIFrameElement>(null)
    const srcDoc = `
    <html>
    <head>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class = "font-mono text-sm">
        ${output}
    </body>
    </html>
    `


    return (
        <div className="output-wrapper">
            {output && (
                <div className="output px-4">
                    <iframe ref={iframe} className="h-full w-full mt-4" srcDoc={srcDoc} onLoad={(event) => {
                        if (iframe.current) {
                            iframe.current.style.height = `${iframe.current.contentWindow!.document.body.scrollHeight}px`
                        }
                    }} />
                </div>
            )}
        </div>
    );
}
