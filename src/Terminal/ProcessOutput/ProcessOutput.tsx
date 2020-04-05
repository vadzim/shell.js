import React from "react"
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
				output.appendChild(render(text))
			}

			const onErrorData = (error: unknown) => {
				const text = (error as any)?.message ?? String(error)
				output.appendChild(render(<span className="terminal-process-output__error">{text}</span>))
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
