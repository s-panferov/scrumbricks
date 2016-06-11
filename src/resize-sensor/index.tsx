import * as React from 'react';
import autobind from '../lib/autobind';

export interface ResizeSensorProps {
    onResize: () => void;
}

let queue: Set<any> = new Set();
let frame: any;

const style = {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    overflow: 'scroll',
    zIndex: -1,
    visibility: 'hidden'
};

const stylesChild = {
    position: 'absolute',
    left: 0,
    top: 0,
    visibility: 'hidden'
};

const stylesShrinkChild = Object.assign({}, stylesChild, { width: '200%', height: '200%' });

export default class ResizeSensor extends React.Component<ResizeSensorProps, void> {
    refs: {
        [key: string]: React.Component<any, any>;
        expand: any;
        expandChild: any;
        shrink: any;
        shrinkChild: any;
    };

    shouldComponentUpdate() {
        // prevents all updates because we manipulate the DOM
        return false;
    }

    componentDidMount() {
        this.attachResizeEvent();
    }

    componentWillUnmount() {
        this.detachResizeEvent();
    }

    render() {
        return (
            <div style={ style }>
                <div ref='expand' style={ style }>
                    <div ref='expandChild' style={ stylesChild }/>
                </div>
                <div ref='shrink' style= { style }>
                    <div
                        ref='shrinkChild'
                        style={ stylesShrinkChild }
                    />
                </div>
            </div>
        );
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {Function}    resized
     */
    attachResizeEvent() {
        let { expand, shrink } = this.refs;
        this.reset();
        addEvent(expand, 'scroll', this.onObjectResize);
        addEvent(shrink, 'scroll', this.onObjectResize);
    }

    reset() {
        let { expand, expandChild, shrink } = this.refs;
        expandChild.style.width  = 100000 + 'px';
        expandChild.style.height = 100000 + 'px';
        expand.scrollLeft = 100000;
        expand.scrollTop = 100000;
        shrink.scrollLeft = 100000;
        shrink.scrollTop = 100000;

        // CHANGE TO THIS IF `100000` hack will not work
        // expandChild.style.width = expand.offsetWidth + 10 + 'px';
        // expandChild.style.height = expand.offsetHeight + 10 + 'px';
        // expand.scrollLeft = expand.scrollWidth;
        // expand.scrollTop = expand.scrollHeight;
        // shrink.scrollLeft = shrink.scrollWidth;
        // shrink.scrollTop = shrink.scrollHeight;
    }

    detachResizeEvent() {
        let { expand, shrink } = this.refs;
        removeEvent(expand, 'scroll', this.onObjectResize);
        removeEvent(shrink, 'scroll', this.onObjectResize);

        if (queue.has(this.onResize)) {
            queue.delete(this.onResize);
        }
    }

    @autobind
    onResize() {
        this.reset();
        this.props.onResize();
    }

    @autobind
    onObjectResize() {
        if (!queue.has(this.onResize)) {
            queue.add(this.onResize);
        }

        if (!frame) {
            requestAnimationFrame(() => {
                queue.forEach(item => item());
                queue.clear();
                frame = null;
            });
        }
    }
}

function addEvent(el: any, name: string, cb: any) {
    if (el.attachEvent) {
        el.attachEvent('on' + name, cb);
    } else {
        el.addEventListener(name, cb);
    }
};

function removeEvent(el: any, name: string, cb: any) {
    if (el.attachEvent) {
        el.attachEvent('on' + name, cb);
    } else {
        el.removeEventListener(name, cb);
    }
}
