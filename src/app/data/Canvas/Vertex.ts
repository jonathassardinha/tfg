import {colourNameToHex, Colors} from "../../utils/colors";
import * as createjs from 'createjs-module';
import CanvasStage from "./CanvasStage";

export default class Vertex extends createjs.Container {
  text: string;
  colors: Colors;
  textColor: string;
  isPressed: boolean;
  isHooked: boolean;
  isSelected: boolean;
  radius: number;
  type: string;

  containerText!: createjs.Text;
  container!: createjs.Container;
  containerOutline!: createjs.Shape;
  containerShape!: createjs.Shape;
  containerHook!: createjs.Shape;
  containerDiff!: createjs.Shape;

  canvasStage: CanvasStage;

  width!: number;
  initialWidth!: number;
  minWidth!: number;
  maxWidth!: number;
  widthRamp!: number;

  height!: number;
  initialHeight!: number;
  minHeight!: number;
  maxHeight!: number;
  heightRamp!: number;
  containerEventListener!: Function;
  detailsCallback: Function;
  offsetCallback: (x: number, y: number, vertex: Vertex) => void;
  propagatingDispatch = false;

  mouseOffset: {x: number, y: number} = {x: 0, y: 0};
  originalMousePosition: {x: number, y: number} = {x: 0, y: 0};
  originalBounds: {w: number, h: number} = {w: 0, h: 0};
  containerShapeCenter: {x: number, y: number} = {x: 0, y: 0};
  outlineCenter: {x: number, y: number} = {x: 0, y: 0};
  hookCenter: {x: number, y: number} = {x: 0, y: 0};
  originalTextPosition: {x: number, y: number} = {x: 0, y: 0};

  commands: {
    containerShape: any,
    containerOutline: any,
    containerHook: any,
    containerDiff: any
  } = {
    containerShape: null,
    containerOutline: null,
    containerHook: null,
    containerDiff: null
  }

  constructor(text: string, color: string, type: string, detailsCallback: Function, offsetCallback: (x: number, y: number, vertex: Vertex) => void, canvasStage: CanvasStage) {
    super();

    this.canvasStage = canvasStage;
    this.text = text;
    this.colors = colourNameToHex(color);
    this.type = type;
    //flag to check if container is clicked
    this.isPressed = false;
    //flag to check if hook is clicked
    this.isHooked = false;
    this.radius = 5;
    this.x = 0;
    this.y = 0;
    this.detailsCallback = detailsCallback;
    this.offsetCallback = offsetCallback;

    this.setup();
  }

  setup() {
    //creating container text
    this.textColor = this.colors.textColor;
    this.containerText = new createjs.Text(this.text, "12px Arial", this.textColor);
    this.containerText.textAlign = 'center';
    this.containerText.textBaseline = 'middle';
    this.containerText.name = 'text';
    this.containerText.cursor = 'pointer';
    this.containerText.lineWidth = 100;
    this.calculateBounds();

    //create rounded rectangle
    this.containerShape = new createjs.Shape();
    this.containerShape.cursor = "pointer";
    this.containerShape.name = 'rRect';
    this.containerShape.shadow = new createjs.Shadow('#666', 3, 3, 10);

    //create on hover outline
    this.containerOutline = new createjs.Shape();
    this.containerOutline.visible = false;
    this.containerOutline.shadow = new createjs.Shadow('#666', 3, 3, 10);

    //create on hover hook
    this.containerHook = new createjs.Shape();
    this.containerHook.cursor = 'pointer';
    this.containerHook.visible = false;

    if (this.type === 'Category') {
      this.containerDiff = new createjs.Shape();
      this.containerDiff.mask = new createjs.Shape();
    }

    this.drawElements();

    this.container = new createjs.Container();

    this.container.addChild(this.containerShape, this.containerDiff, this.containerText, this.containerHook, this.containerOutline);

    this.setupHookMouse();
    this.setupContainerMouse();

    this.addChild(this.container);

    this.on('select', (event: Event) => {
      if (!this.propagatingDispatch) {
        this.propagatingDispatch = true;
        let newEvent = new createjs.Event('mousedown', true, true);
        newEvent['nativeEvent'] = {button: 1};
        this.container.dispatchEvent(newEvent);
      }
    });

    this.on('deselect', (event: Event) => {
      if (!this.propagatingDispatch) {
        this.propagatingDispatch = true;
        let newEvent = new createjs.Event('pressup', true, true);
        this.container.dispatchEvent(newEvent);
      }
    });

    this.on('movegroup', (event: Event) => {
      if (!this.propagatingDispatch) {
        this.propagatingDispatch = true;
        let newEvent = new createjs.Event('pressmove', true, true);
        newEvent['nativeEvent'] = {
          movementX: event['movementX'],
          movementY: event['movementY']
        };
        newEvent['shouldNotOffset'] = true;
        this.container.dispatchEvent(newEvent);
      }
    });

  }

