import 'package:flutter/material.dart';

class EditorView extends StatefulWidget {
  const EditorView({super.key});

  @override
  State<EditorView> createState() => _EditorViewState();
}

class _EditorViewState extends State<EditorView> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: <Widget>[
          NavigationRail(
            backgroundColor: Colors.white,
            selectedIndex: _selectedIndex,
            onDestinationSelected: (int index) {
              setState(() {
                _selectedIndex = index;
              });
            },
            extended: true,
            labelType: NavigationRailLabelType.none,
            destinations: const <NavigationRailDestination>[
              NavigationRailDestination(
                icon: Icon(Icons.insert_drive_file_outlined, size: 16,),
                selectedIcon: Icon(Icons.insert_drive_file, size: 16,),
                label: Text('file1.txt'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.insert_drive_file_outlined, size: 16,),
                selectedIcon: Icon(Icons.insert_drive_file, size: 16,),
                label: Text('file2.txt'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.insert_drive_file_outlined, size: 16,),
                selectedIcon: Icon(Icons.insert_drive_file, size: 16,),
                label: Text('file3.txt'),
              ),
            ],
          ),
          const VerticalDivider(thickness: 1, width: 1),
          // This is the main content.
          Expanded(
            child: Center(
              child: Text('Editor content for file ${_selectedIndex + 1}'),
            ),
          ),
        ],
      ),
    );
  }
}
