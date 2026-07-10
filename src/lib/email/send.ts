import { supabase } from '@/integrations/supabase/client'

export type SendEmailArgs = {
  templateName: string
  recipientEmail: string
  idempotencyKey: string
  templateData?: Record<string, unknown>
}

export async function sendTransactionalEmail(args: SendEmailArgs): Promise<void> {
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    if (!token) return // silently skip if signed out
    await fetch('/lovable/email/transactional/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(args),
    })
  } catch (err) {
    // Never let email failures block the UX
    console.warn('email send failed', err)
  }
}