  calculateBounds() {
    const lines = this.containerText.getMeasuredHeight()/this.containerText.getMeasuredLineHeight();

    let bounds = this.containerText.getBounds();

    //the text vertical placement should be in the middle of the lines
    //so if there are 3 lines the y axis will be shifted one line up
    this.containerText.y = -Math.round(this.containerText.getMeasuredLineHeight()*(lines-1)/2);

    //define initial container size based on the text
    this.width = bounds ? bounds.width + 30 : 150;
    this.initialWidth = this.width;
    this.minWidth = this.width;
    this.maxWidth = this.width + 3;
    this.widthRamp = (this.maxWidth - this.width)/3;

    this.height = bounds ? bounds.height + 30 : 70;
    this.initialHeight = this.height;
    this.minHeight = this.height;
    this.maxHeight = this.height + 3;
    this.heightRamp = (this.maxHeight - this.height)/3;
  }

  recolorElements() {
    this.commands.containerShape.style = this.colors.mainColor;
    this.commands.containerOutline.style = this.colors.mainColor;
    this.commands.containerHook.style = this.colors.highlightColor;
    if (this.commands.containerDiff) this.commands.containerDiff.style = this.colors.activeColor;
  }

  drawElements() {
    this.commands.containerShape = this.containerShape.graphics.clear().beginFill(this.colors.mainColor).command;
    this.containerShape.graphics.drawRoundRect(-this.width/ 2, -this.height/2, this.width, this.height, this.radius);
    // this.containerShape.x = this.x;
    // this.containerShape.y = this.y;

    //create on hover outline
    this.commands.containerOutline = this.containerOutline.graphics.clear().setStrokeStyle(2).beginStroke(this.colors.mainColor).command;
    this.containerOutline.graphics.drawRoundRect(-(this.width/ 2 + 3.5), -(this.height/2 + 3.5), this.width + 7, this.height + 7, this.radius);
    // this.containerOutline.x = this.x;
    // this.containerOutline.y = this.y;

    //create on hover hook
    this.commands.containerHook = this.containerHook.graphics.clear().beginFill(this.colors.highlightColor).command;
    this.containerHook.graphics.drawCircle(this.width/ 2 - 7.5, this.height/2 - 7.5, 5);
    // this.containerHook.x = this.x;
    // this.containerHook.y = this.y;

    if (this.type === 'Category') {
      this.containerDiff.mask.graphics.clear().drawRect(-this.width/2 - 1, -this.height/2, 10, this.height);
      this.commands.containerDiff = this.containerDiff.graphics.clear().beginFill(this.colors.activeColor).command;
      this.containerDiff.graphics.drawRoundRect(-this.width/2 - 1, -this.height/2, 20, this.height, this.radius);
    }
  }

