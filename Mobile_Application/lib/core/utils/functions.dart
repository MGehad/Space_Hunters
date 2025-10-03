import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class Functions {
  static String extractIdFromPath(String path) {
    final segments = path.split('/');
    segments.removeLast();
    return segments.isNotEmpty ? segments.last : '';
  }

  static Future<void> openUrl(BuildContext context, String url) async {
    final Uri uri = Uri.parse(url);

    if (!await launchUrl(uri)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not launch URL')),
      );
    }
  }
}
