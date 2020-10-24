import "./Vertex.js";

export default class VertexCategory {
  constructor(stage, name, color) {
    this.color = color;
    this.name = name;
    this.stage = stage;
    this.renderedVertex = new Vertex(this.name, this.color, this.color);
    this.renderedVertex.name = `vertex${Math.random()*100000}`
    this.renderedVertex.visible = false;
  }

  renderVertex(x, y) {
    this.renderedVertex.x = x;
    this.renderedVertex.y = y;
    this.renderedVertex.visible = true;
    this.stage.addChild(this.renderedVertex);
  }

  makeVertexInvisible() {
    this.renderedVertex.visible = false;
  }

  unrenderVertex() {
    this.stage.removeChild(this.renderedVertex);
    this.renderedVertex.visible = false;
  }
}