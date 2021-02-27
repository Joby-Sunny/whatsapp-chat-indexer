import * as fileSystem from "fs";

export class FileSystemService {
  public getAllFilesInFolder(folderPath: string): any {
    try {
      return fileSystem.readdirSync(folderPath);
    } catch (error) {
      throw error;
    }
  }

  public getFileData(filePath): any {
    try {
      const dataBuffer: any = fileSystem.readFileSync(filePath);
      return JSON.parse(dataBuffer);
    } catch (error) {
      throw error;
    }
  }
}
