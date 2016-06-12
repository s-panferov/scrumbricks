import * as React from 'react'

export interface SvgLayerProps extends React.CommonProps  {
	htmlProps?: React.HTMLAttributes
	viewMatrix?: SVGMatrix
	viewMatrixTransform?: string
	viewMatrixComponents?: number[]
	fixed?: React.ReactNode
}

export interface SvgLayerState { }

export default class SvgLayer extends React.Component<SvgLayerProps, SvgLayerState> {
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
		return (
			<svg
				ref='canvas'
				{ ...this.props.htmlProps }
				style={ styles.index }
			>
				{ this.props.fixed }
				<g key='trans' transform={ this.props.viewMatrixTransform }>
					{ this.props.children }
				</g>
			</svg>
		)
	}
}

const styles = {
	index: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		pointerEvents: 'none'
	}
}

