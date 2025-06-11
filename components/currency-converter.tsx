"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { type Currency, currencies, formatCurrency, useRealTimeConversion } from "@/lib/currency"
import { type Language, getTranslation } from "@/lib/translations"

interface CurrencyConverterProps {
  currentLanguage: Language
  currentCurrency: Currency
  onCurrencyChange: (currency: Currency) => void
}

export default function CurrencyConverter({
  currentLanguage,
  currentCurrency,
  onCurrencyChange,
}: CurrencyConverterProps) {
  const [fromCurrency, setFromCurrency] = useState<Currency>(currentCurrency)
  const [toCurrency, setToCurrency] = useState<Currency>(currentCurrency === "USD" ? "EUR" : "USD")
  const [amount, setAmount] = useState<string>("1")
  const [convertedAmount, setConvertedAmount] = useState<number>(0)

  const t = (key: keyof typeof import("@/lib/translations").translations.en, params?: Record<string, string>) =>
    getTranslation(currentLanguage, key, params)

  const { result: conversionResult, loading: conversionLoading } = useRealTimeConversion(
    Number.parseFloat(amount) || 0,
    fromCurrency,
    toCurrency,
  )

  useEffect(() => {
    if (conversionResult) {
      setConvertedAmount(conversionResult.amount)
    }
  }, [conversionResult])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }

  const handleFromCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromCurrency(e.target.value as Currency)
  }

  const handleToCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(e.target.value as Currency)
  }

  const convertedValue = conversionResult?.amount || 0
  const rate = conversionResult?.rate || 0
  const isRealTime = conversionResult?.success === true
  const lastUpdated = conversionResult?.timestamp ? new Date(conversionResult.timestamp).toLocaleString() : ""

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">{t("currencyConverter")}</h2>
        <p className="text-slate-600 dark:text-slate-400">Convert currencies with real-time exchange rates</p>
      </div>

      {/* Main Converter Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Amount Input Section */}
        <div className="p-6 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
          <label htmlFor="amount" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Amount to Convert
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              className="w-full text-3xl font-bold py-4 px-6 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:border-teal-500 dark:focus:border-teal-400 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/20 transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Currency Selection Section */}
        <div className="p-6 space-y-6">
          {/* From Currency */}
          <div className="space-y-3">
            <label htmlFor="fromCurrency" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              From Currency
            </label>
            <div className="relative">
              <select
                id="fromCurrency"
                className="w-full appearance-none bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl py-4 px-6 text-lg font-medium text-slate-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-400 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/20 transition-all duration-200 cursor-pointer"
                value={fromCurrency}
                onChange={handleFromCurrencyChange}
              >
                {Object.entries(currencies).map(([code, info]) => (
                  <option key={code} value={code} className="py-2">
                    {info.flag} {code} - {info.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                const temp = fromCurrency
                setFromCurrency(toCurrency)
                setToCurrency(temp)
              }}
              className="p-3 bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-900/50 rounded-full transition-all duration-200 group"
            >
              <svg
                className="w-6 h-6 text-teal-600 dark:text-teal-400 group-hover:rotate-180 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          {/* To Currency */}
          <div className="space-y-3">
            <label htmlFor="toCurrency" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              To Currency
            </label>
            <div className="relative">
              <select
                id="toCurrency"
                className="w-full appearance-none bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl py-4 px-6 text-lg font-medium text-slate-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-400 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/20 transition-all duration-200 cursor-pointer"
                value={toCurrency}
                onChange={handleToCurrencyChange}
              >
                {Object.entries(currencies).map(([code, info]) => (
                  <option key={code} value={code} className="py-2">
                    {info.flag} {code} - {info.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Converted Amount</p>
              <p className="text-4xl font-bold text-teal-600 dark:text-teal-400">
                {formatCurrency(convertedValue, toCurrency)}
              </p>
            </div>

            {/* Exchange Rate Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <span>{currencies[fromCurrency].flag}</span>
                <span>
                  1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                </span>
                <span>{currencies[toCurrency].flag}</span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-center space-x-2">
                {conversionLoading ? (
                  <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-600 border-t-transparent"></div>
                    <span className="text-sm font-medium">Fetching latest rates...</span>
                  </div>
                ) : isRealTime ? (
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-sm font-medium">Live Rate</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm font-medium">Estimated Rate (Offline)</span>
                  </div>
                )}
              </div>

              {/* Last Updated */}
              {lastUpdated && <p className="text-xs text-slate-500 dark:text-slate-400">Last updated: {lastUpdated}</p>}
            </div>
          </div>
        </div>

        {/* Set Default Currency Button */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onCurrencyChange(toCurrency)}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/20 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Set {currencies[toCurrency].name} as Default Currency</span>
            </div>
          </button>
        </div>
      </div>

      {/* Additional Info Card */}
      <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Exchange Rate Information</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Exchange rates are updated in real-time when possible. For the most accurate rates, we recommend checking
              with your financial institution before making large transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
