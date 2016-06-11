import * as React from 'react'
import * as Radium from 'radium'

import { getGravatarUrl } from './lib/gravatar'

interface AvatarProps extends React.CommonProps {
	src?: string
	gravatar?: string
	size?: number
}

@Radium
export class Avatar extends React.Component<AvatarProps, any> {
	static defaultProps = {
		size: 20
	}

	render() {
		let url = this.props.src || getGravatarUrl(this.props.gravatar, 40)
		let style = {
			backgroundImage: `url(${ url })`
		}

		return (
			<div style={[ s.avatar, style, this.props.style ]} />
		)
	}
}

const s = {
	avatar: {
		borderRadius: '50%',
		backgroundSize: 'cover',
		width: 20,
		height: 20
	}
}
