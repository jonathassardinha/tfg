(function() {

  function Vertex(stage, circleColor, outlineColor, radius, maxRadius) {
    this.Container_constructor();

    // this.stage = stage;
    this.circleColor = circleColor;
    this.outlineColor = outlineColor;
    this.radius = radius;
    this.minRadius = this.radius;
    this.maxRadius = maxRadius;
    this.isPressed = false;
    this.rampSpace = (maxRadius-radius)/3;
    this.setup();
  }
  var p = createjs.extend(Vertex, createjs.Container);

  p.setup = function() {
    this.circle = new createjs.Shape();
    this.circle.graphics.beginFill(this.circleColor).drawCircle(0, 0, this.radius);
    this.circle.cursor = "pointer";
    this.circle.x = this.x;
    this.circle.y = this.y;

    this.outline = new createjs.Shape();
    this.outline.graphics.setStrokeStyle(2).beginStroke(this.outlineColor).drawCircle(0, 0, this.radius+5);

    this.circle.on("mouseover", () => {
      this.addChild(this.outline);
    });

    this.circle.on("mouseout", () => {
      if (!this.isPressed) this.removeChild(this.outline);
    });

    this.circle.on("mousedown", () => {
      this.isPressed = true;
      if (this.circleEventListener) this.circle.off("tick", this.circleEventListener);
      this.circleEventListener = this.circle.on("tick", this.handleMouseDown);
    });

    this.circle.on("pressup", () => {
      this.isPressed = false;
      var pt = this.circle.globalToLocal(this.stage.mouseX, this.stage.mouseY);
      if (!this.circle.hitTest(pt.x, pt.y)) this.removeChild(this.outline);
      if (this.circleEventListener) this.circle.off("tick", this.circleEventListener);
      this.circleEventListener = this.circle.on("tick", this.handleMouseUp);
    })

    this.addChild(this.circle);

    // this.mouseChildren = false;

    // this.offset = Math.random()*10;
    this.count = 0;
  };

  p.handleMouseDown = function() {
    this.parent.radius += this.parent.rampSpace;
    if (this.parent.radius >= this.parent.maxRadius) {
      this.off("tick", this.parent.circleEventListener);
      this.parent.circleEventListener = null;
      this.parent.radius = this.parent.maxRadius;
    }
    this.graphics.clear().beginFill(this.parent.circleColor).drawCircle(0, 0, this.parent.radius);
    // this.parent.updateCache();
  };
  p.handleMouseUp = function() {
    // console.log(this.parent.radius);
    this.parent.radius -= this.parent.rampSpace;
    if (this.parent.radius <= this.parent.minRadius) {
      this.off("tick", this.parent.circleEventListener);
      this.parent.circleEventListener = null;
      this.parent.radius = this.parent.minRadius;
    }
    this.graphics.clear().beginFill(this.parent.circleColor).drawCircle(0, 0, this.parent.radius);
    // this.parent.updateCache();
  };



  window.Vertex = createjs.promote(Vertex, "Container");
}());