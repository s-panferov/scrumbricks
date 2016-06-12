import { Board } from '../models'

export interface State {
	board: Board
}

export function defaultState(board: Board) {
	return { board }
}
