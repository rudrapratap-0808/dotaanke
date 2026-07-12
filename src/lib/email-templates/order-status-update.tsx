import * as React from 'react'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  siteName?: string
  orderNumber?: string
  customerName?: string
  status?: string
  trackingNumber?: string | null
  note?: string | null
  trackUrl?: string
  whatsappUrl?: string
}

const STATUS_COPY: Record<string, { title: string; body: string }> = {
  placed: {
    title: 'Your order is confirmed',
    body: 'We\'ve received your order and it\'s in our queue. Our artisans will begin preparing it shortly.',
  },
  packed: {
    title: 'Your order is packed',
    body: 'Your pieces have been carefully packed and are ready to leave our studio.',
  },
  shipped: {
    title: 'Your order is on its way',
    body: 'Good news — your order has been shipped and is heading to you.',
  },
  out_for_delivery: {
    title: 'Out for delivery today',
    body: 'Your order is out for delivery and should reach you today. Please keep your phone handy.',
  },
  delivered: {
    title: 'Your order is delivered',
    body: 'We hope you love it. Every stitch was made with care — we\'d be honoured if you shared a photo with us.',
  },
  cancelled: {
    title: 'Your order was cancelled',
    body: 'Your order has been cancelled. If this wasn\'t expected, please reach out and we\'ll help right away.',
  },
}

const humanStatus = (s: string) =>
  s.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

export const OrderStatusUpdateEmail = ({
  siteName = 'दो Taanke',
  orderNumber = 'DT-0000',
  customerName = 'there',
  status = 'placed',
  trackingNumber = null,
  note = null,
  trackUrl = 'https://dotaanke.store/track',
  whatsappUrl = 'https://wa.me/918619780142',
}: Props) => {
  const copy = STATUS_COPY[status] ?? {
    title: `Order update: ${humanStatus(status)}`,
    body: 'There\'s an update on your order.',
  }
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{copy.title} — order {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>दो Taanke</Text>
          <Text style={eyebrow}>Order update</Text>
          <Heading style={h1}>{copy.title}</Heading>
          <Text style={text}>
            Hi {customerName}, {copy.body}
          </Text>

          <Section style={card}>
            <Text style={cardLabel}>Order</Text>
            <Text style={cardValue}>{orderNumber}</Text>
            <Hr style={hr} />
            <Text style={cardLabel}>Status</Text>
            <Text style={cardValue}>{humanStatus(status)}</Text>
            {trackingNumber && (
              <>
                <Hr style={hr} />
                <Text style={cardLabel}>Tracking number</Text>
                <Text style={cardValue}>{trackingNumber}</Text>
              </>
            )}
            {note && (
              <>
                <Hr style={hr} />
                <Text style={cardLabel}>Note from the team</Text>
                <Text style={cardValue}>{note}</Text>
              </>
            )}
          </Section>

          <Section style={{ textAlign: 'center' as const, margin: '32px 0' }}>
            <Button style={button} href={trackUrl}>Track your order</Button>
          </Section>

          <Text style={footer}>
            Questions? Reply to this email or reach us on{' '}
            <Link href={whatsappUrl} style={link}>WhatsApp</Link>.
          </Text>
          <Text style={footer}>— {siteName}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: OrderStatusUpdateEmail,
  subject: (data: Record<string, any>) => {
    const copy = STATUS_COPY[data.status as string]
    const line = copy?.title ?? `Order update: ${humanStatus(String(data.status ?? ''))}`
    return `${line} — ${data.orderNumber ?? ''}`
  },
  displayName: 'Order status update',
  previewData: {
    orderNumber: 'DT-1001',
    customerName: 'Aanya',
    status: 'shipped',
    trackingNumber: 'DL123456789IN',
  },
} satisfies TemplateEntry

export default OrderStatusUpdateEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, "Cormorant Garamond", serif' }
const container = { padding: '32px 28px', maxWidth: '600px', margin: '0 auto' }
const brand = { fontSize: '20px', color: '#6A1E2E', letterSpacing: '0.02em', margin: '0 0 24px' }
const eyebrow = { fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#8a8a8a', margin: '0 0 8px' }
const h1 = { fontSize: '28px', color: '#111111', margin: '0 0 16px', fontWeight: 500 as const }
const text = { fontSize: '15px', color: '#4a4a4a', lineHeight: '1.6', margin: '0 0 24px' }
const card = { border: '1px solid #ececec', borderRadius: '10px', padding: '20px 22px', margin: '8px 0 20px', backgroundColor: '#fafaf7' }
const cardLabel = { fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#8a8a8a', margin: '0 0 4px' }
const cardValue = { fontSize: '15px', color: '#111', margin: '0 0 8px' }
const hr = { borderTop: '1px solid #ececec', margin: '12px 0' }
const button = { backgroundColor: '#6A1E2E', color: '#ffffff', fontSize: '14px', borderRadius: '8px', padding: '12px 24px', textDecoration: 'none', letterSpacing: '0.05em' }
const link = { color: '#6A1E2E', textDecoration: 'underline' }
const footer = { fontSize: '12px', color: '#999', margin: '8px 0' }
