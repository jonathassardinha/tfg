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

const circle1 = new Vertex(stage, "IndianRed", "IndianRed", 20, 23);
circle1.x = stage.canvas.width/3;
circle1.y = stage.canvas.height/3;
circle1.snapToPixel = true;
circle1.on("mousedown", function(evt) {
  this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
});

circle1.on("pressmove", function (evt) {
  this.x = evt.stageX + this.offset.x;
  this.y = evt.stageY + this.offset.y;
  // indicate that the stage should be updated on the next tick:
});

circle1.on("pressup", function(evt) {
  arcId['cp1x'] = circle1.x
  arcId['cp1y'] = circle2.y
  arcId['cp2x'] = circle1.x
  arcId['cp2y'] = circle2.y
})

const circle2 = new Vertex(stage, "Gray", "DarkGrey", 10, 12);
circle2.x = stage.canvas.width/2;
circle2.y = stage.canvas.height/2;

circle2.on("mousedown", function(evt) {
  this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
});

circle2.on("pressmove", function (evt) {
  this.x = evt.stageX + this.offset.x;
  this.y = evt.stageY + this.offset.y;
});

circle2.on("pressup", function(evt) {
  arcId['cp1x'] = circle1.x
  arcId['cp1y'] = circle2.y
  arcId['cp2x'] = circle1.x
  arcId['cp2y'] = circle2.y
})

var arc1 = new createjs.Shape();
arc1.graphics.setStrokeStyle(4).setStrokeDash([15, 5], dash).beginStroke("DeepSkyBlue").moveTo(circle1.x, circle1.y).bezierCurveTo(arcId['cp1x'], arcId['cp1y'], arcId['cp2x'], arcId['cp2y'], circle2.x, circle2.y);

stage.addChild(bg);
stage.addChild(arc1);
stage.addChild(circle1);
stage.addChild(circle2);
createjs.Ticker.timingMode = createjs.Ticker.RAF;
stage.update();

createjs.Ticker.on("tick", function() {
  stage.update();
});

arc1.on("tick", function() {
  dash = (dash+1)%20;
  arc1.graphics.clear().setStrokeStyle(4).setStrokeDash([15, 5], dash).beginStroke("DeepSkyBlue").moveTo(circle1.x, circle1.y).bezierCurveTo(arcId['cp1x'], arcId['cp1y'], arcId['cp2x'], arcId['cp2y'], circle2.x, circle2.y);
});

window.changeArc = function(id, value) {
  arcId[id] = parseInt(value)
}