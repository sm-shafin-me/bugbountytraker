'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { collection, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { useAuthStore } from '@/lib/store/authStore';
import { WeekCard } from '@/components/WeekCard';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import type { Week, Task } from '@/lib/firebase/seedRoadmap';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function Dashboard() {
    const router = useRouter();
    const { memberId, isAuthenticated, logout } = useAuthStore();
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'my-progress' | 'all-members'>('my-progress');
    const [isIdVisible, setIsIdVisible] = useState(false);
    const [codename, setCodename] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState('');



    useEffect(() => {
        if (!isAuthenticated || !memberId) {
            router.push('/');
        }
    }, [isAuthenticated, memberId, router]);

    useEffect(() => {
        if (!memberId) return;

        // Load roadmap structure (Always needed)
        const roadmapUnsub = onSnapshot(collection(db, 'roadmap', 'main', 'weeks'), (snapshot) => {
            const weeksData: Week[] = [];
            snapshot.forEach((doc) => {
                weeksData.push({ id: doc.id, ...doc.data() } as Week);
            });
            weeksData.sort((a, b) => a.weekNumber - b.weekNumber);
            setWeeks(weeksData);
        });

        let memberUnsub = () => { };

        // MEMBER MODE: Load from Firestore
        const memberRef = doc(db, 'members', memberId as string); // Cast as string for Firestore
        memberUnsub = onSnapshot(memberRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setCompletedTasks(data.completedTasks || []);
                setCodename(data.codename || '');
                if (!isEditingName) setTempName(data.codename || '');
            }
            setLoading(false);
        });

        return () => {
            roadmapUnsub();
            memberUnsub();
        };
    }, [memberId]);

    const handleSaveCodename = async () => {
        if (!memberId) return;

        try {
            await updateDoc(doc(db, 'members', memberId), {
                codename: tempName.trim()
            });
            setIsEditingName(false);
        } catch (error) {
            console.error("Error updating codename:", error);
        }
    };

    const toggleTask = async (taskId: string, completed: boolean) => {
        // if (!memberId) return; // memberId is always set if authenticated

        const newCompletedTasks = completed ?
            [...completedTasks, taskId] :
            completedTasks.filter(id => id !== taskId);

        // Optimistic update
        setCompletedTasks(newCompletedTasks);

        // MEMBER MODE: Update Firestore
        const memberRef = doc(db, 'members', memberId as string);
        try {
            await updateDoc(memberRef, {
                completedTasks: newCompletedTasks,
                lastActive: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const resetProgress = async () => {
        if (!confirm('Are you sure you want to reset all your progress? This cannot be undone.')) return;

        try {
            const memberRef = doc(db, 'members', memberId as string);
            await updateDoc(memberRef, {
                completedTasks: []
            });
        } catch (error) {
            console.error('Error resetting progress:', error);
            alert('Failed to reset progress');
        }
    };

    const totalTasks = weeks.reduce((acc, week) => acc + week.tasks.length, 0);
    const progress = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

    if (!isAuthenticated || !memberId) return null;

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border mb-8">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-black border-2 border-primary/50 shadow-[0_0_15px_rgba(0,255,65,0.3)]">
                                {memberId?.substring(3, 5)}
                            </div>
                            <div>
                                <h1 className="font-bold text-foreground leading-none">AGENT DASHBOARD</h1>
                                <div className="flex flex-col gap-1">
                                    {isEditingName ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <input
                                                type="text"
                                                value={tempName}
                                                onChange={(e) => setTempName(e.target.value)}
                                                className="bg-background border border-primary/50 rounded px-2 py-0.5 text-xs text-foreground w-32 focus:outline-none focus:border-primary"
                                                placeholder="Codename"
                                                maxLength={15}
                                            />
                                            <button onClick={handleSaveCodename} className="text-secondary hover:text-secondary/80 text-xs font-bold">SAVE</button>
                                            <button onClick={() => setIsEditingName(false)} className="text-muted-foreground hover:text-white text-xs">X</button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-secondary cursor-pointer hover:underline" onClick={() => setIsEditingName(true)}>
                                                {codename || "Set Codename"} <span className="text-[10px] text-muted-foreground ml-1">✏️</span>
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-primary font-mono opacity-70">
                                            ID: {isIdVisible ? memberId : '••••••••'}
                                        </p>
                                        <button
                                            onClick={() => setIsIdVisible(!isIdVisible)}
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {isIdVisible ? (
                                                <EyeOff className="w-3 h-3" />
                                            ) : (
                                                <Eye className="w-3 h-3" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-4 bg-muted/20 px-4 py-2 rounded-full border border-primary/20">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">My Progress</span>
                            <div className="h-2 w-32 bg-secondary/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-secondary"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="font-mono text-primary font-bold">{progress}%</span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                                onClick={resetProgress}
                            >
                                Reset Stats
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/resources')}
                            >
                                Resources
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    logout();
                                    router.push('/');
                                }}
                                className="border-destructive/30 hover:border-destructive text-destructive"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(0,255,65,0.2)]" />
                    </div>
                ) : (
                    <Tabs defaultValue="my-progress" value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="space-y-8">
                        <div className="flex justify-center">
                            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                                <TabsTrigger value="my-progress">My Mission Status</TabsTrigger>
                                <TabsTrigger value="all-members">All Agents Status</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="my-progress" className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {weeks.map((week, index) => (
                                    <WeekCard
                                        key={week.id}
                                        week={week}
                                        completedTasks={completedTasks}
                                        onTaskToggle={toggleTask}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="all-members">
                            <div className="bg-card border border-border rounded-xl p-6 shadow-2xl">
                                <div className="mb-6 text-center">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        AGENT RANKINGS
                                    </h2>
                                    <p className="text-muted-foreground">Live tracking of all active agents</p>
                                </div>
                                <LeaderboardTable currentMemberId={memberId} totalTasksCount={totalTasks} />
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </main>
        </div>
    );
}
