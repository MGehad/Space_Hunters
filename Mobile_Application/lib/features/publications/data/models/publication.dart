import 'package:flutter/material.dart';

import '../../../../core/utils/functions.dart';

class Publication {
  final String id;
  final String link;
  final String title;
  final PublicationCategory category;
  final int? year;
  bool isViewed;
  bool isFavorite;
  Summary? summary;
  String? keyInsight;

  Publication({
    required this.id,
    required this.link,
    required this.title,
    required this.category,
    this.year,
    this.isViewed = false,
    this.isFavorite = false,
    this.summary,
    this.keyInsight,
  });

  factory Publication.fromJson(Map<String, dynamic> json) {
    return Publication(
      id: Functions.extractIdFromPath(json['link']),
      link: json['link'],
      title: json['title'],
      category: PublicationCategory(category: json['category']),
      year: json['year'],
      isViewed: false,
      isFavorite: false,
      summary: null,
      keyInsight: null,
    );
  }
}

class Summary {
  final String background;
  final String results;
  final String conclusion;

  Summary({
    required this.background,
    required this.results,
    required this.conclusion,
  });
}

class PublicationCategory {
  final String category;
  final Color color;
  final IconData icon;

  PublicationCategory({required this.category})
    : color = _getColor(category),
      icon = _getIcon(category);

  static Color _getColor(String category) {
    String cat = category.trim().split(' ').first;
    switch (cat) {
      case '3D':
      case 'Computational':
      case 'Data':
      case 'Methods':
      case 'Deep-space':
      case 'ISS':
        return const Color(0xFFF59E0B);
      case 'Actin':
      case 'Aero-microbiology':
      case 'Antimicrobial':
      case 'Bacterial':
      case 'Biosensors':
      case 'Fungal':
      case 'Genomics':
      case 'Host–parasite':
      case 'Host–pathogen':
      case 'Immune':
      case 'Immunology':
      case 'Infection':
      case 'LSMMG':
      case 'Microbiology':
      case 'Microbes':
        return const Color(0xFF8B5CF6);
      case 'Aging/frailty':
      case 'Astronaut':
      case 'B-cell':
      case 'Behavior/immune':
      case 'Behavioral/immune':
      case 'Bone':
      case 'Bone/connective':
      case 'Bone–ear':
      case 'Bone–marrow':
      case 'Bone–vascular':
      case 'Calvarial':
      case 'Cardiac':
      case 'Cardiovascular':
      case 'Cartilage':
      case 'Cell':
      case 'Cerebrovascular':
      case 'Clinical':
      case 'Coronary':
      case 'Dermatology':
      case 'ER':
      case 'Electrophysiology':
      case 'Endocrine':
      case 'Endothelium':
      case 'Epigenetics':
      case 'Exercise':
      case 'Human':
      case 'Liver':
      case 'Lymphatic':
      case 'Macrophage':
      case 'MSC':
      case 'Neurobiology':
      case 'Neuroscience':
      case 'Renal':
      case 'Reproductive':
      case 'Stem cells':
        return const Color(0xFF3B82F6);
      case 'Auxin':
      case 'Chloroplast':
      case 'Growth':
      case 'Lunar':
      case 'Mars':
      case 'Plant':
      case 'Gravitropism':
        return const Color(0xFF10B981);
      case 'Bioengineering':
      case 'Biomechanics':
      case 'Countermeasures':
      case 'HLU':
      case 'Hemodynamics':
      case 'Hormonal':
      case 'Imaging':
      case 'Mechanobiology':
      case 'Mechanosensing':
      case 'Mechanosensitive':
      case 'Mechanotransduction':
        return const Color(0xFFEF4444);
      case 'Built':
      case 'Cleanroom':
      case 'Editorial':
      case 'Data access':
        return const Color(0xFF6B7280);
      case 'COVID-19':
        return const Color(0xFFDC2626);
      default:
        return const Color(0xFF6B7280);
    }
  }

  static IconData _getIcon(String category) {
    String cat = category.trim().split(' ').first;
    switch (cat) {
      case '3D':
      case 'Computational':
      case 'Data':
      case 'Methods':
      case 'Deep-space':
      case 'ISS':
        return Icons.computer;
      case 'Actin':
      case 'Aero-microbiology':
      case 'Antimicrobial':
      case 'Bacterial':
      case 'Biosensors':
      case 'Fungal':
      case 'Genomics':
      case 'Host–parasite':
      case 'Host–pathogen':
      case 'Immune':
      case 'Immunology':
      case 'Infection':
      case 'LSMMG':
      case 'Microbiology':
      case 'Microbes':
        return Icons.science;
      case 'Aging/frailty':
      case 'Astronaut':
      case 'B-cell':
      case 'Behavior/immune':
      case 'Behavioral/immune':
      case 'Bone':
      case 'Calvarial':
      case 'Cardiac':
      case 'Cardiovascular':
      case 'Clinical':
      case 'Dermatology':
      case 'Endocrine':
      case 'Epigenetics':
      case 'Exercise':
      case 'Human':
      case 'Liver':
      case 'Lymphatic':
      case 'Macrophage':
      case 'MSC':
        return Icons.person;
      case 'Auxin':
      case 'Chloroplast':
      case 'Growth':
      case 'Lunar':
      case 'Mars':
      case 'Plant':
      case 'Gravitropism':
        return Icons.eco;
      case 'Bioengineering':
      case 'Biomechanics':
      case 'Countermeasures':
      case 'HLU':
      case 'Hemodynamics':
      case 'Hormonal':
      case 'Imaging':
      case 'Mechanobiology':
      case 'Mechanosensing':
      case 'Mechanosensitive':
      case 'Mechanotransduction':
        return Icons.engineering;
      case 'Built':
      case 'Cleanroom':
      case 'Editorial':
      case 'Data access':
        return Icons.layers;
      case 'COVID-19':
        return Icons.coronavirus;
      default:
        return Icons.insert_drive_file;
    }
  }
}
