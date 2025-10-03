import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../../core/routing/routing.dart';
import '../../../data/models/publication.dart';

class PublicationCard extends StatelessWidget {
  final Publication publication;
  final VoidCallback? onRemoveFavorite;

  const PublicationCard({
    super.key,
    required this.publication,
    this.onRemoveFavorite,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.white.withAlpha(30), width: 1),
      ),
      child: InkWell(
        onTap: () =>
            context.push(Routing.publicationDetails, extra: publication.id),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                spacing: 12,
                children: [
                  Flexible(
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: publication.category.color.withAlpha(30),
                        border: Border.all(
                          color: publication.category.color.withAlpha(70),
                        ),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            publication.category.icon,
                            size: 16,
                            color: publication.category.color,
                          ),
                          const SizedBox(width: 6),
                          Flexible(
                            child: Text(
                              publication.category.category,
                              style: TextStyle(
                                color: publication.category.color,
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  if (publication.year != null)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withAlpha(20),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        publication.year.toString(),
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 12,
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                publication.title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  if (publication.isViewed)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.blue.withAlpha(50),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.visibility, size: 12, color: Colors.blue),
                          SizedBox(width: 4),
                          Text(
                            'Viewed',
                            style: TextStyle(color: Colors.blue, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                  const Spacer(),
                  IconButton(
                    icon: Icon(
                      publication.isFavorite
                          ? Icons.bookmark
                          : Icons.bookmark_border,
                      color: publication.isFavorite
                          ? const Color(0xFFF59E0B)
                          : Colors.white60,
                    ),
                    onPressed: onRemoveFavorite,
                  ),
                  IconButton(
                    icon: const Icon(Icons.chat_bubble_outline),
                    color: Colors.white60,
                    onPressed: () =>
                        context.push(Routing.chat, extra: publication.id),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
