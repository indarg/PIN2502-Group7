import { TResponse } from "src/models/response/TResponses";
import { TNews } from "src/models/TNews";
import HttpService from "./HttpService";
import { httpServer, storageHttpServer } from "src/clients/mw-server";
import { TMediaFile } from "src/models/TMediaFile";


export type TFile = {
  fileUrl: string,
  fileSize: number,
  fileFormat: string,
  fileName: string
}
export default class CRMStorageService extends HttpService<TMediaFile> {


  constructor() {
    super('v1/storage/crm/');
  }
  deleteFile(id: string): Promise<TResponse<boolean>> {
    return httpServer.delete(`/${this.baseUrl}delete/id/${id}`)
      .then(({ data }: any): TResponse<boolean> => data as TResponse<boolean>)
  }
  deleteFileByName(name: string): Promise<TResponse<boolean>> {
    return httpServer.post(`/${this.baseUrl}delete/filename`, { file_identifier: name })
      .then(({ data }: any): TResponse<boolean> => data as TResponse<boolean>)
  }

  deleteFileByNameBulk(file_identifiers: string[]): Promise<TResponse<boolean>> {
    return httpServer.post(`/${this.baseUrl}delete/filename/bulk`, { file_identifiers })
      .then(({ data }: any): TResponse<boolean> => data as TResponse<boolean>)
  }

  uploadFile(formData: FormData, overwrite: boolean = false): Promise<TResponse<TFile>> {
    formData.append("overwrite", overwrite ? "true" : "false");
    return storageHttpServer.post(`${this.baseUrl}upload/`, formData)
      .then(({ data }: any): TResponse<TFile> => data as TResponse<TFile>)
  }

  saveFiles = async (fileAsBlobMap: Record<string, Blob>, imageSubName = (Date.now() + Math.floor(Math.random() * 10)).toString()): Promise<Map<string, TResponse<TFile>>> => {
    const responses = new Map<string, TResponse<TFile>>();

    for (const id in fileAsBlobMap) {
      const blob = fileAsBlobMap[id];
      if (!blob) continue;

      const formData = new FormData();
      const fileName = imageSubName?.replace(/\s/g, "_").toLowerCase();
      formData.append('file', blob, `${fileName}-${id}.webp`);
      formData.append('title', `${fileName}-${id}.webp`);
      formData.append('media_type', 'image');
      const res = await this.uploadFile(formData, true);
      responses.set(id, res);
    }
    return responses;
  };

}