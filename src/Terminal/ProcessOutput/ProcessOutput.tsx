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
				output.appendChild(render(<TextLine text={String(data)} />))
			}

			const onErrorData = (error: unknown) => {
				output.appendChild(render(<TextLine className="terminal-process-output__error" text={(error as any)?.message ?? String(error)} />))
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

const TextLine = ({ className = undefined as string | undefined, text = '' as string }) => {
	const { main, end } = text.match(/^(?<main>.*?)(?<end>\n?)$/s)?.groups ?? {}
	return (
		<>
			{className ? <span className={className}>{main}</span> : main}
			<span className={className}>{end}</span>
		</>
	)
}
