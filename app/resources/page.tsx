'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { ResourceCard } from '@/components/ResourceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import type { Resource } from '@/lib/firebase/resources';
import { CATEGORIES } from '@/lib/firebase/resources';

export default function ResourcesPage() {
    const router = useRouter();
    const [resources, setResources] = useState<Resource[]>([]);
    const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    useEffect(() => {
        // Real-time listener for resources
        const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const resourcesData: Resource[] = [];
            snapshot.forEach((doc) => {
                resourcesData.push({ id: doc.id, ...doc.data() } as Resource);
            });
            setResources(resourcesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        let result = resources;

        // Filter by search
        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(r =>
                r.title.toLowerCase().includes(lowerSearch) ||
                r.description.toLowerCase().includes(lowerSearch) ||
                r.category.toLowerCase().includes(lowerSearch)
            );
        }

        // Filter by category
        if (selectedCategory !== 'All') {
            result = result.filter(r => r.category === selectedCategory);
        }

        setFilteredResources(result);
    }, [search, selectedCategory, resources]);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                RESOURCE LIBRARY
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Curated tools and learning materials
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => router.push('/dashboard')}
                            >
                                Dashboard
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/leaderboard')}
                            >
                                Leaderboard
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Filters */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <Input
                            placeholder="Search resources..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="md:max-w-md"
                        />
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            <Button
                                size="sm"
                                variant={selectedCategory === 'All' ? 'default' : 'outline'}
                                onClick={() => setSelectedCategory('All')}
                                className="whitespace-nowrap"
                            >
                                All
                            </Button>
                            {CATEGORIES.map(cat => (
                                <Button
                                    key={cat}
                                    size="sm"
                                    variant={selectedCategory === cat ? 'default' : 'outline'}
                                    onClick={() => setSelectedCategory(cat)}
                                    className="whitespace-nowrap"
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Resources Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredResources.map((resource) => (
                                <ResourceCard key={resource.id} resource={resource} />
                            ))}
                        </div>

                        {filteredResources.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                <p>No resources found matching your criteria.</p>
                                <Button
                                    variant="link"
                                    onClick={() => { setSearch(''); setSelectedCategory('All'); }}
                                >
                                    Clear filters
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
