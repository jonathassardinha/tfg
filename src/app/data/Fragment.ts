interface FragmentRange {
  startXPath: string;
  startOffset: number;
  endXPath: string;
  endOffset: number;
}

export default class Fragment {

  rangeObject: Range
  boundingBox: DOMRect

  constructor(
    public id: string,
    public sourceId: string,
    public range: FragmentRange,
    public content: string,
    public codes: string[],
  ) {  }


}
