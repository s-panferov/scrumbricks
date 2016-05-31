export interface Board {
    width: number;
    lanes: Lane[];
    streams?: Stream[];
    tasks?: Task[];
    users?: User[];
}

export interface Lane {
    id: string;
    title: string;
    flex: number;
}

export interface Stream {
    title: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Task {
    id: string;
    title: string;
    users: string[];
    lane: string;
}

export const board: Board = {
    width: 2000,
    lanes: [
        { id: 'todo', title: 'TODO', flex: 1 },
        { id: 'inprogress', title: 'IN PROGRESS', flex: 2 },
        { id: 'toverify', title: 'TO VERIFY', flex: 1 },
        { id: 'done', title: 'DONE', flex: 2 },
    ],
    tasks: [
        {
            id: 'SB-1',
            title: 'Check how tasks works',
            users: [ 'spanferov' ],
            lane: 'todo'
        }
    ],
    users: [
        { id: 'spanferov', name: 'Stanislav Panferov', email: 'fnight.m@gmail.com' }
    ]
};
