import { execPromise } from "../core";

/**
 * 分享
 * @returns
 */
export function share<T>(): Promise<T> {
  return execPromise<T>("share", {});
}

/**
 * 状态栏通知
 * @returns
 */
export function notification<T>(): Promise<T> {
  return execPromise<T>("notification", {});
}

/**
 * 分享
 * @returns
 */
export function shareToWeChat<T>(): Promise<T> {
  return execPromise<T>("notification", {});
}
