import { Board } from './models';

export const initialBoard: Board = {
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
