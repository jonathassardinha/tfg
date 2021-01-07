import Relationship from './Relationship';

export default class Network {
  constructor(
    public id: string,
    public relationships: Relationship[],
    public positions: {[key: string]: {x: number, y: number}}
  ){}
}