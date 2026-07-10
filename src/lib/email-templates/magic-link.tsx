import * as React from 'react'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text,
} from '@react-email/components'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
  token?: string
}

export const MagicLinkEmail = ({ siteName, confirmationUrl, token }: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your sign-in code for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>दो Taanke</Text>
        <Heading style={h1}>Your sign-in code</Heading>
        <Text style={text}>
          Use the code below to sign in to {siteName}. This code expires in a few minutes.
        </Text>
        {token && <Text style={codeStyle}>{token}</Text>}
        <Text style={text}>Or click the button to sign in instantly:</Text>
        <Button style={button} href={confirmationUrl}>Sign in</Button>
        <Text style={footer}>
          If you didn't request this, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif' }
const container = { padding: '32px 28px', maxWidth: '600px', margin: '0 auto' }
const brand = { fontSize: '20px', color: '#6A1E2E', letterSpacing: '0.02em', margin: '0 0 24px' }
const h1 = { fontSize: '26px', fontWeight: 500 as const, color: '#111', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#4a4a4a', lineHeight: '1.6', margin: '0 0 16px' }
const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '32px',
  fontWeight: 700 as const,
  color: '#6A1E2E',
  letterSpacing: '0.4em',
  background: '#fafaf7',
  border: '1px solid #ececec',
  borderRadius: '8px',
  padding: '18px 24px',
  textAlign: 'center' as const,
  margin: '8px 0 24px',
}
const button = { backgroundColor: '#6A1E2E', color: '#ffffff', fontSize: '14px', borderRadius: '8px', padding: '12px 24px', textDecoration: 'none', letterSpacing: '0.05em' }
const footer = { fontSize: '12px', color: '#999', margin: '24px 0 0' }
