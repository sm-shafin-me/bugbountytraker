'use client';

import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import type { Week, Task, Resource } from '@/lib/firebase/seedRoadmap';

interface WeekCardProps {
    week: Week;
    completedTasks: string[];
    onTaskToggle: (taskId: string, completed: boolean) => void;
    index?: number;
}

export function WeekCard({ week, completedTasks, onTaskToggle }: WeekCardProps) {
    const completedCount = week.tasks.filter((task) => completedTasks.includes(task.id)).length;
    const totalTasks = week.tasks.length;
    const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                            WEEK {week.weekNumber}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {completedCount}/{totalTasks} completed
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{week.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{week.description}</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {Math.round(progressPercentage)}%
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
                <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Tasks */}
            <div className="space-y-3">
                {week.tasks.map((task, index) => {
                    const isCompleted = completedTasks.includes(task.id);

                    return (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 ${isCompleted
                                ? 'bg-primary/5 border-primary/30'
                                : 'bg-muted/30 border-border hover:border-primary/20'
                                }`}
                        >
                            <Checkbox
                                id={task.id}
                                checked={isCompleted}
                                onCheckedChange={(checked) => {
                                    onTaskToggle(task.id, checked as boolean);
                                }}
                                className="mt-0.5"
                            />
                            <div className="flex-1">
                                <label
                                    htmlFor={task.id}
                                    className={`text-sm font-medium cursor-pointer transition-colors ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'
                                        }`}
                                >
                                    {task.title}
                                </label>
                                <p className="text-xs text-muted-foreground mt-1">{task.description}</p>

                                {/* Resources */}
                                {task.resources && task.resources.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                        {task.resources.map((res, idx) => (
                                            <a
                                                key={idx}
                                                href={res.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[10px] font-mono text-secondary hover:text-secondary/80 hover:underline flex items-center gap-1 transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <span className="opacity-70">🔗</span> {res.title}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
