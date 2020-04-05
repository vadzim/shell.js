const { emitTemplate } = require("./emitTemplate")

emitTemplate("class", ({ name, emit }) => {

emit("index.tsx",
`export { ${name} } from "./${name}"
`)

emit(".tsx",
`export class ${name} {
	constructor() {
	}
}
`)

})
