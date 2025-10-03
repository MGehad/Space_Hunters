import 'package:flutter/material.dart';
import '../../../../../core/database/database.dart';
import '../../../data/models/publication.dart';

class QuickFilters extends StatelessWidget {
  final String? selectedFilter;
  final Function(PublicationCategory?) onFilterChanged;

  const QuickFilters({
    super.key,
    required this.selectedFilter,
    required this.onFilterChanged,
  });

  @override
  Widget build(BuildContext context) {
    List<PublicationCategory> categories = Database.getAllPublicationCategory();
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        children: categories.map((category) {
          final isSelected = selectedFilter == category.category;
          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: FilterChip(
              label: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    category.icon,
                    size: 16,
                    color: isSelected ? Colors.white : Colors.white70,
                  ),
                  const SizedBox(width: 6),
                  Text(category.category.split("-").first),
                ],
              ),
              selected: isSelected,
              onSelected: (selected) =>
                  onFilterChanged(selected ? category : null),
              backgroundColor: Colors.white.withAlpha(20),
              selectedColor: category.color,
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : Colors.white70,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              ),
              side: BorderSide(
                color: isSelected ? category.color : Colors.white.withAlpha(50),
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
