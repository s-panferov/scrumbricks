import * as React from 'react'
import * as Radium from 'radium'

import { LaneView } from '../lane'
import { DraggableTask } from '../task'
import { Lane, Board } from '../../models'
import { TransformProps } from '../svg-canvas'

interface BoardUIProps {
	board: Board
}

type P = BoardUIProps & TransformProps

@Radium
export class BoardUI extends React.Component<P, any> {

	render() {
		let transform = this.props.viewMatrixTransform
		let style = { transform }
		return (
			<div style={[ styles.board, style ]}>
				{ build(this.props.board) }
			</div>
		)
	}
}

const styles = {
	board: {
		display: 'flex',
		flexDirection: 'row',
		position: 'absolute',
		margin: 0,
		padding: 0,
		top: 0,
		left: 0,
		transformOrigin: '0 0'
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
			<DraggableTask key={ task.id } task={ task } users={ users } />
		)
	})
}
