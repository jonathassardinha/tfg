import Vertex from "./Vertex";
import * as createjs from 'createjs-module'

export default class VertexCategory {
  private _color: string;
  private _name: string;
  private _stage: createjs.Stage;
  private _vertex: Vertex

  constructor(stage: createjs.Stage, name: string, color: string) {
    this._color = color;
    this._name = name;
    this._stage = stage;
    this._vertex = new Vertex(this._name, this._color);
    this._vertex.name = `vertex${Math.random()*100000}`
    this._vertex.visible = false;
  }

  get vertex() {
    return this._vertex;
  }

  get name() {
    return this._name;
  }

  renderVertex(x: number, y: number) {
    this._vertex.x = x;
    this._vertex.y = y;
    this._vertex.visible = true;
    this._stage.addChild(this._vertex);
  }

  makeVertexInvisible() {
    this._vertex.visible = false;
  }

  unrenderVertex() {
    this._stage.removeChild(this._vertex);
    this._vertex.visible = false;
  }
}