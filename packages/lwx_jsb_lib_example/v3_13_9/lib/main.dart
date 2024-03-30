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
  final WebViewController controller;
  LwxJsbImpl(String bridgeName, BuildContext context, this.controller)
      : super(bridgeName, context);

  @override
  Future<void> runJavaScript(String javaScript) async {
    controller.runJavaScript(javaScript);
  }

  @override
  Future<Map<String, dynamic>> getNetworkType() async {
    return {"networkType": "wifi"};
  }

  @override
  Future<Map<String, dynamic>> getAppRunInfo(Map<String, dynamic> req) async {
    final key = req['key'] ?? "";
    if (key == "token") {
      return {"token": 'qwertyuiop'};
    }
    if (key == "um") {
      return {"um": '123456789'};
    }
    return Future.error("getAppRunInfo.$key no support,pls contact us.");
  }
}
