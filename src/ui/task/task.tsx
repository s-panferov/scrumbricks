import * as React from 'react'
import * as Radium from 'radium'
import * as theme from '../theme'

import { Avatar } from '../avatar'
import { Task, User } from '../../models'

export interface TaskUIProps extends React.CommonProps {
	task: Task
	users: User[]
	connectDragSource?: (el: React.ReactElement<any>) => void
}

@Radium
export class TaskUI extends React.Component<TaskUIProps, any> {
	render() {
		const { task, connectDragSource } = this.props
		const header = this.renderHeader()
		return (
			<div style={[ s.task, this.props.style ]} onMouseDown={ (e) => e.stopPropagation() }>
				{ connectDragSource
					? connectDragSource(header)
					: header }
				<div key='title' style={ s.title }>{ task.title }</div>
			</div>
		)
	}

	renderHeader() {
		const { task, users } = this.props
		return (
			<div style={ s.header }>
				<Avatar key='avatar'
					style={ s.avatar }
					gravatar={ users[0].email }
				/>
				<div key='id' style={ s.id }>{ task.id }</div>
			</div>
		)
	}
}

const s = {
	task: {
		backgroundColor: 'white',
		margin: '10px',
		width: '250px',
		minHeight: '50px',
		boxShadow: theme.shadow
	},
	avatar: {
		marginRight: '5px',
	},
	header: {
		borderBottom: '1px solid #eee',
		display: 'flex',
		padding: '5px',
		alignItems: 'center',
		marginBottom: '5px'
	},
	id: {
		fontFamily: theme.font,
		fontSize: '12px',
	},
	title: {
		fontFamily: theme.font,
		padding: '5px',
		fontSize: '14px',
	}
}
