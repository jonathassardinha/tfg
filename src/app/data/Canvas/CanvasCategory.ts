import CanvasStage from './CanvasStage';
import CanvasCode from './CanvasCode';
import VertexCategory from './VertexCategory'
import Vertex from './Vertex';

export default class CanvasCategory extends VertexCategory {
  codes: string[];
  categories: string[];

  constructor(stage: CanvasStage, id: string, name: string, description: string, color: string, scale: number, detailsCallback: Function, offsetCallback: (x: number, y: number, vertex: Vertex) => void) {
    super(stage, id, name, description, 'Category', color, scale, detailsCallback, offsetCallback);
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