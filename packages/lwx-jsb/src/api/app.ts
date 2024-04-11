import { execCallback, execPromise } from "../core";

/**
 * 获取运行信息
 * @param key
 * @returns
 */
export function getAppRunInfo<T>(key: string): Promise<T> {
  return execPromise<T>("getAppRunInfo", { key });
}

/**
 * 打开Html网页视图
 * @param url
 * @returns
 */
export function openHtmlWindows(url: string): Promise<boolean> {
  return execPromise<boolean>("openHtmlWindows", { url });
}

/**
 * 关闭Html网页视图
 * @returns
 */
export function closeHtmlWindow(): Promise<boolean> {
  return execPromise<boolean>("closeWindow", {});
}

/**
 * 保留当前页面，跳转到应用内的某个页面
 */
export function navigateTo<T>(targetUrl: string): Promise<T> {
  return execPromise<T>("navigateTo", { targetUrl });
}

/**
 * 关闭App
 * @returns
 */
export function quitApp(): Promise<boolean> {
  return execPromise<boolean>("quitApp", {});
}
