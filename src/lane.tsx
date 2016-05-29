import * as React from 'react';
import * as Radium from 'radium';

interface LaneProps {
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
                    style={ styles.text }
                    x={ textX }
                    y={ 15 }
                    textAnchor='middle'
                >
                    { title }
                </text>
                <line
                    style={ styles.line }
                    x1={ left }
                    y1={ 20 }
                    x2={ left + width }
                    y2={ 20 }
                />
                <line
                    style={ styles.line }
                    x1={ left + width }
                    y1={ 0 }
                    x2={ left + width }
                    y2={ '100vh' }
                />
            </g>
        );
    }
}

const styles = {
    line: {
        fill: 'red',
        stroke: 'red',
    } as React.CSSProperties,
    text: {
        fontFamily: '"Roboto", sans-serif'
    } as React.CSSProperties
};
