-- Solución temporal para testing: permitir NULL en user_id o relajar FK
-- Opción 1: Modificar la constraint para permitir testing
ALTER TABLE user_capacity_profile DROP CONSTRAINT user_capacity_profile_user_id_fkey;

-- Volver a crear la FK con comportamiento diferente (si es necesario)
-- Nota: En producción esto debería vincularse a auth.users real
