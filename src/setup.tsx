export interface Board {
    width: number;
    lanes: Lane[];
    streams?: Stream[];
}

export interface Lane {
    title: string;
    flex: number;
}

export interface Stream {
    title: string;
}

export const board: Board = {
    width: 2000,
    lanes: [
        { title: 'TODO', flex: 1 },
        { title: 'IN PROGRESS', flex: 2 },
        { title: 'TO VERIFY', flex: 1 },
        { title: 'DONE', flex: 2 },
    ]
};
