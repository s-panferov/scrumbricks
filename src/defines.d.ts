/// <reference path='../typings/tsd.d.ts' />
/// <reference path='../node_modules/typescript/lib/lib.es6.d.ts' />
/// <reference path='./typings/react-common.d.ts' />
/// <reference path='./typings/redux.d.ts'/>
/// <reference path='./typings/react-redux.d.ts'/>
/// <reference path='./typings/redux-thunk.d.ts'/>
/// <reference path='./typings/react-dnd.d.ts'/>
/// <reference path='./typings/history.d.ts'/>

interface NodeModule {
    hot: {
        accept: (name: string, cb: () => any) => void
    };
}

declare const NODE_ENV: string;

/**
 * Type declarations for Webpack runtime.
 */

interface WebpackRequireEnsureCallback {
    (req: WebpackRequire): void;
}

interface WebpackRequire {
    (id: string): any;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure(ids: string[], callback: WebpackRequireEnsureCallback, chunkName?: string): void;
    context(directory: string, useSubDirectories?: boolean, regExp?: RegExp): WebpackContext;
}

interface WebpackContext extends WebpackRequire {
    keys(): string[];
}

interface NodeRequire extends WebpackRequire {

}
