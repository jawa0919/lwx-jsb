library lwx_jsb_lib;

import 'dart:convert';

import 'package:flutter/material.dart';

abstract class LwxJsbApp {
  Future<Map<String, dynamic>> getAppRunInfo(Map<String, dynamic> req);
  Future<Map<String, dynamic>> openHtmlWindows(Map<String, dynamic> req);
  Future<Map<String, dynamic>> openFile(Map<String, dynamic> req);
  Future<Map<String, dynamic>> quitApp();
}

abstract class LwxJsbMp {
  Future<Map<String, dynamic>> chooseFile(Map<String, dynamic> req);
  Future<Map<String, dynamic>> chooseVideo(Map<String, dynamic> req);
}

abstract class LwxJsbWx {
  Future<Map<String, dynamic>> chooseImage(Map<String, dynamic> req);
  Future<Map<String, dynamic>> getLocalImgData(Map<String, dynamic> req);
  Future<Map<String, dynamic>> getNetworkType();
  Future<Map<String, dynamic>> getLocation(Map<String, dynamic> req);
  Future<Map<String, dynamic>> closeWindow();
  Future<Map<String, dynamic>> scanQRCode(Map<String, dynamic> req);
}

abstract class LwxJsb implements LwxJsbApp, LwxJsbMp, LwxJsbWx {
  static const String defBridgeName = "lwxJsBridge";

  String bridgeName;
  BuildContext context;

  LwxJsb(this.bridgeName, this.context);

  Future<void> runJavaScript(String javaScript);

  void callback(dynamic m) {
    debugPrint("LwxJsb-callback" + m.message);
    Map<String, dynamic> reqMap = jsonDecode(m.message);
    String api = reqMap['api'];
    String id = reqMap['id'];
    Map<String, dynamic> req = reqMap['req'];
    debugPrint("$bridgeName-$api-$id");
    Future.value(api).then<Map<String, dynamic>>((apiName) async {
      switch (apiName) {
        case "getNetworkType":
          return getNetworkType();
        case "getAppRunInfo":
          return getAppRunInfo(req);
        default:
          return Future.error("no support $apiName");
      }
    }).then((res) async {
      debugPrint("LwxJsb-res" + res.toString());
      String codeStr = json.encode(res);
      String evalCode = "window.$bridgeName.$api$id.resolve($codeStr)";
      await runJavaScript(evalCode);
    }).catchError((err) async {
      debugPrint("LwxJsb-err" + err.toString());
      String codeStr = err.toString();
      String evalCode = "window.$bridgeName.$api$id.reject('$codeStr')";
      await runJavaScript(evalCode);
    });
  }
}
