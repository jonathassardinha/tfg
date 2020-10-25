import * as createjs from 'createjs-module';
import CanvasStage from './components/CanvasStage'
import Code from './components/Code'
import Edge from './components/Edge'

const canvasStage = new CanvasStage();
const canvas : HTMLCanvasElement = canvasStage.stage.canvas instanceof HTMLCanvasElement ? canvasStage.stage.canvas : new HTMLCanvasElement();

const bg = new createjs.Shape();
bg.graphics.beginFill('white').drawRect(0, 0, canvas.width, canvas.height);

const rRect1 = new Code(canvasStage.stage, 'HelloWorld', 'IndianRed', {});

const rRect2 = new Code(canvasStage.stage, 'Hit here youadadasdasd asd ad asd asd asd asd asd asd asd asdadasdasdasdads fuck', "Gray", {});

const edge = new Edge(canvasStage.stage, 'DeepSkyBlue', rRect1.renderedVertex, rRect2.renderedVertex);

canvasStage.addChild(bg);
edge.renderArc();
rRect1.renderVertex(canvas.width/3, canvas.height/3);
rRect2.renderVertex(canvas.width/2, canvas.height/2);

createjs.Ticker.timingMode = createjs.Ticker.RAF;
canvasStage.stage.update();

createjs.Ticker.on("tick", function() {
  canvasStage.stage.update();
});
