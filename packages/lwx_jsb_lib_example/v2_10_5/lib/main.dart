import 'dart:async';
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:lwx_jsb_lib/lwx_jsb_lib.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const WebPage(),
    );
  }
}

class WebPage extends StatefulWidget {
  const WebPage({Key? key}) : super(key: key);

  @override
  State<WebPage> createState() => _WebPageState();
}

class _WebPageState extends State<WebPage> {
  final String _url = "http://192.168.4.105:5500/packages/lwx-jsb_web/";
  final Completer<WebViewController> _ctrlCompleter = Completer();
  String _userAgent = "";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('WebView Example')),
      body: WebView(
        backgroundColor: Colors.white,
        key: widget.key,
        initialUrl: _url,
        onWebViewCreated: (WebViewController c) {
          _ctrlCompleter.complete(c);
          c.runJavascriptReturningResult('navigator.userAgent').then((value) {
            _userAgent = value + LwxJsb.defBridgeName;
            setState(() {});
          });
        },
        navigationDelegate: (NavigationRequest request) {
          log('---------------navigationDelegate: $request');
          return NavigationDecision.navigate;
        },
        onPageStarted: (String url) {
          log('---------------onPageStarted: $url');
        },
        onPageFinished: (String url) {
          log('---------------onPageFinished: $url');
        },
        onProgress: (int progress) {
          // log('---------------onProgress: $progress');
        },
        onWebResourceError: (error) {
          log('---------------onWebResourceError: ${error.description}');
        },
        userAgent: _userAgent,
        zoomEnabled: false,
        debuggingEnabled: true,
        javascriptMode: JavascriptMode.unrestricted,
        javascriptChannels: _buildJsSdk(context),
      ),
    );
  }

  Set<JavascriptChannel> _buildJsSdk(BuildContext context) {
    final sdk = LwxJsbImpl(LwxJsb.defBridgeName, context, _ctrlCompleter);
    return {
      JavascriptChannel(name: sdk.bridgeName, onMessageReceived: sdk.callback),
    };
  }
}

class LwxJsbImpl extends LwxJsb {
  final Completer<WebViewController> ctrlCompleter;
  LwxJsbImpl(
    String bridgeName,
    BuildContext context,
    this.ctrlCompleter,
  ) : super(bridgeName, context);

  @override
  Future<void> runJavaScript(String javaScript) async {
    (await ctrlCompleter.future).runJavascript(javaScript);
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
    return Future.error("getAppRunInfo_$key no support,pls contact us.");
  }
}
