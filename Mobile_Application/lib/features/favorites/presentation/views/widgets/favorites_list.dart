import 'package:flutter/material.dart';

import '../../../../publications/data/models/publication.dart';
import '../../../../publications/presentation/views/widgets/publication_card.dart';

class FavoritesList extends StatelessWidget {
  final List<Publication> favorites;
  final VoidCallback onRemoveFavorite;

  const FavoritesList({
    super.key,
    required this.favorites,
    required this.onRemoveFavorite,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Favorite Publications',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 16),

        ...favorites.map((publication) {
          return PublicationCard(
            key: ValueKey(publication.id),
            publication: publication,
            onRemoveFavorite: () => _removeFavorite(publication.id),
          );
        }),
      ],
    );
  }

  void _removeFavorite(String id) {
    favorites.removeWhere((pub) {
      if (pub.id == id) {
        pub.isFavorite = false;
      }
      return pub.id == id;
    });
    onRemoveFavorite();
  }
}
