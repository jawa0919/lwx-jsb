import { getBridgeName, isRunInBridgeApp, lwxLog } from "./index";

/**
 * cd序号
 */
let cbIdentity = 0;

export type Func<T> = (data: T) => void;
export type ResolveFunc<T> = Func<T>;
export type RejectFunc = (error: unknown) => void;

/**
 * 执行一次的方法
 * @param api
 * @param req
 * @param f
 * @returns
 */
export function execOnce<T>(
  api: string,
  req?: Record<string, unknown>,
  ...f: Func<unknown>[]
): Promise<T> {
  if (!isRunInBridgeApp()) return Promise.reject("需要在App中打开");
  return new Promise<T>((resolve, reject) => {
    const id = jsBuildCallback<T>(true, api, resolve, reject, ...f);
    jsPostMessage(api, id, req ?? {}, f.map((r) => r.name) ?? []);
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
  resolve: ResolveFunc<T>,
  reject?: RejectFunc
): string | undefined {
  if (!isRunInBridgeApp()) {
    if (reject) reject("需要在App中打开");
    return undefined;
  }
  const id = jsBuildCallback<T>(false, api, resolve, reject);
  jsPostMessage(api, id, req, []);
  return id;
}

export declare namespace Bridge {
  interface BridgePostMessage {
    postMessage: (json: string) => void;
  }

  interface BridgeApiLife {
    [runningApi: string]: ApiLifeImpl;
  }

  interface ApiLifeImpl {
    resolve?: Function;
    reject?: Function;
    [otherFunc: string]: Function | undefined;
  }
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
  resolve: ResolveFunc<T>,
  reject?: RejectFunc,
  ...otherFunc: Func<unknown>[]
): string {
  const id = `_${++cbIdentity}`;
  const apiId = `${api}${id}`;
  const bridge = (window as any)[getBridgeName()];
  if (typeof bridge[apiId] === "undefined")
    bridge[apiId] = {} as Bridge.ApiLifeImpl;
  const bridgeApi = bridge[apiId];
  bridgeApi[`resolve`] = (data: T) => {
    lwxLog("_jsBuildCallback resolve", data);
    resolve(data);
    if (once) delete bridge[apiId];
  };
  if (reject)
    bridgeApi[`reject`] = (error: unknown) => {
      lwxLog("_jsBuildCallback reject", error);
      reject(`${error}`);
      if (once) delete bridge[apiId];
    };
  otherFunc.forEach((func) => {
    bridgeApi[func.name] = (res: unknown) => {
      lwxLog(`_jsBuildCallback ${func.name}`, res);
      func(res);
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
function jsPostMessage(api: string, id: string, req: object, func: string[]) {
  const map = { api, id, req, func };
  lwxLog(`_jsPostMessage`, map);
  const bridge = (window as any)[getBridgeName()];
  bridge.postMessage(JSON.stringify(map));
}
