import { execOnce } from "../core";

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
  return execOnce<ChooseFileReturn>("chooseFile", { ...args });
}

/**
 *  视频选择
 * @param args
 * @returns
 */
export function chooseVideo(args: ChooseFileArgs): Promise<ChooseFileReturn> {
  return execOnce<ChooseFileReturn>("chooseVideo", { ...args });
}

/**
 * 关闭所有页面，打开到应用内的某个页面
 */
export function reLaunch<T>(url: string): Promise<T> {
  return execOnce<T>("reLaunch", { url });
}

/**
 * 关闭当前页面，跳转到应用内的某个页面
 */
export function redirectTo<T>(url: string): Promise<T> {
  return execOnce<T>("redirectTo", { url });
}

/**
 * 保留当前页面，跳转到应用内的某个页面
 */
export function navigateTo<T>(url: string): Promise<T> {
  return execOnce<T>("navigateTo", { url });
}

export type StorageInfoModel = { keys: string[] };

/**
 * 将数据存储在本地缓存中指定的 key 中
 */
export function setStorage(key: string, value: any): Promise<boolean> {
  return execOnce<boolean>("setStorage", { key, value });
}

/**
 * 从本地缓存中移除指定 key
 */
export function removeStorage(key: string): Promise<boolean> {
  return execOnce<boolean>("removeStorage", { key });
}

/**
 * 从本地缓存中异步获取指定 key 的内容
 */
export function getStorage<T>(key: string): Promise<T> {
  return execOnce<T>("getStorage", { key });
}

/**
 * 获取当前storage的相关信息
 */
export function getStorageInfo(): Promise<StorageInfoModel> {
  return execOnce("getStorageInfo", {});
}

/**
 * 清理本地数据缓存
 */
export function clearStorage(): Promise<boolean> {
  return execOnce<boolean>("clearStorage", {});
}
