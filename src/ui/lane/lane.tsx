import * as React from 'react'
import * as Radium from 'radium'
import * as theme from '../theme'

interface LaneUIProps extends React.CommonProps {
	title: string
}

@Radium
export class LaneUI extends React.Component<LaneUIProps, any> {
	render() {
		return (
			<div style={ styles.lane }>
				<div style={ styles.header }>
					<div style={ styles.text }>{ this.props.title }</div>
				</div>
				<div style={ styles.body }>
					{ this.props.children }
				</div>
			</div>
		)
	}
}

const styles = {
	lane: {
		minWidth: '300px',
		borderRight: '1px solid #ccc',
		borderTop: '1px solid #ccc',
		borderBottom: '1px solid #ccc',
	},
	header: {
		borderBottom: '1px solid #ccc',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '30px',
	},
	text: {
		fontFamily: theme.font,
		fontSize: 12,
		fill: '#666'
	} as React.CSSProperties,
	body: {

	}
}
