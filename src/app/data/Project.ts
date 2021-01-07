export default class Project {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public networks?: string[],
    public sources?: string[],
    public categories?: string[],
    public codes?: string[]
  ) {}
}
