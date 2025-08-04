import 'package:flutter/material.dart';

class ReferenceManagementView extends StatelessWidget {
  const ReferenceManagementView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reference Management'),
      ),
      body: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: DataTable(
            dataTextStyle: TextStyle(
              color: Colors.black87,
              fontSize: 12,
            ),
            dataRowMaxHeight: 48,
            columns: const <DataColumn>[
              DataColumn(
                label: Text('Author'),
              ),
              DataColumn(
                label: Text('Year'),
              ),
              DataColumn(
                label: Text('Title'),
              ),
              DataColumn(
                label: Text('Source'),
              ),
              DataColumn(
                label: Text('Added'),
              ),
            ],
            rows: const <DataRow>[
              DataRow(
                cells: <DataCell>[
                  DataCell(Text('Vaswani, A.')),
                  DataCell(Text('2017')),
                  DataCell(Text('Attention is all you need')),
                  DataCell(Text('NIPS')),
                  DataCell(Text('2023-10-27')),
                ],
              ),
              DataRow(
                cells: <DataCell>[
                  DataCell(Text('Devlin, J.')),
                  DataCell(Text('2018')),
                  DataCell(Text('BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding')),
                  DataCell(Text('NAACL')),
                  DataCell(Text('2023-10-28')),
                ],
              ),
              DataRow(
                cells: <DataCell>[
                  DataCell(Text('Brown, T. B.')),
                  DataCell(Text('2020')),
                  DataCell(Text('Language Models are Few-Shot Learners')),
                  DataCell(Text('NeurIPS')),
                  DataCell(Text('2023-10-29')),
                ],
              ),
            ],
          ),
        ),
      );
  }
}
