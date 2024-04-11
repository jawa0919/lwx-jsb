import { execPromise } from "../core";

export type ScanQRCodeReturn = {
  resultStr: string;
};
/**
 * 扫码
 * @returns
 */
export function scanQRCode(): Promise<ScanQRCodeReturn> {
  return execPromise<ScanQRCodeReturn>("scanQRCode", {});
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
  return execPromise<GetLocationReturn>("getLocation", { ...args });
}

export type GetNetworkTypeReturn = {
  networkType: string;
};
/**
 * 当前网络环境
 * @returns
 */
export function getNetworkType(): Promise<GetNetworkTypeReturn> {
  return execPromise<GetNetworkTypeReturn>("getNetworkType", {});
}
