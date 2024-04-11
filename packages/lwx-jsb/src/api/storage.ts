import { execPromise } from "../core";

export type StorageInfoModel = { keys: string[] };

/**
 * 将数据存储在本地缓存中指定的 key 中
 */
export function setStorage(key: string, value: any): Promise<boolean> {
  return execPromise<boolean>("setStorage", { key, value });
}

/**
 * 从本地缓存中移除指定 key
 */
export function removeStorage(key: string): Promise<boolean> {
  return execPromise<boolean>("removeStorage", { key });
}

/**
 * 从本地缓存中异步获取指定 key 的内容
 */
export function getStorage<T>(key: string): Promise<T> {
  return execPromise<T>("getStorage", { key });
}

/**
 * 获取当前storage的相关信息
 */
export function getStorageInfo(): Promise<StorageInfoModel> {
  return execPromise("getStorageInfo", {});
}

/**
 * 清理本地数据缓存
 */
export function clearStorage(): Promise<boolean> {
  return execPromise<boolean>("clearStorage", {});
}
