import 'dart:async';

import 'package:flutter/material.dart';
import 'package:lwx_jsb_lib/lwx_jsb_lib.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: WebPage(),
    );
  }
}

class WebPage extends StatelessWidget {
  WebPage({super.key});

  final String _url = "http://192.168.4.105:5500/packages/lwx-jsb_web/";
  final WebViewController controller = WebViewController();

  @override
  Widget build(BuildContext context) {
    controller.setJavaScriptMode(JavaScriptMode.unrestricted);
    controller.setBackgroundColor(const Color(0x00000000));
    controller.setNavigationDelegate(
      NavigationDelegate(
        onProgress: (int progress) {},
        onPageStarted: (String url) {},
        onPageFinished: (String url) {},
        onWebResourceError: (WebResourceError error) {},
        onNavigationRequest: (NavigationRequest request) {
          return NavigationDecision.navigate;
        },
      ),
    );
    controller.runJavaScriptReturningResult("navigator.userAgent").then(
      (value) {
        debugPrint(value.toString());
        final userAgent = value.toString() + LwxJsb.defBridgeName;
        controller.setUserAgent(userAgent);
      },
    );
    final sdk = LwxJsbImpl(LwxJsb.defBridgeName, context, controller);
    controller.addJavaScriptChannel(
      sdk.bridgeName,
      onMessageReceived: sdk.callback,
    );
    controller.loadRequest(Uri.parse(_url));
    return Scaffold(
      appBar: AppBar(title: const Text('WebView Example')),
      body: WebViewWidget(controller: controller),
    );
  }
}

class LwxJsbImpl extends LwxJsb {
  final BuildContext context;
  final WebViewController controller;
  LwxJsbImpl(String bridgeName, this.context, this.controller)
      : super(bridgeName);

  @override
  void runJavaScript(String javaScript) {
    controller.runJavaScript(javaScript);
  }

  @override
  Future<Map<String, dynamic>> chooseFile(Map<String, dynamic> req) {
    // TODO: implement chooseFile
    throw UnimplementedError();
  }

  @override
  Future<Map<String, dynamic>> chooseImage(Map<String, dynamic> req) {
    // TODO: implement chooseImage
    throw UnimplementedError();
  }

  @override
  Future<Map<String, dynamic>> chooseVideo(Map<String, dynamic> req) {
    // TODO: implement chooseVideo
    throw UnimplementedError();
  }

  @override
  Future<Map<String, dynamic>> closeWindow(Map<String, dynamic> req) {
    // TODO: implement closeWindow
    throw UnimplementedError();
  }

  @override
  Future<Map<String, dynamic>> getAppRunInfo(Map<String, dynamic> req) async {
    final key = req['key'] ?? "";
    if (key == "token") {
      return {"token": 'qwe'};
    }
    if (key == "um") {
      return {"um": '123'};
    }
    throw UnimplementedError("getAppRunInfo.$key no support,pls contact us.");
  }

  @override
  Future<Map<String, dynamic>> getLocalImgData(Map<String, dynamic> req) {
    // TODO: implement getLocalImgData
    throw UnimplementedError();
  }

  @override
  Future<Map<String, dynamic>> getLocation(Map<String, dynamic> req) {
    // TODO: implement getLocation
    throw UnimplementedError();
  }

  @override
  Future<Map<String, dynamic>> getNetworkType(Map<String, dynamic> req) async {
    return {"networkType": "wifi"};
  }

  @override
  Future<Map<String, dynamic>> openFile(Map<String, dynamic> req) {
    // TODO: implement openFile
    throw UnimplementedError();
  }

  @override
  Future<Map<String, dynamic>> openHtmlWindows(Map<String, dynamic> req) {
    // TODO: implement openHtmlWindows
    throw UnimplementedError();
  }

  @override
  Future<Map<String, dynamic>> quitApp(Map<String, dynamic> req) {
    // TODO: implement quitApp
    throw UnimplementedError();
  }

  @override
  Future<Map<String, dynamic>> scanQRCode(Map<String, dynamic> req) {
    // TODO: implement scanQRCode
    throw UnimplementedError();
  }
}
