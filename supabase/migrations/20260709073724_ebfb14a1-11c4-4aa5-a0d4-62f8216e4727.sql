
CREATE POLICY "anyone upload payment proof" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'payment-proofs');
CREATE POLICY "admin read payment proofs" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'payment-proofs' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin manage payment proofs" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'payment-proofs' AND public.has_role(auth.uid(),'admin'))
  WITH CHECK (bucket_id = 'payment-proofs' AND public.has_role(auth.uid(),'admin'));
