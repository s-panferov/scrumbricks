export interface Board {
	width: number
	lanes: Lane[]
	streams?: Stream[]
	tasks?: Task[]
	users?: User[]
}

export interface Lane {
	id: string
	title: string
	flex: number
}

export interface Stream {
	title: string
}

export interface User {
	id: string
	name: string
	email: string
}

export interface Task {
	id: string
	title: string
	users: string[]
	lane: string
}
