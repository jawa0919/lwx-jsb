import { execCallback, execPromise } from "../core";

/**
 * 打开文件
 * @param filePath
 * @returns
 */
export function openFile(filePath: string): Promise<boolean> {
  return execPromise<boolean>("openFile", { filePath });
}

export type ChooseFileArgs = {
  type: string[];
};
export type ChooseFileFile = {
  name: string;
  size: number;
  path: string;
};
export type ChooseFileReturn = {
  files: ChooseFileFile[];
};
/**
 *  文件选择
 * @param args
 * @returns
 */
export function chooseFile(args: ChooseFileArgs): Promise<ChooseFileReturn> {
  return execPromise<ChooseFileReturn>("chooseFile", { ...args });
}

export type DowloadFileArgs = {
  url: string;
  headers?: Record<string, unknown>;
  fileName?: string;
};
export type DowloadFileCallback<T> = {
  resolve: (res: T) => void;
  reject: (err: unknown) => void;
  onDownloadProgress: (progress: unknown) => void;
};
/**
 * 下载文件
 * @param args
 * @returns 下载到本地的文件路径
 */
export function dowloadFile<T>(
  args: DowloadFileArgs,
  callback: DowloadFileCallback<T>
): string | undefined {
  return execCallback<T>(
    "dowloadFile",
    { ...args },
    callback.resolve,
    callback.reject,
    callback.onDownloadProgress
  );
}

export type UploadFileArgs = {
  url: string;
  filePath?: string;
  headers?: Record<string, unknown>;
  data?: Record<string, unknown>;
};
export type UploadFileCallback<T> = {
  resolve: (res: T) => void;
  reject: (err: unknown) => void;
  onUploadProgress: (progress: unknown) => void;
};

/**
 * 上传文件
 * @param args
 * @returns 上传文件
 */
export function uploadFile<T>(
  args: UploadFileArgs,
  callback: UploadFileCallback<T>
): string | undefined {
  return execCallback<T>(
    "uploadFile",
    { ...args },
    callback.resolve,
    callback.reject,
    callback.onUploadProgress
  );
}
