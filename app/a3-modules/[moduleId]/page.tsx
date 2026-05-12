'use client';

// Module Player Page - Main entry point for taking a module
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ModuleFrame } from '@/components/a3-modules/module-frame';
import { getModuleById } from '@/lib/a3-modules/module-config';
import { completeModule, getUserModuleProgress, updateModuleProgress } from '@/lib/a3-modules/xp-system';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Module } from '@/lib/a3-modules/types';

export default function ModulePage() {
  const params = useParams();
  const { data: session } = useSession();
  const moduleId = params?.moduleId as string;

  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleId) return;

    const mod = getModuleById(moduleId);
    if (mod) {
      setModule(mod);
      // Initialize progress if not started
      if (session?.user?.id) {
        updateModuleProgress(session.user.id, moduleId, 'in_progress').catch(
          (err) => console.error('Error updating progress:', err)
        );
      }
    } else {
      setError('Módulo no encontrado');
    }

    setLoading(false);
  }, [moduleId, session?.user?.id]);

  const handleModuleComplete = async (finalScore: number) => {
    if (!session?.user?.id || !module) return;

    try {
      // Mark as completed in database
      await completeModule(
        session.user.id,
        module.id,
        finalScore,
        module.xp
      );

      // Optionally: Redirect to dashboard or next module
      console.log(`[v0] Module ${module.id} completed with score ${finalScore}`);
    } catch (err) {
      console.error('Error completing module:', err);
    }
  };

  const handleProgress = async (sectionId: string, score: number) => {
    if (!session?.user?.id || !module) return;

    try {
      // Update section progress
      await updateModuleProgress(
        session.user.id,
        module.id,
        'in_progress',
        sectionId
      );
    } catch (err) {
      console.error('Error updating section progress:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error || 'Módulo no encontrado'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <ModuleFrame
        module={module}
        onComplete={handleModuleComplete}
        onProgress={handleProgress}
      />
    </div>
  );
}
