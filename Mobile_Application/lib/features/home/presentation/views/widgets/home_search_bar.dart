import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../../core/routing/routing.dart';

class HomeSearchBar extends StatelessWidget {
  const HomeSearchBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(left: 16),
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(26),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withAlpha(51)),
      ),
      child: TextField(
        readOnly: true,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          hintText: 'Search for publications...',
          hintStyle: TextStyle(color: Colors.white.withAlpha(128)),
          border: InputBorder.none,
          enabledBorder: InputBorder.none,
          focusedBorder: InputBorder.none,
          icon: Icon(Icons.search, color: Colors.white.withAlpha(179)),
        ),
        onTap: () => context.push(Routing.publications),
      ),
    );
  }
}
