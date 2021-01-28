import Vertex from "./Vertex";
import * as createjs from 'createjs-module'
import { colourNameToHex } from "src/app/utils/colors";
import CanvasStage from "./CanvasStage";

export default class VertexCategory {
  private _id: string;
  private _stage: createjs.Stage;
  private _vertex: Vertex;
  private _name: string;
  private _description: string;
  private _color: string;
  private _textColor: string;
  private _isRendered: boolean;
  private _type: string;
  private _detailsCallback: Function;

  constructor(canvasStage: CanvasStage, id: string, name: string, description: string, type: string, color: string = 'white', scale: number, detailsCallback: Function, offsetCallback: (x: number, y: number, vertex: Vertex) => void) {
    this._id = id;
    this._color = color;
    this._name = name;
    this._description = description;
    this._stage = canvasStage.stage;
    this._type = type;
    this._isRendered = false;
    this._detailsCallback = detailsCallback;
    this._vertex = new Vertex(this._name, this._color, this._type, scale, (event) => this._detailsCallback(event, this), offsetCallback, canvasStage);
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

  public get description(): string {
    return this._description;
  }
  public set description(value: string) {
    this._description = value;
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

  renderVertex(x: number, y: number, scale: number) {
    if (!this._stage.contains(this._vertex)) {
      this._vertex.scale = scale;
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