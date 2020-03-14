import * as comlink from 'comlink';
import pify from 'pify';

function setUpFSInWorker() {
  return new Promise((resolve, reject) => {
    importScripts('/browserfs.min.js');
    BrowserFS.configure(
      { fs: 'WorkerFS', options: { worker: self } },
      error => {
        if (error) {
          reject();
        }
        resolve();
      },
    );
  });
}

export class WorkerAPI {
  constructor() {
    setUpFSInWorker().then(() => console.log('READY!'));
  }
  async writeFile(path, data) {
    const fs = BrowserFS.BFSRequire('fs');
    await pify(fs.writeFile)(path, data);
  }
  async readdir(path) {
    const fs = BrowserFS.BFSRequire('fs');
    const data = await pify(fs.readdir)(path);
    return data;
  }
  async readFile(path) {
    const fs = BrowserFS.BFSRequire('fs');
    const data = await pify(fs.readFile)(path);
    return data;
  }
}

comlink.expose(WorkerAPI);
