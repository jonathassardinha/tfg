import { Injectable } from "@angular/core";
import Source from "../data/Source";
import { SourceRepository } from "../storage/firestore/SourceRepository";

@Injectable({
  providedIn: 'root'
})
export class SourceService {

  constructor (
    private sourceRepository: SourceRepository
  ) {}

  getAllSources() {
    return this.sourceRepository.getAllSources()
  }

  subscribeToSources(ids: string[]) {
    return this.sourceRepository.subscribeToSources(ids)
  }

  async getSourcesByIds(ids: string[]) {
    let sources: Source[] = [];
    for (let i = 0; i < ids.length; i+=10) {
      let queryArray = ids.slice(i, i+10);
      sources.push(...await this.sourceRepository.getByIds(queryArray));
    }

    return sources;
  }

  async saveToProject(instance: Source, projId: string) {
    return await this.sourceRepository.saveToProject(instance, projId);
  }

  async updateSource(source: Source) {
    await this.sourceRepository.update(source);
  }

  async getSourceById(id: string) {
    return await this.sourceRepository.getById(id);
  }

  async saveSource(source: Source, projId: string) {
    await this.sourceRepository.saveToProject(source, projId);
  };

  async addFragment(source: Source, fragmentId: string) {
    await this.sourceRepository.addFragment(source.id, fragmentId);
  }

  async updateContent(source: Source) {
    await this.sourceRepository.updateContent(source);
  }
}
