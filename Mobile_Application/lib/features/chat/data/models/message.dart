class Message {
  final String id;
  final MessageType type;
  final String content;
  final DateTime timestamp;
  bool isTyped;

  Message({
    required this.id,
    required this.type,
    required this.content,
    required this.timestamp,
    this.isTyped = false,
  });
}

enum MessageType {
  user,
  ai,
}