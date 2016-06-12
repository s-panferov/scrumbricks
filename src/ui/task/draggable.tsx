import * as React from 'react'
import { DragType } from '../drag'
import { Task } from '../../models'
import { TaskUI, TaskUIProps } from './task'
import { getEmptyImage } from 'react-dnd-html5-backend'
import {
	DragSource,
	DragSourceSpec,
	DragSourceConnector,
	DragSourceMonitor,
	DragElementWrapper
} from 'react-dnd'

interface DragProps {
	connectDragSource?: DragElementWrapper<any>
	connectDragPreview?: DragElementWrapper<any>
	isDragging?: boolean
}

type P = TaskUIProps & DragProps;

const source: DragSourceSpec<TaskUIProps> = {
	beginDrag(props): Task {
		return props.task
	}
}

function collect(connect: DragSourceConnector, monitor: DragSourceMonitor): DragProps {
	return {
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		isDragging: monitor.isDragging()
	}
}

@DragSource<P>(DragType.Task, source, collect)
export class DraggableTask extends React.Component<P, void> {
	componentDidMount?() {
		this.props.connectDragPreview(getEmptyImage(), {
			captureDraggingState: true
		})
	}

	render() {
		let { connectDragSource, isDragging } = this.props
		let style = {
			opacity: isDragging
				? 0
				: 1
		}
		return (
			<TaskUI
				{ ...this.props }
				style={[ this.props.style, style ]}
				connectDragSource={ connectDragSource }
			/>
		)
	}
}
