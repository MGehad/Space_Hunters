import 'package:flutter/material.dart';
import '../../../../core/widgets/app_header.dart';
import '../../../../core/widgets/space_background.dart';
import 'widgets/categories.dart';
import 'widgets/home_header.dart';
import 'widgets/home_search_bar.dart';
import 'widgets/quick_access.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: const AppHeader(isMainScreen: true),
      body: SpaceBackground(
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            clipBehavior: Clip.none,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                SizedBox(height: 40),
                HomeHeader(),
                SizedBox(height: 28),
                HomeSearchBar(),
                SizedBox(height: 40),
                QuickAccess(),
                SizedBox(height: 40),
                Categories(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
