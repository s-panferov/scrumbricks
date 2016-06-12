import * as React from 'react'
import * as Radium from 'radium'
import { SvgCanvas } from './svg-canvas'
import { Board } from '../models'
import { BoardUI, BoardDragLayer } from './board'
import * as theme from './theme'
import { connect } from '../redux'

interface AppReduxProps {
	board?: Board
}

type P = AppReduxProps

@connect(state => {
	return {
		board: state.board
	}
})
@Radium
export class App extends React.Component<P, any> {
	render() {
		let { board } = this.props
		return (
			<div style={ styles.app }>
				<SvgCanvas
					renderBackground={ false }
				>
					<BoardUI board={ board } />
					<BoardDragLayer board={ board } />
				</SvgCanvas>
			</div>
		)
	}
}

const styles = {
	app: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		font: theme.font
	},
}
