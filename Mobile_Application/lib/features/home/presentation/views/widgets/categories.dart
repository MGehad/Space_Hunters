import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:nasa_project/core/routing/routing.dart';

class Categories extends StatelessWidget {
  const Categories({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Categories',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 20),

        Row(
          children: [
            Expanded(
              child: _buildCategoryCard(
                context,
                title: 'Mechanobiology',
                icon: Icons.engineering,
                color: const Color(0xFFEF4444),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildCategoryCard(
                context,
                title: 'Human',
                icon: Icons.person,
                color: const Color(0xFF3B82F6),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildCategoryCard(
                context,
                title: 'Mars',
                icon: Icons.public,
                color: const Color(0xFF10B981),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildCategoryCard(
                context,
                title: 'COVID-19',
                icon: Icons.coronavirus,
                color: const Color(0xFFDC2626),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildCategoryCard(
    BuildContext context, {
    required String title,
    required IconData icon,
    required Color color,
  }) {
    return GestureDetector(
      onTap: () => context.push(Routing.publications, extra: title),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withAlpha(20),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withAlpha(50)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
