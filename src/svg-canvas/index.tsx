import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Radium from 'radium';
import autobind from '../lib/autobind';

import SvgLayer from './svg-layer';
import Background from './bg';
import ResizeSensor from '../resize-sensor';

import { Point } from './utils';

export interface SvgCanvasProps extends React.CommonProps {
    htmlProps?: React.DOMAttributes;
    maxScale?: number;
    minScale?: number;

    renderTopRuller?: boolean;
    renderLeftRuller?: boolean;

    defaultScale?: number;
    svgLayerNodes?: React.ReactNode;
    metaWheel?: boolean;
    metaDrag?: boolean;

    onScaleApplied?: (scale: number) => void;
}

export interface SvgCanvasState {
    inMove?: boolean;
    drag?: Point;
    scale?: number;
    origin?: Point;
    width?: number;
    height?: number;
}

@Radium
export class SvgCanvas extends React.Component<SvgCanvasProps, SvgCanvasState> {
    static defaultProps = {
        maxScale: 10,
        minScale: 1/10,
        defaultScale: 1,
        metaWheel: false,
        metaDrag: false,
        renderTopRuller: true,
        renderLeftRuller: true
    };

    viewMatrix: SVGMatrix;
    viewMatrixComponents: number[];
    viewMatrixTransform: string;

    refs: {
        [key: string]: React.Component<any, any>;
        svgLayer: SvgLayer
        viewport: React.Component<any, any>
    };

    constructor(props: SvgCanvasProps) {
        super(props);

        this.state = {
            inMove: false,
            scale: 1,
            origin: { x: 0, y: 0 },
            drag: null,
        };
    }

    componentWillMount() {
        let viewMatrix = (document.createElementNS('http://www.w3.org/2000/svg', 'svg') as any).createSVGMatrix();
        this.updateViewMatrix(viewMatrix);
    }

    componentDidMount() {
        this.onResize();
    }

    componentDidUpdate(prevProps: SvgCanvasProps, prevState: SvgCanvasState) {
        if (prevState.scale !== this.state.scale) {
            if (this.props.onScaleApplied) {
                this.props.onScaleApplied(this.state.scale);
            }
        }
    }

    componentWillReceiveProps(nextProps: SvgCanvasProps) {
        if (nextProps.defaultScale !== this.props.defaultScale
            && nextProps.defaultScale !== this.state.scale) {

            let el = ReactDOM.findDOMNode(this);
            let bounds = el.getBoundingClientRect();

            this.zoomTo(
                bounds.left + bounds.width / 2,
                bounds.top + bounds.height / 2,
                this.state.scale - nextProps.defaultScale
            );
        }
    }

    render(): React.ReactElement<any> {
        return (
            <div
                { ...this.props.htmlProps }
                style={ styles.index }
                onMouseMove={ this.onMouseMove }
                onTouchMove={ this.onTouchMove }
                onMouseLeave={ this.onMouseUp }
                onMouseDown={ this.onMouseDown }
                onTouchStart={ this.onTouchStart }
                onMouseUp={ this.onMouseUp }
                onTouchEnd={ this.onTouchEnd }
                onTouchCancel={ this.onTouchCancel }
                onWheel={ this.onWheel }
            >
                <div key='viewport' style={ styles.viewport } ref='viewport'>
                    <SvgLayer
                        key='svg-layer'
                        ref='svgLayer'
                        viewMatrix={ this.viewMatrix }
                        viewMatrixComponents={ this.viewMatrixComponents }
                        viewMatrixTransform={ this.viewMatrixTransform }
                        fixed={
                            <Background
                                key='bg'
                                viewMatrix={ this.viewMatrix }
                                origin={ this.state.origin }
                                width={ this.state.width }
                                height={ this.state.height }
                                scale={ this.state.scale }
                            />
                        }
                    >
                        { this.props.svgLayerNodes }
                    </SvgLayer>
                    { this.renderLayers() }
                    <ResizeSensor key='sensor' onResize={ this.onResize } />
                </div>
            </div>
        );
    }

    renderLayers() {
        let props = {
            viewMatrix: this.viewMatrix,
            viewMatrixTransform: this.viewMatrixTransform,
            viewMatrixComponents: this.viewMatrixComponents,
            origin: this.state.origin,
            width: this.state.width,
            height: this.state.height,
            scale: this.state.scale,
            translateMouseEvent: this.translateMouseEvent
        };
        return React.Children.toArray(this.props.children)
            .filter(Boolean)
            .map(child => {
                return React.cloneElement(child as any, props);
            });
    }

    @autobind
    onResize() {
        let el = ReactDOM.findDOMNode(this.refs.viewport);
        this.setState({
            width: el.clientWidth,
            height: el.clientHeight,
        });
    }

    finishMoving() {
        this.setState({
            drag: null,
            inMove: false
        });
    }

    @autobind
    onMouseUp() {
        this.finishMoving();
    }

    @autobind
    onTouchEnd() {
        this.finishMoving();
    }

    startMoving(point: Point) {
        this.setState({
            inMove: true,
            drag: point
        });
    }

    @autobind
    onMouseDown(e: React.MouseEvent) {
        if (!this.props.metaDrag || (e.nativeEvent as any).metaKey) {
            this.startMoving({ x: e.clientX, y: e.clientY });
        }
    }

