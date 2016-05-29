export function getScale(viewMatrix: SVGMatrix) {
    return viewMatrix.a;
}

export function getOriginX(viewMatrix: SVGMatrix) {
    return this.props.viewMatrix.e;
}

export function getOriginY(viewMatrix: SVGMatrix) {
    return this.props.viewMatrix.f;
}

export interface Point {
    x: number;
    y: number;
}
