import 'dart:math';

import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class ChartSection extends StatefulWidget {
  final Map<String, dynamic> chartData;

  const ChartSection({super.key, required this.chartData});

  @override
  State<ChartSection> createState() => _ChartSectionState();
}

class _ChartSectionState extends State<ChartSection> {
  int lastIndex = -1;

  @override
  Widget build(BuildContext context) {
    // Check if we have any data at all
    final hasStatistics =
        (widget.chartData['statistics'] as List?)?.isNotEmpty ?? false;
    final hasComparisons =
        (widget.chartData['comparisons'] as List?)?.isNotEmpty ?? false;
    final hasTrends =
        (widget.chartData['trends'] as List?)?.isNotEmpty ?? false;
    final hasCategories =
        (widget.chartData['categories'] as List?)?.isNotEmpty ?? false;

    if (!hasStatistics && !hasComparisons && !hasTrends && !hasCategories) {
      return _buildNoDataWidget();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Data Visualizations',
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 20),

        // Statistics Cards
        if (hasStatistics) ...[
          _buildStatisticsCards(),
          const SizedBox(height: 20),
        ],

        // Bar Chart for Comparisons
        if (hasComparisons) ...[
          _buildComparisonChart(context),
          const SizedBox(height: 20),
        ],

        // Line Chart for Trends
        if (hasTrends) ...[_buildTrendChart(), const SizedBox(height: 20)],

        // Pie Chart for Categories
        if (hasCategories) ...[_buildCategoryChart()],
      ],
    );
  }

  Widget _buildNoDataWidget() {
    return SizedBox(height: 2);
  }

  Widget _buildStatisticsCards() {
    final statistics = widget.chartData['statistics'] as List;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Key Statistics',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: statistics.map((stat) {
            return Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    const Color(0xFF3B82F6).withAlpha(30),
                    const Color(0xFF8B5CF6).withAlpha(30),
                  ],
                ),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.white.withAlpha(20)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    stat['label'] ?? 'Unknown',
                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        '${stat['value'] ?? 0}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        stat['unit'] ?? '',
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildComparisonChart(BuildContext context) {
    final comparisons = widget.chartData['comparisons'] as List;

    return Container(
      height: 250,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(10),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withAlpha(30)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Comparison Analysis',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: BarChart(
              BarChartData(
                barGroups: comparisons.asMap().entries.map((entry) {
                  final index = entry.key;
                  final data = entry.value;
                  return BarChartGroupData(
                    x: index,
                    barRods: [
                      BarChartRodData(
                        toY: (data['value'] ?? 0).toDouble(),
                        color: _getBarColor(index),
                        width:
                            MediaQuery.widthOf(context) *
                            .3 /
                            comparisons.length,
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(4),
                        ),
                      ),
                    ],
                  );
                }).toList(),
                titlesData: FlTitlesData(
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 40,
                      getTitlesWidget: (value, meta) {
                        return Text(
                          value.toInt().toString(),
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 12,
                          ),
                        );
                      },
                    ),
                  ),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: (value, meta) {
                        if (value.toInt() < comparisons.length) {
                          final label =
                              comparisons[value.toInt()]['category'] ?? '';
                          return Padding(
                            padding: const EdgeInsets.only(top: 8),
                            child: Text(
                              label.length > 10
                                  ? '${label.substring(0, 10)}...'
                                  : label,
                              style: const TextStyle(
                                color: Colors.white70,
                                fontSize: 11,
                              ),
                            ),
                          );
                        }
                        return const SizedBox();
                      },
                    ),
                  ),
                  rightTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  topTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                ),
                borderData: FlBorderData(show: false),
                gridData: FlGridData(
                  show: true,
                  drawVerticalLine: false,
                  getDrawingHorizontalLine: (value) {
                    return FlLine(
                      color: Colors.white.withAlpha(10),
                      strokeWidth: 1,
                    );
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTrendChart() {
    final trends = widget.chartData['trends'] as List;

    return Container(
      height: 250,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(10),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withAlpha(30)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Trend Analysis',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: LineChart(
              LineChartData(
                lineBarsData: [
                  LineChartBarData(
                    spots: trends.asMap().entries.map((entry) {
                      return FlSpot(
                        entry.key.toDouble(),
                        (entry.value['value'] ?? 0).toDouble(),
                      );
                    }).toList(),
                    isCurved: true,
                    color: const Color(0xFF3B82F6),
                    barWidth: 3,
                    belowBarData: BarAreaData(
                      show: true,
                      color: const Color(0xFF3B82F6).withAlpha(30),
                    ),
                    dotData: FlDotData(
                      show: true,
                      getDotPainter: (spot, percent, barData, index) {
                        return FlDotCirclePainter(
                          radius: 4,
                          color: Colors.white,
                          strokeWidth: 2,
                          strokeColor: const Color(0xFF3B82F6),
                        );
                      },
                    ),
                  ),
                ],
                titlesData: FlTitlesData(
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 30,
                      getTitlesWidget: (value, meta) {
                        return Text(
                          value.toInt().toString(),
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 12,
                          ),
                        );
                      },
                    ),
                  ),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: (value, meta) {
                        int val = value.toInt();
                        if (val < trends.length && val != lastIndex) {
                          lastIndex = val;
                          final label = trends[val]['period'] ?? '';
                          return Padding(
                            padding: const EdgeInsets.only(top: 8),
                            child: SizedBox(
                              width: 80,
                              child: Text(
                                label,
                                style: const TextStyle(
                                  color: Colors.white70,
                                  fontSize: 11,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ),
                          );
                        }
                        return const SizedBox();
                      },
                    ),
                  ),
                  rightTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  topTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                ),
                borderData: FlBorderData(show: false),
                gridData: FlGridData(
                  show: true,
                  drawVerticalLine: false,
                  getDrawingHorizontalLine: (value) {
                    return FlLine(
                      color: Colors.white.withAlpha(10),
                      strokeWidth: 1,
                    );
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChart() {
    final categories = widget.chartData['categories'] as List;

    return Container(
      height: 250,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(10),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withAlpha(30)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Distribution Analysis',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: Row(
              children: [
                // Pie Chart
                Expanded(
                  flex: 3,
                  child: PieChart(
                    PieChartData(
                      sections: categories.asMap().entries.map((entry) {
                        final index = entry.key;
                        final data = entry.value;
                        final percentage = (data['percentage'] ?? 0).toDouble();

                        return PieChartSectionData(
                          value: percentage,
                          title: '${percentage.toInt()}%',
                          color: _getPieColor(index),
                          radius: min(MediaQuery.widthOf(context) * .1, 50),
                          titleStyle: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        );
                      }).toList(),
                      sectionsSpace: 2,
                      centerSpaceRadius: 40,
                    ),
                  ),
                ),
                const SizedBox(width: 20),
                // Legend
                Expanded(
                  flex: 2,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: categories.asMap().entries.map((entry) {
                      final index = entry.key;
                      final data = entry.value;

                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: Row(
                          children: [
                            Container(
                              width: 12,
                              height: 12,
                              decoration: BoxDecoration(
                                color: _getPieColor(index),
                                borderRadius: BorderRadius.circular(2),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                data['name'] ?? 'Unknown',
                                style: const TextStyle(
                                  color: Colors.white70,
                                  fontSize: 12,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Color _getBarColor(int index) {
    const colors = [
      Color(0xFF3B82F6),
      Color(0xFF8B5CF6),
      Color(0xFF10B981),
      Color(0xFFF59E0B),
      Color(0xFFEF4444),
    ];
    return colors[index % colors.length];
  }

  Color _getPieColor(int index) {
    const colors = [
      Color(0xFF6366F1),
      Color(0xFFA78BFA),
      Color(0xFF34D399),
      Color(0xFFFBBF24),
      Color(0xFFF87171),
    ];
    return colors[index % colors.length];
  }
}
