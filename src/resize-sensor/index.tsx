import * as React from 'react';

export interface ResizeSensorProps {
    onResize: () => void;
}

export default class ResizeSensor extends React.Component<ResizeSensorProps, void> {
    refs: {
        [key: string]: React.Component<any, any>;
        expand: any;
        expandChild: any;
        shrink: any;
        shrinkChild: any;
    };

    reset: () => void;

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
        let style = {
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            overflow: 'scroll',
            zIndex: -1,
            visibility: 'hidden'
        };

        let stylesChild = {
            position: 'absolute',
            left: 0,
            top: 0,
            visibility: 'hidden'
        };

        return <div className='resize-sensor' style={ style }>
            <div ref='expand' className='resize-sensor-expand' style={ style }>
                <div ref='expandChild' style={ stylesChild }/>
            </div>
            <div ref='shrink' className='resize-sensor-shrink' style= { style }>
                <div
                    ref='shrinkChild'
                    style={ Object.assign({}, stylesChild, { width: '200%', height: '200%' }) }
                />
            </div>
        </div>;
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {Function}    resized
     */
    attachResizeEvent() {
        let { expand, expandChild, shrink } = this.refs;

        let reset = function() {
            expandChild.style.width = expand.offsetWidth + 10 + 'px';
            expandChild.style.height = expand.offsetHeight + 10 + 'px';
            expand.scrollLeft = expand.scrollWidth;
            expand.scrollTop = expand.scrollHeight;
            shrink.scrollLeft = shrink.scrollWidth;
            shrink.scrollTop = shrink.scrollHeight;
        };

        reset();

        this.reset = () => {
            this.props.onResize();
            reset();
        };

        addEvent(expand, 'scroll', this.reset);
        addEvent(shrink, 'scroll', this.reset);
    }

    detachResizeEvent() {
        let { expand, shrink } = this.refs;
        removeEvent(expand, 'scroll', this.reset);
        removeEvent(shrink, 'scroll', this.reset);
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
};
