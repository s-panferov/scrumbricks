declare module 'redux-thunk' {
    import * as redux from 'redux';

    let thunk: redux.Middleware<any, any>;
    export = thunk;
}
