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

stage.canvas.width = window.innerWidth;
stage.canvas.height = window.innerHeight;
stage.canvas.style.width = `${window.innerWidth}px`;
stage.canvas.style.height = `${window.innerHeight}px`;
stage.canvas.getContext('2d').scale(2, 2);

const bg = new createjs.Shape();
bg.graphics.beginFill('white').drawRect(0, 0, stage.canvas.width, stage.canvas.height);

const rRect1 = new Vertex('Hello world', "IndianRed", "IndianRed");
const rect1Text = rRect1.getChildAt(0).getChildByName('text');
rRect1.x = stage.canvas.width/3;
rRect1.y = stage.canvas.height/3;
rRect1.name = 'rRect1';

const rRect2 = new Vertex('Hit here youadadasdasd asd ad asd asd asd asd asd asd asd asdadasdasdasdads fuck', "Gray", "DarkGrey");
rRect2.x = stage.canvas.width/2;
rRect2.y = stage.canvas.height/2;
rRect2.name = 'rRect2';
const rect2Text = rRect2.getChildAt(0).getChildByName('text');

var arc1 = new createjs.Shape();

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
  const pt1 = rect1Text.localToGlobal(rect1Text.x, rect1Text.y);
  pt1.x -= rect1Text.x;
  pt1.y -= rect1Text.y;
  const pt2 = rect2Text.localToGlobal(rect2Text.x, rect2Text.y);
  pt2.x -= rect2Text.x;
  pt2.y -= rect2Text.y;
  arc1.graphics.clear().setStrokeStyle(4).setStrokeDash([15, 5], dash).beginStroke("DeepSkyBlue").moveTo(pt1.x, pt1.y).bezierCurveTo(arcId['cp1x'], arcId['cp1y'], arcId['cp2x'], arcId['cp2y'], pt2.x, pt2.y);
});
