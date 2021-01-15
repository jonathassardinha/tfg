import * as createjs from 'createjs-module'
import Vertex from './Vertex';

interface drawEdgeInterface {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  angle: number;
}

export class Edge extends createjs.Container {
  private DRAW_EDGES: {[key: string]: (drawPoints: drawEdgeInterface) => any} = {
    STANDARD: (drawPoints: drawEdgeInterface) => this.drawStandardEdge(drawPoints),
    DASHED: (drawPoints: drawEdgeInterface) => this.drawDashedEdge(drawPoints),
    DOUBLE: (drawPoints: drawEdgeInterface) => this.drawDoubleEdge(drawPoints),
    DOTTED: (drawPoints: drawEdgeInterface) => this.drawDottedEdge(drawPoints),
  }

  private _arc: createjs.Shape;
  private _arcHitArea: createjs.Shape;
  private _arcMask: createjs.Shape;
  private _titleShape: createjs.Text;
  private _container: createjs.Container;
  private _arrowSize: number;
  private _arrowDistance: number;
  private _dash: number;
  private _edgeType: string;
  private _title: string;

  public static EDGE_TYPES = {
    STANDARD: 'STANDARD',
    DASHED: 'DASHED',
    DOUBLE: 'DOUBLE',
    DOTTED: 'DOTTED'
  };

  public comment: string;
  public arrowFrom: boolean;
  public arrowTo: boolean;
  public color: string;
  public fromVertex: Vertex;
  public toVertex: Vertex;
  public fromVertexText: createjs.Text;
  public toVertexText: createjs.Text;

  constructor(fromVertex: Vertex, toVertex: Vertex, color: string, edgeCallback: (event: MouseEvent, edge: Edge) => void) {
    super();

    this.color = color;
    this.fromVertex = fromVertex;
    this.toVertex = toVertex;
    this.fromVertexText = (fromVertex.getChildAt(0) as createjs.Container).getChildByName('text') as createjs.Text;
    this.toVertexText = (toVertex.getChildAt(0) as createjs.Container).getChildByName('text') as createjs.Text;
    this.arrowFrom = true;
    this.arrowTo = true;
    this._arrowDistance = 15;
    this._arrowSize = 7;
    this._edgeType = Edge.EDGE_TYPES.STANDARD;
    this._dash = 20;
    this._title = this.fromVertex.text + ' to ' + this.toVertex.text;

    this._arc = new createjs.Shape();
    this._arc.cursor = 'pointer';
    this._arcHitArea = new createjs.Shape();
    this._arc.hitArea = this._arcHitArea;
    this._titleShape = new createjs.Text(this._title, '12px Arial', 'black');
    this._titleShape.textAlign = 'center';
    this._titleShape.textBaseline = 'middle';
    this._titleShape.cursor = 'pointer';
    this._titleShape.lineWidth = 100;
    this._arcMask = new createjs.Shape();

    this._arc.mask = this._arcMask;
    this._container = new createjs.Container();
    this._container.addChild(this._arc, this._titleShape);

    this._arc.visible = true;
    this._titleShape.visible = true;
    this._container.visible = true;

    this.addChild(this._container);

    this.setupListeners(edgeCallback);
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
    this._titleShape.text = value;
  }

  get edgeType(): string {
    return this._edgeType;
  }

  set edgeType(value: string) {
    if (Object.keys(Edge.EDGE_TYPES).includes(value)) {
      this._edgeType = value;
    }
  }

  private getShapeDiff(absAngle: number, angle: number, width: number, height: number, sign: boolean) {
    let xDiff: number, yDiff: number;
    height = height/2 + this._arrowDistance;
    width = width/2 + this._arrowDistance;

    let degree = angle*(180/Math.PI);

    let isOnLeftOrRight = Math.tan(absAngle)*width <= height ? 1 : 0;

    let xSign = Math.abs(degree) < 90 ? -1 : 1;
    let ySign = (-degree/Math.abs(degree));

    if (sign) {
      xSign *= -1;
      ySign *= -1;
    }

    if (isOnLeftOrRight) {
      xDiff = width*(-xSign);
      yDiff = Math.tan(absAngle)*width*(-ySign);
    } else {
      xDiff = height/Math.tan(absAngle)*(-xSign);
      yDiff = height*(-ySign);
    }

    return {xDiff, yDiff};
  }

