import * as createjs from 'createjs-module';

export default class CanvasStage {
  private _stage: createjs.Stage;
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;
  private _devicePixelRatio: number;

  constructor() {
    this._stage = new createjs.Stage("canva");
    this._stage.enableMouseOver();
    this._stage.mouseMoveOutside = true;
    this._canvas = <HTMLCanvasElement> this._stage.canvas;
    this._context = <CanvasRenderingContext2D> this._canvas.getContext('2d');
    this._devicePixelRatio = window.devicePixelRatio || 1;
    createjs.Touch.enable(this._stage);


    this._canvas.width = window.innerWidth*this._devicePixelRatio;
    this._canvas.height = window.innerHeight*this._devicePixelRatio;
    this._canvas.style.width = `100%`;
    this._canvas.style.height = `100%`;
    this._context.scale(this._devicePixelRatio, this._devicePixelRatio);
  }

  addChild(child: any) {
    this._stage.addChild(child);
  }

  addChildAtBeggining(child: any) {
    this._stage.addChildAt(child, 1);
  }

  removeChild(child: any) {
    this._stage.removeChild(child);
  }

  get stage(): createjs.Stage {
    return this._stage;
  }
}