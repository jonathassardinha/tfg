export default class Code {

  constructor(
    public id: string,
    public name: string,
    public content: string,
    public color: string,
    public source: {
      id: string,
      range: Range
    },
    public textColor: string
  ) {}
}
