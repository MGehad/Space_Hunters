import 'package:flutter/material.dart';
import 'dart:math' as math;

class SpaceBackground extends StatefulWidget {
  final Widget child;

  const SpaceBackground({super.key, required this.child});

  @override
  State<SpaceBackground> createState() => _SpaceBackgroundState();
}

class _SpaceBackgroundState extends State<SpaceBackground>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<Star> stars = [];

  @override
  void initState() {
    super.initState();
    _generateStars();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 100), // Slower, more peaceful falling motion
    )..repeat();
  }

  void _generateStars() {
    final random = math.Random();
    for (int i = 0; i < 100; i++) {
      stars.add(
        Star(
          x: random.nextDouble(),
          y: random.nextDouble(),
          size: random.nextDouble() * 2 + 1,
          opacity: random.nextDouble() * 0.5 + 0.3,
        ),
      );
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Color(0xFF0F172A), Color(0xFF1E1B4B), Color(0xFF312E81)],
            ),
          ),
        ),
        AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return CustomPaint(
              painter: StarsPainter(stars, _controller.value),
              size: Size.infinite,
            );
          },
        ),
        widget.child,
      ],
    );
  }
}

class Star {
  final double x;
  final double y;
  final double size;
  final double opacity;

  Star({
    required this.x,
    required this.y,
    required this.size,
    required this.opacity,
  });
}

class StarsPainter extends CustomPainter {
  final List<Star> stars;
  final double animation;

  StarsPainter(this.stars, this.animation);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..style = PaintingStyle.fill;

    for (final star in stars) {
      paint.color = Colors.white.withAlpha((star.opacity * 255).toInt());
      
      // Calculate falling motion - stars move downward
      final fallProgress = (animation * 1.5) % 1.0; // Slower falling speed
      final currentY = (star.y + fallProgress) % 1.0;
      
      final offset = Offset(
        star.x * size.width,
        currentY * size.height,
      );
      canvas.drawCircle(offset, star.size, paint);
    }
  }

  @override
  bool shouldRepaint(covariant StarsPainter oldDelegate) => true;
}
