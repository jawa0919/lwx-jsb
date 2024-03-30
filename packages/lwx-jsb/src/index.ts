////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * 打印开关
 */
let logEnable = false;
/**
 * 获取打印开关
 * @returns
 */
function lwxLog(...data: any[]): void {
  if (logEnable) console.log(...data);
}

/**
 * 设置打印开关
 *
 * @returns
 */
export function setLogEnable(val: boolean): void {
  lwxLog("setLogEnable", { val });
  logEnable = val;
}

/**
 * 读取Code
 *
 * @returns
 */
export function getCodeFormUrl(keyName = "code"): string {
  lwxLog("getCodeFormUrl", { keyName }, location.href);
  const query = new URL(location.href.toLocaleLowerCase()).searchParams;
  const resCode = query.get(keyName.toLocaleLowerCase());
  return resCode || "";
}

/**
 * js挂载对象名称
 */
let bridgeName = "lwxJsBridge";

/**
 * 设置挂载对象名称
 *
 * @returns
 */
export function saveBridgeName(val?: string): void {
  lwxLog("saveBridgeName", { val });
  bridgeName = val || bridgeName;
}

/**
 * 是否是在BridgeApp环境-通过window对象挂载来判断
 *
 * @returns
 */
export function isRunInBridgeApp(): boolean {
  const bridge = (window as any)[bridgeName];
  if (typeof bridge === "undefined") {
    return false;
  }
  return true;
}

////////////////////////////////////////////////////////////////////////////////
// 核心
////////////////////////////////////////////////////////////////////////////////
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
function execOnce<T>(
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
  const bridge = (window as any)[bridgeName];
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
  const bridge = (window as any)[bridgeName];
  lwxLog(`_jsPostMessage`, map);
  bridge.postMessage(JSON.stringify(map));
}

////////////////////////////////////////////////////////////////////////////////
// 核心结束
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// 下面是api
////////////////////////////////////////////////////////////////////////////////

export type ChooseImageArgs = {
  count: number; // 默认9
  sizeType: string[]; // 可以指定是原图还是压缩图，默认二者都有
  sourceType: string[]; // 可以指定来源是相册还是相机，默认二者都有
};
export type ChooseImageReturn = {
  localIds: string[];
};
/**
 * 拍照或从手机相册中选图接口
 * @returns
 */
export function chooseImage(args: ChooseImageArgs): Promise<ChooseImageReturn> {
  return execOnce<ChooseImageReturn>("chooseImage", { ...args });
}

export type GetLocalImgDataArgs = {
  localId: string; // 图片的localID
};
export type GetLocalImgDataReturn = {
  localData: string; // localData是图片的base64数据，可以用img标签显示
};
/**
 * 获取本地图片接口
 * @returns
 */
export function getLocalImgData(
  args: ChooseImageArgs
): Promise<GetLocalImgDataReturn> {
  return execOnce<GetLocalImgDataReturn>("getLocalImgData", { ...args });
}

export type GetNetworkTypeReturn = {
  networkType: string;
};
/**
 * 当前网络环境
 * @returns
 */
export function getNetworkType(): Promise<GetNetworkTypeReturn> {
  return execOnce<GetNetworkTypeReturn>("getNetworkType", {});
}

export type GetLocationArgs = {
  type: "wgs84" | "gcj02";
};
export type GetLocationReturn = {
  latitude: number;
  longitude: number;
  speed: number;
  accuracy: string;
};
/**
 * 一次定位
 * @returns
 */
export function getLocation(args: GetLocationArgs): Promise<GetLocationReturn> {
  return execOnce<GetLocationReturn>("getLocation", { ...args });
}

/**
 * 关闭视图
 * @returns
 */
export function closeWindow(): Promise<void> {
  return execOnce<void>("closeWindow", {});
}

export type ScanQRCodeArgs = {
  needResult: number;
  scanType: string[];
};
export type ScanQRCodeReturn = {
  resultStr: string;
};
/**
 * 扫码
 * @returns
 */
export function scanQRCode(args: ScanQRCodeArgs): Promise<ScanQRCodeReturn> {
  return execOnce<ScanQRCodeReturn>("scanQRCode", { ...args });
}

////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////

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
  return execOnce("getStorageInfo");
}

/**
 * 清理本地数据缓存
 */
export function clearStorage(): Promise<boolean> {
  return execOnce<boolean>("clearStorage");
}

////////////////////////////////////////////////////////////////////////////////

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
export function quitApp(): Promise<boolean> {
  return execOnce<boolean>("quitApp", {});
}

////////////////////////////////////////////////////////////////////////////////
