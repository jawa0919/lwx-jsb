library lwx_jsb_lib;

import 'dart:convert';

import 'package:flutter/foundation.dart';

abstract class LwxJsbApp {
  Future<Map<String, dynamic>> getAppRunInfo(Map<String, dynamic> req);
  Future<Map<String, dynamic>> openHtmlWindows(Map<String, dynamic> req);
  Future<Map<String, dynamic>> openFile(Map<String, dynamic> req);
  Future<Map<String, dynamic>> quitApp(Map<String, dynamic> req);
}

abstract class LwxJsbMp {
  Future<Map<String, dynamic>> chooseFile(Map<String, dynamic> req);
  Future<Map<String, dynamic>> chooseVideo(Map<String, dynamic> req);
}

abstract class LwxJsbWx {
  Future<Map<String, dynamic>> chooseImage(Map<String, dynamic> req);
  Future<Map<String, dynamic>> getLocalImgData(Map<String, dynamic> req);
  Future<Map<String, dynamic>> getNetworkType(Map<String, dynamic> req);
  Future<Map<String, dynamic>> getLocation(Map<String, dynamic> req);
  Future<Map<String, dynamic>> closeWindow(Map<String, dynamic> req);
  Future<Map<String, dynamic>> scanQRCode(Map<String, dynamic> req);
}

abstract class LwxJsb implements LwxJsbApp, LwxJsbMp, LwxJsbWx {
  static const String defBridgeName = "lwxJsBridge";

  String bridgeName;
  LwxJsb(this.bridgeName);

  void callback(dynamic javaScriptMessage) {
    debugPrint("LwxJsb-callback " + javaScriptMessage.message);
    Map<String, dynamic> reqMap = jsonDecode(javaScriptMessage.message);
    String api = reqMap['api'];
    String id = reqMap['id'];
    Map<String, dynamic> req = reqMap['req'] ?? {};
    // TODO 2024-03-31 14:56:25 func support
    // List<String> func = reqMap['func'] ?? [];
    debugPrint("LwxJsb-run $bridgeName.$api$id");
    Future.value(api).then<Map<String, dynamic>>((apiName) {
      switch (apiName) {
        case "getAppRunInfo":
          return getAppRunInfo(req);
        case "openHtmlWindows":
          return openHtmlWindows(req);
        case "openFile":
          return openFile(req);
        case "quitApp":
          return quitApp(req);

        case "chooseFile":
          return chooseFile(req);
        case "chooseVideo":
          return chooseVideo(req);

        case "chooseImage":
          return chooseImage(req);
        case "getLocalImgData":
          return getLocalImgData(req);
        case "getNetworkType":
          return getNetworkType(req);
        case "getLocation":
          return getLocation(req);
        case "closeWindow":
          return closeWindow(req);
        case "scanQRCode":
          return scanQRCode(req);

        default:
          return Future.error("no support $apiName");
      }
    }).then((res) {
      debugPrint("LwxJsb-res " + res.toString());
      String codeStr = json.encode(res);
      String evalCode = "$bridgeName.$api$id.resolve($codeStr)";
      runJavaScript(evalCode);
    }).catchError((err) async {
      debugPrint("LwxJsb-err " + err.toString());
      String codeStr = err.toString();
      String evalCode = "$bridgeName.$api$id.reject('$codeStr')";
      runJavaScript(evalCode);
    });
  }

  void resolve(String codeStr) {}

  void reject(String codeStr) {}

  void runJavaScript(String javaScript);
}
