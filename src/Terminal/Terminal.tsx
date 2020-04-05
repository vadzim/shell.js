import React from 'react'
import { uid } from 'react-uid'
import { useHandler } from 'react-use-handler'
import { spawn, Process } from 'Process'
import { SmoothHeight } from 'SmoothHeight'
import { ProcessOutput } from './ProcessOutput'
import { Prompt } from './Prompt'
import './Terminal.css'

export const Terminal = ({
	prompt = '>' as string,
	maxHistory = 99 as number,
}) => {
	type Entry = {
		cmd: string,
		process: Process<string, string, string | Error>,
	}

	const [entries, setEntries] = React.useState([] as Entry[])
	const [cmd, setCmd] = React.useState("")
	const input = React.useRef() as React.RefObject<HTMLInputElement>

	React.useEffect(() => { input.current?.focus() }, [input])

	const runCmd = useHandler((cmd?: string) => {
		if (!cmd) {
			return
		}
		setEntries(currentEntries => [
			...currentEntries.slice(-(maxHistory ?? Infinity)),
			{ cmd, process: spawn<string, string, string | Error>(cmd) },
		])
		setCmd('')
		setTimeout(() => input.current?.scrollIntoView())
	})

	React.useEffect(() => { runCmd('talk') }, [runCmd])

	return (
		<div className="terminal">
			{entries.map(entry => (
				<div key={uid(entry)} className="terminal-entry">
					<div className="terminal-command"><Prompt>{prompt}</Prompt>{entry.cmd}</div>
					<SmoothHeight>
						<ProcessOutput process={entry.process}/>
					</SmoothHeight>
				</div>
			))}
			<form className="terminal-input" onSubmit={e => {
				e.preventDefault()
				runCmd(input.current?.value)
			}}>
				<Prompt>{prompt}</Prompt>
				<input ref={input} className="terminal-current" name="current" value={cmd} onChange={e => setCmd(e.target.value)} />
			</form>
		</div>
	)
}
