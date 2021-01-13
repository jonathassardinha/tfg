import Relationship from './Relationship';

export default class Network {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public relationships: Relationship[],
    public positions: {[key: string]: {x: number, y: number}}
  ){}
}