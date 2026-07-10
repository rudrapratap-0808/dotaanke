import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/unsubscribe')({
  head: () => ({ meta: [{ title: 'Unsubscribe — दो Taanke' }, { name: 'robots', content: 'noindex' }] }),
  component: UnsubscribePage,
})

function UnsubscribePage() {
  const [state, setState] = useState<'loading' | 'confirm' | 'done' | 'already' | 'invalid'>('loading')
  const [submitting, setSubmitting] = useState(false)
  const token = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('token') : null

  useEffect(() => {
    if (!token) return setState('invalid')
    fetch(`/email/unsubscribe?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.valid) setState('confirm')
        else if (d?.reason === 'already_unsubscribed') setState('already')
        else setState('invalid')
      })
      .catch(() => setState('invalid'))
  }, [token])

  const confirm = async () => {
    if (!token) return
    setSubmitting(true)
    try {
      const res = await fetch('/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const d = await res.json()
      if (d?.success) setState('done')
      else if (d?.reason === 'already_unsubscribed') setState('already')
      else setState('invalid')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-5 py-24 text-center md:px-10">
      <p className="eyebrow">Email preferences</p>
      <h1 className="mt-3 font-serif text-4xl">Unsubscribe</h1>
      {state === 'loading' && <p className="mt-6 text-sm text-muted-foreground">Verifying your link…</p>}
      {state === 'confirm' && (
        <>
          <p className="mt-4 text-sm text-muted-foreground">Click below to stop receiving emails from दो Taanke.</p>
          <button onClick={confirm} disabled={submitting} className="btn-primary mt-8">
            {submitting ? 'Unsubscribing…' : 'Confirm unsubscribe'}
          </button>
        </>
      )}
      {state === 'done' && <p className="mt-6">You've been unsubscribed. We're sorry to see you go.</p>}
      {state === 'already' && <p className="mt-6">You're already unsubscribed.</p>}
      {state === 'invalid' && <p className="mt-6 text-destructive">This link is invalid or has expired.</p>}
    </section>
  )
}
