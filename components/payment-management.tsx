"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CreditCard,
  Plus,
  Trash2,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Building,
} from "lucide-react"
import { paymentService, type PaymentMethod, type Transaction } from "@/lib/payments"
import { formatCurrency, type Currency } from "@/lib/currency"
import { type Language, getTranslation } from "@/lib/translations"

interface PaymentManagementProps {
  currentLanguage: Language
  currentCurrency: Currency
}

export function PaymentManagement({ currentLanguage, currentCurrency }: PaymentManagementProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [newPaymentType, setNewPaymentType] = useState<PaymentMethod["type"]>("card")

  const t = (key: keyof typeof import("@/lib/translations").translations.en, params?: Record<string, string>) =>
    getTranslation(currentLanguage, key, params)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const methods = paymentService.getPaymentMethods()
      const history = paymentService.getTransactionHistory()
      setPaymentMethods(methods)
      setTransactions(history)
    } catch (error) {
      console.error("Failed to load payment data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPaymentMethod = async (details: any) => {
    try {
      const newMethod = await paymentService.addPaymentMethod(newPaymentType, details)
      setPaymentMethods([...paymentMethods, newMethod])
      setShowAddPayment(false)
    } catch (error) {
      console.error("Failed to add payment method:", error)
    }
  }

  const handleRefund = async (transactionId: string) => {
    try {
      const success = await paymentService.requestRefund(transactionId, "Customer request")
      if (success) {
        // Update transaction status
        setTransactions(transactions.map((t) => (t.id === transactionId ? { ...t, status: "refunded" } : t)))
      }
    } catch (error) {
      console.error("Refund failed:", error)
    }
  }

  const exportTransactions = () => {
    const csv = [
      ["Date", "Restaurant", "Staff", "Amount", "Currency", "Status", "Payment Method", "Platform Fee"].join(","),
      ...transactions.map((t) =>
        [
          new Date(t.date).toLocaleDateString(),
          t.restaurantName,
          t.staffName || "",
          t.amount,
          t.currency,
          t.status,
          `${t.paymentMethod.brand || t.paymentMethod.type} ${t.paymentMethod.last4 || ""}`,
          t.platformFee,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "refunded":
        return <RefreshCw className="w-4 h-4 text-blue-500" />
      default:
        return null
    }
  }

  const getPaymentMethodIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "card":
        return <CreditCard className="w-5 h-5" />
      case "paypal":
        return <Building className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <CreditCard className="w-8 h-8 animate-pulse text-teal-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading payment data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Payment Management</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your payment methods and transaction history</p>
        </div>
        <Button onClick={exportTransactions} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Transactions
        </Button>
      </div>

      <Tabs defaultValue="methods" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="space-y-6">
          {/* Payment Methods */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Your Payment Methods</h2>
            <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Payment Method</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Payment Type</Label>
                    <Select value={newPaymentType} onValueChange={(value) => setNewPaymentType(value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newPaymentType === "card" && (
                    <>
                      <div>
                        <Label>Card Number</Label>
                        <Input placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Expiry Date</Label>
                          <Input placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label>CVV</Label>
                          <Input placeholder="123" />
                        </div>
                      </div>
                      <div>
                        <Label>Cardholder Name</Label>
                        <Input placeholder="John Doe" />
                      </div>
                    </>
                  )}

                  <Button onClick={() => handleAddPaymentMethod({})} className="w-full">
                    Add Payment Method
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.id} className={`relative ${method.isDefault ? "ring-2 ring-teal-500" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getPaymentMethodIcon(method.type)}
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {method.type === "card" ? `${method.brand?.toUpperCase()} ****${method.last4}` : "PayPal"}
                        </p>
                        {method.type === "card" && (
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  {method.isDefault && (
                    <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">Default</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Transaction Summary */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Spent</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {formatCurrency(
                        transactions.reduce((sum, t) => sum + t.amount, 0),
                        currentCurrency,
                      )}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Tips</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {transactions.filter((t) => t.type === "tip").length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-teal-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Platform Fees</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {formatCurrency(
                        transactions.reduce((sum, t) => sum + t.platformFee, 0),
                        currentCurrency,
                      )}
                    </p>
                  </div>
                  <Building className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(transaction.status)}
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{transaction.restaurantName}</p>
                        {transaction.staffName && (
                          <p className="text-sm text-slate-600 dark:text-slate-400">Staff: {transaction.staffName}</p>
                        )}
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(transaction.date).toLocaleDateString()} •
                          {transaction.paymentMethod.brand || transaction.paymentMethod.type}
                          {transaction.paymentMethod.last4 && ` ****${transaction.paymentMethod.last4}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Fee: {formatCurrency(transaction.platformFee, transaction.currency)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "default"
                              : transaction.status === "pending"
                                ? "secondary"
                                : transaction.status === "failed"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {transaction.status}
                        </Badge>
                        {transaction.status === "completed" && (
                          <Button variant="outline" size="sm" onClick={() => handleRefund(transaction.id)}>
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Refund
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
