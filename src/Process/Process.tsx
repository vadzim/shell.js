import { Readable, Writable, PassThrough } from 'stream'

export const spawn = function<O = string | ArrayBuffer, I = string | ArrayBuffer, E = string | ArrayBuffer | Error>(cmd: string) { return new Process<O, I, E>(cmd) }

export class Process<O = string | ArrayBuffer, I = string | ArrayBuffer, E = string | ArrayBuffer | Error> extends Promise<number> {
	#stdin: Writable
	#stdinp: Readable
	#stdout: Readable
	#stdoutp: Writable
	#stderr: Readable
	#stderrp: Writable
	#resolve: (x: number) => void

	static get [Symbol.species]() { return Promise }

	constructor(cmd: string) {
		super(resolve => { _resolve = resolve })
		// using `var` is a workaround. Typescript allows neither to assign `this.#resolve` within the callback nor to declare `let` variables before super is called.
		var _resolve: any
		this.#resolve = _resolve

		const stdin = new PassThrough()
		const stdout = new PassThrough()
		const stderr = new PassThrough()

		this.#stdin = stdin
		this.#stdinp = stdin
		this.#stdout = stdout
		this.#stdoutp = stdout
		this.#stderr = stderr
		this.#stderrp = stderr

		Promise.all([
			new Promise(resolve => this.#stdout.on("end", resolve)),
			new Promise(resolve => this.#stderr.on("end", resolve)),
			new Promise(resolve => this.#stdin.on("finish", resolve)),
		]).then(() => { this.#resolve(0) })

		void (async () => {
			await new Promise(resolve => setTimeout(resolve, 800))
			stdout.write('...aha...\n')
			await new Promise(resolve => setTimeout(resolve, 500))
			stdout.write('...oho...\n')
			await new Promise(resolve => setTimeout(resolve, 500))
			stdout.end()
			stderr.end()
			stdin.end()
		})()
	}

	write(data: I) {
		this.#stdin.write(data)
	}

	onData(cb: (data: O) => void) {
		this.#stdout.on("data", cb)
	}
	offData(cb: (data: O) => void) {
		this.#stdout.off("data", cb)
	}

	onErrorData(cb: (data: E) => void) {
		this.#stderr.on("data", cb)
	}
	offErrorData(cb: (data: E) => void) {
		this.#stderr.off("data", cb)
	}
}
