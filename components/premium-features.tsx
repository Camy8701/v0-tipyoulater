"use client"

import type React from "react"

import { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, useInView } from "framer-motion"
import Image from "next/image"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
  action: () => void
  bgImage: string
}

interface PremiumFeaturesProps {
  features: Feature[]
}

export function PremiumFeatures({ features }: PremiumFeaturesProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  return (
    <div className="relative py-24 overflow-hidden" ref={ref}>
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 blur-3xl rounded-full"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Premium Features
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Discover the powerful tools and features that make TipYouLater the ultimate tipping platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            >
              <Card
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white dark:bg-slate-800 h-full cursor-pointer"
                onClick={feature.action}
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={feature.bgImage || "/placeholder.svg"}
                    alt={feature.title}
                    fill
                    className="object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 dark:from-slate-900/5 dark:to-slate-900/0 group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                </div>

                {/* Content */}
                <CardContent className="p-8 relative z-20">
                  <div className="flex flex-col h-full">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>

                    <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{feature.description}</p>

                    <div className="mt-auto flex items-center text-blue-500 dark:text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span>Learn more</span>
                      <svg
                        className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
