import 'package:flutter/material.dart';

import '../../../../publications/data/models/publication.dart';

class StatisticsCard extends StatelessWidget {
  final List<Publication> favorites;

  const StatisticsCard({super.key, required this.favorites});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF8B5CF6), Color(0xFF3B82F6)],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStatItem('Total', favorites.length.toString(), Icons.bookmark),
          Container(width: 1, height: 40, color: Colors.white.withAlpha(70)),
          _buildStatItem(
            'Already Read',
            favorites.where((p) => p.isViewed).length.toString(),
            Icons.visibility,
          ),
          Container(width: 1, height: 40, color: Colors.white.withAlpha(70)),
          _buildStatItem(
            'Categories',
            favorites.map((p) => p.category).toSet().length.toString(),
            Icons.category,
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: Colors.white, size: 24),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(fontSize: 12, color: Colors.white.withAlpha(230)),
        ),
      ],
    );
  }
}