  setupContainerMouse() {
    this.container.on("mouseover", () => {
      this.containerOutline.visible = true;
      this.containerHook.visible = true;
    });

    this.container.on("mouseout", () => {
      if (!this.isPressed) {
        this.containerOutline.visible = this.isSelected;
        this.containerHook.visible = false;
      }
    });

    this.container.on("mousedown", (evt: createjs.MouseEvent | MouseEvent) => {
      let mouseEvent = evt instanceof MouseEvent ? evt : evt.nativeEvent;
      if (mouseEvent.button === 2) {
        mouseEvent.preventDefault();
        this.detailsCallback(mouseEvent);
        return;
      }

      //changing the child index so the selected container is on the front
      this.parent.setChildIndex(this, this.parent.numChildren-1);
      if (!this.isHooked) {
        this.isPressed = true;
        //if there is an event listener still going turn it off
        if (this.containerEventListener && this.containerEventListener.name === 'done') this.container.off("tick", this.containerEventListener);
        //set a new event listener to animate the rectangle
        this.containerEventListener = this.container.on("tick", this.handleMouseDown);
      }
      this.propagatingDispatch = false;
    });

    this.container.on("pressmove", (evt: createjs.MouseEvent) => {
      if (!this.isHooked) {
        this.x = this.x + evt.nativeEvent.movementX;
        this.y = this.y + evt.nativeEvent.movementY;
        this.propagatingDispatch = false;

        if (evt['shouldNotOffset']) return;
        let xOffset = 0, yOffset = 0;

        if (this.x - this.width/2 < 10) xOffset = 5;
        else if (this.x + this.width/2 > this.canvasStage.canvasWidth - 10) xOffset = -5;

        if (this.y - this.height/2 < 10) yOffset = 5;
        else if (this.y + this.height/2 > this.canvasStage.canvasHeight - 10) yOffset = -5;

        if (xOffset !== 0 || yOffset !== 0) this.offsetCallback(xOffset, yOffset, this);
      }
    });

    this.container.on("pressup", () => {
      this.isPressed = false;
      //if the mouse is outside the canvas when "declicking" remove the containerOutline and hook
      if (!this.parent.stage.mouseInBounds) {
        this.containerOutline.visible = false;
        this.containerHook.visible = false;
      }
      if (this.containerEventListener && this.containerEventListener.name === 'done') this.container.off("tick", this.containerEventListener);
      this.containerEventListener = this.container.on("tick", this.handleMouseUp);

      this.propagatingDispatch = false;
    });
  }

