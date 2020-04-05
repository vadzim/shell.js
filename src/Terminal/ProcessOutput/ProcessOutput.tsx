import React from "react"
import { TextNode } from "Terminal/TextNode"
import { Process } from "Process"
import { render } from "util/render"
import "./ProcessOutput.css"

export const ProcessOutput = React.memo<{ process: Process }>(({ process }) => {
	const [output] = React.useState(() => process ? document.createElement("div") : undefined)
	const container = React.useRef<Element>() as React.RefObject<HTMLDivElement>

	React.useLayoutEffect(() => {
		if (process && output) {
			output.classList.add('terminal-process-output__loading')
			const containerRef = container.current

			const onData = (data: unknown) => {
				const text = String(data)
				output.appendChild(render(<TextNode text={text} className="terminal-process-output__line terminal-process-output__data" brClassName="terminal-process-output__br" />))
			}

			const onErrorData = (error: unknown) => {
				const text = (error as any)?.message ?? String(error)
				output.appendChild(render(<TextNode text={text} className="terminal-process-output__line terminal-process-output__error" brClassName="terminal-process-output__br" />))
			}

			process.onData(onData)
			process.onErrorData(onErrorData)
			process.finally(() => output.classList.remove('terminal-process-output__loading'))
			containerRef?.appendChild(output)

			return () => {
				process.offData(onData)
				process.offErrorData(onErrorData)
				containerRef?.removeChild(output)
			}
		}

	}, [output, process, container])

	return <div className="terminal-process-output" ref={container} />
})
