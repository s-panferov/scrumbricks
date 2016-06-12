/// <reference path="./defines.d.ts" />

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
let { AppContainer } = require('react-hot-loader')

import { App } from './ui/app'
import { setupRedux, Provider } from './redux'

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

import { initialBoard } from './setup'
let store = setupRedux(initialBoard);

export function render(reactApp: HTMLElement, AppImpl = App) {
	const AppWithDragContext = DragDropContext(HTML5Backend)(AppImpl)

	ReactDOM.render(
		<AppContainer>
			<Provider store={ store }>
				<AppWithDragContext>
					<AppImpl />
				</AppWithDragContext>
			</Provider>
		</AppContainer>,
		reactApp
	)
}

if (module.hot) {
	module.hot.accept('./ui/app.tsx', () => {
		render(reactApp, require('./ui/app.tsx').App)
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
