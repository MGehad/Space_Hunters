import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../../core/routing/routing.dart';
import '../../../../../core/utils/functions.dart';
import '../../../../publications/data/models/publication.dart';

class PublicationDetailsButtonsRow extends StatefulWidget {
  final Publication publication;
  final List<String> pmcDocumentChunks;
  final bool isLoadingPmcData; // 👈 loading state

  const PublicationDetailsButtonsRow({
    super.key,
    required this.publication,
    this.pmcDocumentChunks = const [],
    this.isLoadingPmcData = false,
  });

  @override
  State<PublicationDetailsButtonsRow> createState() =>
      _PublicationDetailsButtonsRowState();
}

class _PublicationDetailsButtonsRowState
    extends State<PublicationDetailsButtonsRow> {
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Hero(
            tag: 'chat_${widget.publication.id}',
            child: ElevatedButton.icon(
              onPressed: () {
                if (widget.isLoadingPmcData ||
                    widget.pmcDocumentChunks.isEmpty) {
                  // 👈 show snackbar if data is not ready
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("Please wait, loading study data..."),
                      duration: Duration(seconds: 2),
                    ),
                  );
                  return;
                }

                // ✅ navigate to chat when data is ready
                context.push(Routing.chat, extra: {
                  'publicationId': widget.publication.id,
                  'pmcDocumentChunks': widget.pmcDocumentChunks,
                });
              },
              icon: const Icon(Icons.chat_bubble_outline),
              label: const Text("Ask about this study"),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF3B82F6),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Container(
          decoration: BoxDecoration(
            color: Colors.white.withAlpha(20),
            borderRadius: BorderRadius.circular(12),
          ),
          child: IconButton(
            icon: Icon(
              widget.publication.isFavorite
                  ? Icons.bookmark
                  : Icons.bookmark_border,
              color: widget.publication.isFavorite
                  ? const Color(0xFFF59E0B)
                  : Colors.white,
            ),
            onPressed: () {
              setState(
                    () => widget.publication.isFavorite =
                !widget.publication.isFavorite,
              );
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    widget.publication.isFavorite
                        ? 'Added to favorites'
                        : 'Removed from favorites',
                  ),
                  duration: const Duration(seconds: 2),
                ),
              );
            },
          ),
        ),
        const SizedBox(width: 8),
        Container(
          decoration: BoxDecoration(
            color: Colors.white.withAlpha(20),
            borderRadius: BorderRadius.circular(12),
          ),
          child: IconButton(
            icon: const Icon(Icons.open_in_new, color: Colors.white),
            onPressed: () =>
                Functions.openUrl(context, widget.publication.link),
          ),
        ),
      ],
    );
  }
}
