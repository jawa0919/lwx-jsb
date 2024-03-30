library lwx_jsb_lib;

import 'dart:convert';

import 'package:flutter/material.dart';

abstract class LwxJsb {
  static const String defBridgeName = "lwxJsBridge";

  String bridgeName;
  BuildContext context;

  LwxJsb(this.bridgeName, this.context);

  Future<void> runJavaScript(String javaScript);

  Future<Map<String, dynamic>> getNetworkType();

  Future<Map<String, dynamic>> getAppRunInfo(Map<String, dynamic> req);

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
