import { FSA, SafeFSA, Dispatch as ReduxDispatch } from 'redux'
import { State } from './state'

export type Action<P> = FSA<ActionType, P, {}>;
export type SafeAction<P> = SafeFSA<ActionType, P, {}>;
type Dispatch<A> = ReduxDispatch<State, A>;
type GetState = () => State;

export enum ActionType {

}
