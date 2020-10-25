import * as createjs from 'createjs-module';

export default class CanvasStage {
  private _stage: createjs.Stage;

  constructor() {
    this._stage = new createjs.Stage("canva");
    this._stage.enableMouseOver();
    this._stage.mouseMoveOutside = true;
    createjs.Touch.enable(this._stage);

    (<HTMLCanvasElement> this._stage.canvas).width = window.innerWidth;
    (<HTMLCanvasElement> this._stage.canvas).height = window.innerHeight;
    (<HTMLCanvasElement> this._stage.canvas).style.width = `${window.innerWidth}px`;
    (<HTMLCanvasElement> this._stage.canvas).style.height = `${window.innerHeight}px`;
    (<HTMLCanvasElement> this._stage.canvas).getContext('2d')?.scale(2, 2);
  }

  addChild(child: any) {
    this._stage.addChild(child);
  }

  get stage(): createjs.Stage {
    return this._stage;
  }
}