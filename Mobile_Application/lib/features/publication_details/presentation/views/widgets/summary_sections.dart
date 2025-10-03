import 'package:flutter/material.dart';

import '../../../../publications/data/models/publication.dart';

class SummarySections extends StatefulWidget {
  final Summary summary;

  const SummarySections({super.key, required this.summary});

  @override
  State<SummarySections> createState() => _SummarySectionsState();
}

class _SummarySectionsState extends State<SummarySections> {
  bool _showFullBackground = false;
  bool _showFullResults = false;
  bool _showFullConclusion = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: 20,
      children: [
        _buildSummarySection(
          'Background',
          widget.summary.background,
          _showFullBackground,
          () {
            setState(() {
              _showFullBackground = !_showFullBackground;
            });
          },
        ),
        _buildSummarySection(
          'Results',
          widget.summary.results,
          _showFullResults,
          () {
            setState(() {
              _showFullResults = !_showFullResults;
            });
          },
        ),
        _buildSummarySection(
          'Conclusion',
          widget.summary.conclusion,
          _showFullConclusion,
          () {
            setState(() {
              _showFullConclusion = !_showFullConclusion;
            });
          },
        ),
      ],
    );
  }

  Widget _buildSummarySection(
    String title,
    String content,
    bool isExpanded,
    VoidCallback onToggle,
  ) {
    final maxLength = 150;
    final shouldTruncate = content.length > maxLength;
    final displayContent = !shouldTruncate || isExpanded
        ? content
        : '${content.substring(0, maxLength)}...';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(10),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withAlpha(30)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            displayContent,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 14,
              height: 1.6,
            ),
          ),
          if (shouldTruncate) ...[
            const SizedBox(height: 8),
            InkWell(
              onTap: onToggle,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    isExpanded ? 'Read less' : 'Read more',
                    style: const TextStyle(
                      color: Color(0xFF3B82F6),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Icon(
                    isExpanded
                        ? Icons.keyboard_arrow_up
                        : Icons.keyboard_arrow_down,
                    color: const Color(0xFF3B82F6),
                    size: 20,
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
