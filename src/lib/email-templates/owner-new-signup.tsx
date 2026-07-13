import * as React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  email?: string
  when?: string
}

const Email = ({ name = '', email = '', when = '' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New signup: {name || email}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>New signup</Text>
        <Heading style={h1}>{name || email}</Heading>
        <Text style={text}>Email: {email}</Text>
        <Text style={text}>When: {when}</Text>
        <Text style={muted}>दो Taanke — user just created an account.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `🌸 New signup — ${d.name || d.email || 'user'}`,
  displayName: 'Owner: new signup',
  to: 'support@dotaanke.store',
  previewData: { name: 'Aanya', email: 'aanya@example.com', when: 'Just now' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px', margin: '0 auto' }
const eyebrow = { fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#8a8a8a', margin: '0 0 6px' }
const h1 = { fontSize: '22px', color: '#111', margin: '0 0 12px' }
const text = { fontSize: '14px', color: '#333', lineHeight: '1.6', margin: '0 0 6px' }
const muted = { fontSize: '12px', color: '#999', margin: '20px 0 0' }
