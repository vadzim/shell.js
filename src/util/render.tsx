import React from 'react'
import ReactDOM from 'react-dom'

export const render = (markup: React.ReactNode | undefined, element: string | Element | DocumentFragment = document.createDocumentFragment()): Element | DocumentFragment => {
	const node = typeof element === "string" ? document.createElement(element) : element
	ReactDOM.render(<>{markup}</>, node)
	return node
}
