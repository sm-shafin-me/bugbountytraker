'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LeaderboardPage() {
    const router = useRouter();
    const { checkAuth } = useAuth();

    if (!checkAuth()) {
        router.push('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                LIVE LEADERBOARD
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Real-time progress tracking for all members
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/dashboard')}
                            className="border-primary/30 hover:border-primary hover:bg-primary/10"
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <p className="text-sm text-foreground">
                                <span className="font-semibold">Live Updates:</span> This leaderboard updates in real-time as members complete tasks
                            </p>
                        </div>
                    </div>

                    <LeaderboardTable />
                </motion.div>
            </main>
        </div>
    );
}
