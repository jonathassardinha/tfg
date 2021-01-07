import * as createjs from 'createjs-module'
import CanvasStage from './CanvasStage';
import VertexCategory from './VertexCategory';

interface drawEdgeInterface {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  angle: number;
}

export default class CanvasEdge {
  private DRAW_EDGES: {[key: string]: (drawPoints: drawEdgeInterface) => any} = {
    STANDARD: (drawPoints: drawEdgeInterface) => this.drawStandardEdge(drawPoints),
    DASHED: (drawPoints: drawEdgeInterface) => this.drawDashedEdge(drawPoints),
    DOUBLE: (drawPoints: drawEdgeInterface) => this.drawDoubleEdge(drawPoints),
    DOTTED: (drawPoints: drawEdgeInterface) => this.drawDottedEdge(drawPoints),
  }

  private _stage: CanvasStage;
  private _fromVertexText: createjs.Text;
  private _toVertexText: createjs.Text;
  private _arc: createjs.Shape;
  private _arcHitArea: createjs.Shape;
  private _titleShape: createjs.Text;
  private _container: createjs.Container;
  private _arcMask: createjs.Shape;
  private _title: string;

  private _arrowDistance: number;
  private _arrowSize: number;
  private _edgeType: string;
  private _dash: number;

  public static EDGE_TYPES = {
    STANDARD: 'STANDARD',
    DASHED: 'DASHED',
    DOUBLE: 'DOUBLE',
    DOTTED: 'DOTTED'
  };
  public comment: string;
  public color: string;
  public fromVertex: VertexCategory;
  public toVertex: VertexCategory;
  public arrowTo: boolean;
  public arrowFrom: boolean;

  constructor(_stage: CanvasStage, color: string, fromVertex: VertexCategory, toVertex: VertexCategory, edgeCallback: Function) {
    this._stage = _stage;
    this.color = color;
    this.fromVertex = fromVertex;
    this.toVertex = toVertex;
    this._fromVertexText = (fromVertex.vertex.getChildAt(0) as createjs.Container).getChildByName('text') as createjs.Text;
    this._toVertexText = (toVertex.vertex.getChildAt(0) as createjs.Container).getChildByName('text') as createjs.Text;
    this.arrowFrom = true;
    this.arrowTo = true;
    this._arrowDistance = 15;
    this._arrowSize = 7;
    this._edgeType = CanvasEdge.EDGE_TYPES.STANDARD;
    this._dash = 20;
    this._title = this.fromVertex.name + ' to ' + this.toVertex.name;

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
    if (Object.keys(CanvasEdge.EDGE_TYPES).includes(value)) {
      this._edgeType = value;
    }
  }

  private setupListeners(edgeCallback: Function) {
    this._arc.on('tick', () => {
      if (this._arc.visible) {
        const pt1 = this._fromVertexText.localToGlobal(this._fromVertexText.x, this._fromVertexText.y);
        const pt2 = this._toVertexText.localToGlobal(this._toVertexText.x, this._toVertexText.y);

        pt1.x -= this._fromVertexText.x;
        pt1.y -= (this._fromVertexText.y - this._fromVertexText.getMeasuredHeight()/2 + this._fromVertexText.getMeasuredLineHeight()/2);
        pt2.x -= this._toVertexText.x;
        pt2.y -= (this._toVertexText.y - this._toVertexText.getMeasuredHeight()/2 + this._toVertexText.getMeasuredLineHeight()/2);

        let deltaY = pt1.y - pt2.y;
        let deltaX = pt1.x - pt2.x;
        let absAngle = Math.atan2(Math.abs(deltaY), Math.abs(deltaX));
        let angle = Math.atan2(deltaY, deltaX);

        let fromVertexDiff = this.getShapeDiff(absAngle, angle, this.fromVertex.vertex.width, this.fromVertex.vertex.height, false);
        let toVertexDiff = this.getShapeDiff(absAngle, angle, this.toVertex.vertex.width, this.toVertex.vertex.height, true);
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

    this._container.on('click', (evt: createjs.MouseEvent) => {
      if (evt.nativeEvent.button === 2) {
        edgeCallback(evt.nativeEvent, this);
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

  renderArc() {
    this._stage.addChild(this._container);
    this._arc.visible = true;
    this._titleShape.visible = true;
    this._container.visible = true;
  }

  renderArcAtBeggining() {
    this._stage.addChildAtBeggining(this._container);
    this._arc.visible = true;
    this._titleShape.visible = true;
    this._container.visible = true;
  }

  makeArcInvisible() {
    this._arc.visible = false;
  }

  unrenderArc() {
    this._stage.removeChild(this._container);
    this._container.visible = false;
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

  private drawStandardEdge(drawPoints: drawEdgeInterface) {
    let {fromX, fromY, toX, toY, angle} = drawPoints;
    this._arc.graphics.clear().setStrokeStyle(4, 1).beginStroke(this.color)
      .moveTo(fromX, fromY).lineTo(toX, toY).endStroke();
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