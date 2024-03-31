import { execOnce } from "../core";

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