  setupHookMouse() {
    this.containerHook.on("mouseover", () => {
      if (!this.isHooked && !this.isSelected)
        this.commands.containerHook = this.containerHook.graphics.clear().beginFill(this.colors.hoverColor).command;
        this.containerHook.graphics.drawCircle(this.width/ 2 - 7.5, this.height/2 - 7.5, 5);
    });

    this.containerHook.on("mouseout", () => {
      if (!this.isHooked && !this.isSelected)
        this.commands.containerHook = this.containerHook.graphics.clear().beginFill(this.colors.highlightColor).command;
        this.containerHook.graphics.drawCircle(this.width/ 2 - 7.5, this.height/2 - 7.5, 5);
    });

    this.containerHook.on('mousedown', (evt) => {
      if (this.isSelected) return;
      const mouseEvent = evt as createjs.MouseEvent;
      this.isHooked = true;
      this.isPressed = true;
      this.originalMousePosition = {x: mouseEvent.stageX, y: mouseEvent.stageY};
      this.originalBounds = {w: this.width, h: this.height};
      this.containerShapeCenter = {x: -this.width/ 2, y: -this.height/2};
      this.outlineCenter = {x: -(this.width/ 2 + 3.5), y: -(this.height/2 + 3.5)};
      this.hookCenter = {x: this.width/ 2 - 7.5, y: this.height/2 - 7.5};
      this.originalTextPosition = {x: this.containerText.x, y: this.containerText.y};
    });

    this.containerHook.on('pressmove', (evt: createjs.MouseEvent) => {
      if (this.isSelected) return;
      const diffX = evt.stageX - this.originalMousePosition.x;
      const diffY = evt.stageY - this.originalMousePosition.y;
      const hookCenter = {x: 0, y: 0};
      let diffHeight;

      //updating the width
      //the width can't be smaller than the first min width
      if (this.originalBounds.w + diffX <= this.initialWidth) {
        this.width = this.initialWidth;
        hookCenter.x = this.hookCenter.x - (this.originalBounds.w - this.initialWidth);
      }
      //the width can't be greater than 5 times the current max width
      else if (this.originalBounds.w + diffX > this.minWidth*5) {
        this.width = this.minWidth*5;
        hookCenter.x = this.hookCenter.x + this.minWidth*4;
      }
      else {
        this.width = this.originalBounds.w + diffX;
        this.containerText.x = this.originalTextPosition.x + diffX/2;
        hookCenter.x = this.hookCenter.x + diffX;
        //if the width is growing in comparison to the base width we can possibly change the number of lines
        if (this.width > this.initialWidth - 30) {
          //basically, we change the lineWidth and check if the number of lines changed
          //if they did we change then we change the text vertical placement to match
          const lineHeight = this.containerText.getMeasuredLineHeight();
          const linesBefore = this.containerText.getMeasuredHeight()/lineHeight;
          this.containerText.lineWidth = this.width - 30;
          const linesAfter = this.containerText.getMeasuredHeight()/lineHeight;
          if (linesBefore !== linesAfter) {
            this.originalTextPosition.y = -lineHeight*(linesAfter-1)/2;
            this.containerText.y = this.originalTextPosition.y + (this.height - this.originalBounds.h)/2;
          }
        }
      }

      //updating the height
      //the height have the same restrictions as the width
      if (this.originalBounds.h + diffY <= this.initialHeight) {
        this.height = this.initialHeight;
        hookCenter.y = this.hookCenter.y - (this.originalBounds.h - this.initialHeight);
      }
      else if (this.originalBounds.h + diffY >= this.minHeight*5) {
        this.height = this.minHeight*5;
        hookCenter.y = this.hookCenter.y + this.minHeight*4;

      }
      else {
        this.height = this.originalBounds.h + diffY;
        this.containerText.y = this.originalTextPosition.y + diffY/2;
        hookCenter.y = this.hookCenter.y + diffY;
      }
      //finally, we update the rectangle, outline and hook graphics
      this.commands.containerShape = this.containerShape.graphics.clear().beginFill(this.colors.mainColor).command;
      this.containerShape.graphics.drawRoundRect(
        this.containerShapeCenter.x,
        this.containerShapeCenter.y,
        this.width,
        this.height,
        this.radius);
      this.commands.containerOutline = this.containerOutline.graphics.clear().setStrokeStyle(2).beginStroke(this.colors.mainColor).command;
      this.containerOutline.graphics.drawRoundRect(this.outlineCenter.x, this.outlineCenter.y, this.width + 7, this.height + 7, this.radius);
      this.commands.containerHook = this.containerHook.graphics.clear().beginFill(this.colors.activeColor).command;
      this.containerHook.graphics.drawCircle(hookCenter.x, hookCenter.y, 5);
      if (this.type === 'Category') {
        this.containerDiff.mask.graphics.clear().drawRect(-this.originalBounds.w/2 - 1, -this.originalBounds.h/2, 10, this.height);
        this.commands.containerDiff = this.containerDiff.graphics.clear().beginFill(this.colors.activeColor).command;
        this.containerDiff.graphics.drawRoundRect(-this.originalBounds.w/2-1, -this.originalBounds.h/2, 20, this.height, this.radius);
      }
    });

    this.containerHook.on('pressup', () => {
      //redefine min and max values
      if (this.isSelected) return;
      this.minWidth = this.width;
      this.maxWidth = this.width + 3;
      this.widthRamp = (this.maxWidth - this.width)/3;

      this.minHeight = this.height;
      this.maxHeight = this.height + 3;
      this.heightRamp = (this.maxHeight - this.height)/3;

      //during the resize the rectangle x and y positions did not change, so, now we change them to match the new center of the rectangle
      const vertex = this.parent.getChildByName(this.name);
      vertex.x += (this.width - this.originalBounds.w)/2;
      vertex.y += (this.height - this.originalBounds.h)/2;
      this.commands.containerOutline = this.containerOutline.graphics.clear().setStrokeStyle(2).beginStroke(this.colors.mainColor).command;
      this.containerOutline.graphics.drawRoundRect(-(this.width/ 2 + 3.5), -(this.height/2 + 3.5), this.width + 7, this.height + 7, this.radius);
      this.commands.containerHook = this.containerHook.graphics.clear().beginFill(this.colors.highlightColor).command;
      this.containerHook.graphics.drawCircle(this.width/ 2 - 7.5, this.height/2 - 7.5, 5);
      if (this.type === 'Category') {
        this.containerDiff.mask.graphics.clear().drawRect(-this.width/2 - 1, -this.height/2, 10, this.height);
        this.commands.containerDiff = this.containerDiff.graphics.clear().beginFill(this.colors.activeColor).command;
        this.containerDiff.graphics.drawRoundRect(-this.width/2 - 1, -this.height/2, 20, this.height, this.radius);
      }

      //since the container x and y positions changed we can now rever the original text positions
      this.containerText.x = this.originalTextPosition.x;
      this.containerText.y = this.originalTextPosition.y;

      this.isHooked = false;
      this.isPressed = false;
    });
  }

