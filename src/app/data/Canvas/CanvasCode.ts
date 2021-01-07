import CanvasStage from './CanvasStage';
import CodeType from '../CodeType';
import VertexCategory from './VertexCategory'

export default class CanvasCode extends VertexCategory {
  private _codeType: CodeType;
  private _quotations: string[];

  constructor(stage: CanvasStage, id: string, name: string, {color, type}: {color?: string, type?: CodeType}, detailsCallback: Function) {
    let codeName = type ? type.name + ': ' + name : name;
    let codeColor = type ? type.color : (color ? color : 'black');
    super(stage.stage, id, codeName, 'Code', codeColor, detailsCallback);
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