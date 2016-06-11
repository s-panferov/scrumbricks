/// <reference path="./defines.d.ts" />

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { App } from './app'

let { AppContainer } = require('react-hot-loader')

let reactApp: HTMLElement
export function runApp() {
	reactApp = document.createElement('div')
	document.documentElement.style.height = '100%'
	document.body.style.height = '100%'
	document.body.style.margin = '0px'
	document.body.style.padding = '0px'
	reactApp.id = 'react-app'
	reactApp.style.height = '100%'
	document.body.appendChild(reactApp)

	render(reactApp)
}

export function render(reactApp: HTMLElement, AppImpl = App) {
	ReactDOM.render(
		<AppContainer>
			<AppImpl />
		</AppContainer>,
		reactApp
	)
}

if (module.hot) {
	module.hot.accept('./app.tsx', () => {
		render(reactApp, require('./app.tsx').App)
	})
}

export function webFont() {
	(window as any).WebFontConfig = {
		google: { families: ['Roboto:400,300,500,700:latin,cyrillic'] }
	};
	(function () {
		const wf = document.createElement('script')
		wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js'
		wf.type = 'text/javascript'
		wf.async = true
		const s = document.getElementsByTagName('script')[0]
		s.parentNode.insertBefore(wf, s)
	})()
}

webFont()
runApp()
