export type Color = {
    r: number,
    g: number,
    b: number,
    a?: number,
}

export type Camera = {
    x: number,
    y: number,
    scale: number,
}

export type Point = {
    x: number,
    y: number,
}

export enum LayerType {
    Text,
    Sticky,
    Rectangle,
    Ellipse,
    Pencil
}

export type RectangleLayer = {
    type: LayerType.Rectangle,
    id: string,
    fill: Color,
    stroke: Color,
    position: Point,
    size: Point,
    rotation: number,
    value?: string,
}

export type EllipseLayer = {
    type: LayerType.Ellipse,
    id: string,
    fill: Color,
    stroke: Color,
    position: Point,
    size: Point,
    rotation: number,
    value?: string,
}

export type PathLayer = {
    type: LayerType.Pencil,
    id: string,
    stroke: Color,
    position: Point,
    fill: Color,
    size: Point,
    points: Point[],
    value?: string,
}

export type TextLayer = {
    type: LayerType.Text,
    id: string,
    stroke: Color,
    position: Point,
    size: Point,
    fill: Color,
    rotation: number,
    value?: string,
    fontSize: number
}

export type NoteLayer = {
    type: LayerType.Sticky,
    id: string,
    fill: Color,
    stroke: Color,
    position: Point,
    size: Point,
    rotation: number,
    value?: string,
    fontSize: number
}

export type XYWH = {
    x: number,
    y: number,
    w: number,
    h: number,
}

export enum Side {
    Left = 1,
    Bottom = 2,
    Right = 4,
    Top = 8,
}

export type  CanvasState = 
    {
        mode: CanvasMode.None,
    } |
    {
        mode: CanvasMode.Processing,
    } |
    {
        mode: CanvasMode.SelectionNet,
        origin: Point,
        position?: Point,
    } |
    {
        mode: CanvasMode.Translating,
        position?: Point,
    } |
    {
        mode: CanvasMode.Inserting,
        layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Sticky | LayerType.Pencil
    } |
    {
        mode: CanvasMode.Resizing,
        initialBounds: XYWH,
        side: Side,
    } |
    {
        mode: CanvasMode.Pencil,
    } |
    {
        mode: CanvasMode.Pressing,
        origin: Point,
    } |
    {
        mode: CanvasMode.Drawing
    } | 
    {
        mode: CanvasMode.Panning,
        origMousePos: Point,
        origCameraPos: Camera,
    }


export enum CanvasMode {
    None,
    Processing,
    SelectionNet,
    Translating,
    Inserting,
    Resizing,
    Pencil,
    Pressing,
    Drawing,
    Panning
}

export type Layer = RectangleLayer | EllipseLayer | PathLayer | TextLayer | NoteLayer