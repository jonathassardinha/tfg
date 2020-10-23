import colorNames from "./aux/colors.js";

(function() {

  function Vertex(text, rectColor, outlineColor) {
    this.Container_constructor();

    this.text = text;
    this.rectColor = colorNames(rectColor);
    this.outlineColor = outlineColor;
    this.isPressed = false;
    this.hooked = false;
    this.radius = 5;
    this.x = 0;
    this.y = 0;

    this.setup();
  }
  var p = createjs.extend(Vertex, createjs.Container);

  p.setup = function() {
    this.text = new createjs.Text(this.text, "12px Arial", "black");
    this.text.textAlign = 'center';
    this.text.textBaseline = 'middle';
    this.text.name = 'text';
    this.text.cursor = 'pointer';
    this.text.lineWidth = 100;
    const lines = this.text.getMeasuredHeight()/this.text.getMeasuredLineHeight();

    let bounds = this.text.getBounds();

    this.text.y = -this.text.getMeasuredLineHeight()*(lines-1)/2;

    this.w = bounds.width + 30;
    this.firstMinW = this.w;
    this.minW = this.w;
    this.maxW = this.w + 3;
    this.rampSpaceW = (this.maxW-this.w)/3;

    this.h = bounds.height + 30;
    this.firstMinH = this.h;
    this.minH = this.h;
    this.maxH = this.h + 3;
    this.rampSpaceH = (this.maxH-this.h)/3;

    this.rRect = new createjs.Shape();
    this.rRect.graphics.beginFill(`hsl(${this.rectColor.h}, ${this.rectColor.s}%, ${this.rectColor.l}%)`).drawRoundRect(-this.w/2, -this.h/2, this.w, this.h, this.radius);
    this.rRect.cursor = "pointer";
    this.rRect.x = this.x;
    this.rRect.y = this.y;
    this.rRect.name = 'rRect';

    this.outline = new createjs.Shape();
    this.outline.graphics.setStrokeStyle(2).beginStroke(this.outlineColor).drawRoundRect(-(this.w/2 + 3.5), -(this.h/2 + 3.5), this.w+7, this.h+7, this.radius);
    this.outline.x = this.x;
    this.outline.y = this.y;
    this.outline.visible = false;

    this.hook = new createjs.Shape();
    this.hook.graphics.beginFill(`hsl(${this.rectColor.h}, ${this.rectColor.s}%, ${this.rectColor.l+30}%)`).drawCircle(this.w/2 - 7.5, this.h/2 - 7.5, 5);
    this.hook.cursor = 'pointer';
    this.hook.visible = false;
    this.hook.x = this.x;
    this.hook.y = this.y;

    this.container = new createjs.Container();
    this.container.addChild(this.rRect, this.text, this.hook, this.outline);

    this.hook.on("mouseover", () => {
      if (!this.hooked) this.hook.graphics.clear().beginFill(`hsl(${this.rectColor.h}, ${this.rectColor.s}%, ${this.rectColor.l+10}%)`).drawCircle(this.w/2 - 7.5, this.h/2 - 7.5, 5);
    });

    this.hook.on("mouseout", () => {
      if (!this.hooked) this.hook.graphics.clear().beginFill(`hsl(${this.rectColor.h}, ${this.rectColor.s}%, ${this.rectColor.l+30}%)`).drawCircle(this.w/2 - 7.5, this.h/2 - 7.5, 5);
    });

    this.hook.on('mousedown', (evt) => {
      this.hooked = true;
      this.isPressed = true;
      this.originalMousePosition = {x: evt.stageX, y: evt.stageY};
      this.originalBounds = {w: this.w, h: this.h};
      this.rectCenter = {x: -this.w/2, y: -this.h/2};
      this.outlineCenter = {x: -(this.w/2 + 3.5), y: -(this.h/2 + 3.5)};
      this.hookCenter = {x: this.w/2 - 7.5, y: this.h/2 - 7.5};
      this.originalText = {x: this.text.x, y: this.text.y};
    });

    this.hook.on('pressmove', (evt) => {
      const diffX = evt.stageX - this.originalMousePosition.x;
      const diffY = evt.stageY - this.originalMousePosition.y;
      let hookCenter = {};
      if (this.originalBounds.w + diffX <= this.firstMinW) {
        this.w = this.firstMinW;
        hookCenter.x = this.hookCenter.x - (this.originalBounds.w - this.firstMinW);
      }
      else if (this.originalBounds.w + diffX > this.minW*2) {
        this.w = this.minW*2;
        hookCenter.x = this.hookCenter.x + this.minW;
      }
      else {
        this.w = this.originalBounds.w + diffX;
        this.changed = true;
        hookCenter.x = this.hookCenter.x + diffX;
        this.text.x = this.originalText.x + diffX/2;
        if (this.w > this.firstMinW - 20) {
          const linesBefore = this.text.getMeasuredHeight()/this.text.getMeasuredLineHeight();
          this.text.lineWidth = this.w - 20;
          const linesAfter = this.text.getMeasuredHeight()/this.text.getMeasuredLineHeight();
          this.originalText.y = -this.text.getMeasuredLineHeight()*(linesAfter-1)/2;
          if (linesBefore !== linesAfter) this.text.y = this.originalText.y + (this.h - this.originalBounds.h)/2;
        }
      }


      if (this.originalBounds.h + diffY <= this.firstMinH) {
        this.h = this.firstMinH;
        hookCenter.y = this.hookCenter.y - (this.originalBounds.h - this.firstMinH);
      }
      else if (this.originalBounds.h + diffY >= this.minH*2) {
        this.h = this.minH*2;
        hookCenter.y = this.hookCenter.y + this.minH;

      }
      else {
        this.h = this.originalBounds.h + diffY;
        this.changed = true;
        hookCenter.y = this.hookCenter.y + diffY;
        this.text.y = this.originalText.y + diffY/2;
      }
      this.rRect.graphics.clear().beginFill(`hsl(${this.rectColor.h}, ${this.rectColor.s}%, ${this.rectColor.l}%)`).drawRoundRect(
        this.rectCenter.x,
        this.rectCenter.y,
        this.w,
        this.h,
        this.radius);
      this.outline.graphics.clear().setStrokeStyle(2).beginStroke(this.outlineColor).drawRoundRect(this.outlineCenter.x, this.outlineCenter.y, this.w+7, this.h+7, this.radius);
      this.hook.graphics.clear().beginFill(`hsl(${this.rectColor.h}, ${this.rectColor.s}%, ${this.rectColor.l+30}%)`).drawCircle(hookCenter.x, hookCenter.y, 5);
    });


    this.hook.on('pressup', () => {
      this.minW = this.w;
      this.maxW = this.w + 3;
      this.rampSpaceW = (this.maxW-this.w)/3;

      this.minH = this.h;
      this.maxH = this.h + 3;
      this.rampSpaceH = (this.maxH-this.h)/3;

      const vertex = this.parent.getChildByName(this.name);
      vertex.x += (this.w - this.originalBounds.w)/2;
      vertex.y += (this.h - this.originalBounds.h)/2;
      this.outline.graphics.clear().setStrokeStyle(2).beginStroke(this.outlineColor).drawRoundRect(-(this.w/2 + 3.5), -(this.h/2 + 3.5), this.w+7, this.h+7, this.radius);
      this.hook.graphics.clear().beginFill(`hsl(${this.rectColor.h}, ${this.rectColor.s}%, ${this.rectColor.l+30}%)`).drawCircle(this.w/2 - 7.5, this.h/2 - 7.5, 5);

      this.text.x = this.originalText.x;
      this.text.y = this.originalText.y;

      this.hooked = false;
      this.isPressed = false;
    });

    this.container.on("mouseover", () => {
      this.outline.visible = true;
      this.hook.visible = true;
    });

    this.container.on("mouseout", () => {
      if (!this.isPressed) {
        this.outline.visible = false;
        this.hook.visible = false;
      }
    });

    this.container.on("mousedown", (evt) => {
      if (!this.hooked) {
        this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
        this.isPressed = true;
        if (this.containerEventListener) this.container.off("tick", this.containerEventListener);
        this.containerEventListener = this.container.on("tick", this.handleMouseDown);
      }
    });

    this.container.on("pressmove", function (evt) {
      if (!this.parent.hooked) {
        this.parent.x = evt.stageX + this.parent.offset.x;
        this.parent.y = evt.stageY + this.parent.offset.y;
      }
    });

    this.container.on("pressup", () => {
      this.isPressed = false;
      var pt = this.container.globalToLocal(this.stage.mouseX, this.stage.mouseY);
      if (!this.container.hitTest(pt.x, pt.y)) this.outline.visible = false;
      if (this.containerEventListener) this.container.off("tick", this.rRectEvencontainerEventListenertListener);
      this.containerEventListener = this.container.on("tick", this.handleMouseUp);
    });

    this.addChild(this.container);

  };

  p.handleMouseDown = function() {
    let rRect = this.getChildByName('rRect');
    this.parent.w += this.parent.rampSpaceW;
    this.parent.h += this.parent.rampSpaceH;
    if (this.parent.w >= this.parent.maxW || this.parent.h >= this.parent.maxH) {
      this.off("tick", this.parent.containerEventListener);
      this.parent.containerEventListener = null;
      this.parent.w = this.parent.maxW;
      this.parent.h = this.parent.maxH;
    }
    rRect.graphics.clear().beginFill(`hsl(${this.parent.rectColor.h}, ${this.parent.rectColor.s}%, ${this.parent.rectColor.l}%)`).drawRoundRect(-this.parent.w/2, -this.parent.h/2, this.parent.w, this.parent.h, this.parent.radius);
  };
  p.handleMouseUp = function() {
    let rRect = this.getChildByName('rRect');
    this.parent.w -= this.parent.rampSpaceW;
    this.parent.H -= this.parent.rampSpaceH;
    if (this.parent.w <= this.parent.minW || this.parent.h <= this.parent.minH) {
      this.off("tick", this.parent.containerEventListener);
      this.parent.containerEventListener = null;
      this.parent.w = this.parent.minW;
      this.parent.h = this.parent.minH;
    }
    rRect.graphics.clear().beginFill(`hsl(${this.parent.rectColor.h}, ${this.parent.rectColor.s}%, ${this.parent.rectColor.l}%)`).drawRoundRect(-this.parent.w/2, -this.parent.h/2, this.parent.w, this.parent.h, this.parent.radius);
  };

  window.Vertex = createjs.promote(Vertex, "Container");
}());