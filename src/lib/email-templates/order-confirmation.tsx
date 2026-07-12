import * as React from 'react'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Item { name: string; size: string; quantity: number; price: number }
interface Props {
  siteName?: string
  siteUrl?: string
  orderNumber?: string
  customerName?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  phone?: string
  items?: Item[]
  subtotal?: number
  discount?: number
  total?: number
  couponCode?: string | null
  trackUrl?: string
  whatsappUrl?: string
}

const inr = (n: number) => `Rs. ${n.toLocaleString('en-IN')}`

export const OrderConfirmationEmail = ({
  siteName = 'दो Taanke',
  orderNumber = 'DT-0000',
  customerName = 'there',
  address = '',
  city = '',
  state = '',
  pincode = '',
  phone = '',
  items = [],
  subtotal = 0,
  discount = 0,
  total = 0,
  couponCode = null,
  trackUrl = 'https://dotaanke.store/track',
  whatsappUrl = 'https://wa.me/918619780142',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your {siteName} order {orderNumber} is confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>दो Taanke</Text>
        <Text style={eyebrow}>Order confirmed</Text>
        <Heading style={h1}>Thank you, {customerName}.</Heading>
        <Text style={text}>
          Every stitch is being prepared with care. Below is your invoice for order{' '}
          <strong>{orderNumber}</strong>.
        </Text>

        <Section style={card}>
          <Text style={cardLabel}>Invoice</Text>
          <Text style={cardMuted}>Order {orderNumber}</Text>

          <Hr style={hr} />
          {items.map((it, i) => (
            <Section key={i} style={row}>
              <Text style={rowLeft}>
                {it.name}
                <br />
                <span style={rowMeta}>Size {it.size} · Qty {it.quantity}</span>
              </Text>
              <Text style={rowRight}>{inr(it.price * it.quantity)}</Text>
            </Section>
          ))}
          <Hr style={hr} />

          <Section style={row}><Text style={rowLeft}>Subtotal</Text><Text style={rowRight}>{inr(subtotal)}</Text></Section>
          {discount > 0 && (
            <Section style={row}>
              <Text style={rowLeft}>Discount{couponCode ? ` (${couponCode})` : ''}</Text>
              <Text style={rowRight}>− {inr(discount)}</Text>
            </Section>
          )}
          <Section style={row}><Text style={rowLeft}>Shipping</Text><Text style={rowRight}>Free</Text></Section>
          <Hr style={hr} />
          <Section style={row}>
            <Text style={totalLeft}>Total paid</Text>
            <Text style={totalRight}>{inr(total)}</Text>
          </Section>
        </Section>

        <Section style={shipBox}>
          <Text style={cardLabel}>Shipping to</Text>
          <Text style={shipText}>
            {customerName}<br />
            {address}<br />
            {city}, {state} - {pincode}<br />
            {phone}
          </Text>
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

export const template = {
  component: OrderConfirmationEmail,
  subject: (data: Record<string, any>) => `Your दो Taanke order ${data.orderNumber ?? ''} is confirmed`,
  displayName: 'Order confirmation',
  previewData: {
    orderNumber: 'DT-1001',
    customerName: 'Aanya',
    address: '12 Rose Lane',
    city: 'Mumbai', state: 'MH', pincode: '400001', phone: '+91 98xxxx1234',
    items: [{ name: 'Chikankari Kurta', size: 'M', quantity: 1, price: 4800 }],
    subtotal: 4800, discount: 0, total: 4800,
  },
} satisfies TemplateEntry

export default OrderConfirmationEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, "Cormorant Garamond", serif' }
const container = { padding: '32px 28px', maxWidth: '600px', margin: '0 auto' }
const brand = { fontSize: '20px', color: '#6A1E2E', letterSpacing: '0.02em', margin: '0 0 24px' }
const eyebrow = { fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#8a8a8a', margin: '0 0 8px' }
const h1 = { fontSize: '28px', color: '#111111', margin: '0 0 16px', fontWeight: 500 as const }
const text = { fontSize: '15px', color: '#4a4a4a', lineHeight: '1.6', margin: '0 0 24px' }
const card = { border: '1px solid #ececec', borderRadius: '10px', padding: '20px 22px', margin: '8px 0 20px', backgroundColor: '#fafaf7' }
const cardLabel = { fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#8a8a8a', margin: '0 0 4px' }
const cardMuted = { fontSize: '13px', color: '#888', margin: '0 0 8px' }
const hr = { borderTop: '1px solid #ececec', margin: '12px 0' }
const row = { display: 'block', margin: '6px 0' }
const rowLeft = { fontSize: '14px', color: '#333', display: 'inline-block', width: '68%', verticalAlign: 'top' as const, margin: 0 }
const rowRight = { fontSize: '14px', color: '#333', display: 'inline-block', width: '32%', textAlign: 'right' as const, verticalAlign: 'top' as const, margin: 0 }
const rowMeta = { fontSize: '12px', color: '#888' }
const totalLeft = { ...rowLeft, fontSize: '16px', color: '#111', fontWeight: 600 as const }
const totalRight = { ...rowRight, fontSize: '18px', color: '#6A1E2E', fontWeight: 600 as const }
const shipBox = { border: '1px solid #ececec', borderRadius: '10px', padding: '16px 22px', margin: '0 0 20px' }
const shipText = { fontSize: '14px', color: '#333', lineHeight: '1.6', margin: 0 }
const button = { backgroundColor: '#6A1E2E', color: '#ffffff', fontSize: '14px', borderRadius: '8px', padding: '12px 24px', textDecoration: 'none', letterSpacing: '0.05em' }
const link = { color: '#6A1E2E', textDecoration: 'underline' }
const footer = { fontSize: '12px', color: '#999', margin: '8px 0' }
