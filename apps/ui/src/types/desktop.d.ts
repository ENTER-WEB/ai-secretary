export {};

declare global {
  interface Window {
    aiSecretary?: {
      getWorkspace(): Promise<string | null>;
      getJob(jobId: string): Promise<{ id: string; status: string; output: string; workspace: string; exitCode: number | null }>;
      selectWorkspace(): Promise<string | null>;
      runTask(task: string): Promise<{ id: string; status: string; workspace: string }>;
    };
  }
}
