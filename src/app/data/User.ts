export default class User {
  constructor(
    public id: string,
    public username: string,
    public projectsIds: string[]
  ) {}
}
