import 'package:flutter/material.dart';
import '../../../../core/database/database.dart';
import '../../../../core/widgets/app_header.dart';
import '../../../../core/widgets/space_background.dart';
import '../../../publications/data/models/publication.dart';
import 'widgets/empty_favorites_state.dart';
import 'widgets/favorites_widget.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  List<Publication> favorites = Database.getFavoritePublications();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: const AppHeader(showBackButton: true),
      body: SpaceBackground(
        child: SafeArea(
          child: AnimatedSwitcher(
            duration: Duration(milliseconds: 500),
            child: favorites.isEmpty
                ? EmptyFavoritesState()
                : FavoritesWidget(
                    favorites: favorites,
                    onRemoveFavorite: _removeFavorite,
                  ),
          ),
        ),
      ),
    );
  }

  void _removeFavorite() {
    setState(() {});
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Deleted from favorites!'),
        duration: Duration(seconds: 2),
      ),
    );
  }
}
