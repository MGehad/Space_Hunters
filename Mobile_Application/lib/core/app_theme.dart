import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: const Color(0xFF8B5CF6),
      scaffoldBackgroundColor: const Color(0xFF0F172A),
      colorScheme: const ColorScheme.dark(
        primary: Color(0xFF8B5CF6),
        secondary: Color(0xFF3B82F6),
        surface: Color(0xFF1E293B),
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: Colors.white,
      ),
      textTheme: const TextTheme(
        displayLarge: TextStyle(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
        displayMedium: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
        bodyLarge: TextStyle(
          fontSize: 16,
          color: Colors.white70,
        ),
        bodyMedium: TextStyle(
          fontSize: 14,
          color: Colors.white60,
        ),
      ),
      cardTheme: CardThemeData(
        color: Colors.white.withAlpha(20),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white.withAlpha(20),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.white.withAlpha(50)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.white.withAlpha(50)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF8B5CF6)),
        ),
      ),
    );
  }
}
