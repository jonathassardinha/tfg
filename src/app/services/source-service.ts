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
}
