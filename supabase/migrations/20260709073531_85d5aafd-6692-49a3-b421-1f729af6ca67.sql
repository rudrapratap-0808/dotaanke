
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- has_role stays executable by authenticated so policies referencing it via RLS work; it only reads user_roles.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
