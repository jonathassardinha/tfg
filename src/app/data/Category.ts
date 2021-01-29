export default class Category {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public color: string,
    public textColor: string,
    public parent?: string,
    public categories?: string[],
    public codes?: string[]
  ) {
  }

  addCode(code: string) {
    this.codes.push(code);
  }

  addCategory(category: string) {
    this.categories.push(category);
  }
}
