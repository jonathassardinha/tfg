import CanvasStage from './CanvasStage';
import CodeType from '../CodeType';
import VertexCategory from './VertexCategory'
import Vertex from './Vertex';

export default class CanvasCode extends VertexCategory {
  private _codeType: CodeType;
  private _quotations: string[];

  constructor(stage: CanvasStage, id: string, name: string, scale: number, detailsCallback: Function, offsetCallback: (x: number, y: number, vertex: Vertex) => void, {color, type}: {color?: string, type?: CodeType}) {
    let codeName = type ? type.name + ': ' + name : name;
    let codeColor = type ? type.color : (color ? color : 'black');
    super(stage, id, codeName, 'Code', codeColor, scale, detailsCallback, offsetCallback);
    this._codeType = type;
    this._quotations = [];
  }

  addQuotation(quotation: string) {

  }

  removeQuotation(quotation: string) {

  }

  get type() {
    return this._codeType;
  }
}