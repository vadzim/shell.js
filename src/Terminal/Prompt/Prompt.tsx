import React from "react"
import "./Prompt.css"

export const Prompt = ({ children = '>' as React.ReactNode }) => <>{Boolean(children) && <span className='terminal-prompt'>{children}</span>}</>
