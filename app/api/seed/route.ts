import { NextResponse } from 'next/server';
import { seedRoadmap } from '@/lib/firebase/seedRoadmap';

/**
 * API route to seed the database
 * Navigate to /api/seed to run this
 */
export async function GET() {
    try {
        const result = await seedRoadmap();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { success: false, error: String(error) },
            { status: 500 }
        );
    }
}
