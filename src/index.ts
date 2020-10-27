import * as createjs from 'createjs-module';
import CanvasStage from './components/CanvasStage'
import Category from './components/Category';
import Code from './components/Code'
import CodeType from './components/CodeType';
import Edge from './components/Edge'

const canvasStage = new CanvasStage();
const canvas : HTMLCanvasElement = canvasStage.stage.canvas instanceof HTMLCanvasElement ? canvasStage.stage.canvas : new HTMLCanvasElement();

const bg = new createjs.Shape();
bg.graphics.beginFill('white').drawRect(0, 0, canvas.width, canvas.height);

const types: {[key: string]: CodeType} = {};
const typeOptions: HTMLOptionElement[] = [];
const codes: {[key: string]: Code} = {};
const codeOptions: HTMLOptionElement[] = [];

const codeTypeProblem = new CodeType('Problem', 'IndianRed');
const codeTypeTools = new CodeType('Tools', 'Gray');

let option = new Option(codeTypeProblem.name, codeTypeProblem.name, true);
typeOptions.push(option);
option = new Option(codeTypeTools.name,codeTypeTools.name, false);
typeOptions.push(option);

types[codeTypeProblem.name] = codeTypeProblem;
types[codeTypeTools.name] = codeTypeTools;

const code1 = new Code(canvasStage, 'HelloWorld', codeTypeProblem);
const code2 = new Code(canvasStage, 'Hit here youadadasdasd asd ad asd asd asd asd asd asd asd asdadasdasdasdads fuck', codeTypeTools);
codes[code1.vertex.text] = code1;
codes[code2.vertex.text] = code2;

option = new Option(code1.vertex.text, code1.vertex.text, true);
codeOptions.push(option);
option = new Option(code2.vertex.text, code2.vertex.text, false);
codeOptions.push(option);

// const category = new Category(canvasStage.stage, 'Category 1', 'DeepSkyBlue');

const edge = new Edge(canvasStage, 'DeepSkyBlue', code1.vertex, code2.vertex);
// const edge2 = new Edge(canvasStage, 'Black', code1.vertex, category.vertex);

canvasStage.addChild(bg);
edge.renderArc();
// edge2.renderArc();
code1.renderVertex(canvas.width/3, canvas.height/3);
code2.renderVertex(canvas.width/4, canvas.height/4);
// category.renderVertex(200, 200);

createjs.Ticker.timingMode = createjs.Ticker.RAF;
canvasStage.stage.update();

createjs.Ticker.on("tick", function() {
  canvasStage.stage.update();
});

// let buttons = document.getElementsByClassName('collapsible');
// Array.from(buttons).forEach(button => {
//   button.addEventListener('click', () => {
//     let content = button.nextElementSibling ? <HTMLElement> button.nextElementSibling : null;
//     if (content) content.classList.toggle('active');
//   })
// })
let codeButton = document.getElementById('codeButton');
let codeTypeButton = document.getElementById('codeTypeButton');
let codeCreator = document.getElementById('codeCreator');
let codeTypeCreator = document.getElementById('codeTypeCreator');
let exitCreator = document.getElementsByClassName('exit');
let createCode = document.getElementById('createCode');
let createCodeType = document.getElementById('createCodeType');
let codeName = <HTMLInputElement> document.getElementById('codeName');
let codeType = <HTMLSelectElement> document.getElementById('codeType');
let typeName = <HTMLInputElement> document.getElementById('typeName');
let typeColor = <HTMLInputElement> document.getElementById('typeColor');

let connectionButton = document.getElementById('connectButton');
let connectionCreator = document.getElementById('verticesConnector');
let v1Selector = <HTMLSelectElement> document.getElementById('v1');
let v2Selector = <HTMLSelectElement> document.getElementById('v2');

let createConnection = document.getElementById('connectVertices');

let activeDialog: HTMLElement | null;

typeOptions.forEach(type => codeType.appendChild(type));
codeOptions.forEach(code => {
  v1Selector.appendChild(code.cloneNode(true));
  v2Selector.appendChild(code.cloneNode(true));
});

codeButton?.addEventListener('click', () => {
  if (activeDialog) activeDialog.classList.toggle('active');
  codeCreator?.classList.add('active');
  activeDialog = codeCreator;
});

codeTypeButton?.addEventListener('click', () => {
  if (activeDialog) activeDialog.classList.toggle('active');
  codeTypeCreator?.classList.add('active');
  activeDialog = codeTypeCreator;
});

connectionButton?.addEventListener('click', () => {
  if (activeDialog) activeDialog.classList.toggle('active');
  connectionCreator?.classList.add('active');
  activeDialog = connectionCreator;
});

Array.from(exitCreator).forEach(button => {
  button.addEventListener('click', () => {
    button.parentElement?.classList.toggle('active');
    activeDialog = null;
  });
})

createCode?.addEventListener('click', () => {
  if (codeName.value !== '' && codeType.value) {
    const code = new Code(canvasStage, codeName.value, types[codeType.value]);

    codes[code.vertex.text] = code;
    let option = new Option(code.vertex.text, code.vertex.text, false);
    codeOptions.push(option);
    v1Selector.innerHTML = '';
    v2Selector.innerHTML = '';
    codeOptions.forEach(code => {
      v1Selector.appendChild(code.cloneNode(true));
      v2Selector.appendChild(code.cloneNode(true));
    });

    code.renderVertex(canvas.width/2, canvas.height/2);

    activeDialog?.classList.toggle('active');
    activeDialog = null;
  }
});

createCodeType?.addEventListener('click', () => {
  if (typeName.value !== '' && typeColor.value) {
    const type = new CodeType(typeName.value, typeColor.value);
    types[type.name] = type;

    let option = new Option(type.name, type.name, false);
    typeOptions.push(option);

    codeType.innerHTML = '';
    typeOptions.forEach(type => codeType.appendChild(type));

    activeDialog?.classList.toggle('active');
    activeDialog = null;
  }
})

createConnection?.addEventListener('click', () => {
  if (v1Selector.value && v2Selector.value) {
    const edge = new Edge(canvasStage, 'black', codes[v1Selector.value].vertex, codes[v2Selector.value].vertex);
    edge.renderArcAtBeggining();

    activeDialog?.classList.toggle('active');
    activeDialog = null;
  }
})