'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

interface MemberProgress {
    memberId: string;
    codename: string;
    completedTasks: number;
    totalTasks: number;
    percentage: number;
    lastUpdated: string;
}

interface LeaderboardTableProps {
    currentMemberId?: string;
    totalTasksCount?: number;
}

export function LeaderboardTable({ currentMemberId, totalTasksCount = 47 }: LeaderboardTableProps) {
    const [members, setMembers] = useState<MemberProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set up real-time listener for all members
        const membersRef = collection(db, 'members');

        const unsubscribe = onSnapshot(membersRef, (snapshot) => {
            const memberData: MemberProgress[] = [];

            snapshot.forEach((memberDoc) => {
                const memberId = memberDoc.id;
                const data = memberDoc.data();

                // Get completed tasks from array
                const completedTasksList = data.completedTasks || [];
                const completedCount = completedTasksList.length;

                // Use prop or default
                const totalTasks = totalTasksCount;

                const percentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

                memberData.push({
                    memberId,
                    codename: data.codename || '',
                    completedTasks: completedCount,
                    totalTasks,
                    percentage,
                    lastUpdated: data.lastLogin || data.createdAt || new Date().toISOString(),
                });
            });

            // Sort by percentage (descending)
            memberData.sort((a, b) => b.percentage - a.percentage);

            setMembers(memberData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

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
        <div className="rounded-xl border border-border overflow-hidden bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="border-border hover:bg-muted/50">
                        <TableHead className="text-primary font-bold">RANK</TableHead>
                        <TableHead className="text-primary font-bold">AGENT</TableHead>
                        <TableHead className="text-primary font-bold">PROGRESS</TableHead>
                        <TableHead className="text-primary font-bold text-right">COMPLETION</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.map((member, index) => (
                        <motion.tr
                            key={member.memberId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="border-border hover:bg-muted/30 transition-colors"
                        >
                            <TableCell className="font-mono">
                                <div className="flex items-center gap-2">
                                    {index === 0 && <span className="text-xl">🥇</span>}
                                    {index === 1 && <span className="text-xl">🥈</span>}
                                    {index === 2 && <span className="text-xl">🥉</span>}
                                    <span className="text-muted-foreground">#{index + 1}</span>
                                </div>
                            </TableCell>
                            <TableCell className="font-semibold text-foreground">
                                {member.memberId === currentMemberId ? (
                                    <span className="text-secondary font-bold">{member.codename || 'You'} <span className="text-xs text-muted-foreground">(You)</span></span>
                                ) : (
                                    <span className="text-foreground">{member.codename || `Agent ${member.memberId.substring(3, 5)}`}</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="space-y-2">
                                    <Progress value={member.percentage} className="h-2" />
                                    <span className="text-xs text-muted-foreground">
                                        {member.completedTasks}/{member.totalTasks} tasks
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <span className={`text-lg font-bold ${member.percentage === 100
                                    ? 'text-primary'
                                    : member.percentage >= 75
                                        ? 'text-secondary'
                                        : member.percentage >= 50
                                            ? 'text-yellow-500'
                                            : 'text-muted-foreground'
                                    }`}>
                                    {Math.round(member.percentage)}%
                                </span>
                            </TableCell>
                        </motion.tr>
                    ))}
                </TableBody>
            </Table>

            {members.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No members found. Start tracking your progress!
                </div>
            )}
        </div>
    );
}
