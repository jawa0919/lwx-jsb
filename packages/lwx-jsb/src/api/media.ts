import { execPromise } from "../core";

/**
 *  保存到媒体库
 * @param filePath
 * @returns
 */
export function saveMediaToGallerye<T>(filePath: string): Promise<T> {
  return execPromise<T>("saveMediaToGallerye", { filePath });
}

/**
 *  选择图库视频
 * @returns
 */
export function pickGalleryVideo<T>(): Promise<T> {
  return execPromise<T>("pickGalleryVideo", {});
}

/**
 *  选择拍摄视频
 * @returns
 */
export function pickCameraVideo<T>(): Promise<T> {
  return execPromise<T>("pickCameraVideo", {});
}

/**
 * 视频压缩
 * @param filePath
 * @returns
 */
export function videoCompress<T>(filePath: string): Promise<T> {
  return execPromise<T>("videoCompress", { filePath });
}

/**
 * 获取视频文件缩略图
 * @param filePath
 * @returns
 */
export function getVideoThumbnail<T>(filePath: string): Promise<T> {
  return execPromise<T>("getVideoThumbnail", { filePath });
}

/**
 *  选择图库图片
 * @returns
 */
export function pickGalleryImage<T>(): Promise<T> {
  return execPromise<T>("pickGalleryImage", {});
}

/**
 *  选择拍摄图片
 * @returns
 */
export function pickCameraImage<T>(): Promise<T> {
  return execPromise<T>("pickCameraImage", {});
}

/**
 * 图片压缩
 * @param filePath
 * @returns
 */
export function imageCompress<T>(filePath: string): Promise<T> {
  return execPromise<T>("imageCompress", { filePath });
}

/**
 *  二维码保存成图片
 * @param string
 * @returns
 */
export function qrCode2Image<T>(string: string): Promise<T> {
  return execPromise<T>("qrCode2Image", { string });
}

/**
 * 图片文件转base64
 * @param filePath
 * @returns
 */
export function image2Base64<T>(filePath: string): Promise<T> {
  return execPromise<T>("image2Base64", { filePath });
}
