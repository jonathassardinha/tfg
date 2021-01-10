import * as createjs from 'createjs-module';
import Vertex from './Vertex';

export default class CanvasStage {
  private _stage: createjs.Stage;
  private _canvas: HTMLCanvasElement;
  private _selectBox: createjs.Shape;
  private _selectBoxData = {x: 0, y: 0, width: 0, height: 0};
  private _context: CanvasRenderingContext2D;
  private _devicePixelRatio: number;
  private _isSelecting = false;
  private _isSelected = false;

  private _selectedVertices: Vertex[] = [];
  private clickedChild;

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

    this.setupCanvasSelect();

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

  private setupCanvasSelect() {
    this._selectBox = new createjs.Shape();
    this._canvas.onmousedown = (event: MouseEvent) => {
      if (this._stage.children.every(child => {
        let point = child.globalToLocal(event.clientX, event.clientY - 60);
        if (!child.hitTest(point.x, point.y)) {
          return true;
        } else {
          this.clickedChild = child;
          return false;
        };
      })) {
          if (this._isSelected) {
            this._isSelected = false;
            this._selectedVertices.forEach(vertex => vertex.deselectVertex());
            this._selectedVertices = [];
          }
          this._isSelecting = true;
          this._selectBox.graphics.clear();
          this._selectBox.setBounds(0, 0, 0, 0);
          this._selectBox.visible = true;
          this._selectBoxData.x = event.x;
          this._selectBoxData.y = event.y - 60;
          this._selectBoxData.width = 0;
          this._selectBoxData.height = 0;
          this._stage.addChildAt(this._selectBox, this._stage.numChildren);
      } else {
        if (this._isSelected) {
          if (!this._selectedVertices.includes(this.clickedChild)) {
            this._isSelected = false;
            this._selectedVertices.forEach(vertex => vertex.deselectVertex());
            this._selectedVertices = [];
            this.clickedChild = null;
          } else {
            this._selectedVertices.forEach(child => {
              if (child !== this.clickedChild) {
                let newEvent = new createjs.Event('select', false, false);
                child.dispatchEvent(newEvent);
              }
            });
          }
        }
      }

    }

    this._canvas.onmouseup = (event: MouseEvent) => {
      if (this._isSelected) {
        this._selectedVertices.forEach(child => {
          if (this.clickedChild !== child){
            let newEvent = new createjs.Event('deselect', false, false);
            child.dispatchEvent(newEvent)
          }
        });
        this.clickedChild = null;
      }
      if (!this._isSelecting) return;

      let selectBounds = this._selectBox.getBounds();
      if (selectBounds) {
        console.log('selecting');
        this._stage.children.forEach(child => {
          if (child === this._selectBox || !(child instanceof Vertex)) return;
          let vertex = child as Vertex;
          let vertexBounds = vertex.getTransformedBounds();
          let crossesHorizontal = false;
          let crossesVertical = false;
          if (selectBounds.x < vertexBounds.x) {
            if (selectBounds.x + selectBounds.width/2 >= vertexBounds.x - vertexBounds.width/2) crossesHorizontal = true;
          } else {
            if (selectBounds.x - selectBounds.width/2 <= vertexBounds.x + vertexBounds.width/2) crossesHorizontal = true;
          }

          if (selectBounds.y < vertexBounds.y) {
            if (selectBounds.y + selectBounds.height/2 >= vertexBounds.y - vertexBounds.height/2) crossesVertical = true;
          } else {
            if (selectBounds.y - selectBounds.height/2 <= vertexBounds.y + vertexBounds.height/2) crossesVertical = true;
          }

          if (crossesHorizontal && crossesVertical) {
            vertex.selectVertex();
            this._selectedVertices.push(vertex);
          }
        });
        this._isSelected = true;
      }
      this._isSelecting = false;
      this._stage.removeChild(this._selectBox);
      this._selectBox.visible = false;
    }

    this._canvas.onmousemove = (event: MouseEvent) => {
      if (this._isSelected && this.clickedChild) {
        this._selectedVertices.forEach(child => {
          if (this.clickedChild !== child){
            let newEvent = new createjs.Event('movegroup', false, false);
            newEvent['movementX'] = event.movementX;
            newEvent['movementY'] = event.movementY;
            child.dispatchEvent(newEvent)
          }
        });
      } else if (this._isSelecting) {
        this._selectBoxData.width = this._selectBoxData.width + event.movementX;
        this._selectBoxData.height = this._selectBoxData.height + event.movementY;
        this._selectBox.graphics.clear().beginFill('rgba(50, 50, 50, 0.5)').drawRect(
          this._selectBoxData.x,
          this._selectBoxData.y,
          this._selectBoxData.width,
          this._selectBoxData.height
        );
        this._selectBox.setBounds(
          this._selectBoxData.x + this._selectBoxData.width/2,
          this._selectBoxData.y + this._selectBoxData.height/2,
          this._selectBoxData.width,
          this._selectBoxData.height
        )
      }
    }
  }
}