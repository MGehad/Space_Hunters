import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_recognition_result.dart';
import '../../../../core/services/pmc_service.dart';
import '../../../../core/widgets/app_header.dart';
import '../../../../core/widgets/space_background.dart';
import '../../data/models/message.dart';
import 'widgets/message_bubble.dart';
import 'package:speech_to_text/speech_to_text.dart';

class ChatScreen extends StatefulWidget {
  final String publicationId;
  final List<String> pmcDocumentChunks;

  const ChatScreen({
    super.key,
    required this.publicationId,
    required this.pmcDocumentChunks,
  });

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  final List<Message> _messages = [];

  final PMCService _pmcService = PMCService();

  bool _isTyping = false;

  SpeechToText speechToText = SpeechToText();
  bool _speechEnabled = false;
  String _lastWords = '';

  final List<String> _quickSuggestions = [
    'Main findings',
    'Research methods',
    'Future applications',
    'Clinical implications',
  ];

  @override
  void initState() {
    super.initState();
    _initSpeech();

    _messages.add(
      Message(
        id: '1',
        type: MessageType.ai,
        content: 'Welcome to the chat! Ask me anything about this research.',
        timestamp: DateTime.now(),
      ),
    );
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: const AppHeader(showBackButton: true),
      body: SpaceBackground(
        child: SafeArea(
          child: Column(
            children: [
              Expanded(
                child: ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.all(20),
                  itemCount: _messages.length + (_isTyping ? 1 : 0),
                  itemBuilder: (context, index) {
                    if (index == _messages.length && _isTyping) {
                      return _buildTypingIndicator();
                    }
                    return MessageBubble(message: _messages[index]);
                  },
                ),
              ),

              if (_messages.length <= 2)
                Container(
                  height: 44,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: ListView.builder(
                    clipBehavior: Clip.none,
                    scrollDirection: Axis.horizontal,
                    itemCount: _quickSuggestions.length,
                    itemBuilder: (context, index) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: OutlinedButton(
                          onPressed: () =>
                              _handleSendMessage(_quickSuggestions[index]),
                          style: OutlinedButton.styleFrom(
                            backgroundColor: Colors.white.withAlpha(20),
                            side: BorderSide(color: Colors.white.withAlpha(40)),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                            ),
                          ),
                          child: Text(
                            _quickSuggestions[index],
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white.withAlpha(10),
                  border: Border(
                    top: BorderSide(color: Colors.white.withAlpha(30)),
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _messageController,
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          hintText: 'Ask me anything about this research...',
                          hintStyle: TextStyle(
                            color: Colors.white.withAlpha(128),
                          ),
                          border: InputBorder.none,
                          filled: true,
                          fillColor: Colors.white.withAlpha(20),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                        ),
                        onSubmitted: _handleSendMessage,
                      ),
                    ),
                    const SizedBox(width: 12),
                    // Voice Record Button
                    Container(
                      decoration: BoxDecoration(
                        color: speechToText.isListening
                            ? const Color(0xFFEF4444)
                            : const Color(0xFF8B5CF6),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: IconButton(
                        icon: Icon(
                          speechToText.isListening
                              ? Icons.stop_rounded
                              : Icons.keyboard_voice_rounded,
                          color: Colors.white,
                        ),
                        onPressed: _handleVoiceMessage,
                      ),
                    ),
                    const SizedBox(width: 8),
                    // Send Message Button
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF3B82F6),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.send, color: Colors.white),
                        onPressed: () =>
                            _handleSendMessage(_messageController.text),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _handleSendMessage(String content) {
    if (content.trim().isEmpty) return;
    setState(() {
      _messages.add(
        Message(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          type: MessageType.user,
          content: content.trim(),
          timestamp: DateTime.now(),
        ),
      );
      _messageController.clear();
      _isTyping = true;
    });

    _scrollToBottom();

    _getAIResponse(content);
  }

  void _handleVoiceMessage() async {
    // If not yet listening for speech start, otherwise stop
    if (speechToText.isNotListening) {
      _startListening();
    } else {
      _stopListening();
    }
  }

  /// This has to happen only once per app
  void _initSpeech() async {
    _speechEnabled = await speechToText.initialize();
    setState(() {});
  }

  /// Each time to start a speech recognition session
  void _startListening() async {
    await speechToText.listen(onResult: _onSpeechResult);
    setState(() {});
  }

  /// Manually stop the active speech recognition session
  /// Note that there are also timeouts that each platform enforces
  /// and the SpeechToText plugin supports setting timeouts on the
  /// listen method.
  void _stopListening() async {
    await speechToText.stop();
    setState(() {});
  }

  /// This is the callback that the SpeechToText plugin calls when
  /// the platform returns recognized words.
  void _onSpeechResult(SpeechRecognitionResult result) {
    setState(() {
      _lastWords = result.recognizedWords;
    });
    if (result.finalResult) {
      _handleSendMessage(_lastWords);
    }
  }

  void _scrollToBottom() async{
    if (_scrollController.hasClients) {
      await Future.delayed(const Duration(milliseconds: 100));
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeOut,
      );
    }
  }

  Future<void> _getAIResponse(String question) async {
    try {
      final result = await _pmcService.askFree(
        question,
        widget.pmcDocumentChunks,
      );

      setState(() {
        _messages.add(
          Message(
            id: (DateTime.now().millisecondsSinceEpoch + 1).toString(),
            type: MessageType.ai,
            content:
                result['Answer'] ?? 'Sorry, I couldn\'t process your question.',
            timestamp: DateTime.now(),
          ),
        );
        _isTyping = false;
      });
    } catch (e) {
      setState(() {
        _messages.add(
          Message(
            id: (DateTime.now().millisecondsSinceEpoch + 1).toString(),
            type: MessageType.ai,
            content:
                'Sorry, there was an error processing your question: ${e.toString()}',
            timestamp: DateTime.now(),
          ),
        );
        _isTyping = false;
      });
    }

    _scrollToBottom();
  }

  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          const CircleAvatar(
            backgroundColor: Color(0xFF8B5CF6),
            child: Icon(Icons.smart_toy, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withAlpha(30),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Text(
              'AI is typing...',
              style: TextStyle(color: Colors.white70),
            ),
          ),
        ],
      ),
    );
  }
}
