const fs = require("fs")
const path = require("path")

const [,,entityPath] = process.argv

exports.emitTemplate = (type, cb) => {
	const entityName = path.basename(entityPath)

	console.log(type + " path:\t", entityPath)
	console.log(type + " name:\t", entityName)

	cb({
		name: entityName,
		path: entityPath,
		emit: (fileName, body) => {
			const name = fileName.startsWith(".") ? entityName + fileName : fileName
			const filePath = path.join(entityPath, name)

			if (!fs.existsSync(filePath)) {
				console.log("emitting:\t", filePath)
				fs.mkdirSync(entityPath, { recursive: true })
				fs.writeFileSync(filePath, body)
			} else {
				console.log("skipping:\t", filePath)
			}
		},
	})
}
