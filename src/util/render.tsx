import React from 'react'
import ReactDOM from 'react-dom'

export const render = (markup: React.ReactNode | undefined, element: string) => {
	const node = document.createElement(element)
	ReactDOM.render(<>{markup}</>, node)
	return node
}
