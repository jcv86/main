-- Tabla de códigos de invitación (cupos globales)
CREATE TABLE IF NOT EXISTS public.invitation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(16) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadata
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  CHECK (code ~ '^[A-Z0-9]{6,16}$')
);

-- Tabla de invitaciones por usuario (track uso)
CREATE TABLE IF NOT EXISTS public.user_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invitation_code_id UUID REFERENCES public.invitation_codes(id) ON DELETE CASCADE,
  
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, invitation_code_id)
);

-- Tabla de waitlist (solo email, no autenticados)
CREATE TABLE IF NOT EXISTS public.waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Estado: pending, sent_invite, invited, registered
  status VARCHAR(32) DEFAULT 'pending',
  invite_sent_at TIMESTAMP WITH TIME ZONE,
  
  CHECK (email ~ '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Z|a-z]{2,}$')
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_invitation_codes_code ON public.invitation_codes(code);
CREATE INDEX IF NOT EXISTS idx_user_invitations_user_id ON public.user_invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist_signups(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.waitlist_signups(status);

-- RLS para invitation_codes (solo admin puede crear/modificar)
ALTER TABLE public.invitation_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invitation_codes_public_read" ON public.invitation_codes
  FOR SELECT USING (true);

-- RLS para user_invitations (solo self)
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_invitations_self" ON public.user_invitations
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- RLS para waitlist_signups (solo insert público, otros datos self)
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "waitlist_insert_public" ON public.waitlist_signups
  FOR INSERT WITH CHECK (true);
CREATE POLICY "waitlist_select_public" ON public.waitlist_signups
  FOR SELECT USING (true);
