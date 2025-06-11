"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface Stat {
  value: string
  label: string
  color: string
}

interface PremiumStatsProps {
  stats: Stat[]
}

export function PremiumStats({ stats }: PremiumStatsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  return (
    <div className="relative py-24" ref={ref}>
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 animate-gradient-shift"></div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
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
            Trusted by Thousands
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Join the growing community of happy customers and businesses
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="relative"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sharp h-full transform transition-transform duration-300 hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-xl rounded-full transform translate-x-1/3 -translate-y-1/3"></div>

                <div className="relative z-10 text-center">
                  <div
                    className={`text-5xl font-bold ${stat.color} mb-4 animate-scale-pulse`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
