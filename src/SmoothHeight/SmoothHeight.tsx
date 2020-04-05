import React from "react"
import "./SmoothHeight.css"

export const SmoothHeight = ({ children = undefined as React.ReactNode }) => {
	const inner = React.useRef() as React.RefObject<HTMLDivElement>
	const [height, setHeight] = React.useState(0)

	React.useEffect(() => {
		const interval = setInterval(() => setHeight(inner.current?.getBoundingClientRect().height ?? 0), 150)
		return () => clearInterval(interval)
	}, [setHeight, inner])

	return (
		<div className="smooth-height" style={{height}}>
			<div ref={inner} className="smooth-height__inner">
				{children}
			</div>
		</div>
	)
}
