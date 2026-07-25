import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const FinGrowApp());
}

class FinGrowApp extends StatelessWidget {
  const FinGrowApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FinGrow',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  final List<Widget> _pages = const [
    DashboardView(),
    PortfolioView(),
    GoalsView(),
    NewsView(),
    ProfileView(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('FinGrow'),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 16),
            child: Icon(Icons.notifications_none),
          ),
        ],
      ),
      body: SafeArea(child: _pages[_selectedIndex]),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) => setState(() => _selectedIndex = index),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          NavigationDestination(icon: Icon(Icons.pie_chart), label: 'Portfolio'),
          NavigationDestination(icon: Icon(Icons.flag), label: 'Goals'),
          NavigationDestination(icon: Icon(Icons.newspaper), label: 'News'),
          NavigationDestination(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

class DashboardView extends StatelessWidget {
  const DashboardView({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Welcome back, Ava', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 8),
                Text('Your money habits are trending in the right direction.', style: Theme.of(context).textTheme.bodyMedium),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: const [
                    Chip(label: Text('+12% this month')),
                    Chip(label: Text('3 goals active')),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        Text('Your snapshot', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 1.25,
          children: const [
            StatCard(title: 'Net worth', value: '\$24.8k'),
            StatCard(title: 'Invested', value: '\$18.2k'),
            StatCard(title: 'Monthly save', value: '\$1.2k'),
            StatCard(title: 'Cash buffer', value: '\$6.6k'),
          ],
        ),
        const SizedBox(height: 16),
        Text('Today’s focus', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        Card(
          child: ListTile(
            leading: const Icon(Icons.trending_up),
            title: const Text('Portfolio health'),
            subtitle: const Text('Your diversified mix is holding steady amid recent market swings.'),
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.savings),
            title: const Text('Emergency fund'),
            subtitle: const Text('You are 72% toward your target of \$10k.'),
          ),
        ),
      ],
    );
  }
}

class PortfolioView extends StatelessWidget {
  const PortfolioView({super.key});

  @override
  Widget build(BuildContext context) {
    final holdings = [
      _Holding(name: 'Stocks', value: '\$10.4k', percent: '45%'),
      _Holding(name: 'Mutual funds', value: '\$6.9k', percent: '30%'),
      _Holding(name: 'Crypto', value: '\$3.4k', percent: '15%'),
      _Holding(name: 'Cash', value: '\$2.3k', percent: '10%'),
    ];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text('Portfolio allocation', style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 12),
        ...holdings.map((holding) => Card(
              child: ListTile(
                leading: const Icon(Icons.show_chart),
                title: Text(holding.name),
                subtitle: Text(holding.value),
                trailing: Text(holding.percent, style: const TextStyle(fontWeight: FontWeight.bold)),
              ),
            )),
      ],
    );
  }
}

class GoalsView extends StatelessWidget {
  const GoalsView({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text('Goals', style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 12),
        const GoalTile(title: 'Emergency Fund', progress: 0.72, target: '\$10k target'),
        const GoalTile(title: 'Travel', progress: 0.48, target: '\$4k target'),
        const GoalTile(title: 'Home', progress: 0.24, target: '\$25k target'),
      ],
    );
  }
}

class NewsView extends StatefulWidget {
  const NewsView({super.key});

  @override
  State<NewsView> createState() => _NewsViewState();
}

class _NewsViewState extends State<NewsView> {
  late Future<List<NewsArticle>> _newsFuture;

  @override
  void initState() {
    super.initState();
    _newsFuture = _fetchNews();
  }

  Future<List<NewsArticle>> _fetchNews() async {
    final urls = [
      Uri.parse('http://10.0.2.2:5000/api/news'),
      Uri.parse('http://localhost:5000/api/news'),
    ];

    for (final url in urls) {
      try {
        final response = await http.get(url).timeout(const Duration(seconds: 6));
        if (response.statusCode == 200) {
          final decoded = jsonDecode(response.body);
          if (decoded is List) {
            return decoded.map((item) => NewsArticle.fromJson(item)).toList();
          }
        }
      } catch (_) {}
    }

    return [
      const NewsArticle(
        title: 'Markets react to evolving rate signals',
        description: 'Investors are watching inflation and central bank commentary closely.',
        pubDate: 'Live summary',
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<NewsArticle>>(
      future: _newsFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        final articles = snapshot.data ?? [];

        return ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text('Financial news', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 12),
            if (articles.isEmpty)
              Card(child: Padding(padding: const EdgeInsets.all(16), child: Text('News is temporarily unavailable.')))
            else
              ...articles.map((article) => Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(article.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                          const SizedBox(height: 8),
                          Text(article.description),
                          const SizedBox(height: 8),
                          Text(article.pubDate, style: Theme.of(context).textTheme.bodySmall),
                        ],
                      ),
                    ),
                  )),
          ],
        );
      },
    );
  }
}

class ProfileView extends StatelessWidget {
  const ProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Center(
          child: CircleAvatar(
            radius: 36,
            backgroundColor: Theme.of(context).colorScheme.primary,
            child: const Icon(Icons.person, size: 40, color: Colors.white),
          ),
        ),
        const SizedBox(height: 12),
        Center(child: Text('Ava Martinez', style: Theme.of(context).textTheme.titleMedium)),
        Center(child: Text('Premium member', style: Theme.of(context).textTheme.bodyMedium)),
        const SizedBox(height: 16),
        const ListTile(title: Text('Email'), subtitle: Text('ava@fingrow.app')),
        const ListTile(title: Text('Plan'), subtitle: Text('Growth')),
        const ListTile(title: Text('Joined'), subtitle: Text('March 2026')),
        const SizedBox(height: 8),
        SwitchListTile(value: true, onChanged: (_) {}, title: const Text('Notifications')),
        SwitchListTile(value: false, onChanged: (_) {}, title: const Text('Auto-save insights')),
      ],
    );
  }
}

class StatCard extends StatelessWidget {
  final String title;
  final String value;

  const StatCard({required this.title, required this.value, super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 8),
            Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}

class GoalTile extends StatelessWidget {
  final String title;
  final double progress;
  final String target;

  const GoalTile({required this.title, required this.progress, required this.target, super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.bold))),
                Text(target, style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
            const SizedBox(height: 10),
            LinearProgressIndicator(value: progress),
            const SizedBox(height: 8),
            Text('${(progress * 100).toInt()}% completed'),
          ],
        ),
      ),
    );
  }
}

class _Holding {
  final String name;
  final String value;
  final String percent;

  const _Holding({required this.name, required this.value, required this.percent});
}

class NewsArticle {
  final String title;
  final String description;
  final String pubDate;

  const NewsArticle({required this.title, required this.description, required this.pubDate});

  factory NewsArticle.fromJson(dynamic json) {
    if (json is Map<String, dynamic>) {
      return NewsArticle(
        title: json['title']?.toString() ?? 'Untitled',
        description: json['description']?.toString() ?? 'No description available',
        pubDate: json['pubDate']?.toString() ?? 'Recently updated',
      );
    }

    return const NewsArticle(title: 'Untitled', description: 'No description available', pubDate: 'Recently updated');
  }
}
