import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:typethis/typethis.dart';

import '../../../data/models/message.dart';

class MessageBubble extends StatefulWidget {
  final Message message;

  const MessageBubble({super.key, required this.message});

  @override
  State<MessageBubble> createState() => _MessageBubbleState();
}

class _MessageBubbleState extends State<MessageBubble> {
  FlutterTts? flutterTts;
  bool isPlaying = false;

  @override
  void initState() {
    super.initState();
    flutterTts = FlutterTts();
    _initializeTTS();
  }

  @override
  void dispose() {
    flutterTts?.stop();
    widget.message.isTyped = true;
    super.dispose();
  }

  void _initializeTTS() async {
    if (flutterTts != null) {
      await flutterTts!.setLanguage("en-US");
      await flutterTts!.setSpeechRate(0.5);
      await flutterTts!.setVolume(1.0);
      await flutterTts!.setPitch(1.0);

      // Set completion handler - called when speech finishes naturally
      flutterTts!.setCompletionHandler(() {
        if (mounted) {
          setState(() {
            isPlaying = false;
          });
        }
      });

      // Set error handler - called if there's an error during speech
      flutterTts!.setErrorHandler((msg) {
        if (mounted) {
          setState(() {
            isPlaying = false;
          });
        }
      });

      // Set cancel handler - called when speech is cancelled/stopped
      flutterTts!.setCancelHandler(() {
        if (mounted) {
          setState(() {
            isPlaying = false;
          });
        }
      });
    }
  }

  void _toggleTTS() async {
    if (flutterTts == null) return;

    if (isPlaying) {
      // Stop the speech
      await flutterTts!.stop();
      // Force state update immediately
      if (mounted) {
        setState(() {
          isPlaying = false;
        });
      }
    } else {
      // Start playing
      setState(() {
        isPlaying = true;
      });

      try {
        await flutterTts!.speak(widget.message.content);
      } catch (e) {
        // If there's an error, reset the playing state
        if (mounted) {
          setState(() {
            isPlaying = false;
          });
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isAI = widget.message.type == MessageType.ai;
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: isAI
            ? MainAxisAlignment.start
            : MainAxisAlignment.end,
        children: [
          if (isAI) ...[
            CircleAvatar(
              backgroundColor: const Color(0xFF8B5CF6),
              child: const Icon(Icons.smart_toy, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 12),
          ],
          Flexible(
            child: GestureDetector(
              onLongPress: () {
                // Handle long press action, e.g., copy message content
                Clipboard.setData(ClipboardData(text: widget.message.content));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Message copied to clipboard')),
                );
              },
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isAI
                      ? Colors.white.withAlpha(30)
                      : const Color(0xFF3B82F6),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  spacing: 2,
                  children: [
                    TypeThis(
                      string: widget.message.content,
                      speed: widget.message.isTyped
                          ? 0
                          : isAI
                          ? 28
                          : 0,
                      showBlinkingCursor: isAI,
                      style: const TextStyle(color: Colors.white),
                    ),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          '${widget.message.timestamp.hour.toString().padLeft(2, '0')}:${widget.message.timestamp.minute.toString().padLeft(2, '0')}',
                          style: TextStyle(
                            color: Colors.white.withAlpha(150),
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
          if (isAI) ...[
            SizedBox(width: 6),
            Container(
              decoration: BoxDecoration(
                color: Colors.white.withAlpha(30),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: isPlaying
                          ? const Color(0xFFEF4444)
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: IconButton(
                      padding: EdgeInsets.zero,
                      onPressed: _toggleTTS,
                      icon: Icon(
                        isPlaying
                            ? Icons.stop_rounded
                            : Icons.volume_up_rounded,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
