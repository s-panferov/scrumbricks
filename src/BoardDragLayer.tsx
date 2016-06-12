import * as React from 'react'
import * as Radium from 'radium'

import { Task, Board } from './models'
import { TaskView } from './task'
import { DragLayer, ClientOffset } from 'react-dnd'
import { TransformProps } from './svg-canvas'

interface BoardProps {
	board: Board
}

interface DragLayerProps {
	item?: Task
	itemType?: string
	initialSourceOffset?: ClientOffset
	diff?: ClientOffset
	isDragging?: boolean
}

type P = BoardProps & DragLayerProps & TransformProps

@DragLayer<P>(monitor => ({
	item: monitor.getItem(),
	itemType: monitor.getItemType(),
	initialSourceOffset: monitor.getInitialSourceClientOffset(),
	diff: monitor.getDifferenceFromInitialOffset(),
	isDragging: monitor.isDragging()
}))
@Radium
export class BoardDragLayer extends React.Component<P, any> {

	render() {
		let transform = this.props.viewMatrixTransform
		let style = { transform }
		return (
			<div style={[ styles.boardDragLayer, style ]}>
				{ this.renderDragItem() }
			</div>
		)
	}

	renderDragItem?() {
		let { itemType, item, board } = this.props
		if (!itemType) { return null }

		let margin = { x: 10, y: 10 }
		let diff = this.props.diff
		let offset = this.props.initialSourceOffset
		let point = this.props.translateMouseEvent({
			x: offset.x + diff.x - margin.x,
			y: offset.y + diff.y - margin.y
		})

		const transform = `translate(${point.x}px, ${point.y}px)`

		const style = {
			position: 'absolute',
			top: 0,
			left: 0,
			zIndex: 1,
			pointerEvents: 'none',
			transform
		}

		return (
			<div style={ style }>
				<TaskView task={ item } users={ board.users } />
			</div>
		)
	}
}

const styles = {
	boardDragLayer: {
		position: 'absolute',
		margin: 0,
		padding: 0,
		top: 0,
		left: 0,
		transformOrigin: '0 0'
	}
}
