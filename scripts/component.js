const { emitTemplate } = require("./emitTemplate")

emitTemplate("component", ({ name, emit }) => {

const style = name
	.replace(/^([A-Z]+)([A-Z])/, (s, s1, s2) => s1.toLowerCase() + s2)
	.replace(/^[A-Z]/, s => s.toLowerCase())
	.replace(/[A-Z]/g, s => "-" + s.toLowerCase())

console.log("style name:\t", style)

emit("index.tsx",
`export { ${name} } from "./${name}"
`)

emit(".tsx",
`import React from "react"
import "./${name}.css"

export const ${name} = () => (
	<div className="${style}">
	</div>
)
`)

emit(".css",
`.${style} {
}
`)

})
