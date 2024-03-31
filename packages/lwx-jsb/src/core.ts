import { getBridgeName, isRunInBridgeApp, lwxLog } from "./index";

/**
 * cd序号
 */
let cbIdentity = 0;

/**
 * 执行一次的方法
 * @param api
 * @param req
 * @param f
 * @returns
 */
export function execOnce<T>(
  api: string,
  req: Record<string, unknown> = {}
): Promise<T> {
  if (!isRunInBridgeApp()) return Promise.reject("需要在App中打开");
  return new Promise<T>((resolve, reject) => {
    const id = jsBuildCallback<T>(true, api, resolve, reject);
    jsPostMessage(api, id, req);
  });
}

/**
 * 执行多次的方法
 * @param api
 * @param req
 * @param f
 * @returns
 * @deprecated Use `execOnce()` instead.
 */
export function exec<T>(
  api: string,
  req: Record<string, unknown> = {},
  resolve: (res: T) => void,
  reject?: (err: unknown) => void,
  ...f: ((data: unknown) => void)[]
): string | undefined {
  if (!isRunInBridgeApp()) {
    if (reject) reject("需要在App中打开");
    return undefined;
  }
  const id = jsBuildCallback<T>(false, api, resolve, reject, ...f);
  jsPostMessage(api, id, req, ...(f.map((r) => r.name) ?? []));
  return id;
}

/**
 * 构建联通函数
 * @param once
 * @param api
 * @param resolve
 * @param reject
 * @param otherFunc
 * @returns
 */
function jsBuildCallback<T>(
  once = true,
  api: string,
  resolve: (res: T) => void,
  reject?: (err: unknown) => void,
  ...f: ((data: unknown) => void)[]
): string {
  const id = `_${++cbIdentity}`;
  const apiId = `${api}${id}`;
  const bridge = (window as any)[getBridgeName()];
  if (typeof bridge[apiId] === "undefined") bridge[apiId] = {};
  const bridgeApi = bridge[apiId];
  bridgeApi[`resolve`] = (res: T) => {
    lwxLog("_jsBuildCallback resolve", res);
    resolve(res);
    if (once) delete bridge[apiId];
  };
  if (reject)
    bridgeApi[`reject`] = (err: unknown) => {
      lwxLog("_jsBuildCallback reject", err);
      reject(`${err}`);
      if (once) delete bridge[apiId];
    };
  f.forEach((func) => {
    bridgeApi[func.name] = (data: unknown) => {
      lwxLog(`_jsBuildCallback ${func.name}`, data);
      func(data);
    };
  });
  lwxLog(`_jsBuildCallback`, bridgeApi);
  return id;
}

/**
 * 返回函数
 * @param api
 * @param id
 * @param req
 * @param func
 */
function jsPostMessage(
  api: string,
  id: string,
  req: Record<string, unknown>,
  ...func: string[]
) {
  const map = { api, id, req, func };
  lwxLog(`_jsPostMessage`, map);
  const bridge = (window as any)[getBridgeName()];
  bridge.postMessage(JSON.stringify(map));
}
