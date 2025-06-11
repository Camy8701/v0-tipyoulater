"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  MapPin,
  Users,
  CreditCard,
  FileText,
  CheckCircle,
  Plus,
  Trash2,
  Clock,
  DollarSign,
} from "lucide-react"
import { type Language, getTranslation } from "@/lib/translations"

interface BusinessApplicationProps {
  currentLanguage: Language
}

export function BusinessApplication({ currentLanguage }: BusinessApplicationProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Business Information
    businessName: "",
    businessType: "",
    cuisine: "",
    description: "",
    website: "",
    phone: "",
    email: "",

    // Location Information
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",

    // Operating Information
    operatingHours: {
      monday: { open: "", close: "", closed: false },
      tuesday: { open: "", close: "", closed: false },
      wednesday: { open: "", close: "", closed: false },
      thursday: { open: "", close: "", closed: false },
      friday: { open: "", close: "", closed: false },
      saturday: { open: "", close: "", closed: false },
      sunday: { open: "", close: "", closed: false },
    },

    // Staff Information
    staff: [{ name: "", role: "", email: "" }],
    tipDistribution: "business", // "business", "individual", "both"

    // Banking Information
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountHolderName: "",

    // Legal Information
    businessLicense: "",
    taxId: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",

    // Agreements
    termsAccepted: false,
    privacyAccepted: false,
    feeAgreement: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const t = (key: keyof typeof import("@/lib/translations").translations.en, params?: Record<string, string>) =>
    getTranslation(currentLanguage, key, params)

  const businessTypes = [
    "Restaurant",
    "Cafe/Coffee Shop",
    "Bar/Pub",
    "Fast Food",
    "Food Truck",
    "Bakery",
    "Catering",
    "Hotel Restaurant",
    "Other",
  ]

  const cuisineTypes = [
    "American",
    "Italian",
    "Mexican",
    "Chinese",
    "Japanese",
    "Indian",
    "Thai",
    "French",
    "Mediterranean",
    "Korean",
    "Vietnamese",
    "Greek",
    "Spanish",
    "Other",
  ]

  const addStaffMember = () => {
    setFormData({
      ...formData,
      staff: [...formData.staff, { name: "", role: "", email: "" }],
    })
  }

  const removeStaffMember = (index: number) => {
    const newStaff = formData.staff.filter((_, i) => i !== index)
    setFormData({ ...formData, staff: newStaff })
  }

  const updateStaffMember = (index: number, field: string, value: string) => {
    const newStaff = [...formData.staff]
    newStaff[index] = { ...newStaff[index], [field]: value }
    setFormData({ ...formData, staff: newStaff })
  }

  const updateOperatingHours = (day: string, field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      operatingHours: {
        ...formData.operatingHours,
        [day]: {
          ...formData.operatingHours[day as keyof typeof formData.operatingHours],
          [field]: value,
        },
      },
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSubmitted(true)
    setIsSubmitting(false)
  }

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-4xl font-bold mb-4">{t("applicationSubmittedTitle")}</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{t("applicationSubmittedDescription")}</p>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-2">{t("whatHappensNext")}</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{t("applicationReview")}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{t("documentVerification")}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>{t("bankingSetup")}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t("accountActivation")}</span>
            </div>
          </div>
        </div>
        <Button onClick={() => window.location.reload()} size="lg">
          {t("submitAnotherApplication")}
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center py-8 px-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl">
        <h1 className="text-4xl font-bold mb-4">{t("joinTipYouLater")}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">{t("startReceivingTips")}</p>

        {/* Progress Indicator */}
        <div className="flex justify-center items-center gap-4 max-w-md mx-auto">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {step}
              </div>
              {step < 5 && (
                <div
                  className={`w-8 h-1 mx-2 ${step < currentStep ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {t("stepOf", { current: currentStep.toString(), total: "5" })}
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          {/* Step 1: Business Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">{t("businessInformation")}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("businessName")} *</label>
                  <Input
                    placeholder={t("enterBusinessName") as string}
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("businessType")} *</label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectBusinessType") as string} />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {t(type.toLowerCase() as keyof typeof import("@/lib/translations").translations.en)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("cuisineType")}</label>
                  <Select
                    value={formData.cuisine}
                    onValueChange={(value) => setFormData({ ...formData, cuisine: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCuisineType") as string} />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisineTypes.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                          {t(cuisine.toLowerCase() as keyof typeof import("@/lib/translations").translations.en)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("phoneNumber")} *</label>
                  <Input
                    placeholder={t("phoneNumberPlaceholder") as string}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("emailAddress")} *</label>
                  <Input
                    type="email"
                    placeholder={t("emailAddressPlaceholder") as string}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("website")}</label>
                  <Input
                    placeholder={t("websitePlaceholder") as string}
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("businessDescription")}</label>
                <Textarea
                  placeholder={t("businessDescriptionPlaceholder") as string}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          {/* Step 2: Location Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">{t("locationInformation")}</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("streetAddress")} *</label>
                  <Input
                    placeholder={t("streetAddressPlaceholder") as string}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                  <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {t("addressSuggestionsAvailable")}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("city")} *</label>
                    <Input
                      placeholder={t("cityPlaceholder") as string}
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("stateProvince")} *</label>
                    <Input
                      placeholder={t("stateProvincePlaceholder") as string}
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("zipPostalCode")} *</label>
                    <Input
                      placeholder={t("zipPostalCodePlaceholder") as string}
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("country")} *</label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => setFormData({ ...formData, country: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCountry") as string} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">{t("unitedStates")}</SelectItem>
                        <SelectItem value="ca">{t("canada")}</SelectItem>
                        <SelectItem value="uk">{t("unitedKingdom")}</SelectItem>
                        <SelectItem value="au">{t("australia")}</SelectItem>
                        <SelectItem value="fr">{t("france")}</SelectItem>
                        <SelectItem value="be">{t("belgium")}</SelectItem>
                        <SelectItem value="es">{t("spain")}</SelectItem>
                        <SelectItem value="de">{t("germany")}</SelectItem>
                        <SelectItem value="lu">{t("luxembourg")}</SelectItem>
                        <SelectItem value="ch">{t("switzerland")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t("operatingHours")}</h3>
                <div className="space-y-3">
                  {Object.entries(formData.operatingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium capitalize">
                        {t(day as keyof typeof import("@/lib/translations").translations.en)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={hours.closed}
                          onCheckedChange={(checked) => updateOperatingHours(day, "closed", checked as boolean)}
                        />
                        <span className="text-sm">{t("closed")}</span>
                      </div>
                      {!hours.closed && (
                        <>
                          <Input
                            type="time"
                            value={hours.open}
                            onChange={(e) => updateOperatingHours(day, "open", e.target.value)}
                            className="w-32"
                          />
                          <span className="text-sm">{t("to")}</span>
                          <Input
                            type="time"
                            value={hours.close}
                            onChange={(e) => updateOperatingHours(day, "close", e.target.value)}
                            className="w-32"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Staff & Tip Distribution */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">{t("staffTipDistribution")}</h2>
              </div>

              {/* Tip Distribution Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t("tipDistributionMethod")}</h3>
                <div className="grid gap-4">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.tipDistribution === "business"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setFormData({ ...formData, tipDistribution: "business" })}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-semibold">{t("businessTipsOnly")}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {t("businessTipsOnlyDescription")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.tipDistribution === "individual"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setFormData({ ...formData, tipDistribution: "individual" })}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-semibold">{t("individualStaffTips")}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {t("individualStaffTipsDescription")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.tipDistribution === "both"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setFormData({ ...formData, tipDistribution: "both" })}
                  >
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-semibold">{t("bothOptions")}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t("bothOptionsDescription")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff Members */}
              {(formData.tipDistribution === "individual" || formData.tipDistribution === "both") && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{t("staffMembers")}</h3>
                    <Button onClick={addStaffMember} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      {t("addStaffMember")}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {formData.staff.map((staff, index) => (
                      <div key={index} className="grid md:grid-cols-4 gap-3 p-4 border rounded-lg">
                        <Input
                          placeholder={t("fullName") as string}
                          value={staff.name}
                          onChange={(e) => updateStaffMember(index, "name", e.target.value)}
                        />
                        <Input
                          placeholder={t("rolePosition") as string}
                          value={staff.role}
                          onChange={(e) => updateStaffMember(index, "role", e.target.value)}
                        />
                        <Input
                          type="email"
                          placeholder={t("emailOptional") as string}
                          value={staff.email}
                          onChange={(e) => updateStaffMember(index, "email", e.target.value)}
                        />
                        <Button
                          onClick={() => removeStaffMember(index)}
                          variant="outline"
                          size="sm"
                          disabled={formData.staff.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Banking Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">{t("bankingInformation")}</h2>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800 dark:text-yellow-200">{t("secureInformation")}</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">{t("secureInformationDescription")}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("bankName")} *</label>
                  <Input
                    placeholder={t("bankNamePlaceholder") as string}
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("accountHolderName")} *</label>
                  <Input
                    placeholder={t("accountHolderNamePlaceholder") as string}
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("accountNumber")} *</label>
                  <Input
                    placeholder={t("accountNumberPlaceholder") as string}
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("routingNumber")} *</label>
                  <Input
                    placeholder={t("routingNumberPlaceholder") as string}
                    value={formData.routingNumber}
                    onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                  />
                </div>
              </div>

              {/* Legal Information */}
              <div className="space-y-6 pt-6 border-t">
                <h3 className="text-lg font-semibold">{t("legalInformation")}</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("businessLicenseNumber")}</label>
                    <Input
                      placeholder={t("businessLicenseNumberPlaceholder") as string}
                      value={formData.businessLicense}
                      onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("taxIdEin")} *</label>
                    <Input
                      placeholder={t("taxIdEinPlaceholder") as string}
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("ownerManagerName")} *</label>
                    <Input
                      placeholder={t("ownerManagerNamePlaceholder") as string}
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("ownerManagerEmail")} *</label>
                    <Input
                      type="email"
                      placeholder={t("ownerManagerEmailPlaceholder") as string}
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">{t("reviewSubmit")}</h2>
              </div>

              {/* Application Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("businessInformation")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <strong>{t("name")}:</strong> {formData.businessName}
                    </div>
                    <div>
                      <strong>{t("type")}:</strong> {formData.businessType}
                    </div>
                    <div>
                      <strong>{t("email")}:</strong> {formData.email}
                    </div>
                    <div>
                      <strong>{t("phone")}:</strong> {formData.phone}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("location")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>{formData.address}</div>
                    <div>
                      {formData.city}, {formData.state} {formData.zipCode}
                    </div>
                    <div>{formData.country}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("tipDistribution")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="capitalize">
                      {formData.tipDistribution === "both"
                        ? t("businessIndividualStaff")
                        : t(formData.tipDistribution as keyof typeof import("@/lib/translations").translations.en)}
                    </Badge>
                    {(formData.tipDistribution === "individual" || formData.tipDistribution === "both") && (
                      <div className="mt-3">
                        <div className="text-sm font-medium mb-2">{t("staffMembers")}:</div>
                        <div className="space-y-1">
                          {formData.staff.map((staff, index) => (
                            <div key={index} className="text-sm">
                              {staff.name} - {staff.role}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Terms and Agreements */}
              <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h3 className="font-semibold">{t("termsAgreements")}</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: checked as boolean })}
                    />
                    <div className="text-sm leading-relaxed">
                      {t("iAgreeToThe")}{" "}
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        {t("termsOfService")}
                      </a>{" "}
                      {t("andUnderstandThePlatformRequirements")}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={formData.privacyAccepted}
                      onCheckedChange={(checked) => setFormData({ ...formData, privacyAccepted: checked as boolean })}
                    />
                    <div className="text-sm leading-relaxed">
                      {t("iAgreeToThe")}{" "}
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        {t("privacyPolicy")}
                      </a>{" "}
                      {t("andDataHandlingPractices")}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={formData.feeAgreement}
                      onCheckedChange={(checked) => setFormData({ ...formData, feeAgreement: checked as boolean })}
                    />
                    <div className="text-sm leading-relaxed">
                      {t("iUnderstandAndAgreeToThePlatformFee")} {t("of")}{" "}
                      <span className="font-semibold text-blue-600">3.5%</span> {t("onAllTransactions")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t">
            <Button
              onClick={prevStep}
              variant="outline"
              disabled={currentStep === 1}
              className="hover:shadow-md hover:scale-105 transition-all duration-200"
            >
              {t("previous")}
            </Button>

            {currentStep < 5 ? (
              <Button onClick={nextStep} className="hover:shadow-md hover:scale-105 transition-all duration-200">
                {t("next")}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={
                  !formData.termsAccepted || !formData.privacyAccepted || !formData.feeAgreement || isSubmitting
                }
                className="bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-200"
              >
                {isSubmitting ? t("submitting") : t("submitApplication")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
