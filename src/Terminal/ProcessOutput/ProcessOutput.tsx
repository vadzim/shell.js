import React from "react"
import { TextNode } from "Terminal/TextNode"
import { Process } from "Process"
import { SmallSpinner } from "SmallSpinner"
import { render } from "util/render"
import "./ProcessOutput.css"

export const ProcessOutput = React.memo<{ process: Process }>(({ process }) => {
	const [output] = React.useState(() => process ? document.createElement("div") : undefined)
	const container = React.useRef<Element>() as React.RefObject<HTMLDivElement>

	React.useLayoutEffect(() => {
		if (process && output) {
			const containerRef = container.current
			const spinner = render(<SmallSpinner />, "span")
			output.appendChild(spinner)

			const moveSpinner = () => {
				let lastChild: Node = output
				while (lastChild.lastChild) {
					lastChild = lastChild.lastChild
				}
				if (lastChild.constructor as unknown === HTMLBRElement) {
					lastChild.parentNode?.insertBefore(spinner, lastChild)
				} else {
					output.appendChild(spinner)
				}
			}

			const onData = (data: unknown) => {
				const text = String(data)
				output.appendChild(render(<TextNode text={text} className="terminal-process-output__data" />, "span"))
				moveSpinner()
			}

			const onErrorData = (error: unknown) => {
				const text = (error as any)?.message ?? String(error)
				output.appendChild(render(<TextNode text={text} className="terminal-process-output__error" />, "span"))
				moveSpinner()
			}

			process.onData(onData)
			process.onErrorData(onErrorData)
			process.finally(() => spinner.parentNode?.removeChild(spinner))
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
