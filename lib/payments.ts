import type { Currency } from "./currency"

export interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "apple_pay" | "google_pay"
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: Currency
  status: "pending" | "processing" | "succeeded" | "failed"
  paymentMethod: PaymentMethod
  metadata?: Record<string, any>
}

export interface Transaction {
  id: string
  amount: number
  currency: Currency
  status: "completed" | "pending" | "failed" | "refunded"
  type: "tip" | "refund"
  restaurantName: string
  staffName?: string
  date: string
  paymentMethod: PaymentMethod
  platformFee: number
}

class PaymentService {
  private apiKey: string = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""

  // Initialize Stripe
  async initializeStripe() {
    if (typeof window === "undefined") return null

    try {
      // Load Stripe.js dynamically
      const stripe = await import("@stripe/stripe-js").then((module) => module.loadStripe(this.apiKey))

      console.log("Stripe initialized successfully")
      return stripe
    } catch (error) {
      console.error("Failed to initialize Stripe:", error)
      return null
    }
  }

  // Create payment intent
  async createPaymentIntent(
    amount: number,
    currency: Currency,
    metadata?: Record<string, any>,
  ): Promise<PaymentIntent> {
    try {
      // Simulate API call to create payment intent
      const paymentIntent: PaymentIntent = {
        id: `pi_${Math.random().toString(36).substr(2, 9)}`,
        amount,
        currency,
        status: "pending",
        paymentMethod: this.getDefaultPaymentMethod(),
        metadata,
      }

      console.log("Created payment intent:", paymentIntent)
      return paymentIntent
    } catch (error) {
      console.error("Failed to create payment intent:", error)
      throw new Error("Failed to create payment intent")
    }
  }

  // Process payment
  async processPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentIntent> {
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const success = Math.random() > 0.1 // 90% success rate for demo

      const updatedIntent: PaymentIntent = {
        id: paymentIntentId,
        amount: 0, // Will be filled from stored intent
        currency: "USD",
        status: success ? "succeeded" : "failed",
        paymentMethod: this.getPaymentMethodById(paymentMethodId),
      }

      console.log("Payment processed:", updatedIntent)
      return updatedIntent
    } catch (error) {
      console.error("Payment processing failed:", error)
      throw new Error("Payment processing failed")
    }
  }

  // Get payment methods
  getPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: "pm_card_visa",
        type: "card",
        last4: "4242",
        brand: "visa",
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
      },
      {
        id: "pm_card_mastercard",
        type: "card",
        last4: "5555",
        brand: "mastercard",
        expiryMonth: 8,
        expiryYear: 2026,
        isDefault: false,
      },
      {
        id: "pm_paypal",
        type: "paypal",
        isDefault: false,
      },
    ]
  }

  // Get default payment method
  getDefaultPaymentMethod(): PaymentMethod {
    return this.getPaymentMethods().find((pm) => pm.isDefault) || this.getPaymentMethods()[0]
  }

  // Get payment method by ID
  getPaymentMethodById(id: string): PaymentMethod {
    return this.getPaymentMethods().find((pm) => pm.id === id) || this.getDefaultPaymentMethod()
  }

  // Get transaction history
  getTransactionHistory(): Transaction[] {
    return [
      {
        id: "txn_001",
        amount: 25.0,
        currency: "USD",
        status: "completed",
        type: "tip",
        restaurantName: "Bella Vista Italian",
        staffName: "Marco",
        date: "2024-01-15T18:30:00Z",
        paymentMethod: this.getPaymentMethods()[0],
        platformFee: 0.63,
      },
      {
        id: "txn_002",
        amount: 15.0,
        currency: "USD",
        status: "completed",
        type: "tip",
        restaurantName: "Coffee Corner",
        date: "2024-01-14T09:15:00Z",
        paymentMethod: this.getPaymentMethods()[1],
        platformFee: 0.38,
      },
      {
        id: "txn_003",
        amount: 30.0,
        currency: "USD",
        status: "pending",
        type: "tip",
        restaurantName: "Sushi Zen",
        staffName: "Yuki",
        date: "2024-01-13T20:45:00Z",
        paymentMethod: this.getPaymentMethods()[0],
        platformFee: 0.75,
      },
    ]
  }

  // Request refund
  async requestRefund(transactionId: string, reason: string): Promise<boolean> {
    try {
      // Simulate refund request
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log(`Refund requested for transaction ${transactionId}: ${reason}`)
      return true
    } catch (error) {
      console.error("Refund request failed:", error)
      return false
    }
  }

  // Add payment method
  async addPaymentMethod(type: PaymentMethod["type"], details: any): Promise<PaymentMethod> {
    try {
      const newPaymentMethod: PaymentMethod = {
        id: `pm_${Math.random().toString(36).substr(2, 9)}`,
        type,
        ...details,
        isDefault: false,
      }

      console.log("Added payment method:", newPaymentMethod)
      return newPaymentMethod
    } catch (error) {
      console.error("Failed to add payment method:", error)
      throw new Error("Failed to add payment method")
    }
  }
}

export const paymentService = new PaymentService()
