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
        { title: 'To Do', flex: 1 },
        { title: 'In Progress', flex: 2 },
        { title: 'To Verify', flex: 1 },
        { title: 'Done', flex: 2 },
    ]
};
