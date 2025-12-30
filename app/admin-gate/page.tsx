'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { getSystemSettings, updateSystemSettings } from '@/lib/firebase/settings';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminRoadmapEditor } from '@/components/AdminRoadmapEditor';
import { AdminResourceManager } from '@/components/AdminResourceManager';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface MemberData {
    memberId: string;
    codename: string;
    deviceCount: number;
    lastLogin: string;
    createdAt: string;
    devices: Array<{
        deviceId: string;
        userAgent: string;
        lastSeen: string;
    }>;
}

export default function AdminPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [members, setMembers] = useState<MemberData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [idsVisible, setIdsVisible] = useState(false);


    const handleLogin = () => {
        const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

        if (password === adminPassword) {
            setIsAuthenticated(true);
            setError('');
            loadMembers();
        } else {
            setError('Invalid admin password');
        }
    };

    const loadMembers = async () => {
        setLoading(true);
        try {
            const membersRef = collection(db, 'members');
            const membersSnapshot = await getDocs(membersRef);
            const memberData: MemberData[] = [];

            for (const memberDoc of membersSnapshot.docs) {
                const data = memberDoc.data();
                const memberId = memberDoc.id;

                // Get devices
                const devicesRef = collection(db, 'members', memberId, 'devices');
                const devicesSnapshot = await getDocs(devicesRef);
                const devices = devicesSnapshot.docs.map((doc) => ({
                    deviceId: doc.id,
                    userAgent: doc.data().userAgent || 'Unknown',
                    lastSeen: doc.data().lastSeen || 'Unknown',
                }));

                memberData.push({
                    memberId,
                    codename: data.codename || '-',
                    deviceCount: data.deviceCount || devices.length,
                    lastLogin: data.lastLogin || data.createdAt || 'Unknown',
                    createdAt: data.createdAt || 'Unknown',
                    devices,
                });
            }

            setMembers(memberData);
        } catch (err) {
            console.error('Error loading members:', err);
            setError('Failed to load members');
        } finally {
            setLoading(false);
        }
    };

    const handleResetDevices = async (memberId: string) => {
        if (!confirm(`Reset all devices for ${memberId}?`)) return;

        try {
            // Delete all devices
            const devicesRef = collection(db, 'members', memberId, 'devices');
            const devicesSnapshot = await getDocs(devicesRef);

            for (const deviceDoc of devicesSnapshot.docs) {
                await deleteDoc(deviceDoc.ref);
            }

            // Update member document
            const memberRef = doc(db, 'members', memberId);
            await updateDoc(memberRef, {
                deviceCount: 0,
            });

            // Reload members
            loadMembers();
            alert(`Devices reset successfully for ${memberId}`);
        } catch (err) {
            console.error('Error resetting devices:', err);
            alert('Failed to reset devices');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-2xl"
                >
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-destructive to-primary bg-clip-text text-transparent mb-2">
                            ADMIN ACCESS
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter admin password to continue
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Input
                            type="password"
                            placeholder="Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            className="text-center"
                        />

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/50 text-destructive text-sm p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            onClick={handleLogin}
                            className="w-full bg-gradient-to-r from-destructive to-primary"
                        >
                            ACCESS ADMIN PANEL
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => router.push('/dashboard')}
                            className="w-full"
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-destructive to-primary bg-clip-text text-transparent">
                                ADMIN COMMAND CENTER
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Manage members and monitor progress
                            </p>
                        </div>
                        <div className="flex items-center gap-4">

                            <Button
                                variant="outline"
                                onClick={() => router.push('/dashboard')}
                            >
                                Dashboard
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsAuthenticated(false)}
                                className="border-destructive/30 hover:border-destructive"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="container mx-auto px-4 py-8">
                <Tabs defaultValue="members" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8 max-w-[600px]">
                        <TabsTrigger value="members">Member Management</TabsTrigger>
                        <TabsTrigger value="roadmap">Roadmap Editor</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                    </TabsList>

                    <TabsContent value="members" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">Member Status</h2>
                                <p className="text-muted-foreground">Monitor member activity and manage access</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIdsVisible(!idsVisible)}
                                    className="gap-2"
                                >
                                    {idsVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    {idsVisible ? 'Hide IDs' : 'Show IDs'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={loadMembers}
                                    disabled={loading}
                                    className="border-primary/30 hover:border-primary"
                                >
                                    {loading ? 'Loading...' : 'Refresh Data'}
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border overflow-hidden bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border">
                                        <TableHead className="text-primary font-bold">MEMBER ID</TableHead>
                                        <TableHead className="text-primary font-bold">CODENAME</TableHead>
                                        <TableHead className="text-primary font-bold">DEVICES</TableHead>
                                        <TableHead className="text-primary font-bold">LAST LOGIN</TableHead>
                                        <TableHead className="text-primary font-bold text-right">ACTIONS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {members.map((member) => (
                                        <TableRow key={member.memberId} className="border-border">
                                            <TableCell className="font-mono font-semibold">
                                                {idsVisible ? member.memberId : '••••••••••••'}
                                            </TableCell>
                                            <TableCell className="font-semibold text-secondary">
                                                {member.codename}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className={`text-sm font-semibold ${member.deviceCount >= 2 ? 'text-destructive' : 'text-primary'}`}>
                                                        {member.deviceCount}/2 devices
                                                    </div>
                                                    {member.devices.map((device, idx) => (
                                                        <div key={device.deviceId} className="text-xs text-muted-foreground">
                                                            {device.userAgent.substring(0, 25)}...
                                                        </div>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {new Date(member.lastLogin).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleResetDevices(member.memberId)}
                                                    className="border-destructive/30 hover:border-destructive hover:bg-destructive/10 text-destructive"
                                                >
                                                    Reset Devices
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {members.length === 0 && !loading && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                No active members found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    <TabsContent value="roadmap">
                        <AdminRoadmapEditor />
                    </TabsContent>

                    <TabsContent value="resources">
                        <AdminResourceManager />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
