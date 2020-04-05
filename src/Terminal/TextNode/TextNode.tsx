import React from "react"
import classnames from "classnames"
import "./TextNode.css"

export const TextNode = ({text = '' as string, className = undefined as string | undefined, brClassName = undefined as string | undefined}) => (
	<>
		{text.split('\n').map((line, index) => (
			<React.Fragment key={index}>
				{index > 0 && <span className={classnames(brClassName, 'terminal-text-node__br')}>{"\n"}</span>}
				{Boolean(line) && <span className={className}>{line}</span>}
			</React.Fragment>
		))}
	</>
)