  private setupListeners(edgeCallback: (event: MouseEvent, edge: Edge) => void) {
    this._arc.on('tick', () => {
      if (this._arc.visible) {
        const pt1 = this.fromVertexText.localToGlobal(this.fromVertexText.x, this.fromVertexText.y);
        const pt2 = this.toVertexText.localToGlobal(this.toVertexText.x, this.toVertexText.y);

        pt1.x -= this.fromVertexText.x;
        pt1.y -= (this.fromVertexText.y - this.fromVertexText.getMeasuredHeight()/2 + this.fromVertexText.getMeasuredLineHeight()/2);
        pt2.x -= this.toVertexText.x;
        pt2.y -= (this.toVertexText.y - this.toVertexText.getMeasuredHeight()/2 + this.toVertexText.getMeasuredLineHeight()/2);

        let deltaY = pt1.y - pt2.y;
        let deltaX = pt1.x - pt2.x;
        let absAngle = Math.atan2(Math.abs(deltaY), Math.abs(deltaX));
        let angle = Math.atan2(deltaY, deltaX);

        let fromVertexDiff = this.getShapeDiff(absAngle, angle, this.fromVertex.width, this.fromVertex.height, false);
        let toVertexDiff = this.getShapeDiff(absAngle, angle, this.toVertex.width, this.toVertex.height, true);
        let fromX = pt1.x - fromVertexDiff.xDiff;
        let fromY = pt1.y - fromVertexDiff.yDiff;

        let toX = pt2.x - toVertexDiff.xDiff;
        let toY = pt2.y - toVertexDiff.yDiff;

        this.DRAW_EDGES[this._edgeType]({fromX, fromY, toX, toY, angle});
        this._arcHitArea.graphics.clear().beginFill("#000").beginStroke('#000').setStrokeStyle(15).moveTo(fromX, fromY).lineTo(toX, toY).endStroke();

        this._titleShape.x = (fromX + toX)/2;
        this._titleShape.y = (fromY + toY)/2;
        this._arcHitArea.graphics.beginFill('#000').drawRect(
          this._titleShape.x - this._titleShape.getMeasuredWidth()/2,
          this._titleShape.y  - this._titleShape.getMeasuredHeight()/2,
          this._titleShape.getMeasuredWidth(),
          this._titleShape.getMeasuredHeight()
        );
        const lines = this._titleShape.getMeasuredHeight()/this._titleShape.getMeasuredLineHeight();
        this._titleShape.y -= Math.round(this._titleShape.getMeasuredLineHeight()*(lines-1)/2);
        let bounds = this._titleShape.getBounds();
        if (bounds) {
          let fromTextDiff = this.getShapeDiff(absAngle, angle, bounds.width, bounds.height, true);
          let toTextDiff = this.getShapeDiff(absAngle, angle, bounds.width, bounds.height, false);
          let fromTextCenter = {
            x: (fromX + (this._titleShape.x - fromTextDiff.xDiff))/2,
            y: (fromY + (this._titleShape.y - fromTextDiff.yDiff))/2,
          };
          let fromRadius = Math.sqrt(Math.pow(fromTextCenter.x - fromX, 2) + Math.pow(fromTextCenter.y - fromY, 2)) + this._arrowSize;

          let toTextCenter = {
            x: (toX + (this._titleShape.x - toTextDiff.xDiff))/2,
            y: (toY + (this._titleShape.y - toTextDiff.yDiff))/2,
          };
          let toRadius = Math.sqrt(Math.pow(toTextCenter.x - toX, 2) + Math.pow(toTextCenter.y - toY, 2)) + this._arrowSize;
          this._arcMask.graphics.clear();
          this._arcMask.graphics.beginFill('black').drawCircle(fromTextCenter.x, fromTextCenter.y, fromRadius);
          this._arcMask.graphics.drawCircle(toTextCenter.x, toTextCenter.y, toRadius).endFill();
        } else {
          this._arcMask.graphics.clear();
        }
      }
    });

    this._container.on('click', (event: any) => {
      if (event instanceof createjs.MouseEvent && event.nativeEvent.button === 2) {
        edgeCallback(event.nativeEvent, this);
        return;
      }
    });

    this._container.on('mouseover', () => {
      this._arc.shadow = new createjs.Shadow('#999', 3, 3, 5);
    });

    this._container.on('mouseout', () => {
      this._arc.shadow = null;
    });
  }

