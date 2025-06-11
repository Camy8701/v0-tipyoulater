"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { currencies, type Currency } from "@/lib/currency"

interface CurrencySelectorProps {
  currentCurrency: Currency
  onCurrencyChange: (currency: Currency) => void
  className?: string
}

export function CurrencySelector({ currentCurrency, onCurrencyChange, className }: CurrencySelectorProps) {
  const currentCurrencyInfo = currencies[currentCurrency]

  return (
    <Select value={currentCurrency} onValueChange={onCurrencyChange}>
      <SelectTrigger className={`w-32 bg-white/10 border-white/20 text-white hover:bg-white/20 ${className}`}>
        <SelectValue>
          <div className="flex items-center gap-2">
            <span>{currentCurrencyInfo.flag}</span>
            <span className="hidden sm:inline">{currentCurrencyInfo.code}</span>
            <span className="sm:hidden">{currentCurrencyInfo.symbol}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(currencies).map(([code, info]) => (
          <SelectItem key={code} value={code}>
            <div className="flex items-center gap-2">
              <span>{info.flag}</span>
              <span>{info.name}</span>
              <span className="text-gray-500">({info.symbol})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
