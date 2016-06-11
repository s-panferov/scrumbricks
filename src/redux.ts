import { compose } from 'redux'
export { Provider } from 'react-redux'
import * as thunk from 'redux-thunk'

import {
	createStore as createStore_,
	applyMiddleware,
	Store
} from 'redux'

let prevState: any = null
const logger = (store: any) => (next: any) => (action: any) => {
	console.log('dispatching', action)
	let result = next(action)
	let state = store.getState()
	console.log('next state', state)
	prevState = state
	return result
}

export function createStore<S, A>(reducer: any, initialState: S): Store<S, A> {
	const finalCreateStore = compose(
		applyMiddleware((thunk as any).default || thunk, logger)
	)(createStore_)

	let store = finalCreateStore(reducer, initialState)

	return store
}
