'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Week, Task, Resource } from '@/lib/firebase/seedRoadmap';

export function AdminRoadmapEditor() {
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingWeek, setEditingWeek] = useState<Week | null>(null);
    const [isAddingWeek, setIsAddingWeek] = useState(false);

    useEffect(() => {
        loadWeeks();
    }, []);

    const loadWeeks = async () => {
        setLoading(true);
        try {
            const weeksRef = collection(db, 'roadmap', 'main', 'weeks');
            const weeksSnapshot = await getDocs(weeksRef);
            const weeksData: Week[] = [];

            weeksSnapshot.forEach((doc) => {
                weeksData.push({ id: doc.id, ...doc.data() } as Week);
            });

            weeksData.sort((a, b) => a.weekNumber - b.weekNumber);
            setWeeks(weeksData);
        } catch (error) {
            console.error('Error loading weeks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddWeek = async (weekData: Partial<Week>) => {
        try {
            const weekId = `week-${weekData.weekNumber}`;
            const weekRef = doc(db, 'roadmap', 'main', 'weeks', weekId);

            await setDoc(weekRef, {
                weekNumber: weekData.weekNumber,
                title: weekData.title,
                description: weekData.description,
                tasks: weekData.tasks || [],
            });

            await loadWeeks();
            setIsAddingWeek(false);
        } catch (error) {
            console.error('Error adding week:', error);
            alert('Failed to add week');
        }
    };

    const handleUpdateWeek = async (weekId: string, weekData: Partial<Week>) => {
        try {
            const weekRef = doc(db, 'roadmap', 'main', 'weeks', weekId);

            await updateDoc(weekRef, {
                title: weekData.title,
                description: weekData.description,
                tasks: weekData.tasks,
            });

            await loadWeeks();
            setEditingWeek(null);
        } catch (error) {
            console.error('Error updating week:', error);
            alert('Failed to update week');
        }
    };

    const handleDeleteWeek = async (weekId: string) => {
        if (!confirm('Are you sure you want to delete this week? This action cannot be undone.')) {
            return;
        }

        try {
            const weekRef = doc(db, 'roadmap', 'main', 'weeks', weekId);
            await deleteDoc(weekRef);
            await loadWeeks();
        } catch (error) {
            console.error('Error deleting week:', error);
            alert('Failed to delete week');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Roadmap Management</h2>
                    <p className="text-sm text-muted-foreground">Add, edit, or delete weeks and tasks</p>
                </div>
                <Button
                    onClick={() => setIsAddingWeek(true)}
                    className="bg-gradient-to-r from-primary to-secondary"
                >
                    + Add New Week
                </Button>
            </div>

            {isAddingWeek && (
                <WeekForm
                    onSave={handleAddWeek}
                    onCancel={() => setIsAddingWeek(false)}
                    nextWeekNumber={weeks.length + 1}
                />
            )}

            <div className="space-y-4">
                {weeks.map((week) => (
                    <motion.div
                        key={week.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border rounded-xl p-6"
                    >
                        {editingWeek?.id === week.id ? (
                            <WeekForm
                                week={editingWeek}
                                onSave={(data) => handleUpdateWeek(week.id, data)}
                                onCancel={() => setEditingWeek(null)}
                            />
                        ) : (
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                                                WEEK {week.weekNumber}
                                            </span>
                                            <h3 className="text-xl font-bold text-foreground">{week.title}</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{week.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditingWeek(week)}
                                            className="border-primary/30 hover:border-primary"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDeleteWeek(week.id)}
                                            className="border-destructive/30 hover:border-destructive text-destructive"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-foreground">Tasks ({week.tasks.length}):</p>
                                    {week.tasks.map((task, idx) => (
                                        <div key={task.id} className="text-sm text-muted-foreground pl-4">
                                            {idx + 1}. {task.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

interface WeekFormProps {
    week?: Week;
    onSave: (data: Partial<Week>) => void;
    onCancel: () => void;
    nextWeekNumber?: number;
}

function WeekForm({ week, onSave, onCancel, nextWeekNumber }: WeekFormProps) {
    const [weekNumber, setWeekNumber] = useState(week?.weekNumber || nextWeekNumber || 1);
    const [title, setTitle] = useState(week?.title || '');
    const [description, setDescription] = useState(week?.description || '');
    const [tasks, setTasks] = useState<Task[]>(week?.tasks || []);

    // New task state
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [newTaskResources, setNewTaskResources] = useState<Resource[]>([]);

    // Temp resource state
    const [tempResTitle, setTempResTitle] = useState('');
    const [tempResUrl, setTempResUrl] = useState('');

    const handleAddResource = () => {
        if (!tempResTitle.trim() || !tempResUrl.trim()) return;
        setNewTaskResources([...newTaskResources, { title: tempResTitle, url: tempResUrl }]);
        setTempResTitle('');
        setTempResUrl('');
    };

    const handleRemoveResource = (index: number) => {
        setNewTaskResources(newTaskResources.filter((_, i) => i !== index));
    };

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;

        const newTask: Task = {
            id: `w${weekNumber}-t${tasks.length + 1}`,
            title: newTaskTitle,
            description: newTaskDesc,
            completed: false,
            resources: newTaskResources,
        };

        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
        setNewTaskDesc('');
        setNewTaskResources([]);
    };

    const handleRemoveTask = (taskId: string) => {
        setTasks(tasks.filter(t => t.id !== taskId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ weekNumber, title, description, tasks });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-muted/30 border border-border rounded-xl p-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-sm font-medium text-foreground">Week Number</label>
                    <Input
                        type="number"
                        value={weekNumber}
                        onChange={(e) => setWeekNumber(parseInt(e.target.value))}
                        min={1}
                        max={52}
                        required
                        disabled={!!week}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-foreground">Title</label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., XSS Fundamentals"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of this week's focus"
                    required
                />
            </div>

            <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground mb-3">Tasks ({tasks.length})</p>

                <div className="space-y-2 mb-4">
                    {tasks.map((task, idx) => (
                        <div key={task.id} className="bg-card p-3 rounded border border-border">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2">
                                    <span className="text-xs text-muted-foreground mt-1">{idx + 1}.</span>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{task.title}</p>
                                        <p className="text-xs text-muted-foreground">{task.description}</p>
                                        {task.resources && task.resources.length > 0 && (
                                            <div className="mt-1 flex flex-wrap gap-2">
                                                {task.resources.map((res, i) => (
                                                    <span key={i} className="text-[10px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded truncate max-w-[200px]">
                                                        🔗 {res.title}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemoveTask(task.id)}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                >
                                    ✕
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-background border border-border rounded-lg p-4 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Add New Task</p>
                    <Input
                        placeholder="Task title"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <Input
                        placeholder="Task description"
                        value={newTaskDesc}
                        onChange={(e) => setNewTaskDesc(e.target.value)}
                    />

                    {/* Resource addition for new task */}
                    <div className="bg-muted/50 p-3 rounded space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Attached Resources ({newTaskResources.length})</p>
                        {newTaskResources.map((res, i) => (
                            <div key={i} className="flex items-center justify-between text-xs bg-background p-1.5 rounded border border-border">
                                <span className="truncate max-w-[200px]">{res.title}</span>
                                <button type="button" onClick={() => handleRemoveResource(i)} className="text-destructive hover:text-destructive/80">✕</button>
                            </div>
                        ))}
                        <div className="flex gap-2">
                            <Input
                                placeholder="Resource Title"
                                value={tempResTitle}
                                onChange={(e) => setTempResTitle(e.target.value)}
                                className="h-8 text-xs"
                            />
                            <Input
                                placeholder="URL"
                                value={tempResUrl}
                                onChange={(e) => setTempResUrl(e.target.value)}
                                className="h-8 text-xs"
                            />
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleAddResource}
                                className="h-8 bg-secondary/20 text-secondary hover:bg-secondary/30 border border-secondary/20"
                            >
                                +Link
                            </Button>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={handleAddTask}
                        variant="outline"
                        className="w-full border-primary/30 hover:border-primary"
                    >
                        + Add Task to Week
                    </Button>
                </div>
            </div>

            <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-secondary">
                    {week ? 'Update Week' : 'Create Week'}
                </Button>
                <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
                    Cancel
                </Button>
            </div>
        </form>
    );
}
