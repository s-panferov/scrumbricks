import * as React from 'react';
import * as Radium from 'radium';
import { SvgCanvas } from './svg-canvas';
import { Lane } from './lane';
import { Task } from './task';
import { Lane as LaneModel, Board, board } from './setup';

@Radium
export class App extends React.Component<any, any> {
    render() {
        return (
            <div style={ styles.app }>
                <SvgCanvas
                    renderBackground={ false }
                    svgLayerNodes={[
                        build(board)
                    ]}
                >
                </SvgCanvas>
            </div>
        );
    }
}

function build(board: Board) {
    let { width, lanes } = board;
    let totalFlex = lanes.reduce<number>((acc, lane) => acc + lane.flex, 0);
    let currentOffset = 0;
    return (
        <g key='board'>
            {
                lanes.map(lane => {
                    let laneWidth = width / totalFlex * lane.flex;
                    let compiledLane = (
                        <Lane
                            key={ lane.title }
                            title={ lane.title }
                            left={ currentOffset }
                            width={ laneWidth }
                        >
                            { tasksForLane(lane, board, currentOffset, laneWidth) }
                        </Lane>
                    );
                    currentOffset += laneWidth;
                    return compiledLane;
                })
            }
        </g>
    );
}

function tasksForLane(lane: LaneModel, board: Board, left: number, width: number) {
    const tasks = board.tasks
        .filter(task => task.lane === lane.id);

    return tasks.map(task => {
        let users = board.users.filter(user => task.users.indexOf(user.id) !== -1);
        return (
            <Task task={ task } users={ users } left={ left + 10 } top={ 30 } />
        );
    });
}

const styles = {
    app: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
};
