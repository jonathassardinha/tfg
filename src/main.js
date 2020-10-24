import Code from './components/Code.js'
import Edge from './components/Edge.js'

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

const rRect1 = new Code(stage, 'HelloWorld', 'IndianRed', {});

const rRect2 = new Code(stage, 'Hit here youadadasdasd asd ad asd asd asd asd asd asd asd asdadasdasdasdads fuck', "Gray", {});

const edge = new Edge(stage, 'DeepSkyBlue', rRect1.renderedVertex, rRect2.renderedVertex);

stage.addChild(bg);
edge.renderArc();
rRect1.renderVertex(stage.canvas.width/3, stage.canvas.height/3);
rRect2.renderVertex(stage.canvas.width/2, stage.canvas.height/2);

createjs.Ticker.timingMode = createjs.Ticker.RAF;
stage.update();

createjs.Ticker.on("tick", function() {
  stage.update();
});
