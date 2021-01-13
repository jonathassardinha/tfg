import CanvasStage from './CanvasStage';
import VertexCategory from './VertexCategory';
import {Edge} from './Edge';

export default class CanvasEdge {

  private _stage: CanvasStage;

  public edge: Edge;
  public fromVertex: VertexCategory;
  public toVertex: VertexCategory;

  constructor(stage: CanvasStage, color: string, fromVertex: VertexCategory, toVertex: VertexCategory, edgeCallback: (event: MouseEvent, edge: Edge) => void) {
    this._stage = stage;
    this.edge = new Edge(fromVertex.vertex, toVertex.vertex, color, edgeCallback);

    this.fromVertex = fromVertex;
    this.toVertex = toVertex;
  }

  renderArc() {
    this._stage.addChild(this.edge);
    this.edge.visible = true;
  }

  renderArcAtBeggining() {
    this._stage.addChildAtBeggining(this.edge);
    this.edge.visible = true;
  }

  makeArcInvisible() {
    this.edge.visible = false;
  }

  unrenderArc() {
    this._stage.removeChild(this.edge);
    this.edge.visible = false;
  }
}