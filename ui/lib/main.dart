import 'package:flutter/material.dart';
import 'view/home_screen.dart';


void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AI Co-scientist',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.teal,
          primaryContainer: Colors.teal.shade50,
        ),
        navigationRailTheme: NavigationRailThemeData(
          backgroundColor: Colors.teal.shade50,
          selectedIconTheme: const IconThemeData(color: Colors.teal),
          selectedLabelTextStyle: const TextStyle(color: Colors.teal),
          minWidth: 52,
        ),
        appBarTheme: AppBarTheme(
          backgroundColor: Colors.teal.shade50,
          foregroundColor: Colors.teal.shade50,
        ),
        inputDecorationTheme: const InputDecorationTheme(
          hintStyle: TextStyle(fontSize: 14),
        ),
      ),
      home: const HomeScreen(),
    );
  }
}
