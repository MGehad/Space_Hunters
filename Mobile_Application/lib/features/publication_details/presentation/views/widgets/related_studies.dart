import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../../core/routing/routing.dart';
import '../../../../publications/data/models/publication.dart';

class RelatedStudies extends StatelessWidget {
  final List<Publication> relatedStudies;

  const RelatedStudies({super.key, required this.relatedStudies});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Related Studies',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 16),
        ...relatedStudies.map(
          (study) => _buildRelatedStudyCard(context, study),
        ),
      ],
    );
  }

  Widget _buildRelatedStudyCard(BuildContext context, Publication study) {
    return GestureDetector(
      onTap: () =>
          context.pushReplacement(Routing.publicationDetails, extra: study.id),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white.withAlpha(10),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white.withAlpha(30)),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    study.title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    study.category.category,
                    style: const TextStyle(color: Colors.white60, fontSize: 12),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.arrow_forward_ios,
              color: Colors.white60,
              size: 16,
            ),
          ],
        ),
      ),
    );
  }
}
