'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { Resource } from '@/lib/firebase/resources';
import { Button } from '@/components/ui/button';

interface ResourceCardProps {
    resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-primary/10 h-full flex flex-col"
        >
            <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                    {resource.category}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => window.open(resource.url, '_blank')}
                >
                    <ExternalLink className="h-4 w-4" />
                </Button>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
                {resource.title}
            </h3>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                {resource.description}
            </p>

            <Button
                variant="outline"
                className="w-full border-primary/20 hover:border-primary/50 text-foreground hover:text-primary mt-auto group"
                onClick={() => window.open(resource.url, '_blank')}
            >
                <span>Visit Resource</span>
                <ExternalLink className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
        </motion.div>
    );
}
