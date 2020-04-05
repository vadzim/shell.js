import React from "react"
import "./TextNode.css"

export const TextNode = ({text = '' as string, className = undefined as string | undefined}) => (
	<>
		{text.split('\n').map((line, index) => (
			<React.Fragment key={index}>
				{index > 0 && <br/>}
				{Boolean(line) && <span className={className}>{line}</span>}
			</React.Fragment>
		))}
	</>
)