  private drawStandardEdge(drawPoints: drawEdgeInterface) {
    let {fromX, fromY, toX, toY, angle} = drawPoints;
    this._arc.graphics.clear().setStrokeStyle(4, 1).beginStroke(this.color).moveTo(fromX, fromY);
    this._arc.graphics.lineTo(toX, toY).endStroke();
    if (this.arrowFrom)
      this._arc.graphics.beginFill(this.color)
        .drawPolyStar(fromX, fromY, this._arrowSize, 3, 0.5, angle*(180/Math.PI));
    if (this.arrowTo)
      this._arc.graphics.beginFill(this.color)
        .drawPolyStar(toX, toY, this._arrowSize, 3, 0.5, angle*(180/Math.PI) + 180);
  }

  private drawDashedEdge(drawPoints: drawEdgeInterface) {
    let {fromX, fromY, toX, toY, angle} = drawPoints;
    this._arc.graphics.clear().setStrokeStyle(4, 1).setStrokeDash([this._dash, this._dash/2])
      .beginStroke(this.color).moveTo(fromX, fromY).lineTo(toX, toY).endStroke();
    if (this.arrowFrom)
      this._arc.graphics.beginFill(this.color)
        .drawPolyStar(fromX, fromY, this._arrowSize, 3, 0.5, angle*(180/Math.PI));
    if (this.arrowTo)
      this._arc.graphics.beginFill(this.color)
        .drawPolyStar(toX, toY, this._arrowSize, 3, 0.5, angle*(180/Math.PI) + 180);
  }

  private drawDoubleEdge(drawPoints: drawEdgeInterface) {
    let {fromX, fromY, toX, toY, angle} = drawPoints;
    let xOffset = 2*Math.sin(angle);
    let yOffset = 2*Math.cos(angle);
    this._arc.graphics.clear().setStrokeStyle(2, 1).beginStroke(this.color)
      .moveTo(fromX - xOffset, fromY + yOffset).lineTo(toX - xOffset, toY + yOffset).endStroke();
    this._arc.graphics.setStrokeStyle(2, 1).beginStroke(this.color)
      .moveTo(fromX + xOffset, fromY - yOffset).lineTo(toX + xOffset, toY - yOffset).endStroke();
    if (this.arrowFrom)
      this._arc.graphics.beginFill(this.color)
        .drawPolyStar(fromX, fromY, this._arrowSize, 3, 0.5, angle*(180/Math.PI));
    if (this.arrowTo)
      this._arc.graphics.beginFill(this.color)
        .drawPolyStar(toX, toY, this._arrowSize, 3, 0.5, angle*(180/Math.PI) + 180);
  }

  private drawDottedEdge(drawPoints: drawEdgeInterface) {
    let {fromX, fromY, toX, toY, angle} = drawPoints;
    this._arc.graphics.clear().setStrokeStyle(4, 1).setStrokeDash([1, 5])
      .beginStroke(this.color).moveTo(fromX, fromY).lineTo(toX, toY).endStroke();
    if (this.arrowFrom)
      this._arc.graphics.beginFill(this.color)
        .drawPolyStar(fromX, fromY, this._arrowSize, 3, 0.5, angle*(180/Math.PI));
    if (this.arrowTo)
      this._arc.graphics.beginFill(this.color)
        .drawPolyStar(toX, toY, this._arrowSize, 3, 0.5, angle*(180/Math.PI) + 180);
  }
}