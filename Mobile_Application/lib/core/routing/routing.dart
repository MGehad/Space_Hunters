import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/chat/presentation/views/chat_screen.dart';
import '../../features/favorites/presentation/views/favorites_screen.dart';
import '../../features/home/presentation/views/home_screen.dart';
import '../../features/publication_details/presentation/views/publication_details_screen.dart';
import '../../features/publications/presentation/views/publications_screen.dart';

class Routing {
  static const String favorites = '/favorites';
  static const String publications = '/publications';
  static const String publicationDetails = '/publications_details';
  static const String chat = '/chat';

  static final GoRouter _router = GoRouter(
    routes: [
      GoRoute(
        path: '/',
        pageBuilder: (context, state) =>
            _fadeTransitionPage(state, child: HomeScreen()),
      ),
      GoRoute(
        path: favorites,
        pageBuilder: (context, state) =>
            _fadeTransitionPage(state, child: FavoritesScreen()),
      ),
      GoRoute(
        path: publications,
        pageBuilder: (context, state) {
          final String? selectedCategory = state.extra as String?;

          return _fadeTransitionPage(
            state,
            child: PublicationsScreen(selectedCategory: selectedCategory),
          );
        },
      ),
      GoRoute(
        path: publicationDetails,
        pageBuilder: (context, state) {
          final String publicationId = state.extra as String;
          return _fadeTransitionPage(
            state,
            child: PublicationDetailsScreen(publicationId: publicationId),
          );
        },
      ),
      GoRoute(
        path: chat,
        pageBuilder: (context, state) {
          final Map<String, dynamic> extra = state.extra as Map<String, dynamic>;
          final String publicationId = extra['publicationId'] as String;
          final List<String> pmcDocumentChunks = extra['pmcDocumentChunks'] as List<String>;
          return _fadeTransitionPage(
            state,
            child: ChatScreen(
              publicationId: publicationId,
              pmcDocumentChunks: pmcDocumentChunks,
            ),
          );
        },
      ),
    ],
  );

  static CustomTransitionPage<dynamic> _fadeTransitionPage(
    GoRouterState state, {
    required Widget child,
  }) {
    return CustomTransitionPage(
      key: state.pageKey,
      child: child,
      transitionsBuilder: (context, animation, secondaryAnimation, child) =>
          FadeTransition(opacity: animation, child: child),
    );
  }

  static GoRouter get router => _router;
}
