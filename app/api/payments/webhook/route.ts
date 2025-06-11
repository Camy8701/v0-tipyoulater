import { type NextRequest, NextResponse } from "next/server"
import { monitoring } from "@/lib/monitoring"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error("Webhook secret not configured")
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
    }

    // In production, verify webhook signature
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    // Mock webhook handling for demo
    const event = JSON.parse(body)

    console.log("Webhook received:", event.type)

    switch (event.type) {
      case "payment_intent.succeeded":
        // Handle successful payment
        console.log("Payment succeeded:", event.data.object.id)
        monitoring.trackBusinessMetric("payment_succeeded", {
          paymentIntentId: event.data.object.id,
          amount: event.data.object.amount,
          currency: event.data.object.currency,
        })
        break

      case "payment_intent.payment_failed":
        // Handle failed payment
        console.log("Payment failed:", event.data.object.id)
        monitoring.trackBusinessMetric("payment_failed", {
          paymentIntentId: event.data.object.id,
          failureReason: event.data.object.last_payment_error?.message,
        })
        break

      case "customer.subscription.created":
        // Handle new subscription
        console.log("Subscription created:", event.data.object.id)
        monitoring.trackBusinessMetric("subscription_created", {
          subscriptionId: event.data.object.id,
          customerId: event.data.object.customer,
        })
        break

      case "invoice.payment_succeeded":
        // Handle successful invoice payment
        console.log("Invoice paid:", event.data.object.id)
        break

      default:
        console.log("Unhandled event type:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    monitoring.trackError(error as Error, { context: "stripe_webhook" })
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
  }
}
