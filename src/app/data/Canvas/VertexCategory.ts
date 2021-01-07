import Vertex from "./Vertex";
import * as createjs from 'createjs-module'
import { colourNameToHex } from "src/app/utils/colors";

export default class VertexCategory {
  private _id: string;
  private _stage: createjs.Stage;
  private _vertex: Vertex;
  private _name: string;
  private _color: string;
  private _textColor: string;
  private _isRendered: boolean;
  private _type: string;
  private _detailsCallback: Function;

  constructor(stage: createjs.Stage, id: string, name: string, type: string, color: string = 'white', detailsCallback: Function) {
    this._id = id;
    this._color = color;
    this._name = name;
    this._stage = stage;
    this._type = type;
    this._isRendered = false;
    this._detailsCallback = detailsCallback;
    this._vertex = new Vertex(this._name, this._color, this._type, (event) => this._detailsCallback(event, this));
    this._textColor = this._vertex.textColor;
    this._vertex.name = `vertex${Math.random()*100000}`
    this._vertex.visible = false;
  }

  get id() {
    return this._id;
  }

  get isVertexRendered() {
    return this._isRendered;
  }

  get vertex() {
    return this._vertex;
  }

  get name() {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
    this._vertex.containerText.text = value;
    this._vertex.calculateBounds();
    this._vertex.drawElements();
  }

  get color() {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
    this._vertex.colors = colourNameToHex(value);
    this._vertex.recolorElements();
  }

  get textColor() {
    return this._textColor;
  }

  set textColor(value: string) {
    this._textColor = value;
    this._vertex.containerText.color = value;
  }

  renderVertex(x: number, y: number) {
    if (!this._stage.contains(this._vertex)) {
      this._vertex.x = x;
      this._vertex.y = y;
      this._vertex.visible = true;
      this._stage.addChild(this._vertex);
      this._isRendered = true;
    }
  }

  makeVertexInvisible() {
    this._vertex.visible = false;
    this._isRendered = false;
  }

  unrenderVertex() {
    this._stage.removeChild(this._vertex);
    this._vertex.visible = false;
    this._isRendered = false;
  }
}