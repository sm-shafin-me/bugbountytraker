'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addResource, updateResource, deleteResource, CATEGORIES } from '@/lib/firebase/resources';
import type { Resource } from '@/lib/firebase/resources';

export function AdminResourceManager() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);

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

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setUrl('');
        setCategory(CATEGORIES[0]);
        setEditingId(null);
        setIsAdding(false);
    };

    const handleEdit = (resource: Resource) => {
        setTitle(resource.title);
        setDescription(resource.description);
        setUrl(resource.url);
        setCategory(resource.category);
        setEditingId(resource.id);
        setIsAdding(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            await updateResource(editingId, { title, description, url, category });
        } else {
            await addResource({ title, description, url, category });
        }

        resetForm();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            await deleteResource(id);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Resources</h2>
                    <p className="text-muted-foreground">Manage learning resources and tools</p>
                </div>
                <Button
                    onClick={() => setIsAdding(true)}
                    className="bg-gradient-to-r from-primary to-secondary"
                >
                    + Add Resource
                </Button>
            </div>

            {isAdding && (
                <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="bg-muted/30 border border-border rounded-xl p-6 space-y-4"
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-foreground">Title</label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Resource Title"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">Category</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">URL</label>
                        <Input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            type="url"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">Description</label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of the resource"
                            required
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                        <Button type="submit" className="bg-primary text-primary-foreground">
                            {editingId ? 'Update Resource' : 'Add Resource'}
                        </Button>
                    </div>
                </motion.form>
            )}

            <div className="grid gap-4">
                {resources.map((resource) => (
                    <div
                        key={resource.id}
                        className="flex items-center justify-between p-4 bg-card border border-border rounded-lg group hover:border-primary/30 transition-colors"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                                    {resource.category}
                                </span>
                                <h3 className="font-medium text-foreground">{resource.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                            <a href={resource.url} target="_blank" rel="noreferrer" className="text-xs text-secondary hover:underline truncate block max-w-md mt-1">
                                {resource.url}
                            </a>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(resource)}>Edit</Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-destructive/30 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(resource.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}

                {resources.length === 0 && !loading && (
                    <div className="text-center py-8 text-muted-foreground">
                        No resources found. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
