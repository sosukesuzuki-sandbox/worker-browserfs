import { h, render, createContext } from 'preact';
import { useContext, useState, useEffect } from 'preact/hooks';
import * as Comlink from 'comlink';

const WorkerContext = createContext(null);
export const useWorker = () => useContext(WorkerContext);

function Main() {
  const [files, setFiles] = useState([]);
  const { readdir } = useWorker();
  useEffect(() => {
    (async () => {
      const files = await readdir('.');
      setFiles(files);
    })();
  }, []);
  return h(
    'div',
    { style: { display: 'flex' } },
    files.map(file => h('p', null, file)),
  );
}

function App({ proxy }) {
  return h(WorkerContext.Provider, { value: proxy }, [
    h('h1', null, 'worker-browserfs'),
    h(Main),
  ]);
}

function setUpFS(worker) {
  return new Promise((resolve, reject) => {
    BrowserFS.install(window);
    BrowserFS.configure({ fs: 'LocalStorage' }, error => {
      if (error) {
        reject(error);
      }
      BrowserFS.FileSystem.WorkerFS.attachRemoteListener(worker);
      resolve();
    });
  });
}

(async () => {
  const worker = new Worker('./worker/index.js', { type: 'module' });
  await setUpFS(worker);
  const WorkerProxy = Comlink.wrap(worker);
  const proxy = await new WorkerProxy();
  render(h(App, { proxy }), document.body);
})();
