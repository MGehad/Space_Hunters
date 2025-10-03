import 'dart:convert';

import 'package:flutter/services.dart';

import '../../features/publications/data/models/publication.dart';

class Database {
  static List<Publication> _publications = [];

  static Future<void> init() async {
    var file = await rootBundle.loadString('assets/data/nasa_data.json');
    var data = await json.decode(file);
    for (var item in data) {
      _publications.add(Publication.fromJson(item));
    }
    _publications = _publications.toSet().toList();
  }

  static List<Publication> getAllPublication() {
    return _publications;
  }

  static Publication getPublicationById(String id) {
    var item = _publications.firstWhere((element) => element.id == id);
    return item;
  }

  static List<PublicationCategory> getAllPublicationCategory() {
    List<PublicationCategory> categories = [];
    for (var pub in _publications) {
      if (!categories.any(
        (cat) =>
            cat.category.split(" ").first ==
            pub.category.category.split(" ").first,
      )) {
        categories.add(pub.category);
      }
    }
    return categories;
  }

  static List<Publication> getFavoritePublications() {
    return _publications.where((pub) => pub.isFavorite).toList();
  }
}
