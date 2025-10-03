import 'package:flutter/material.dart';
import '../../../../core/database/database.dart';
import '../../../../core/widgets/app_header.dart';
import '../../../../core/widgets/space_background.dart';
import '../../data/models/publication.dart';
import 'widgets/publication_card.dart';
import 'widgets/quick_filters.dart';

class PublicationsScreen extends StatefulWidget {
  const PublicationsScreen({super.key, this.selectedCategory});

  final String? selectedCategory;

  @override
  State<PublicationsScreen> createState() => _PublicationsScreenState();
}

class _PublicationsScreenState extends State<PublicationsScreen> {
  String? _selectedFilter;
  final TextEditingController _searchController = TextEditingController();

  late List<Publication> _publications;

  List<Publication> filteredPublications = [];

  @override
  void initState() {
    _publications = Database.getAllPublication();
    if (widget.selectedCategory == null) {
      filteredPublications = _publications;
    } else {
      _selectedFilter = widget.selectedCategory;
      filteredCategoryPublications();
    }
    super.initState();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: const AppHeader(showBackButton: true),
      body: SpaceBackground(
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 20),

              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Container(
                  padding: const EdgeInsets.only(left: 16),
                  decoration: BoxDecoration(
                    color: Colors.white.withAlpha(20),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white.withAlpha(50)),
                  ),
                  child: TextField(
                    controller: _searchController,
                    onChanged: (value) {
                      setState(() {
                        _selectedFilter = value.isEmpty ? null : value;
                        getFilteredPublicationsSearch();
                      });
                    },
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Search for publications...',
                      hintStyle: TextStyle(color: Colors.white.withAlpha(128)),
                      border: InputBorder.none,
                      icon: Icon(
                        Icons.search,
                        color: Colors.white.withAlpha(179),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              QuickFilters(
                selectedFilter: _selectedFilter,
                onFilterChanged: (filter) => setState(() {
                  _selectedFilter = filter?.category;
                  filteredCategoryPublications();
                }),
              ),
              const SizedBox(height: 20),

              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  children: [
                    Text(
                      _selectedFilter != null
                          ? 'Publications in ${_selectedFilter!.split("-").first}'
                          : 'All Publications',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 20),
                    ...filteredPublications.map(
                      (pub) => PublicationCard(publication: pub),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void getFilteredPublicationsSearch() {
    if (_selectedFilter == null || _selectedFilter!.isEmpty) {
      filteredPublications = _publications;
    }
    final filterLower = _selectedFilter!.toLowerCase();
    filteredPublications = _publications.where((pub) {
      final titleMatch = pub.title.toLowerCase().contains(filterLower);
      final categoryMatch = pub.category.category.toLowerCase().contains(
        filterLower,
      );
      return titleMatch || categoryMatch;
    }).toList();
  }

  void filteredCategoryPublications() {
    if (_selectedFilter == null) {
      filteredPublications = _publications;
    }
    filteredPublications = _publications
        .where(
          (pub) =>
              pub.category.category.split(" ").first ==
              _selectedFilter!.split(" ").first,
        )
        .toList();
  }
}
