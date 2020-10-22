import "./Vertex.js";

let dash = 0;
let arcId = {
  "cp1x": 250,
  "cp1y": 150,
  "cp2x": 250,
  "cp2y": 150
}

var stage = new createjs.Stage("canva");
stage.enableMouseOver();
stage.mouseMoveOutside = true;
createjs.Touch.enable(stage);

const bg = new createjs.Shape();
bg.graphics.beginFill('white').drawRect(0, 0, stage.canvas.width, stage.canvas.height);

const rRect1 = new Vertex(stage, 30, 50, "IndianRed", "IndianRed", 5);
rRect1.x = stage.canvas.width/3;
rRect1.y = stage.canvas.height/3;
rRect1.snapToPixel = true;
rRect1.on("mousedown", function(evt) {
  this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
});

rRect1.on("pressmove", function (evt) {
  this.x = evt.stageX + this.offset.x;
  this.y = evt.stageY + this.offset.y;
  // indicate that the stage should be updated on the next tick:
});

rRect1.on("pressup", function(evt) {
  arcId['cp1x'] = rRect1.x
  arcId['cp1y'] = rRect2.y
  arcId['cp2x'] = rRect1.x
  arcId['cp2y'] = rRect2.y
})

const rRect2 = new Vertex(stage, 80, 50, "Gray", "DarkGrey", 5, 85, 55);
rRect2.x = stage.canvas.width/2;
rRect2.y = stage.canvas.height/2;

rRect2.on("mousedown", function(evt) {
  this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
});

rRect2.on("pressmove", function (evt) {
  this.x = evt.stageX + this.offset.x;
  this.y = evt.stageY + this.offset.y;
});

rRect2.on("pressup", function(evt) {
  arcId['cp1x'] = rRect1.x
  arcId['cp1y'] = rRect2.y
  arcId['cp2x'] = rRect1.x
  arcId['cp2y'] = rRect2.y
})

var arc1 = new createjs.Shape();
arc1.graphics.setStrokeStyle(4).setStrokeDash([15, 5], dash).beginStroke("DeepSkyBlue").moveTo(rRect1.x, rRect1.y).bezierCurveTo(arcId['cp1x'], arcId['cp1y'], arcId['cp2x'], arcId['cp2y'], rRect2.x, rRect2.y);

stage.addChild(bg);
stage.addChild(arc1);
stage.addChild(rRect1);
stage.addChild(rRect2);
createjs.Ticker.timingMode = createjs.Ticker.RAF;
stage.update();

createjs.Ticker.on("tick", function() {
  stage.update();
});

arc1.on("tick", function() {
  dash = (dash+1)%20;
  arc1.graphics.clear().setStrokeStyle(4).setStrokeDash([15, 5], dash).beginStroke("DeepSkyBlue").moveTo(rRect1.x, rRect1.y).bezierCurveTo(arcId['cp1x'], arcId['cp1y'], arcId['cp2x'], arcId['cp2y'], rRect2.x, rRect2.y);
});

window.changeArc = function(id, value) {
  arcId[id] = parseInt(value)
}