    @autobind
    onTouchStart(e: React.TouchEvent) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.startMoving({ x: touch.clientX, y: touch.clientY });
        }
    }

    @autobind
    onWheel(e: React.WheelEvent) {
        if (!this.props.metaWheel || (e.nativeEvent as any).metaKey) {
            this.zoomTo((e as any).clientX, (e as any).clientY, e.deltaY / 200);
            e.preventDefault();
            e.stopPropagation();
        }
    }

    moveTo(point: Point) {
        const { x, y }: Point = this.state.drag || point;

        let zoomMat: SVGMatrix;

        zoomMat = this.viewMatrix
            .translate(
                (point.x - x) / this.state.scale,
                (point.y - y) / this.state.scale
            );

        this.updateViewMatrix(zoomMat);

        let p = this.cursorPoint({ x: 0, y: 0 }, zoomMat);
        let scale = this.state.scale;

        this.setState({
            drag: { x: point.x, y: point.y },
            origin: { x: -p.x * scale, y: -p.y * scale },
        });
    }

    @autobind
    onMouseMove(e: React.MouseEvent) {
        if (this.state.inMove) {
            this.moveTo({x: e.clientX, y: e.clientY});
        }
    }

    @autobind
    onTouchMove(e: React.TouchEvent) {
        if (this.state.inMove && e.touches.length === 1) {
            e.preventDefault();
            const touch = e.touches[0];
            this.moveTo({ x: touch.clientX, y: touch.clientY });
        }
    }

    @autobind
    onTouchCancel() {
        this.finishMoving();
    }

    // Get point in global SVG space
    cursorPoint(pos: { x: number, y: number }, matrix?: SVGMatrix): SVGPoint {
        // Create an SVGPoint for future math
        let canvas = this.refs.svgLayer.getCanvas();
        let pt = canvas.createSVGPoint();
        pt.x = pos.x; pt.y = pos.y;
        if (!matrix) {
            matrix = canvas.getScreenCTM();
        }
        return pt.matrixTransform(matrix.inverse());
    }

    @autobind
    translateMouseEvent(e: { clientX: number, clientY: number}): Point {
        let canvas = this.refs.svgLayer.getCanvas();
        let pt = canvas.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const matrix = canvas.getScreenCTM();
        pt = pt.matrixTransform(matrix.inverse());
        pt = pt.matrixTransform(this.viewMatrix.inverse());
        return {
            x: pt.x,
            y: pt.y
        };
    }

    zoomTo(pointX: number, pointY: number, scaleD: number) {
        // TODO min max scale to props
        const scale = Math.min(
            this.props.maxScale,
            Math.max(
                this.props.minScale,
                this.state.scale - scaleD
            )
        );

        let zoomMat: SVGMatrix;
        zoomMat = this.viewMatrix;

        let applyScale = scale / this.state.scale;
        let p = this.cursorPoint({ x: pointX, y: pointY });
        p = this.cursorPoint(p, zoomMat);

        zoomMat = zoomMat
            .translate(p.x, p.y)
            .scale(applyScale)
            .translate(-p.x, -p.y);

        let { x, y } = this.cursorPoint({ x: 0, y: 0 }, zoomMat);

        this.updateViewMatrix(zoomMat);
        let origin = { x: -x * scale, y: -y * scale };

        this.setState({
            scale,
            origin
        });
    }

    focus(width: number, height: number, scaleMultiplier = 1) {
        let zoomMat = this.viewMatrix;
        let scale = this.state.scale;
        let viewWidth = this.state.width;
        let viewHeight = this.state.height;

        let initialWidth = width;
        let initialHeight = height;

        let targetScaleX = viewWidth / width;
        let targetScaleY = viewHeight / height;
        let targetScale = Math.min(targetScaleX, targetScaleY);
        targetScale = targetScale * scaleMultiplier;

        if (targetScale < this.props.minScale) { targetScale = this.props.minScale; }
        if (targetScale > this.props.maxScale) { targetScale = this.props.maxScale; }

        let scaleAmount = targetScale/scale;
        zoomMat = zoomMat.scale(scaleAmount);

        let scaledWidth = initialWidth * targetScale;
        let scaledHeight = initialHeight * targetScale;

        let targetMoveX = -(this.state.origin.x / targetScale) + ((viewWidth - scaledWidth) / 2) / targetScale;
        let targetMoveY = -(this.state.origin.y / targetScale) + ((viewHeight - scaledHeight) / 2) / targetScale;

        zoomMat = zoomMat
            .translate(
                targetMoveX,
                targetMoveY
            );

        this.updateViewMatrix(zoomMat);
        let p = this.cursorPoint({ x: 0, y: 0 }, zoomMat);

        this.setState({
            scale: targetScale,
            origin: { x: -p.x * targetScale, y: -p.y * targetScale },
        });
    }

    updateViewMatrix(viewMatrix: SVGMatrix) {
        this.viewMatrix = viewMatrix;
        this.viewMatrixComponents = [
            viewMatrix.a, viewMatrix.b, // x scaling
            viewMatrix.c, viewMatrix.d, // y scaling
            viewMatrix.e, viewMatrix.f  // translate
        ];

        this.viewMatrixTransform = `matrix(${this.viewMatrixComponents.join(', ')})`;
    }
}

const styles = {
    index: {
        position: 'relative',
        margin: 0,
        padding: 0,
        flex: '1 1 auto',
        overflow: 'hidden',
    },
    viewport: {
        backgroundColor: '#fff',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
};
