import * as createjs from 'createjs-module'
import CanvasStage from './CanvasStage';
import Vertex from './Vertex';

export default class Edge {
  private _stage: CanvasStage;
  private _color: string;
  private _fromVertexText: createjs.Text;
  private _toVertexText: createjs.Text;
  private _dash: number;
  private _arc: createjs.Shape;

  constructor(stage: CanvasStage, color: string, fromVertex: Vertex, toVertex: Vertex) {
    this._stage = stage;
    this._color = color;
    this._fromVertexText = (fromVertex.getChildAt(0) as createjs.Container).getChildByName('text') as createjs.Text;
    this._toVertexText = (toVertex.getChildAt(0) as createjs.Container).getChildByName('text') as createjs.Text;
    this._dash = 0;
    this._arc = new createjs.Shape();
    this._arc.visible = false;
    this._arc.on('tick', () => {
      if (this._arc.visible) {
        this._dash = (this._dash+1)%20;
        const pt1 = this._fromVertexText.localToGlobal(this._fromVertexText.x, this._fromVertexText.y);
        const pt2 = this._toVertexText.localToGlobal(this._toVertexText.x, this._toVertexText.y);

        pt1.x -= this._fromVertexText.x;
        pt1.y -= this._fromVertexText.y;
        pt2.x -= this._toVertexText.x;
        pt2.y -= this._toVertexText.y;

        let x = (pt1.x + pt2.x)/2;
        let y = (pt1.y + pt2.y);

        this._arc.graphics.clear().setStrokeStyle(4).setStrokeDash([15, 5], this._dash).beginStroke(this._color).moveTo(pt1.x, pt1.y)
          .quadraticCurveTo(x, y , pt2.x, pt2.y);
      }
    });
  }

  renderArc() {
    this._arc.visible = true;
    this._stage.addChild(this._arc);
  }

  renderArcAtBeggining() {
    this._arc.visible = true;
    this._stage.addChildAtBeggining(this._arc);
  }

  makeArcInvisible() {
    this._arc.visible = false;
  }

  unrenderArc() {
    this._stage.removeChild(this._arc);
    this._arc.visible = false;
  }
}