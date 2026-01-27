-- A2: RUTAS DE APRENDIZAJE PERSONALIZADO
-- Schema para gestionar rutas, módulos y microacciones

-- Tabla principal de rutas de aprendizaje
CREATE TABLE IF NOT EXISTS a2_learning_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  perfil_ideal CHAR(1) CHECK (perfil_ideal IN ('A', 'B', 'C', 'D')),
  nivel VARCHAR(20) DEFAULT 'principiante' CHECK (nivel IN ('principiante', 'intermedio', 'avanzado')),
  duracion_dias INT DEFAULT 90,
  modulos_count INT DEFAULT 0,
  icono VARCHAR(50),
  color VARCHAR(20),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Módulos dentro de cada ruta
CREATE TABLE IF NOT EXISTS a2_route_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES a2_learning_routes NOT NULL,
  orden INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  duracion_estimada_horas DECIMAL(4,1),
  objetivos TEXT[],
  competencias TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Microacciones personalizadas por perfil
CREATE TABLE IF NOT EXISTS a2_micro_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES a2_route_modules NOT NULL,
  dia INT NOT NULL,
  tipo_perfil CHAR(1) CHECK (tipo_perfil IN ('A', 'B', 'C', 'D')),
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  formato VARCHAR(30) CHECK (formato IN ('video', 'lectura', 'ejercicio', 'proyecto', 'quiz', 'reflexion', 'networking')),
  duracion_minutos INT DEFAULT 30,
  contenido_url TEXT,
  tareas JSONB,
  objetivos TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progreso del usuario en rutas
CREATE TABLE IF NOT EXISTS a2_user_route_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  route_id UUID REFERENCES a2_learning_routes NOT NULL,
  estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'pausado', 'completado', 'abandonado')),
  dia_actual INT DEFAULT 1,
  modulo_actual_id UUID REFERENCES a2_route_modules,
  porcentaje_completado DECIMAL(5,2) DEFAULT 0,
  fecha_inicio TIMESTAMPTZ DEFAULT NOW(),
  fecha_fin TIMESTAMPTZ,
  capacidad_promedio DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, route_id)
);

-- Microacciones completadas por el usuario
CREATE TABLE IF NOT EXISTS a2_user_actions_completed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  action_id UUID REFERENCES a2_micro_actions NOT NULL,
  completado_at TIMESTAMPTZ DEFAULT NOW(),
  tiempo_real_minutos INT,
  calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
  notas TEXT,
  UNIQUE(user_id, action_id)
);

-- Recomendaciones de rutas para usuarios
CREATE TABLE IF NOT EXISTS a2_route_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  route_id UUID REFERENCES a2_learning_routes NOT NULL,
  score_match DECIMAL(5,2),
  razones TEXT[],
  generado_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_a2_modules_route ON a2_route_modules(route_id);
CREATE INDEX IF NOT EXISTS idx_a2_actions_module ON a2_micro_actions(module_id);
CREATE INDEX IF NOT EXISTS idx_a2_actions_perfil ON a2_micro_actions(tipo_perfil);
CREATE INDEX IF NOT EXISTS idx_a2_progress_user ON a2_user_route_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_a2_completed_user ON a2_user_actions_completed(user_id);

-- RLS Policies
ALTER TABLE a2_learning_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_route_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_micro_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_user_route_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_user_actions_completed ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_route_recommendations ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para rutas y módulos
CREATE POLICY "Rutas visibles para todos" ON a2_learning_routes FOR SELECT USING (true);
CREATE POLICY "Módulos visibles para todos" ON a2_route_modules FOR SELECT USING (true);
CREATE POLICY "Acciones visibles para todos" ON a2_micro_actions FOR SELECT USING (true);

-- Políticas de usuario para progreso
CREATE POLICY "Usuario ve su progreso" ON a2_user_route_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuario actualiza su progreso" ON a2_user_route_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuario crea su progreso" ON a2_user_route_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuario ve sus acciones" ON a2_user_actions_completed FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuario registra acciones" ON a2_user_actions_completed FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuario ve sus recomendaciones" ON a2_route_recommendations FOR SELECT USING (auth.uid() = user_id);

-- Insertar rutas base
INSERT INTO a2_learning_routes (codigo, nombre, descripcion, perfil_ideal, nivel, duracion_dias, icono, color) VALUES
('TECH_ESP', 'Especialista Técnico', 'Domina habilidades técnicas con un enfoque estructurado y metódico', 'C', 'principiante', 90, 'Code', 'blue'),
('LIDER_EJ', 'Líder Ejecutivo', 'Desarrolla habilidades de liderazgo y toma de decisiones rápidas', 'A', 'intermedio', 90, 'Crown', 'amber'),
('EMPREND', 'Emprendedor Creativo', 'Aprende a innovar, comunicar y construir tu visión', 'B', 'principiante', 90, 'Rocket', 'purple'),
('COLAB_EX', 'Colaborador Experto', 'Fortalece trabajo en equipo y habilidades interpersonales', 'D', 'principiante', 90, 'Users', 'green')
ON CONFLICT (codigo) DO NOTHING;
