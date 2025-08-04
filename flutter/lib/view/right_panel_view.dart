import 'package:flutter/material.dart';

class RightPanelView extends StatelessWidget {
  const RightPanelView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const Padding(
          padding: EdgeInsets.all(8.0),
          child: Text("CHAT"),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              children: const [
                // Chat messages will go here
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Container(
              padding: const EdgeInsets.all(4.0),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primaryContainer,
                borderRadius: BorderRadius.circular(8.0),
              ),
              child: Column(
                children: <Widget>[
                  Row(),
                  TextField(
                    decoration: InputDecoration(
                      hint: Text(
                        "Ask Co-scientist",
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.attach_file, size: 16),
                        onPressed: () {
                          // Attach file action
                        },
                      ),
                      IconButton(
                        icon: const Icon(Icons.mic, size: 16),
                        onPressed: () {
                          // Voice input action
                        },
                      ),
                      IconButton(
                        icon: const Icon(Icons.send, size: 16),
                        onPressed: () {
                          // Voice input action
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
