/**
 * 打印开关
 */
let logEnable = false;

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
 * 获取打印开关
 * @returns
 */
export function lwxLog(...data: any[]): void {
  if (logEnable) console.log(...data);
}

/**
 * js挂载对象名称
 */
let bridgeName = "lwxJsBridge";

/**
 * 设置挂载对象名称
 * @returns
 */
export function saveBridgeName(val?: string): void {
  lwxLog("saveBridgeName", { val });
  bridgeName = val || bridgeName;
}

/**
 * 获取挂载对象名称
 */
export function getBridgeName(): string {
  return bridgeName;
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

export * from "./api/app";
export * from "./api/mp";
export * from "./api/wx";