  //animate the container to "grow" when mouse down
  handleMouseDown() {
    if (this.parent instanceof Vertex) {
      this.parent.width += this.parent.widthRamp;
      this.parent.height += this.parent.heightRamp;
      // when the rectangle reaches it's max size stop the event listener
      if (this.parent.width >= this.parent.maxWidth || this.parent.height >= this.parent.maxHeight) {
        this.parent.container.off("tick", this.parent.containerEventListener);
        Object.defineProperty(this.parent.containerEventListener, 'name', {value: 'done'});
        this.parent.width = this.parent.maxWidth;
        this.parent.height = this.parent.maxHeight;
      }
      this.parent.commands.containerShape = this.parent.containerShape.graphics.clear().beginFill(this.parent.colors.mainColor).command;
      this.parent.containerShape.graphics.drawRoundRect(-this.parent.width/2, -this.parent.height/2, this.parent.width, this.parent.height, this.parent.radius);
    }
  }

  //animate the container to "shrink" when mouse up
  handleMouseUp() {
    if (this.parent instanceof Vertex) {
      this.parent.width -= this.parent.widthRamp;
      this.parent.height -= this.parent.heightRamp;
      // when the rectangle reaches it's max size stop the event listener
      if (this.parent.width <= this.parent.minWidth || this.parent.height <= this.parent.minHeight) {
        this.parent.container.off("tick", this.parent.containerEventListener);
        Object.defineProperty(this.parent.containerEventListener, 'name', {value: 'done'});
        this.parent.width = this.parent.minWidth;
        this.parent.height = this.parent.minHeight;
      }
      this.parent.commands.containerShape = this.parent.containerShape.graphics.clear().beginFill(this.parent.colors.mainColor).command;
      this.parent.containerShape.graphics.drawRoundRect(-this.parent.width/2, -this.parent.height/2, this.parent.width, this.parent.height, this.parent.radius);
    }
  }

  selectVertex() {
    this.isSelected = true;
    this.containerOutline.visible = true;
  }

  deselectVertex() {
    this.isSelected = false;
    this.containerOutline.visible = false;
  }
}