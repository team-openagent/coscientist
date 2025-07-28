import 'package:flutter/material.dart';
import 'reference_management_view.dart';
import 'editor_view.dart';
import 'right_panel_view.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;
  bool _isRightPanelVisible = true;

  void _toggleRightPanel() {
    setState(() {
      _isRightPanelVisible = !_isRightPanelVisible;
    });
  }

  final List<Widget> _views = [
    const EditorView(),
    const ReferenceManagementView(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Co-scientist'),
        toolbarHeight: 32,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(8),
          child: const Divider(height: 1.0, thickness: 1.0),
        ),
        actions: [
          IconButton(
            icon: _isRightPanelVisible
                ? const Icon(Icons.keyboard_double_arrow_right)
                : const Icon(Icons.keyboard_double_arrow_left),
            onPressed: _toggleRightPanel,
          ),
        ],
      ),
      body: Row(
        children: <Widget>[
          NavigationRail(
            selectedIndex: _selectedIndex,
            onDestinationSelected: (int index) {
              setState(() {
                _selectedIndex = index;
              });
            },
            labelType: NavigationRailLabelType.none,
            leading: const SizedBox(height: 128),
            trailing: Expanded(
              child: Align(
                alignment: Alignment.bottomCenter,
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 4),
                  child: IconButton(
                    icon: const Icon(Icons.settings),
                    onPressed: () {
                      // Handle settings
                    },
                  ),
                ),
              ),
            ),
            destinations: const <NavigationRailDestination>[
              NavigationRailDestination(
                icon: Icon(Icons.edit_document),
                selectedIcon: Icon(Icons.edit_document),
                label: Text('Editor'),
                padding: EdgeInsets.symmetric(vertical: 4.0),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.book),
                selectedIcon: Icon(Icons.book),
                label: Text('References'),
                padding: EdgeInsets.symmetric(vertical: 4.0),
              ),
            ],
          ),
          const VerticalDivider(thickness: 1, width: 1),
          // This is the main content.
          Expanded(child: Stack(children: [_views[_selectedIndex]])),
          const VerticalDivider(thickness: 1, width: 1),
          if (_isRightPanelVisible)
            SizedBox(width: 300, child: RightPanelView()),
        ],
      ),
    );
  }
}
