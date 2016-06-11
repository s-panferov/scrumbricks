import * as React from 'react'
import { Point } from './utils'

export interface BackgroundProps extends React.CommonProps  {
	htmlProps?: React.DOMAttributes
	viewMatrix: SVGMatrix
	width?: number
	height?: number
	origin?: Point
	scale?: number
}

export interface BackgroundState { }

export default class Background extends React.Component<BackgroundProps, BackgroundState> {
	static defaultProps = {
		viewMatrix: SVGMatrix,
		vertical: false
	}

	render(): React.ReactElement<any> {
		let style = {
			width: this.props.width,
			height: this.props.height,
		}
		return (
			<g { ...{ style: style } }>
				<pattern id='bg-pattern' patternUnits='userSpaceOnUse' width='20' height='20'>
					<image xlinkHref={ require('./images/bg.png') } x='0' y='0' width='20' height='20' />
				</pattern>
				{ this.renderTiles() }
			</g>
		)
	}

	renderTiles() {
		let width = this.props.width
		let height = this.props.height
		let tileSize = 400
		let origin = this.props.origin
		let result: any[] = []

		let firstVisibleX = Math.floor(-origin.x / tileSize)
		let firstVisibleY = Math.floor(-origin.y / tileSize)

		let countX = Math.ceil(width / tileSize) + 1
		let countY = Math.ceil(height / tileSize) + 1

		for (let i = 0; i < countX; i++) {
			for (let j = 0; j < countY; j++) {
				let props: BackgroundTileProps  = {
					key: `bg-${firstVisibleX + i}-${firstVisibleY + j}`,
					x: origin.x + (firstVisibleX + i) * tileSize,
					y: origin.y + (firstVisibleY + j) * tileSize,
				} as any

				result.push(
					<BackgroundTile { ...props } />
				)
			}
		}

		return result
	}
}

export interface BackgroundTileProps extends React.CommonProps  {
	x: number
	y: number
}

export class BackgroundTile extends React.Component<BackgroundTileProps, void> {
	shouldComponentUpdate(nextProps: BackgroundTileProps) {
		if (
			this.props.x !== nextProps.x
			|| this.props.y !== nextProps.y
		) {
			return true
		} else {
			return false
		}
	}
	render(): React.ReactElement<any> {
		return (
			<rect
				style={{
					width: 400,
					height: 400,
					transform: `translate(${this.props.x}px,${this.props.y}px)`
				}}
				fill='url(#bg-pattern)'
			>
			</rect>
		)
	}
}
