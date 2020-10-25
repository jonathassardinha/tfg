import Vertex from "./Vertex";
import * as createjs from 'createjs-module'

export default class VertexCategory {
  color: string;
  name: string;
  stage: createjs.Stage;
  renderedVertex: Vertex

  constructor(stage: createjs.Stage, name: string, color: string) {
    this.color = color;
    this.name = name;
    this.stage = stage;
    this.renderedVertex = new Vertex(this.name, this.color);
    this.renderedVertex.name = `vertex${Math.random()*100000}`
    this.renderedVertex.visible = false;
  }

  renderVertex(x: number, y: number) {
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