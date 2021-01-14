export default class Category {
  constructor(
    public id: string,
    public name: string,
    public color: string,
    public textColor: string,
    public categories: string[],
    public codes: string[],
    public parent?: string,
  ) {
  }

  addCode(code: string) {
    this.codes.push(code);
  }

  addCategory(category: string) {
    this.categories.push(category);
  }
}
