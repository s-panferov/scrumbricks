/// <reference path="./defines.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Radium from 'radium';
import { SvgCanvas } from './svg-canvas';

@Radium
class App extends React.Component<any, any> {
    render() {
        return (
            <div style={ styles.app }>
                <SvgCanvas>

                </SvgCanvas>
            </div>
        );
    }
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

runApp();