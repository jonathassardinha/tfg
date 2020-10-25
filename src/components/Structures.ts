import Category from "./Category";
import Code from "./Code";
import Quotation from "./Quotation";

export default class Structures {
  categories: Category[];
  codes: Code[];
  quotations: Quotation[];
  codeTypes: any[];

  constructor () {
    this.categories = [];
    this.codes = [];
    this.quotations = [];
    this.codeTypes = [];
  }

  createCategory(name: string, color: string) {

  }

  createCode(name: string, color: string, type: any) {

  }

  createNodeType(name: string, color: string) {

  }

  createQuotation(text: string) {

  }
}