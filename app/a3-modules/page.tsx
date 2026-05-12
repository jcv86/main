'use client';

// A3 Modules Hub - Dashboard showing all 10 modules with XP system
import React, { useEffect, useState } from 'react';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Lock, Play, Trophy, Zap } from 'lucide-react';
import { ALL_MODULES, isModuleUnlocked } from '@/lib/a3-modules/module-config';
import { getUserPillar3Stats } from '@/lib/a3-modules/xp-system';

export default function A3ModulesHub() {
  const { user, loading: authLoading } = useAuthRedirect();
  const [stats, setStats] = useState({
    currentXP: 0,
    lifetimeXP: 0,
    modulesCompleted: 0,
    totalModules: 10,
    completionPercentage: 0,
    completedModuleIds: [] as string[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!authLoading && user?.id) {
        try {
          const userStats = await getUserPillar3Stats(user.id);
          setStats(userStats);
        } catch (error) {
          console.error('[Load Stats Error]', error);
        }
      }
      setLoading(false);
    };

    loadStats();
  }, [user?.id, authLoading]);

  const modules = Object.values(ALL_MODULES);
  const groupedModules = {
    nivel1: modules.filter((m) => m.level === 1),
    nivel2: modules.filter((m) => m.level === 2),
    nivel3: modules.filter((m) => m.level === 3),
    nivel4: modules.filter((m) => m.level === 4),
  };

  const getModuleStatus = (moduleId: string) => {
    const isCompleted = stats.completedModuleIds.includes(moduleId);
    const isUnlocked = isModuleUnlocked(moduleId, stats.completedModuleIds);

    if (isCompleted) return 'completed';
    if (isUnlocked) return 'available';
    return 'locked';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Header with XP Stats */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Pillar 3: Entrenamiento</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Completa todos los módulos para dominar técnicas de entrevista
          </p>

          {/* XP Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">XP Acumulado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.currentXP}</div>
                <p className="text-xs text-muted-foreground">
                  De {stats.lifetimeXP} total ganados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Nivel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.floor(stats.currentXP / 500) + 1}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.currentXP % 500} / 500 XP
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Módulos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats.modulesCompleted}/{stats.totalModules}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(stats.completionPercentage)}% completados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Progreso Total</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={stats.completionPercentage} className="mb-2" />
                <p className="text-xs text-muted-foreground text-center">
                  {Math.round(stats.completionPercentage)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 mb-8">
            <div className="flex items-center justify-between text-sm">
              <span>Progreso General</span>
              <span className="font-semibold">
                {stats.modulesCompleted} de {stats.totalModules} módulos
              </span>
            </div>
            <Progress value={stats.completionPercentage} className="h-3" />
          </div>
        </div>

        {/* Modules by Level */}
        {[1, 2, 3, 4].map((level) => {
          const levelModules = Object.values(ALL_MODULES).filter((m) => m.level === level);
          if (levelModules.length === 0) return null;

          const levelNames = {
            1: 'Nivel 1: Fundamentos',
            2: 'Nivel 2: Intermedio',
            3: 'Nivel 3: Avanzado',
            4: 'Nivel 4: Capstone',
          };

          return (
            <div key={level} className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                {levelNames[level as keyof typeof levelNames]}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {levelModules.map((module) => {
                  const status = getModuleStatus(module.id);
                  const isCompleted = status === 'completed';
                  const isAvailable = status === 'available';
                  const isLocked = status === 'locked';

                  return (
                    <Card
                      key={module.id}
                      className={`transition-all ${
                        isLocked ? 'opacity-50' : ''
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{module.name}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {module.description}
                            </CardDescription>
                          </div>
                          {isCompleted && (
                            <Badge variant="default" className="bg-green-600">
                              ✓
                            </Badge>
                          )}
                          {isLocked && (
                            <Badge variant="outline">
                              <Lock className="w-3 h-3" />
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Module Info */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Duración</span>
                            <p className="font-semibold">
                              {module.estimatedDuration} min
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-muted-foreground">Recompensa</span>
                            <p className="font-semibold flex items-center justify-end gap-1">
                              <Zap className="w-4 h-4 text-yellow-600" />
                              {module.xp} XP
                            </p>
                          </div>
                        </div>

                        {/* Prerequisites */}
                        {module.prerequisites.length > 0 && (
                          <div className="text-xs">
                            <span className="text-muted-foreground">Requisitos:</span>
                            <div className="flex gap-1 flex-wrap mt-1">
                              {module.prerequisites.map((prereq) => (
                                <Badge key={prereq} variant="secondary" className="text-xs">
                                  {ALL_MODULES[prereq]?.name || prereq}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        {isCompleted ? (
                          <Button disabled className="w-full bg-green-600">
                            Completado
                          </Button>
                        ) : isAvailable ? (
                          <Link href={`/a3-modules/${module.id}`} className="block">
                            <Button className="w-full">
                              <Play className="w-4 h-4 mr-2" />
                              Empezar
                            </Button>
                          </Link>
                        ) : (
                          <Button disabled className="w-full">
                            Bloqueado
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Completion Message */}
        {stats.completionPercentage === 100 && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mt-12">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Trophy className="w-12 h-12 mx-auto text-yellow-600" />
                <h3 className="text-2xl font-bold">¡Felicidades!</h3>
                <p className="text-muted-foreground">
                  Completaste todos los 10 módulos de Pillar 3 con {stats.lifetimeXP} XP totales
                </p>
                <p className="text-sm font-semibold text-green-700">
                  Ahora estás listo para entrevistas profesionales
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
