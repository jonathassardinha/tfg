import Category from "./Category";
import Code from "./Code";
import Quotation from "./Quotation";

export default class Network {
  categories: Category[];
  codes: Code[];
  quotations: Quotation[];
  visibleRelationships: any[];

  constructor() {
    this.categories = [];
    this.codes = [];
    this.quotations = [];
    this.visibleRelationships = [];
  }
}