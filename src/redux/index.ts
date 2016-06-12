import { Provider, Connect, connect as reduxConnect } from 'react-redux'
import { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux'

import { createStore } from './setup'
import { Board } from '../models'
import { State, defaultState } from './state'
import { ActionType, Action } from './actions'
import { reducer } from './reducer'
import * as actions from './actions'

export { actions, State, ActionType, Action, Provider }
export type Store = ReduxStore<State, Action<any>>;
export type Dispatch = ReduxDispatch<State, Action<any>>;

export function setupRedux(board: Board): Store {
	let store = createStore<State, Action<any>>(reducer, defaultState(board))
	return store
}

export var connect: Connect<State, Action<any>, Dispatch> = reduxConnect
