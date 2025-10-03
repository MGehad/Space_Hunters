import 'package:flutter/material.dart';

import '../../../../publications/data/models/publication.dart';
import 'favorites_header.dart';
import 'favorites_list.dart';
import 'statistics_card.dart';

class FavoritesWidget extends StatelessWidget {
  final List<Publication> favorites;
  final VoidCallback onRemoveFavorite;

  const FavoritesWidget({
    super.key,
    required this.favorites,
    required this.onRemoveFavorite,
  });

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        FavoritesHeader(favoritesLength: favorites.length),
        const SizedBox(height: 30),
        StatisticsCard(favorites: favorites),
        const SizedBox(height: 30),
        FavoritesList(favorites: favorites, onRemoveFavorite: onRemoveFavorite),
      ],
    );
  }
}
