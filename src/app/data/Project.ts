export default class Project {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public networks?: string[],
    public sources?: string[],
    public categories?: string[],
    public codes?: string[]
  ) {}
}
