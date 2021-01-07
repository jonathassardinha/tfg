export class Repository<T> {
  constructor () {}

  async getById(id: string): Promise<T> {
    return;
  }

  async getAll(): Promise<T[]> {
    return;
  };

  async save(instance: T) {
    return;
  }

  async getByProperty(property: string, match: string): Promise<T[]> {
    return;
  }
}