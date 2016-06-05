import * as React from 'react';
import * as Radium from 'radium';
import { SvgCanvas } from './svg-canvas';
import { BoardView } from './board';
import { initialBoard } from './setup';
import { HtmlLayer } from './svg-canvas/html-layer';
import * as theme from './theme';

@Radium
export class App extends React.Component<any, any> {
    render() {
        return (
            <div style={ styles.app }>
                <SvgCanvas
                    renderBackground={ false }
                >
                    <HtmlLayer>
                        <BoardView board={ initialBoard } />
                    </HtmlLayer>
                </SvgCanvas>
            </div>
        );
    }
}

const styles = {
    app: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        font: theme.font
    },
};
