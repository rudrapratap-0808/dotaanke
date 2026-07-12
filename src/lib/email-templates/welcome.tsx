import * as React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Section, Text, Button } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  customerName?: string
  siteUrl?: string
}

const Email = ({ customerName = 'there', siteUrl = 'https://dotaanke.store' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to दो Taanke — heirloom embroidery, hand-stitched for you.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to दो Taanke</Heading>
        <Text style={p}>Namaste {customerName} 🙏</Text>
        <Text style={p}>
          Thank you for joining our little atelier. Every piece here is hand-embroidered — one thread,
          one stitch, one story at a time.
        </Text>
        <Text style={p}>
          Take a look at our new arrivals, and if you ever need anything, just reply to this email.
        </Text>
        <Section style={{ textAlign: 'center', margin: '28px 0' }}>
          <Button href={`${siteUrl}/shop`} style={btn}>Explore the collection</Button>
        </Section>
        <Text style={muted}>With love,<br />The दो Taanke team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Welcome to दो Taanke 🌸',
  displayName: 'Welcome email',
  previewData: { customerName: 'Ananya' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif', color: '#1a1a1a' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '28px', margin: '0 0 16px', color: '#2b1810' }
const p = { fontSize: '15px', lineHeight: '1.7', margin: '0 0 12px' }
const muted = { fontSize: '13px', color: '#6b5a4a', marginTop: '24px' }
const btn = {
  backgroundColor: '#8b2635',
  color: '#ffffff',
  padding: '12px 28px',
  borderRadius: '6px',
  fontSize: '14px',
  textDecoration: 'none',
  fontFamily: 'Arial, sans-serif',
}
