import * as React from 'react';
import * as ReactDOM from 'react-dom';

class App extends React.Component<any, any> {
    render() {
        return <h1>Hello</h1>
    }
}

export function runApp() {
    let reactApp = document.createElement('div');
    reactApp.id = 'react-app';
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