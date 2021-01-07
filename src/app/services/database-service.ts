import { Injectable } from "@angular/core";
import { SourceRepository } from "../storage/firestore/SourceRepository";
import Source from "src/app/data/Source";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor (
    private sourceRepository: SourceRepository,
  ) {}

  // Source

  async getSourceById(id: string) {
    return await this.sourceRepository.getById(id);
  }

  async getSourcesByIds(ids: string[]) {
    return await this.sourceRepository.getByIds(ids);
  }

  getAllSources() {
    return this.sourceRepository.getAllSources()
  }

  async saveSource(source: Source, projId: string) {
    await this.sourceRepository.saveToProject(source, projId);
  };

  async updateSource(source: Source) {
    await this.sourceRepository.update(source);
  }

}
