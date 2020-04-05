import React from 'react'
import { uid } from 'react-uid'
import { spawn, Process } from '../Process'
import { ProcessOutput } from './ProcessOutput'
import './Terminal.css'

const Prompt = ({children = <></> as React.ReactNode}) => <>{Boolean(children) && <span className='terminal-prompt'>{children}</span>}</>

export const Terminal = ({
	prompt = '>' as string,
}) => {
	type Entry = {
		cmd: string,
		process: Process<string, string, string | Error>,
	}

	const [entries, setEntries] = React.useState([] as Entry[])
	const [cmd, setCmd] = React.useState("")
	const input = React.useRef() as React.RefObject<HTMLInputElement>

	React.useEffect(() => { input.current?.focus() })

	return (
		<div className="terminal">
			{entries.map(entry => (
				<div key={uid(entry)} className="terminal-entry">
					<div className="terminal-command"><Prompt>{prompt}</Prompt>{entry.cmd}</div>
					<ProcessOutput process={entry.process}/>
				</div>
			))}
			<form className="terminal-input" onSubmit={e => {
				e.preventDefault()
				const cmd = input.current?.value ?? ''
				setEntries([...entries, { cmd, process: spawn<string, string, string | Error>(cmd) }])
				setCmd('')
				setTimeout(() => input.current?.scrollIntoView())
			}}>
				<Prompt>{prompt}</Prompt>
				<input ref={input} className="terminal-current" name="current" value={cmd} onChange={e => setCmd(e.target.value)} />
			</form>
		</div>
	)
}
