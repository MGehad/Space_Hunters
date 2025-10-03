import 'package:flutter/material.dart';

class KeyInsight extends StatelessWidget {
  final String keyInsight;

  const KeyInsight({super.key, required this.keyInsight});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF8B5CF6), Color(0xFF3B82F6)],
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          const Icon(Icons.lightbulb, color: Colors.white),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              keyInsight,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
