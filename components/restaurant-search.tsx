"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  MapPin,
  DollarSign,
  Sparkles,
  Clock,
  X,
  SlidersHorizontal,
  MapPinIcon,
  Utensils,
  Heart,
  Share2,
  Navigation,
  Filter,
  Loader2,
} from "lucide-react"
import { getTranslation } from "@/lib/translations"
import type { Currency } from "@/lib/currency"
import type { Language } from "@/lib/i18n/settings"
import Image from "next/image"

const sampleRestaurants = [
  {
    id: 1,
    name: "Mario's Italian Bistro",
    type: "Italian Restaurant",
    address: "123 Main St, Downtown",
    rating: 4.8,
    tipCount: 127,
    reviewCount: 89,
    image: "🍝",
    realImage: "/warm-italian-interior.png",
    cuisine: "italian",
    distance: "0.3 miles",
    priceRange: "$$",
    isOpen: true,
    openUntil: "11:00 PM",
    popularDishes: ["Pasta Carbonara", "Margherita Pizza", "Tiramisu"],
    staff: [
      { id: 1, name: "Marco", role: "Head Chef", avatar: "👨‍🍳", rating: 4.9, tipCount: 45 },
      { id: 2, name: "Sofia", role: "Server", avatar: "👩‍💼", rating: 4.7, tipCount: 32 },
      { id: 3, name: "Luigi", role: "Bartender", avatar: "👨‍💼", rating: 4.8, tipCount: 28 },
    ],
    tipDistribution: "individual",
    gradient: "from-red-500 to-orange-600",
    coordinates: { lat: 40.7128, lng: -74.006 },
    recentReviews: [
      { user: "Sarah M.", rating: 5, comment: "Amazing pasta! Marco is a fantastic chef.", date: "2 days ago" },
      { user: "John D.", rating: 4, comment: "Great atmosphere and service.", date: "1 week ago" },
    ],
  },
  {
    id: 2,
    name: "The Coffee Corner",
    type: "Coffee Shop",
    address: "456 Oak Ave, City Center",
    rating: 4.6,
    tipCount: 89,
    reviewCount: 156,
    image: "☕",
    realImage: "/cozy-coffee-shop.png",
    cuisine: "cafe",
    distance: "0.5 miles",
    priceRange: "$",
    isOpen: true,
    openUntil: "9:00 PM",
    popularDishes: ["Cappuccino", "Avocado Toast", "Blueberry Muffin"],
    staff: [
      { id: 4, name: "Emma", role: "Barista", avatar: "👩‍🍳", rating: 4.8, tipCount: 67 },
      { id: 5, name: "Jake", role: "Manager", avatar: "👨‍💼", rating: 4.6, tipCount: 23 },
    ],
    tipDistribution: "both",
    gradient: "from-amber-500 to-yellow-600",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    recentReviews: [
      {
        user: "Lisa K.",
        rating: 5,
        comment: "Best coffee in the city! Emma makes perfect latte art.",
        date: "1 day ago",
      },
    ],
  },
  {
    id: 3,
    name: "Sakura Sushi",
    type: "Japanese Restaurant",
    address: "789 Pine St, Japantown",
    rating: 4.9,
    tipCount: 156,
    reviewCount: 203,
    image: "🍣",
    realImage: "/elegant-sushi-restaurant.png",
    cuisine: "japanese",
    distance: "0.8 miles",
    priceRange: "$$$",
    isOpen: false,
    openUntil: "Closed",
    opensAt: "5:00 PM",
    popularDishes: ["Omakase", "Salmon Sashimi", "Dragon Roll"],
    staff: [
      { id: 6, name: "Hiroshi", role: "Sushi Chef", avatar: "👨‍🍳", rating: 4.9, tipCount: 78 },
      { id: 7, name: "Yuki", role: "Server", avatar: "👩‍💼", rating: 4.8, tipCount: 45 },
      { id: 8, name: "Takeshi", role: "Host", avatar: "👨‍💼", rating: 4.7, tipCount: 33 },
    ],
    tipDistribution: "individual",
    gradient: "from-pink-500 to-rose-600",
    coordinates: { lat: 40.7282, lng: -73.9942 },
    recentReviews: [
      { user: "Michael R.", rating: 5, comment: "Hiroshi's omakase was incredible!", date: "3 days ago" },
    ],
  },
  {
    id: 4,
    name: "Brewery & Grill",
    type: "Bar & Grill",
    address: "321 Elm St, Brewery District",
    rating: 4.5,
    tipCount: 203,
    reviewCount: 298,
    image: "🍺",
    realImage: "/placeholder-6g06j.png",
    cuisine: "bar",
    distance: "1.2 miles",
    priceRange: "$$",
    isOpen: true,
    openUntil: "12:00 AM",
    popularDishes: ["IPA Flight", "BBQ Burger", "Wings"],
    staff: [
      { id: 9, name: "Mike", role: "Bartender", avatar: "👨‍🍳", rating: 4.7, tipCount: 89 },
      { id: 10, name: "Sarah", role: "Server", avatar: "👩‍💼", rating: 4.6, tipCount: 67 },
    ],
    tipDistribution: "business",
    gradient: "from-blue-500 to-indigo-600",
    coordinates: { lat: 40.7505, lng: -73.9934 },
    recentReviews: [
      { user: "Tom B.", rating: 4, comment: "Great beer selection and friendly staff.", date: "5 days ago" },
    ],
  },
  {
    id: 5,
    name: "Taco Fiesta",
    type: "Mexican Restaurant",
    address: "654 Cedar Blvd, South Side",
    rating: 4.7,
    tipCount: 98,
    reviewCount: 134,
    image: "🌮",
    realImage: "/vibrant-mexican-restaurant.png",
    cuisine: "mexican",
    distance: "0.7 miles",
    priceRange: "$",
    isOpen: true,
    openUntil: "10:00 PM",
    popularDishes: ["Fish Tacos", "Guacamole", "Margaritas"],
    staff: [
      { id: 11, name: "Carlos", role: "Chef", avatar: "👨‍🍳", rating: 4.8, tipCount: 56 },
      { id: 12, name: "Maria", role: "Server", avatar: "👩‍💼", rating: 4.7, tipCount: 42 },
    ],
    tipDistribution: "both",
    gradient: "from-green-500 to-emerald-600",
    coordinates: { lat: 40.7282, lng: -74.0776 },
    recentReviews: [{ user: "Ana G.", rating: 5, comment: "Carlos makes the best fish tacos!", date: "1 day ago" }],
  },
  {
    id: 6,
    name: "French Delights",
    type: "French Cuisine",
    address: "987 Maple Dr, Uptown",
    rating: 4.9,
    tipCount: 76,
    reviewCount: 92,
    image: "🥐",
    realImage: "/elegant-french-bistro.png",
    cuisine: "french",
    distance: "1.5 miles",
    priceRange: "$$$",
    isOpen: true,
    openUntil: "11:30 PM",
    popularDishes: ["Coq au Vin", "Crème Brûlée", "Wine Pairing"],
    staff: [
      { id: 13, name: "Pierre", role: "Chef", avatar: "👨‍🍳", rating: 4.9, tipCount: 34 },
      { id: 14, name: "Claire", role: "Sommelier", avatar: "👩‍💼", rating: 4.8, tipCount: 42 },
    ],
    tipDistribution: "individual",
    gradient: "from-purple-500 to-violet-600",
    coordinates: { lat: 40.7831, lng: -73.9712 },
    recentReviews: [
      { user: "Robert L.", rating: 5, comment: "Pierre's coq au vin was perfection!", date: "4 days ago" },
    ],
  },
]

