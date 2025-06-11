"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Building2, User, Sparkles, CheckCircle, Loader2, Heart, Share2 } from "lucide-react"
import { type Language, getTranslation } from "@/lib/translations"
import { formatCurrency, convertCurrency, type Currency } from "@/lib/currency"
import Image from "next/image"

interface TipModalProps {
  restaurant: any
  onClose: () => void
  currentLanguage: Language
  currentCurrency: Currency
}

export function TipModal({ restaurant, onClose, currentLanguage, currentCurrency }: TipModalProps) {
  const [tipAmount, setTipAmount] = useState(0)
  const [customAmount, setCustomAmount] = useState("")
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [tipType, setTipType] = useState<"business" | "individual">("business")
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [step, setStep] = useState<"tip" | "review" | "payment">("tip")

  // Convert tip options to current currency
  const baseTipOptions = [5, 10, 15, 20, 25, 50]
  const tipOptions = baseTipOptions.map((amount) => convertCurrency(amount, "USD", currentCurrency))

  const t = (key: keyof typeof import("@/lib/translations").translations.en, params?: Record<string, string>) =>
    getTranslation(currentLanguage, key, params)

  const handleTipSelect = (amount: number) => {
    setTipAmount(amount)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const amount = Number.parseFloat(value) || 0
    if (amount > 0) {
      setTipAmount(amount)
    }
  }

  const handleSubmit = async () => {
    if (tipAmount <= 0) {
      alert(t("selectTipAmountError"))
      return
    }

    if (tipType === "individual" && !selectedStaff) {
      alert(t("selectStaffMemberError"))
      return
    }

    setIsSubmitting(true)

    // Simulate API call with progress
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setShowSuccess(true)

    // Auto-close after success animation
    setTimeout(() => {
      onClose()
    }, 3000)
  }

  const platformFee = tipAmount * 0.025
  const totalCharge = tipAmount + platformFee

  const canTipBusiness = restaurant.tipDistribution === "business" || restaurant.tipDistribution === "both"
  const canTipIndividual = restaurant.tipDistribution === "individual" || restaurant.tipDistribution === "both"

  if (showSuccess) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md border-0 shadow-2xl bg-white dark:bg-slate-900">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Tip Sent Successfully! 🎉</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Your {formatCurrency(tipAmount, currentCurrency)} tip has been sent to{" "}
              <span className="font-semibold text-teal-600">
                {tipType === "business" ? restaurant.name : selectedStaff?.name}
              </span>
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                <span>Thank you for spreading kindness!</span>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "I just tipped at " + restaurant.name,
                      text: `Just sent a tip to ${tipType === "business" ? restaurant.name : selectedStaff?.name} via TipYouLater!`,
                      url: window.location.href,
                    })
                  }
                }}
                className="w-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Your Good Deed
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-white dark:bg-slate-900">
        <DialogHeader className="border-b border-slate-200 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden">
              <Image
                src={restaurant.realImage || "/placeholder.svg"}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-left bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {restaurant.name}
              </DialogTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">{restaurant.type}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{restaurant.rating}</span>
                <span className="text-sm text-slate-500">({restaurant.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4">
            {["tip", "review", "payment"].map((stepName, index) => (
              <div key={stepName} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    step === stepName
                      ? "bg-teal-500 text-white scale-110"
                      : index < ["tip", "review", "payment"].indexOf(step)
                        ? "bg-green-500 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                  }`}
                >
                  {index < ["tip", "review", "payment"].indexOf(step) ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                {index < 2 && (
                  <div
                    className={`w-8 h-1 rounded transition-all duration-300 ${
                      index < ["tip", "review", "payment"].indexOf(step)
                        ? "bg-green-500"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === "tip" && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              {/* Tip Type Selection */}
              {canTipBusiness && canTipIndividual && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">{t("whoToTip")}</h3>
                  <Tabs value={tipType} onValueChange={(value) => setTipType(value as "business" | "individual")}>
                    <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800">
                      <TabsTrigger
                        value="business"
                        className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 transition-all duration-200"
                      >
                        <Building2 className="w-4 h-4" />
                        {t("tipBusiness")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="individual"
                        className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 transition-all duration-200"
                      >
                        <User className="w-4 h-4" />
                        {t("tipStaffMember")}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="business" className="mt-4">
                      <div className="p-4 bg-gradient-to-r from-teal-50 to-indigo-50 dark:from-teal-900/20 dark:to-indigo-900/20 rounded-xl border border-teal-200 dark:border-teal-800">
                        <div className="flex items-center gap-3 mb-2">
                          <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                          <span className="font-semibold text-teal-900 dark:text-teal-100">Tip the Business</span>
                        </div>
                        <p className="text-sm text-teal-700 dark:text-teal-300">
                          {t("tipTheBusinessDesc", { businessName: restaurant.name })}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="individual" className="mt-4">
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-teal-50 to-slate-50 dark:from-teal-900/20 dark:to-slate-900/20 rounded-xl border border-teal-200 dark:border-teal-800">
                          <div className="flex items-center gap-3 mb-2">
                            <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            <span className="font-semibold text-teal-900 dark:text-teal-100">Tip a Staff Member</span>
                          </div>
                          <p className="text-sm text-teal-700 dark:text-teal-300">{t("tipStaffMemberDesc")}</p>
                        </div>

                        {/* Enhanced Staff Selection */}
                        <div>
                          <h4 className="font-semibold mb-3 text-slate-900 dark:text-white">
                            {t("selectStaffMember")}:
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {restaurant.staff?.map((staff: any) => (
                              <div
                                key={staff.id}
                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                                  selectedStaff?.id === staff.id
                                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-lg"
                                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md"
                                }`}
                                onClick={() => setSelectedStaff(staff)}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-3xl">{staff.avatar}</span>
                                  <div className="flex-1">
                                    <div className="font-semibold text-slate-900 dark:text-white">{staff.name}</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">{staff.role}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                      <span className="text-xs font-medium">{staff.rating}</span>
                                      <span className="text-xs text-slate-500">({staff.tipCount} tips)</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {/* Enhanced Tip Amount Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">{t("chooseTipAmount")}</h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {tipOptions.map((amount) => (
                    <Button
                      key={amount}
                      variant={tipAmount === amount && !customAmount ? "default" : "outline"}
                      onClick={() => handleTipSelect(amount)}
                      className={`h-12 transition-all duration-200 hover:scale-105 ${
                        tipAmount === amount && !customAmount
                          ? "bg-gradient-to-r from-teal-600 to-teal-400 hover:from-teal-700 hover:to-teal-500 text-white shadow-lg"
                          : "border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500"
                      }`}
                    >
                      {formatCurrency(amount, currentCurrency)}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(0, currentCurrency).charAt(0)}
                  </span>
                  <Input
                    type="number"
                    placeholder={t("customAmount")}
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    min="1"
                    step="0.01"
                    className="text-lg font-semibold border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-500 transition-all duration-200"
                  />
                </div>
              </div>

              <Button
                onClick={() => setStep("review")}
                disabled={tipAmount <= 0 || (tipType === "individual" && !selectedStaff)}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-400 hover:from-teal-700 hover:to-teal-500 text-white h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Continue to Review
              </Button>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              {/* Rating */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">{t("leaveReview")}</h3>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400 scale-110"
                          : "text-slate-300 hover:text-amber-400 hover:scale-105"
                      }`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                <Textarea
                  placeholder={t("shareExperience")}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="min-h-[100px] border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-500 transition-all duration-200"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("tip")}
                  className="flex-1 hover:scale-105 transition-transform"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep("payment")}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-teal-400 hover:from-teal-700 hover:to-teal-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              {/* Payment Summary */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 space-y-3 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-lg">
                  <span className="text-slate-700 dark:text-slate-300">{t("tipAmount")}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(tipAmount, currentCurrency)}
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-slate-700 dark:text-slate-300">{t("platformFee")}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(platformFee, currentCurrency)}
                  </span>
                </div>
                <div className="border-t border-slate-300 dark:border-slate-600 pt-3 flex justify-between text-xl font-bold">
                  <span className="text-slate-900 dark:text-white">{t("totalCharge")}:</span>
                  <span className="text-teal-600 dark:text-teal-400">
                    {formatCurrency(totalCharge, currentCurrency)}
                  </span>
                </div>
                <div className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2">
                  {tipType === "business" ? (
                    <>
                      <span className="font-semibold text-teal-600 dark:text-teal-400">{restaurant.name}</span>{" "}
                      {t("receives")}:{" "}
                      <span className="font-semibold text-teal-600 dark:text-teal-400">
                        {formatCurrency(tipAmount, currentCurrency)}
                      </span>
                    </>
                  ) : (
                    selectedStaff && (
                      <>
                        <span className="font-semibold text-teal-600 dark:text-teal-400">{selectedStaff.name}</span>{" "}
                        {t("receives")}:{" "}
                        <span className="font-semibold text-teal-600 dark:text-teal-400">
                          {formatCurrency(tipAmount, currentCurrency)}
                        </span>
                      </>
                    )
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("review")}
                  className="flex-1 hover:scale-105 transition-transform"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-teal-400 hover:from-teal-700 hover:to-teal-500 text-white h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t("sendingTip")}
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      {t("sendTip")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
