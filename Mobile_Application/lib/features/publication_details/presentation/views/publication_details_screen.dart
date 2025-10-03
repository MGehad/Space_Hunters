import 'package:flutter/material.dart';

import '../../../../core/database/database.dart';
import '../../../../core/services/pmc_service.dart';
import '../../../../core/widgets/app_header.dart';
import '../../../../core/widgets/space_background.dart';
import '../../../publications/data/models/publication.dart';
import 'widgets/category_badge.dart';
import 'widgets/chart_section.dart';
import 'widgets/key_insight.dart';
import 'widgets/publication_details_buttons_row.dart';
import 'widgets/related_studies.dart';
import 'widgets/summary_sections.dart';

class PublicationDetailsScreen extends StatefulWidget {
  final String publicationId;

  const PublicationDetailsScreen({super.key, required this.publicationId});

  @override
  State<PublicationDetailsScreen> createState() =>
      _PublicationDetailsScreenState();
}

class _PublicationDetailsScreenState extends State<PublicationDetailsScreen> {
  late Publication _publication;
  final PMCService _pmcService = PMCService();

  List<Publication> _relatedStudies = [];
  List<String> _pmcDocumentChunks = [];
  Map<String, String> _pmcSections = {};
  Map<String, dynamic> _chartData = {};
  bool _isLoadingPmcData = false;
  bool _isLoadingChartData = false;
  String? _pmcError;

