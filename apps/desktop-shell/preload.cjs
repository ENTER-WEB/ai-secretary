const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("aiSecretary", Object.freeze({
  getWorkspace: () => ipcRenderer.invoke("secretary:get-workspace"),
  selectWorkspace: () => ipcRenderer.invoke("secretary:select-workspace"),
  runTask: (task) => ipcRenderer.invoke("secretary:run-task", { task, confirmed: true }),
}));
