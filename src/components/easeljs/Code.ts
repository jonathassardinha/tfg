import CanvasStage from './CanvasStage.js';
import CodeType from './CodeType.js';
import Quotation from './Quotation.js';
import VertexCategory from './VertexCategory'

export default class Code extends VertexCategory {
  private _codeType: CodeType;
  private _quotations: Quotation[];

  constructor(stage: CanvasStage, name: string, type: CodeType) {
    super(stage.stage, type.name + ': ' + name, 'Code', type.color);
    this._codeType = type;
    this._quotations = [];
  }

  addQuotation(quotation: Quotation) {

  }

  removeQuotation(quotation: Quotation) {

  }

  get type() {
    return this._codeType;
  }
}