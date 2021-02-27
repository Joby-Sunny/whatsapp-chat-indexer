export function waitFor(interval: number): Promise<any> {
  return new Promise((resolve: Function) => setTimeout(resolve, interval));
}

export function makeFilePath(pathPrefix: string, fileName: string): string {
  return `./${pathPrefix}/${fileName}`;
}
