import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../routing/routing.dart';

class AppHeader extends StatelessWidget implements PreferredSizeWidget {
  final bool showBackButton;
  final bool isMainScreen;

  const AppHeader({
    super.key,
    this.showBackButton = false,
    this.isMainScreen = false,
  });

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      leading: showBackButton
          ? IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: () => context.pop(),
            )
          : null,
      title: Row(
        spacing: 12,
        children: [
          SizedBox(
            width: 40,
            height: 40,
            child: Image.asset('assets/images/logo.png', fit: BoxFit.contain),
          ),
          const Text(
            'Space Hunters',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 20,
            ),
          ),
        ],
      ),
      actions: isMainScreen
          ? [
              IconButton(
                icon: const Icon(Icons.search, color: Colors.white),
                onPressed: () => context.push(Routing.publications),
              ),
              IconButton(
                icon: const Icon(Icons.favorite_border, color: Colors.white),
                onPressed: () => context.push(Routing.favorites),
              ),
              const SizedBox(width: 8),
            ]
          : null,
    );
  }
}
