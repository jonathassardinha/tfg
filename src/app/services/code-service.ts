import { Injectable } from "@angular/core";
import { CodeRepository } from '../storage/firestore/CodeRepository';
import Code from "../data/Code";
import Category from "../data/Category";

@Injectable({
  providedIn: 'root'
})
export class CodeService {

  constructor (
    private codeRepository: CodeRepository
  ) {}

  async getCodesByIds(ids: string[]) {
    let codes: Code[] = [];
    for (let i = 0; i < ids.length; i+=10) {
      let queryArray = ids.slice(i, i+10);
      codes.push(...await this.codeRepository.getByIds(queryArray));
    }

    return codes;
  }

  async updateCodes(updateData: Partial<Code>[]) {
    for (let data of updateData) {
      await this.codeRepository.updateById(data.id, data);
    }
  }

  subscribeToCategories(ids: string[]){
    return this.codeRepository.subscribeToCodes(ids)
  }

  async saveCode(code: Code, projId: string) {
    return await this.codeRepository.saveToProject(code, projId);
  }

  async saveToCategories(code: Code, catIds: string[]) {
    await this.codeRepository.saveToCategories(code, catIds);
  }

  async updateCodeContent(code: Code, updateData: Partial<Code>){
    await this.codeRepository.updateContent(code, updateData);
  }

  async addFragment(code: Code, fragmentId: string) {
    await this.codeRepository.addFragment(code.id, fragmentId);
  }
}
