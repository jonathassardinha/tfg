import * as createjs from 'createjs-module';

export default class CanvasStage {
  private _stage: createjs.Stage;
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;
  private _devicePixelRatio: number;

  constructor(canvasRef: HTMLCanvasElement) {
    this._stage = new createjs.Stage(canvasRef);
    this._stage.enableMouseOver();
    this._stage.mouseEnabled = true;
    this._stage.mouseMoveOutside = true;
    this._canvas = this._stage.canvas as HTMLCanvasElement;
    this._context = this._canvas.getContext('2d', {alpha: true}) as CanvasRenderingContext2D;
    this._context.translate(0.5, 0.5);
    this._context.imageSmoothingEnabled = false;
    this._canvas.style.height = '100%';
    this._canvas.style.width = '100%';

    createjs.Touch.enable(this._stage);

    this.redraw();
  }

  addChild(...children: createjs.DisplayObject[]) {
    this._stage.addChild(...children);
  }

  addChildAtBeggining(child: any) {
    this._stage.addChildAt(child, 0);
  }

  removeChild(child: any) {
    this._stage.removeChild(child);
  }

  redraw() {
    this._devicePixelRatio = window.devicePixelRatio || 1;
    this._canvas.width = window.innerWidth*this._devicePixelRatio;
    this._canvas.height = (window.innerHeight - 65)*this._devicePixelRatio;
    this._context.scale(this._devicePixelRatio, this._devicePixelRatio);
  }

  get stage(): createjs.Stage {
    return this._stage;
  }
}