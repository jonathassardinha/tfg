import { Shape, Ticker } from 'createjs-module';
import React, { Component } from 'react'
import CanvasStage from '../easeljs/CanvasStage'

export default class Network extends Component<{updateStage: Function} | Readonly<{updateStage: Function}>> {
  canvasStage: CanvasStage | undefined;
  canvas: HTMLCanvasElement | undefined;
  canvasRef: HTMLCanvasElement | undefined;
  bg: Shape | undefined;
  setCanvasRef: (element: HTMLCanvasElement) => void;

  constructor(props: {updateStage: Function} | Readonly<{updateStage: Function}>) {
    super(props);
    this.setCanvasRef = (element: HTMLCanvasElement) => {
      this.canvasRef = element;
    };
  }

  shouldComponentUpdate(nextProps: any, nextState: any, nextContext: any) {
    console.log(nextContext);
    return true;
  }

  componentDidMount() {
    if (this.canvasRef) {
      this.canvasStage = new CanvasStage(this.canvasRef);
      this.canvas = this.canvasStage.stage.canvas as HTMLCanvasElement;
      // this.bg = new Shape();
      // this.bg.graphics.beginFill('white').drawRect(0, 0, this.canvas.width, this.canvas.height);
      // this.canvasStage.addChild(this.bg);
      this.canvasStage.stage.update();

      Ticker.on("tick", () => {
        this.canvasStage?.stage.update();
      });

      window.addEventListener('resize', () => {
        this.canvasStage?.redraw();
      })

      this.props.updateStage(this.canvasStage);
    }
  }

  render() {
    return (
      <canvas ref={this.setCanvasRef} id='canvas'></canvas>
    )
  }
}
