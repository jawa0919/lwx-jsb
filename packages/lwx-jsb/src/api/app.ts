import { execOnce } from "../core";

/**
 * 获取运行信息
 * @returns
 */
export function getAppRunInfo<T>(key: string): Promise<T> {
  return execOnce<T>("getAppRunInfo", { key });
}

/**
 * 打开Html网页
 */
export function openHtmlWindows<T>(url: string): Promise<T> {
  return execOnce<T>("openHtmlWindows", { url });
}

/**
 * 打开文件
 */
export function openFile<T>(filePath: string): Promise<T> {
  return execOnce<T>("openFile", { filePath });
}

/**
 * 关闭App
 * @returns
 */
export function quitApp<T>(): Promise<T> {
  return execOnce<T>("quitApp", {});
}
