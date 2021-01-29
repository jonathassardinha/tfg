export default class Code {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public fragments: string[],
    public color: string,
    public parent?: string,
    public textColor: string = 'black',
  ) {}
}