// Enhanced search suggestions with categories
const searchSuggestions = [
  { text: "Mario's Italian Bistro", category: "restaurant" },
  { text: "The Coffee Corner", category: "restaurant" },
  { text: "Sakura Sushi", category: "restaurant" },
  { text: "Italian restaurants", category: "cuisine" },
  { text: "Coffee shops near me", category: "cuisine" },
  { text: "Sushi restaurants", category: "cuisine" },
  { text: "Mexican food", category: "cuisine" },
  { text: "French cuisine", category: "cuisine" },
  { text: "Bars and grills", category: "cuisine" },
  { text: "Pizza places", category: "cuisine" },
]

interface RestaurantSearchProps {
  searchQuery: string
  onSelectRestaurant: (restaurant: any) => void
  currentLanguage: Language
  currentCurrency: Currency
}

// Skeleton Loading Component
const RestaurantCardSkeleton = () => (
  <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-slate-800 animate-pulse">
    <div className="h-32 md:h-48 bg-slate-200 dark:bg-slate-700"></div>
    <CardContent className="p-4 md:p-6">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-3"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-4"></div>
      <div className="flex justify-between mb-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
      </div>
      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
    </CardContent>
  </Card>
)

export function RestaurantSearch({
  searchQuery,
  onSelectRestaurant,
  currentLanguage,
  currentCurrency,
}: RestaurantSearchProps) {
  const t = (key: keyof typeof import("@/lib/translations").translations.en, params?: Record<string, string>) =>
    getTranslation(currentLanguage, key, params)

  const [searchTerm, setSearchTerm] = useState(searchQuery)
  const [location, setLocation] = useState("")
  const [cuisine, setCuisine] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [distance, setDistance] = useState("")
  const [filteredRestaurants, setFilteredRestaurants] = useState(sampleRestaurants)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Mario's Italian Bistro",
    "Coffee shops",
    "Sushi restaurants",
  ])
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([1, 3])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "tips">("distance")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchCache = useRef<Map<string, any[]>>(new Map())

  useEffect(() => {
    setSearchTerm(searchQuery)
  }, [searchQuery])

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      filterRestaurants()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, location, cuisine, priceRange, distance, sortBy])

  // Get user location
  const getUserLocation = useCallback(() => {
    setIsLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setIsLoadingLocation(false)
          // Update distances based on actual location
          updateDistancesFromLocation(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoadingLocation(false)
        },
      )
    }
  }, [])

  const updateDistancesFromLocation = (lat: number, lng: number) => {
    // Calculate actual distances (simplified calculation)
    const updatedRestaurants = sampleRestaurants.map((restaurant) => {
      const distance = calculateDistance(lat, lng, restaurant.coordinates.lat, restaurant.coordinates.lng)
      return { ...restaurant, distance: `${distance.toFixed(1)} miles` }
    })
    setFilteredRestaurants(updatedRestaurants)
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 3959 // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const filterRestaurants = useCallback(() => {
    setIsLoading(true)

    // Check cache first
    const cacheKey = `${searchTerm}-${location}-${cuisine}-${priceRange}-${distance}-${sortBy}`
    if (searchCache.current.has(cacheKey)) {
      setFilteredRestaurants(searchCache.current.get(cacheKey)!)
      setIsLoading(false)
      return
    }

    // Simulate API delay for loading state
    setTimeout(() => {
      const filtered = sampleRestaurants.filter((restaurant) => {
        const matchesSearch =
          !searchTerm ||
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.popularDishes.some((dish) => dish.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesLocation = !location || restaurant.address.toLowerCase().includes(location.toLowerCase())
        const matchesCuisine = !cuisine || restaurant.cuisine === cuisine
        const matchesPriceRange = !priceRange || restaurant.priceRange === priceRange
        const matchesDistance = !distance || Number.parseFloat(restaurant.distance) <= Number.parseFloat(distance)

        return matchesSearch && matchesLocation && matchesCuisine && matchesPriceRange && matchesDistance
      })

      // Sort results
      const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "rating":
            return b.rating - a.rating
          case "tips":
            return b.tipCount - a.tipCount
          case "distance":
          default:
            return Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
        }
      })

      // Cache results
      searchCache.current.set(cacheKey, sorted)
      setFilteredRestaurants(sorted)
      setIsLoading(false)
    }, 500)
  }, [searchTerm, location, cuisine, priceRange, distance, sortBy])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setShowSuggestions(value.length > 0)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
    // Add to recent searches if not already there
    if (!recentSearches.includes(suggestion)) {
      setRecentSearches([suggestion, ...recentSearches.slice(0, 4)])
    }
  }

  const handleRecentSearchClick = (search: string) => {
    setSearchTerm(search)
    setShowSuggestions(false)
  }

  const removeRecentSearch = (search: string) => {
    setRecentSearches(recentSearches.filter((s) => s !== search))
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setLocation("")
    setCuisine("")
    setPriceRange("")
    setDistance("")
  }

  const toggleFavorite = (restaurantId: number) => {
    setFavorites((prev) =>
      prev.includes(restaurantId) ? prev.filter((id) => id !== restaurantId) : [...prev, restaurantId],
    )
  }

  const shareRestaurant = (restaurant: any) => {
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: `Check out ${restaurant.name} - ${restaurant.type}`,
        url: window.location.href,
      })
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`Check out ${restaurant.name} at ${restaurant.address}`)
    }
  }

  const getFilteredSuggestions = () => {
    return searchSuggestions
      .filter((suggestion) => suggestion.text.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5)
  }

  const activeFiltersCount = [location, cuisine, priceRange, distance].filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Enhanced Search Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 transition-all duration-500 hover:shadow-2xl">
        <CardContent className="p-4 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-400 text-white rounded-full text-sm font-medium mb-4 animate-pulse">
              <Sparkles className="w-4 h-4" />
              Discover Amazing Places
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {t("findPlacesToTip")}
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300">{t("discoverRestaurants")}</p>
          </div>

          {/* Enhanced Search Form */}
          <div className="space-y-4">
            {/* Main Search Bar with Suggestions */}
            <div className="relative">
              <div className="relative">
                <Input
                  ref={searchInputRef}
                  placeholder={t("restaurantNameKeyword")}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                  className="h-12 md:h-14 text-base md:text-lg pl-12 pr-16 border-2 border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-500 rounded-xl transition-all duration-300 focus:shadow-lg"
                />
                <Sparkles className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />

                {/* Location Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={getUserLocation}
                  disabled={isLoadingLocation}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-2"
                >
                  {isLoadingLocation ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Enhanced Search Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && searchTerm.length === 0 && (
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Recent Searches</span>
                      </div>
                      <div className="space-y-2">
                        {recentSearches.map((search, index) => (
                          <div key={index} className="flex items-center justify-between group">
                            <button
                              onClick={() => handleRecentSearchClick(search)}
                              className="flex-1 text-left text-sm text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 py-1 transition-colors"
                            >
                              {search}
                            </button>
                            <button
                              onClick={() => removeRecentSearch(search)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all"
                            >
                              <X className="w-3 h-3 text-slate-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Search Suggestions with Categories */}
                  {searchTerm.length > 0 && (
                    <div className="p-4">
                      <div className="space-y-2">
                        {getFilteredSuggestions().map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion.text)}
                            className="w-full text-left text-sm text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-700 py-2 px-3 rounded-lg transition-all duration-200 flex items-center gap-2"
                          >
                            {suggestion.category === "restaurant" ? (
                              <Utensils className="w-4 h-4 text-slate-400" />
                            ) : (
                              <Filter className="w-4 h-4 text-slate-400" />
                            )}
                            {suggestion.text}
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {suggestion.category}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between md:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-teal-100 text-teal-800 animate-pulse">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="text-sm hover:scale-105 transition-transform"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Enhanced Filters */}
            <div
              className={`grid gap-4 transition-all duration-500 ${showFilters || window.innerWidth >= 768 ? "grid-cols-1 md:grid-cols-5 opacity-100" : "hidden opacity-0"}`}
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  {t("location")}
                </label>
                <Input
                  placeholder={userLocation ? "Current location" : t("cityZipCode")}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-10 md:h-12 border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-500 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Utensils className="w-4 h-4" />
                  {t("cuisineType")}
                </label>
                <Select value={cuisine} onValueChange={setCuisine}>
                  <SelectTrigger className="h-10 md:h-12 border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-500 transition-all duration-200">
                    <SelectValue placeholder={t("allTypes")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_types">{t("allTypes")}</SelectItem>
                    <SelectItem value="american">{t("american")}</SelectItem>
                    <SelectItem value="italian">{t("italian")}</SelectItem>
                    <SelectItem value="mexican">{t("mexican")}</SelectItem>
                    <SelectItem value="chinese">{t("chinese")}</SelectItem>
                    <SelectItem value="japanese">{t("japanese")}</SelectItem>
                    <SelectItem value="french">{t("french")}</SelectItem>
                    <SelectItem value="cafe">Cafe</SelectItem>
                    <SelectItem value="bar">Bar/Pub</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price Range
                </label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="h-10 md:h-12 border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-500 transition-all duration-200">
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any_price">Any Price</SelectItem>
                    <SelectItem value="$">$ - Budget</SelectItem>
                    <SelectItem value="$$">$$ - Moderate</SelectItem>
                    <SelectItem value="$$$">$$$ - Expensive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Distance
                </label>
                <Select value={distance} onValueChange={setDistance}>
                  <SelectTrigger className="h-10 md:h-12 border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-500 transition-all duration-200">
                    <SelectValue placeholder="Any Distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any_distance">Any Distance</SelectItem>
                    <SelectItem value="0.5">Within 0.5 miles</SelectItem>
                    <SelectItem value="1">Within 1 mile</SelectItem>
                    <SelectItem value="2">Within 2 miles</SelectItem>
                    <SelectItem value="5">Within 5 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="h-10 md:h-12 border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-500 transition-all duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="tips">Most Tips</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 animate-in slide-in-from-left duration-300">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Active filters:</span>
                {location && (
                  <Badge
                    variant="secondary"
                    className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 transition-all duration-200 hover:scale-105"
                  >
                    Location: {location}
                    <button
                      onClick={() => setLocation("")}
                      className="ml-1 hover:bg-teal-200 dark:hover:bg-teal-800 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {cuisine && (
                  <Badge
                    variant="secondary"
                    className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 transition-all duration-200 hover:scale-105"
                  >
                    Cuisine: {cuisine}
                    <button
                      onClick={() => setCuisine("")}
                      className="ml-1 hover:bg-teal-200 dark:hover:bg-teal-800 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {priceRange && (
                  <Badge
                    variant="secondary"
                    className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 transition-all duration-200 hover:scale-105"
                  >
                    Price: {priceRange}
                    <button
                      onClick={() => setPriceRange("")}
                      className="ml-1 hover:bg-teal-200 dark:hover:bg-teal-800 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {distance && (
                  <Badge
                    variant="secondary"
                    className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 transition-all duration-200 hover:scale-105"
                  >
                    Distance: {distance} miles
                    <button
                      onClick={() => setDistance("")}
                      className="ml-1 hover:bg-teal-200 dark:hover:bg-teal-800 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
            <span className="ml-2 text-slate-600 dark:text-slate-400">Finding amazing places...</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, index) => (
              <RestaurantCardSkeleton key={index} />
            ))}
          </div>
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="text-4xl md:text-6xl mb-4">🔍</div>
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              {t("noRestaurantsFound")}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{t("tryAdjustingCriteria")}</p>
            <Button onClick={clearAllFilters} variant="outline" className="hover:scale-105 transition-transform">
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Results Count and Sort */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Found {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? "s" : ""}
              {userLocation && " near you"}
            </p>
          </div>

          {/* Enhanced Restaurant Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredRestaurants.map((restaurant, index) => (
              <Card
                key={restaurant.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer bg-white dark:bg-slate-800 animate-in slide-in-from-bottom duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onSelectRestaurant(restaurant)}
              >
                {/* Enhanced Image Section */}
                <div className="relative h-32 md:h-48 overflow-hidden">
                  <Image
                    src={restaurant.realImage || "/placeholder.svg"}
                    alt={restaurant.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant={restaurant.isOpen ? "default" : "secondary"}
                      className={`text-xs ${restaurant.isOpen ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                    >
                      {restaurant.isOpen
                        ? `Open until ${restaurant.openUntil}`
                        : `Closed • Opens ${restaurant.opensAt}`}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(restaurant.id)
                      }}
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    >
                      <Heart
                        className={`w-4 h-4 ${favorites.includes(restaurant.id) ? "fill-red-500 text-red-500" : "text-slate-600"} transition-colors`}
                      />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        shareRestaurant(restaurant)
                      }}
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    >
                      <Share2 className="w-4 h-4 text-slate-600" />
                    </Button>
                  </div>

                  {/* Price and Distance Badges */}
                  <div className="absolute bottom-2 left-2 flex gap-2">
                    <Badge variant="secondary" className="text-xs bg-white/90 text-slate-800">
                      {restaurant.priceRange}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-white/90 text-slate-800">
                      {restaurant.distance}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                      {restaurant.name}
                    </h3>
                    {favorites.includes(restaurant.id) && (
                      <Heart className="w-5 h-5 fill-red-500 text-red-500 animate-pulse" />
                    )}
                  </div>

                  <Badge
                    variant="secondary"
                    className="mb-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs"
                  >
                    {restaurant.type}
                  </Badge>

                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 mb-3">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm truncate">{restaurant.address}</span>
                  </div>

                  {/* Popular Dishes */}
                  <div className="mb-3">
                    <p className="text-xs text-slate-500 mb-1">Popular:</p>
                    <div className="flex flex-wrap gap-1">
                      {restaurant.popularDishes.slice(0, 2).map((dish, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {dish}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 md:w-4 md:h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-slate-900 dark:text-white text-sm md:text-base">
                        {restaurant.rating}
                      </span>
                      <span className="text-xs text-slate-500">({restaurant.reviewCount})</span>
                    </div>
                    <span className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                      {restaurant.tipCount} {t("tips")}
                    </span>
                  </div>

                  {/* Recent Review Preview */}
                  {restaurant.recentReviews.length > 0 && (
                    <div className="mb-4 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        "{restaurant.recentReviews[0].comment}"
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        - {restaurant.recentReviews[0].user}, {restaurant.recentReviews[0].date}
                      </p>
                    </div>
                  )}

                  <Button
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-400 hover:from-teal-700 hover:to-teal-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-10 md:h-12 text-sm md:text-base"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectRestaurant(restaurant)
                    }}
                  >
                    <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    {t("sendTip")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
