import 'package:flutter/material.dart';

import '../../../../publications/data/models/publication.dart';

class CategoryBadge extends StatelessWidget {
  final PublicationCategory category;
  final int? year;

  const CategoryBadge({super.key, required this.category, required this.year});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: category.color.withAlpha(30),
        border: Border.all(color: category.color.withAlpha(70)),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(category.icon, size: 16, color: category.color),
          const SizedBox(width: 6),
          Flexible(
            child: Text(
              category.category,
              style: TextStyle(
                color: category.color,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            '• $year',
            style: TextStyle(color: category.color, fontSize: 12),
          ),
        ],
      ),
    );
  }
}
