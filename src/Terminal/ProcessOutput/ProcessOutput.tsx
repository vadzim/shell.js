import React from "react"
import { TextNode } from "../TextNode"
import { Process } from "../../Process"
import { render } from '../../util/render'
import "./ProcessOutput.css"

export const ProcessOutput = React.memo<{ process: Process }>(({ process }) => {
	const [output] = React.useState(() => process ? document.createElement('div') : undefined)
	const container = React.useRef<Element>() as React.RefObject<HTMLDivElement>

	React.useLayoutEffect(() => {
		const containerRef = container.current
		const onData = (data: unknown) => {
			const text = String(data)
			output?.appendChild(render(<TextNode text={text} className="terminal-data" />, 'span'))
		}

		const onErrorData = (error: unknown) => {
			const text = (error as any)?.message ?? String(error)
			output?.appendChild(render(<TextNode text={text} className="terminal-error" />, 'span'))
		}

		if (process && output) {
			process?.onData(onData)
			process?.onErrorData(onErrorData)
			containerRef?.appendChild(output)
		}

		return () => {
			if (process && output) {
				process?.offData(onData)
				process?.offErrorData(onErrorData)
				containerRef?.removeChild(output)
			}
		}
	}, [output, process, container])

	return <div className="process-output" ref={container} />
})
