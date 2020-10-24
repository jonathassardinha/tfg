import colorNames from "../aux/colors.js";

(function() {

  function Vertex(text, rectColor, outlineColor) {
    this.Container_constructor();

    this.text = text;
    this.rectColor = colorNames(rectColor);
    this.outlineColor = outlineColor;
    //flag to check if container is clicked
    this.isPressed = false;
    //flag to check if hook is clicked
    this.hooked = false;
    this.radius = 5;
    this.x = 0;
    this.y = 0;

    this.setup();
  }
  var p = createjs.extend(Vertex, createjs.Container);

  p.setup = function() {
    //creating container text
    this.text = new createjs.Text(this.text, "12px Arial", "white");
    this.text.textAlign = 'center';
    this.text.textBaseline = 'middle';
    this.text.name = 'text';
    this.text.cursor = 'pointer';
    this.text.lineWidth = 100;
    const lines = this.text.getMeasuredHeight()/this.text.getMeasuredLineHeight();

    let bounds = this.text.getBounds();

    //the text vertical placement should be in the middle of the lines
    //so if there are 3 lines the y axis will be shifted one line up
    this.text.y = -this.text.getMeasuredLineHeight()*(lines-1)/2;

    //define initial container size based on the text
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

    //create rounded rectangle
    this.rRect = new createjs.Shape();
    this.rRect.graphics.beginFill(`hsl(${this.rectColor.h}, ${this.rectColor.s}%, ${this.rectColor.l}%)`).drawRoundRect(-this.w/2, -this.h/2, this.w, this.h, this.radius);
    this.rRect.cursor = "pointer";
    this.rRect.x = this.x;
    this.rRect.y = this.y;
    this.rRect.name = 'rRect';

    //create on hover outline
    this.outline = new createjs.Shape();
    this.outline.graphics.setStrokeStyle(2).beginStroke(this.outlineColor).drawRoundRect(-(this.w/2 + 3.5), -(this.h/2 + 3.5), this.w+7, this.h+7, this.radius);
    this.outline.x = this.x;
    this.outline.y = this.y;
    this.outline.visible = false;

    //create on hover hook
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

      //updating the width
      //the width can't be smaller than the first min width
      if (this.originalBounds.w + diffX <= this.firstMinW) {
        this.w = this.firstMinW;
        hookCenter.x = this.hookCenter.x - (this.originalBounds.w - this.firstMinW);
      }
      //the width can't be greater than 5 times the current max width
      else if (this.originalBounds.w + diffX > this.minW*5) {
        this.w = this.minW*5;
        hookCenter.x = this.hookCenter.x + this.minW*4;
      }
      else {
        this.w = this.originalBounds.w + diffX;
        this.text.x = this.originalText.x + diffX/2;
        hookCenter.x = this.hookCenter.x + diffX;
        //if the width is growing in comparison to the base width we can possibly change the number of lines
        if (this.w > this.firstMinW - 30) {
          //basically, we change the lineWidth and check if the number of lines changed
          //if they did we change then we change the text vertical placement to match
          const lineHeight = this.text.getMeasuredLineHeight();
          const linesBefore = this.text.getMeasuredHeight()/lineHeight;
          this.text.lineWidth = this.w - 30;
          const linesAfter = this.text.getMeasuredHeight()/lineHeight;
          if (linesBefore !== linesAfter) {
            this.originalText.y = -lineHeight*(linesAfter-1)/2;
            this.text.y = this.originalText.y + (this.h - this.originalBounds.h)/2;
          }
        }
      }

      //updating the height
      //the height have the same restrictions as the width
      if (this.originalBounds.h + diffY <= this.firstMinH) {
        this.h = this.firstMinH;
        hookCenter.y = this.hookCenter.y - (this.originalBounds.h - this.firstMinH);
      }
      else if (this.originalBounds.h + diffY >= this.minH*5) {
        this.h = this.minH*5;
        hookCenter.y = this.hookCenter.y + this.minH*4;

      }
      else {
        this.h = this.originalBounds.h + diffY;
        this.text.y = this.originalText.y + diffY/2;
        hookCenter.y = this.hookCenter.y + diffY;
      }
      //finally, we update the rectangle, outline and hook graphics
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
      //redefine min and max values
      this.minW = this.w;
      this.maxW = this.w + 3;
      this.rampSpaceW = (this.maxW-this.w)/3;

      this.minH = this.h;
      this.maxH = this.h + 3;
      this.rampSpaceH = (this.maxH-this.h)/3;

      //during the resize the rectangle x and y positions did not change, so, now we change them to match the new center of the rectangle
      const vertex = this.parent.getChildByName(this.name);
      vertex.x += (this.w - this.originalBounds.w)/2;
      vertex.y += (this.h - this.originalBounds.h)/2;
      this.outline.graphics.clear().setStrokeStyle(2).beginStroke(this.outlineColor).drawRoundRect(-(this.w/2 + 3.5), -(this.h/2 + 3.5), this.w+7, this.h+7, this.radius);
      this.hook.graphics.clear().beginFill(`hsl(${this.rectColor.h}, ${this.rectColor.s}%, ${this.rectColor.l+30}%)`).drawCircle(this.w/2 - 7.5, this.h/2 - 7.5, 5);

      //since the container x and y positions changed we can now rever the original text positions
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
      //changing the child index so the selected container is on the front
      this.parent.setChildIndex(this, this.parent.numChildren-1);
      if (!this.hooked) {
        this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
        this.isPressed = true;
        //if there is an event listener still going turn it off
        if (this.containerEventListener) this.container.off("tick", this.containerEventListener);
        //set a new event listener to animate the rectangle
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
      //if the mouse is outside the canvas when "declicking" remove the outline and hook
      if (!this.parent.mouseInBounds) {
        this.outline.visible = false;
        this.hook.visible = false;
      }
      if (this.containerEventListener) this.container.off("tick", this.rRectEvencontainerEventListenertListener);
      this.containerEventListener = this.container.on("tick", this.handleMouseUp);
    });

    this.addChild(this.container);

  };

  //animate the container to "grow" when mouse down
  p.handleMouseDown = function() {
    let rRect = this.getChildByName('rRect');
    this.parent.w += this.parent.rampSpaceW;
    this.parent.h += this.parent.rampSpaceH;
    // when the rectangle reaches it's max size stop the event listener
    if (this.parent.w >= this.parent.maxW || this.parent.h >= this.parent.maxH) {
      this.off("tick", this.parent.containerEventListener);
      this.parent.containerEventListener = null;
      this.parent.w = this.parent.maxW;
      this.parent.h = this.parent.maxH;
    }
    rRect.graphics.clear().beginFill(`hsl(${this.parent.rectColor.h}, ${this.parent.rectColor.s}%, ${this.parent.rectColor.l}%)`).drawRoundRect(-this.parent.w/2, -this.parent.h/2, this.parent.w, this.parent.h, this.parent.radius);
  };
  //animate the container to "shrink" when mouse up
  p.handleMouseUp = function() {
    let rRect = this.getChildByName('rRect');
    this.parent.w -= this.parent.rampSpaceW;
    this.parent.H -= this.parent.rampSpaceH;
    // when the rectangle reaches it's max size stop the event listener
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