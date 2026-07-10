import * as React from 'react'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Item { name: string; size: string; quantity: number; price: number }
interface Props {
  orderNumber?: string
  customerName?: string
  customerEmail?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  items?: Item[]
  total?: number
  couponCode?: string | null
}

const inr = (n: number) => `Rs. ${n.toLocaleString('en-IN')}`

export const OwnerOrderAlertEmail = ({
  orderNumber = 'DT-0000',
  customerName = '',
  customerEmail = '',
  phone = '',
  address = '', city = '', state = '', pincode = '',
  items = [], total = 0, couponCode = null,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New order {orderNumber} — {inr(total)}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>New order received</Text>
        <Heading style={h1}>{orderNumber} — {inr(total)}</Heading>

        <Section style={card}>
          <Text style={label}>Customer</Text>
          <Text style={text}>
            {customerName}<br />
            {customerEmail}<br />
            {phone}
          </Text>
          <Hr style={hr} />
          <Text style={label}>Ship to</Text>
          <Text style={text}>{address}, {city}, {state} - {pincode}</Text>
          <Hr style={hr} />
          <Text style={label}>Items</Text>
          {items.map((it, i) => (
            <Text key={i} style={text}>
              • {it.name} — Size {it.size} × {it.quantity} — {inr(it.price * it.quantity)}
            </Text>
          ))}
          {couponCode && <Text style={text}>Coupon: {couponCode}</Text>}
          <Hr style={hr} />
          <Text style={{ ...text, fontWeight: 600 as const }}>Total: {inr(total)}</Text>
        </Section>

        <Text style={footer}>Awaiting payment verification. Check the admin panel.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OwnerOrderAlertEmail,
  subject: (d: Record<string, any>) => `🛍️ New order ${d.orderNumber ?? ''} — ₹${d.total ?? 0}`,
  displayName: 'Owner: new order alert',
  to: 'support@dotaanke.store',
  previewData: {
    orderNumber: 'DT-1001', customerName: 'Aanya', customerEmail: 'a@example.com',
    phone: '+91 98xxxx1234', address: '12 Rose Lane', city: 'Mumbai', state: 'MH', pincode: '400001',
    items: [{ name: 'Chikankari Kurta', size: 'M', quantity: 1, price: 4800 }], total: 4800,
  },
} satisfies TemplateEntry

export default OwnerOrderAlertEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '600px', margin: '0 auto' }
const eyebrow = { fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#8a8a8a', margin: '0 0 6px' }
const h1 = { fontSize: '22px', color: '#111', margin: '0 0 18px', fontWeight: 600 as const }
const card = { border: '1px solid #ececec', borderRadius: '8px', padding: '18px 20px' }
const label = { fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#8a8a8a', margin: '0 0 6px' }
const text = { fontSize: '14px', color: '#333', lineHeight: '1.6', margin: '0 0 6px' }
const hr = { borderTop: '1px solid #ececec', margin: '12px 0' }
const footer = { fontSize: '12px', color: '#999', margin: '20px 0 0' }
