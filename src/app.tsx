/// <reference path="./defines.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Radium from 'radium';
import { SvgCanvas } from './svg-canvas';
import { Lane } from './lane';

import { Board, board } from './setup';

@Radium
class App extends React.Component<any, any> {
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
                        />
                    );
                    currentOffset += laneWidth;
                    return compiledLane;
                })
            }
        </g>
    );
}

const styles = {
    app: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
};

export function runApp() {
    let reactApp = document.createElement('div');
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.margin = '0px';
    document.body.style.padding = '0px';
    reactApp.id = 'react-app';
    reactApp.style.height = '100%';
    document.body.appendChild(reactApp);

    render(reactApp);
}

export function render(reactApp: HTMLElement) {
    ReactDOM.render(
        <App />,
        reactApp
    );
}

export function webFont() {
    (window as any).WebFontConfig = {
        google: { families: ['Roboto:400,300,500,700:latin,cyrillic'] }
    };
    (function () {
        const wf = document.createElement('script');
        wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = true;
        const s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
    })();
}

webFont();
runApp();
