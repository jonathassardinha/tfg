(function() {

  function Vertex(stage, w, h, rectColor, outlineColor, radius) {
    this.Container_constructor();

    // this.stage = stage;
    this.w = w;
    this.h = h;
    this.rectColor = rectColor;
    this.outlineColor = outlineColor;
    this.radius = radius;
    this.minW = this.w;
    this.minH = this.h;
    this.maxW = this.w + 3;
    this.maxH = this.h + 3;
    this.isPressed = false;
    this.rampSpaceW = (this.maxW-this.w)/3;
    this.rampSpaceH = (this.maxH-this.h)/3;
    this.setup();
  }
  var p = createjs.extend(Vertex, createjs.Container);

  p.setup = function() {
    this.rRect = new createjs.Shape();
    this.rRect.graphics.beginFill(this.rectColor).drawRoundRect(-this.w/2, -this.h/2, this.w, this.h, this.radius);
    this.rRect.cursor = "pointer";
    this.rRect.x = this.x;
    this.rRect.y = this.y;

    this.outline = new createjs.Shape();
    this.outline.graphics.setStrokeStyle(2).beginStroke(this.outlineColor).drawRoundRect(-(this.w/2+3.5), -(this.h/2+3.5), this.w+7, this.h+7, this.radius);

    this.rRect.on("mouseover", () => {
      this.addChild(this.outline);
    });

    this.rRect.on("mouseout", () => {
      if (!this.isPressed) this.removeChild(this.outline);
    });

    this.rRect.on("mousedown", () => {
      this.isPressed = true;
      if (this.rRectEventListener) this.rRect.off("tick", this.rRectEventListener);
      this.rRectEventListener = this.rRect.on("tick", this.handleMouseDown);
    });

    this.rRect.on("pressup", () => {
      this.isPressed = false;
      var pt = this.rRect.globalToLocal(this.stage.mouseX, this.stage.mouseY);
      if (!this.rRect.hitTest(pt.x, pt.y)) this.removeChild(this.outline);
      if (this.rRectEventListener) this.rRect.off("tick", this.rRectEventListener);
      this.rRectEventListener = this.rRect.on("tick", this.handleMouseUp);
    })

    this.addChild(this.rRect);

    // this.mouseChildren = false;

    // this.offset = Math.random()*10;
    this.count = 0;
  };

  p.handleMouseDown = function() {
    this.parent.w += this.parent.rampSpaceW;
    this.parent.h += this.parent.rampSpaceH;
    if (this.parent.w >= this.parent.maxW || this.parent.h >= this.parent.maxH) {
      this.off("tick", this.parent.rRectEventListener);
      this.parent.rRectEventListener = null;
      this.parent.w = this.parent.maxW;
      this.parent.h = this.parent.maxH;
    }
    this.graphics.clear().beginFill(this.parent.rectColor).drawRoundRect(-this.parent.w/2, -this.parent.h/2, this.parent.w, this.parent.h, this.parent.radius);
    // this.parent.updateCache();
  };
  p.handleMouseUp = function() {
    // console.log(this.parent.radius);
    this.parent.w -= this.parent.rampSpaceW;
    this.parent.H -= this.parent.rampSpaceH;
    if (this.parent.w <= this.parent.minW || this.parent.h <= this.parent.minH) {
      this.off("tick", this.parent.rRectEventListener);
      this.parent.rRectEventListener = null;
      this.parent.w = this.parent.minW;
      this.parent.h = this.parent.minH;
    }
    this.graphics.clear().beginFill(this.parent.rectColor).drawRoundRect(-this.parent.w/2, -this.parent.h/2, this.parent.w, this.parent.h, this.parent.radius);
    // this.parent.updateCache();
  };

  window.Vertex = createjs.promote(Vertex, "Container");
}());