export {};

declare global {
  interface Window {
    aiSecretary?: {
      getWorkspace(): Promise<string | null>;
      selectWorkspace(): Promise<string | null>;
      runTask(task: string): Promise<{ id: string; status: string; workspace: string }>;
    };
  }
}
