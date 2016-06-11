import * as React from 'react'
import * as Radium from 'radium'

import { LaneView } from './lane'
import { TaskView } from './task'
import { Lane, Board } from './models'

interface BoardProps {
	board: Board
}

@Radium
export class BoardView extends React.Component<any, any> {
	render() {
		return (
			<div style={ styles.board }>
				{ build(this.props.board) }
			</div>
		)
	}
}

const styles = {
	board: {
		display: 'flex',
		flexDirection: 'row'
	}
}

function build(board: Board) {
	let { lanes } = board
	return (
		lanes.map(lane => {
			let compiledLane = (
				<LaneView
					key={ lane.title }
					title={ lane.title }
				>
					{ tasksForLane(lane, board) }
				</LaneView>
			)
			return compiledLane
		})
	)
}

function tasksForLane(lane: Lane, board: Board) {
	const tasks = board.tasks
		.filter(task => task.lane === lane.id)

	return tasks.map(task => {
		let users = board.users.filter(user => task.users.indexOf(user.id) !== -1)
		return (
			<TaskView key={ task.id } task={ task } users={ users } />
		)
	})
}
