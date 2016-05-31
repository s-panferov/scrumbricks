import * as React from 'react';
import * as Radium from 'radium';
import { getGravatarUrl } from './lib/gravatar';

import { Task as TaskModel, User } from './setup';

interface TaskProps {
    task: TaskModel;
    users: User[];
    top: number;
    left: number;
}

@Radium
export class Task extends React.Component<TaskProps, any> {
    render() {
        const { task, users, top, left } = this.props;
        return (
            <g style={{ transform: `translate(${left}px,${top}px)` }}>
                <rect key='back' x='0' y='0' width='300' height='100' style={ styles.rect } />
                <text key='id' x='10' y='20'>{ task.id }</text>
                <text key='title' x='10' y='40'>{ task.title }</text>
                <image
                    key='avatar'
                    xlinkHref={ getGravatarUrl(users[0].email) }
                    x='265'
                    y='65'
                    height='30px'
                    width='30px'
                >
                    { task.title }
                </image>
            </g>
        );
    }
}

const styles = {
    rect: {
        fill: '#f0f0f0',
    }
};