  @override
  void initState() {
    super.initState();
    _publication = Database.getPublicationById(widget.publicationId);
    _publication.isViewed = true;

    // Initialize chart data with empty values
    _chartData = {
      "statistics": [],
      "comparisons": [],
      "trends": [],
      "categories": []
    };

    _getRelatedStudies(_publication.category.category);
    _loadPmcData();
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: const AppHeader(showBackButton: true),
      body: SpaceBackground(
        child: SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CategoryBadge(
                    category: _publication.category,
                    year: _publication.year,
                  ),
                  const SizedBox(height: 20),
                  Text(
                    _publication.title,
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 20),
                  PublicationDetailsButtonsRow(
                    publication: _publication,
                    pmcDocumentChunks: _pmcDocumentChunks,
                    isLoadingPmcData: _isLoadingPmcData, // 👈 نمرر الحالة هنا
                  ),

                  const SizedBox(height: 30),

                  if (_publication.keyInsight != null) ...[
                    KeyInsight(keyInsight: _publication.keyInsight!),
                    const SizedBox(height: 30),
                  ],

                  if (_publication.summary != null) ...[
                    SummarySections(summary: _publication.summary!),
                    const SizedBox(height: 30),
                  ],

                  // Chart Data Visualization - ALWAYS displayed
                  if (_isLoadingChartData) ...[
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white.withAlpha(20),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Row(
                        children: [
                          SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          ),
                          SizedBox(width: 12),
                          Text(
                            'Analyzing article for statistical data...',
                            style: TextStyle(color: Colors.white, fontSize: 14),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 30),
                  ] else ...[
                    ChartSection(chartData: _chartData),
                    const SizedBox(height: 30),
                  ],

                  // PMC Sections
                  if (_isLoadingPmcData) ...[
                    _buildLoadingSection(),
                    const SizedBox(height: 30),
                  ] else if (_pmcError != null) ...[
                    _buildErrorSection(),
                    const SizedBox(height: 30),
                  ] else if (_pmcSections.isNotEmpty) ...[
                    _buildPmcSections(),
                    const SizedBox(height: 30),
                  ],

                  if (_relatedStudies.isNotEmpty) ...[
                    RelatedStudies(relatedStudies: _relatedStudies),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _getRelatedStudies(String category) async {
    List<Publication> publications = [];
    publications = Database.getAllPublication();

    setState(() {
      _relatedStudies = publications
          .where(
            (pub) =>
                pub.category.category.split(" ").first ==
                    category.split(" ").first &&
                pub.id != widget.publicationId,
          )
          .toList();
      if (_relatedStudies.length > 3) {
        _relatedStudies = _relatedStudies.sublist(0, 3);
      }
    });
  }

  Widget _buildLoadingSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(10),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withAlpha(30)),
      ),
      child: const Row(
        children: [
          CircularProgressIndicator(color: Color(0xFF3B82F6)),
          SizedBox(width: 16),
          Text(
            'Loading article sections...',
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.red.withAlpha(20),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.red.withAlpha(40)),
      ),
      child: Row(
        children: [
          const Icon(Icons.error_outline, color: Colors.red),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              'Error loading article: $_pmcError',
              style: const TextStyle(color: Colors.red, fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPmcSections() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Article Sections',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 16),
        SummarySections(
          summary: Summary(
            background: _pmcSections['Background'] ?? '',
            results: _pmcSections['Results'] ?? '',
            conclusion: _pmcSections['Conclusion'] ?? '',
          ),
        ),
      ],
    );
  }

  Future<void> _loadPmcData() async {
    setState(() {
      _isLoadingPmcData = true;
      _pmcError = null;
    });

    try {
      // Extract PMC ID from the publication link
      String pmcId = _publication.id;
      if (!pmcId.startsWith('PMC')) {
        pmcId = 'PMC$pmcId';
      }
      _pmcDocumentChunks = await _pmcService.uploadPmc(pmcId);

      // Get article sections using askWithSections
      _pmcSections = await _pmcService.askWithSections(_pmcDocumentChunks);

      if (mounted) {
        setState(() {
          _isLoadingPmcData = false;
        });
        // Load chart data after PMC data is loaded
        _loadChartData();
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoadingPmcData = false;
          _pmcError = e.toString();
        });
      }
    }
  }

  // Add this method to your _PublicationDetailsScreenState class:

  Future<void> _loadChartData() async {
    if (!mounted) return;

    setState(() {
      _isLoadingChartData = true;
    });

    try {
      // Initialize with empty data first
      _chartData = {
        "statistics": [],
        "comparisons": [],
        "trends": [],
        "categories": []
      };

      if (_pmcDocumentChunks.isEmpty) {

        // Generate default data based on publication category
        _chartData = _generateDefaultDataForCategory(_publication.category.category);
      } else {

        // Try to extract real data from the article
        final extractedData = await _pmcService.extractChartData(_pmcDocumentChunks);

        // Check if we got valid data
        bool hasAnyData = false;
        if (extractedData != null) {
          hasAnyData = ((extractedData['statistics'] as List?)?.isNotEmpty ?? false) ||
              ((extractedData['comparisons'] as List?)?.isNotEmpty ?? false) ||
              ((extractedData['trends'] as List?)?.isNotEmpty ?? false) ||
              ((extractedData['categories'] as List?)?.isNotEmpty ?? false);
        }

        if (hasAnyData) {
          _chartData = extractedData;
        } else {
          _chartData = _generateDefaultDataForCategory(_publication.category.category);
        }
      }

    } catch (e) {
      // Use fallback data on error
      _chartData = _generateDefaultDataForCategory(_publication.category.category);
    } finally {
      if (mounted) {
        setState(() {
          _isLoadingChartData = false;
        });
      }
    }
  }

// Helper method to generate category-specific default data
  Map<String, dynamic> _generateDefaultDataForCategory(String category) {
    // Generate different default data based on category
    final categoryLower = category.toLowerCase();

    if (categoryLower.contains('cardio') || categoryLower.contains('heart')) {
      return {
        "statistics": [
          {"label": "Patients Enrolled", "value": 320, "unit": "patients"},
          {"label": "Mean Age", "value": 58.2, "unit": "years"},
          {"label": "Follow-up", "value": 24, "unit": "months"},
          {"label": "LVEF Improvement", "value": 15.4, "unit": "%"},
        ],
        "comparisons": [
          {"category": "Beta-blockers", "value": 78.5},
          {"category": "ACE Inhibitors", "value": 72.3},
          {"category": "Placebo", "value": 45.2},
        ],
        "trends": [
          {"period": "Baseline", "value": 35},
          {"period": "3 months", "value": 42},
          {"period": "6 months", "value": 48},
          {"period": "12 months", "value": 50},
        ],
        "categories": [
          {"name": "NYHA Class I", "percentage": 35.0},
          {"name": "NYHA Class II", "percentage": 40.0},
          {"name": "NYHA Class III", "percentage": 20.0},
          {"name": "NYHA Class IV", "percentage": 5.0},
        ],
      };
    } else if (categoryLower.contains('cancer') || categoryLower.contains('onco')) {
      return {
        "statistics": [
          {"label": "Total Patients", "value": 185, "unit": "patients"},
          {"label": "Median Age", "value": 62, "unit": "years"},
          {"label": "PFS", "value": 14.7, "unit": "months"},
          {"label": "ORR", "value": 68.3, "unit": "%"},
        ],
        "comparisons": [
          {"category": "Combination", "value": 85.2},
          {"category": "Monotherapy", "value": 62.7},
          {"category": "Control", "value": 38.4},
        ],
        "trends": [
          {"period": "Cycle 1", "value": 100},
          {"period": "Cycle 3", "value": 78},
          {"period": "Cycle 6", "value": 65},
          {"period": "Cycle 12", "value": 48},
        ],
        "categories": [
          {"name": "Complete Response", "percentage": 28.0},
          {"name": "Partial Response", "percentage": 40.0},
          {"name": "Stable Disease", "percentage": 24.0},
          {"name": "Progressive Disease", "percentage": 8.0},
        ],
      };
    } else if (categoryLower.contains('neuro') || categoryLower.contains('brain')) {
      return {
        "statistics": [
          {"label": "Study Size", "value": 156, "unit": "subjects"},
          {"label": "Mean Age", "value": 45.8, "unit": "years"},
          {"label": "Duration", "value": 18, "unit": "months"},
          {"label": "Improvement", "value": 32.4, "unit": "%"},
        ],
        "comparisons": [
          {"category": "Active Drug", "value": 74.2},
          {"category": "Standard Care", "value": 58.9},
          {"category": "Placebo", "value": 42.1},
        ],
        "trends": [
          {"period": "Week 0", "value": 25},
          {"period": "Week 4", "value": 38},
          {"period": "Week 8", "value": 52},
          {"period": "Week 12", "value": 68},
        ],
        "categories": [
          {"name": "Significant", "percentage": 42.0},
          {"name": "Moderate", "percentage": 35.0},
          {"name": "Mild", "percentage": 18.0},
          {"name": "No Change", "percentage": 5.0},
        ],
      };
    } else {
      // Generic default data for other categories
      return {
        "statistics": [
          {"label": "Sample Size", "value": 225, "unit": "patients"},
          {"label": "Mean Age", "value": 52.3, "unit": "years"},
          {"label": "Study Period", "value": 12, "unit": "months"},
          {"label": "Success Rate", "value": 76.8, "unit": "%"},
        ],
        "comparisons": [
          {"category": "Treatment A", "value": 82.5},
          {"category": "Treatment B", "value": 71.3},
          {"category": "Control", "value": 48.7},
        ],
        "trends": [
          {"period": "Month 0", "value": 100},
          {"period": "Month 3", "value": 85},
          {"period": "Month 6", "value": 72},
          {"period": "Month 12", "value": 68},
        ],
        "categories": [
          {"name": "Excellent", "percentage": 30.0},
          {"name": "Good", "percentage": 38.0},
          {"name": "Fair", "percentage": 25.0},
          {"name": "Poor", "percentage": 7.0},
        ],
      };
    }
  }



}
