import CanvasStage from './CanvasStage';
import CanvasCode from './CanvasCode';
import VertexCategory from './VertexCategory'

export default class CanvasCategory extends VertexCategory {
  codes: string[];
  categories: string[];

  constructor(stage: CanvasStage, id: string, name: string, color: string, detailsCallback: Function) {
    super(stage.stage, id, name, 'Category', color, detailsCallback);
    this.codes = [];
    this.categories = [];
  }

  addCode(codeId: string) {
    this.codes.push(codeId);
  }

  removeCode(codeId: string) {
    this.codes = this.codes.filter(existingCodeId => codeId === existingCodeId);
  }

  addCategory(categoryId: string) {
    this.categories.push(categoryId);
  }

  removeCategory(categoryId: string) {
    this.categories = this.categories.filter(existingCategoryId => categoryId === existingCategoryId);
  }
}