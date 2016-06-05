import * as React from 'react';
import * as Radium from 'radium';
import * as theme from './theme';

import { Avatar } from './avatar';
import { Task, User } from './setup';

interface TaskProps {
    task: Task;
    users: User[];
}

@Radium
export class TaskView extends React.Component<TaskProps, any> {
    render() {
        const { task, users } = this.props;
        return (
            <div style={ s.task }>
                <div style={ s.header }>
                    <Avatar key='avatar'
                        style={ s.avatar }
                        gravatar={ users[0].email }
                    />
                    <div key='id' style={ s.id }>{ task.id }</div>
                </div>
                <div key='title' style={ s.title }>{ task.title }</div>
            </div>
        );
    }
}

const s = {
    task: {
        margin: '10px',
        padding: '5px',
        minWidth: '250px',
        minHeight: '50px',
        boxShadow: theme.shadow
    },
    avatar: {
        marginRight: '5px',
    },
    header: {
        borderBottom: '1px solid #eee',
        display: 'flex',
        alignItems: 'center',
        paddingBottom: '5px',
        marginBottom: '5px'
    },
    id: {
        fontFamily: theme.font,
        fontSize: '12px',
    },
    title: {
        fontFamily: theme.font,
        fontSize: '14px',
    }
};
