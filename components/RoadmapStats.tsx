'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RoadmapStatsProps {
    weeks: any[];
    allCompletedTasks: { [key: string]: number }; // taskId -> count of members who completed it
    totalMembers: number;
}

export function RoadmapStats({ weeks, allCompletedTasks, totalMembers }: RoadmapStatsProps) {
    // Calculate stats
    const totalTasks = weeks.reduce((acc, week) => acc + week.tasks.length, 0);
    const totalPossibleCompletions = totalTasks * totalMembers;
    const totalActualCompletions = Object.values(allCompletedTasks).reduce((acc, count) => acc + count, 0);
    const globalProgress = totalMembers > 0 ? Math.round((totalActualCompletions / totalPossibleCompletions) * 100) : 0;

    // Find hardest week (lowest completion rate)
    const weekStats = weeks.map(week => {
        const weekTasks = week.tasks;
        const weekTotalPossible = weekTasks.length * totalMembers;
        const weekActual = weekTasks.reduce((acc: number, task: any) => acc + (allCompletedTasks[task.id] || 0), 0);
        const rate = totalMembers > 0 && weekTasks.length > 0 ? Math.round((weekActual / weekTotalPossible) * 100) : 0;

        return {
            ...week,
            completionRate: rate,
            actualCompletions: weekActual
        };
    });

    const hardestWeek = [...weekStats].sort((a, b) => a.completionRate - b.completionRate)[0];
    const easiestWeek = [...weekStats].sort((a, b) => b.completionRate - a.completionRate)[0];

    return (
        <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-muted/20 border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Global Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">{globalProgress}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Across all {totalMembers} agents</p>
                        <Progress value={globalProgress} className="h-1 mt-3" />
                    </CardContent>
                </Card>

                <Card className="bg-muted/20 border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Most Active Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-secondary truncate">Week {easiestWeek?.weekNumber || 0}: {easiestWeek?.title || 'N/A'}</div>
                        <p className="text-xs text-muted-foreground mt-1">{easiestWeek?.completionRate || 0}% completion rate</p>
                    </CardContent>
                </Card>

                <Card className="bg-muted/20 border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Hardest Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-destructive truncate">Week {hardestWeek?.weekNumber || 0}: {hardestWeek?.title || 'N/A'}</div>
                        <p className="text-xs text-muted-foreground mt-1">{hardestWeek?.completionRate || 0}% completion rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid gap-6">
                <h2 className="text-xl font-bold text-foreground">Detailed Week Analysis</h2>
                {weekStats.map((week) => (
                    <motion.div
                        key={week.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border rounded-xl p-6"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                                        WEEK {week.weekNumber}
                                    </span>
                                    <h3 className="font-bold text-lg text-foreground">{week.title}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">{week.description}</p>
                            </div>
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary">{week.completionRate}%</div>
                                    <div className="text-xs text-muted-foreground">Completion Rate</div>
                                </div>
                                <div className="h-12 w-1 bg-border rounded-full" />
                                <div className="text-right">
                                    <div className="text-xl font-bold text-foreground">{week.actualCompletions}</div>
                                    <div className="text-xs text-muted-foreground">Tasks Done</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mt-4 pt-4 border-t border-border/50">
                            {week.tasks.map((task: any) => {
                                const completions = allCompletedTasks[task.id] || 0;
                                const percentage = totalMembers > 0 ? Math.round((completions / totalMembers) * 100) : 0;

                                return (
                                    <div key={task.id} className="grid grid-cols-[1fr,100px] items-center gap-4">
                                        <div className="text-sm text-muted-foreground truncate">{task.title}</div>
                                        <div className="flex items-center gap-2">
                                            <Progress value={percentage} className="h-1.5" />
                                            <span className="text-xs font-mono w-8 text-right">{percentage}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
