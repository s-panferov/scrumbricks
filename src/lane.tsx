import * as React from 'react';
import * as Radium from 'radium';
import * as theme from './theme';

interface LaneProps extends React.CommonProps {
    left: number;
    width: number;
    title: string;
}

@Radium
export class Lane extends React.Component<LaneProps, any> {
    render() {
        let { left, width, title } = this.props;
        let textX = left + width/2;
        return (
            <g>
                <text
                    key='title'
                    style={ styles.text }
                    x={ textX }
                    y={ 15 }
                    textAnchor='middle'
                >
                    { title }
                </text>
                <line
                    key='top-header-line'
                    style={ styles.line }
                    x1={ left }
                    y1={ 0 }
                    x2={ left + width }
                    y2={ 0 }
                />
                <line
                    key='bottom-header-line'
                    style={ styles.line }
                    x1={ left }
                    y1={ 20 }
                    x2={ left + width }
                    y2={ 20 }
                />
                <line
                    key='left-line'
                    style={ styles.line }
                    x1={ left }
                    y1={ 0 }
                    x2={ left }
                    y2={ '100vh' }
                />
                <line
                    key='right-line'
                    style={ styles.line }
                    x1={ left + width }
                    y1={ 0 }
                    x2={ left + width }
                    y2={ '100vh' }
                />
                <g key='tasks'>
                    { this.props.children }
                </g>
            </g>
        );
    }
}

const styles = {
    line: {
        fill: '#999',
        stroke: '#999',
    } as React.CSSProperties,
    text: {
        fontFamily: theme.font,
        fontSize: 12,
        fill: '#666'
    } as React.CSSProperties
};
