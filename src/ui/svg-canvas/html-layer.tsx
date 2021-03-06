import * as React from 'react'
import * as Radium from 'radium'
import { TransformProps } from './index'

export interface HtmlLayerProps extends React.CommonProps, TransformProps  {
	htmlProps?: React.DOMAttributes
	fixed?: React.ReactNode
}

export interface HtmlLayerState { }

@Radium
export class HtmlLayer extends React.Component<HtmlLayerProps, HtmlLayerState> {
	static defaultProps = {
		viewMatrix: SVGMatrix
	}

	refs: {
		[key: string]: any
		canvas: SVGSVGElement
	}

	getCanvas(): SVGSVGElement {
		return this.refs.canvas
	}

	render(): React.ReactElement<any> {
		let style = {
			transform: this.props.viewMatrixTransform
		}

		return (
			<div
				{ ...this.props.htmlProps }
				style={ styles.index }
			>
				<div key='trans' style={[ style, styles.index ]}>
					{ this.props.children }
				</div>
				{ this.props.fixed }
			</div>
		)
	}
}

const styles = {
	index: {
		position: 'absolute',
		margin: 0,
		padding: 0,
		top: 0,
		left: 0,
		transformOrigin: '0 0'
	}
}
