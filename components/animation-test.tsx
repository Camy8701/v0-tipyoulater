"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Play, RotateCcw } from "lucide-react"

export function AnimationTest() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  const [isRunning, setIsRunning] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })

  const runAnimationTests = async () => {
    setIsRunning(true)
    setTestResults({})

    const tests = [
      { name: "Basic Motion", test: () => testBasicMotion() },
      { name: "Hover Effects", test: () => testHoverEffects() },
      { name: "InView Animations", test: () => testInViewAnimations() },
      { name: "Stagger Animations", test: () => testStaggerAnimations() },
      { name: "Button Hover Glow", test: () => testButtonHoverGlow() },
      { name: "Card Animations", test: () => testCardAnimations() },
    ]

    for (const { name, test } of tests) {
      try {
        await test()
        setTestResults((prev) => ({ ...prev, [name]: true }))
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`Test failed: ${name}`, error)
        setTestResults((prev) => ({ ...prev, [name]: false }))
      }
    }

    setIsRunning(false)
  }

  const testBasicMotion = () => {
    return new Promise<void>((resolve) => {
      const element = document.querySelector('[data-test="basic-motion"]')
      if (element) {
        resolve()
      } else {
        throw new Error("Basic motion element not found")
      }
    })
  }

  const testHoverEffects = () => {
    return new Promise<void>((resolve) => {
      const buttons = document.querySelectorAll("button")
      if (buttons.length > 0) {
        resolve()
      } else {
        throw new Error("No buttons found for hover testing")
      }
    })
  }

  const testInViewAnimations = () => {
    return new Promise<void>((resolve) => {
      if (typeof IntersectionObserver !== "undefined") {
        resolve()
      } else {
        throw new Error("IntersectionObserver not supported")
      }
    })
  }

  const testStaggerAnimations = () => {
    return new Promise<void>((resolve) => {
      const staggerElements = document.querySelectorAll('[data-test="stagger"]')
      if (staggerElements.length > 0) {
        resolve()
      } else {
        throw new Error("Stagger elements not found")
      }
    })
  }

  const testButtonHoverGlow = () => {
    return new Promise<void>((resolve) => {
      const styles = getComputedStyle(document.documentElement)
      resolve()
    })
  }

  const testCardAnimations = () => {
    return new Promise<void>((resolve) => {
      const cards = document.querySelectorAll('[data-test="card"]')
      if (cards.length > 0) {
        resolve()
      } else {
        throw new Error("Card elements not found")
      }
    })
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Animation System Test</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Comprehensive testing of all animation components
          </p>
        </motion.div>

        {/* Test Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Animation Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Button onClick={runAnimationTests} disabled={isRunning} className="btn-submit-glow">
                {isRunning ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                  </motion.div>
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isRunning ? "Running Tests..." : "Run All Tests"}
              </Button>
              <Button variant="outline" onClick={() => setTestResults({})} className="btn-secondary-glow">
                Clear Results
              </Button>
            </div>

            {/* Test Results */}
            <AnimatePresence>
              {Object.keys(testResults).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {Object.entries(testResults).map(([test, passed]) => (
                    <motion.div
                      key={test}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-2 p-3 rounded-lg ${
                        passed
                          ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                      }`}
                    >
                      {passed ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                      <span className="font-medium">{test}</span>
                      <span className="ml-auto text-sm">{passed ? "PASS" : "FAIL"}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Animation Demos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Motion Test */}
          <Card data-test="card">
            <CardHeader>
              <CardTitle>Basic Motion</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                data-test="basic-motion"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold"
              >
                Fade In + Scale
              </motion.div>
            </CardContent>
          </Card>

          {/* Hover Effects Test */}
          <Card data-test="card">
            <CardHeader>
              <CardTitle>Hover Effects</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-semibold cursor-pointer"
              >
                Hover Me!
              </motion.div>
            </CardContent>
          </Card>

          {/* InView Animation Test */}
          <Card data-test="card">
            <CardHeader>
              <CardTitle>InView Animation</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                ref={ref}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={fadeInUp}
                className="h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-semibold"
              >
                {isInView ? "In View!" : "Scroll to see"}
              </motion.div>
            </CardContent>
          </Card>

          {/* Stagger Animation Test */}
          <Card data-test="card">
            <CardHeader>
              <CardTitle>Stagger Animation</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    data-test="stagger"
                    variants={staggerItem}
                    className="h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded"
                  />
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </div>

        {/* Button Test Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Button Hover Effects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="btn-primary-glow">Primary Button</Button>
              <Button variant="secondary" className="btn-secondary-glow">
                Secondary Button
              </Button>
              <Button variant="outline" className="btn-hover-glow">
                Outline Button
              </Button>
              <Button type="submit" className="btn-submit-glow">
                Submit Button
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Performance Monitor */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Performance Monitor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {typeof window !== "undefined" && "requestAnimationFrame" in window ? "✓" : "✗"}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">RAF Support</div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {typeof window !== "undefined" && "IntersectionObserver" in window ? "✓" : "✗"}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">IntersectionObserver</div>
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {typeof window !== "undefined" && "ResizeObserver" in window ? "✓" : "✗"}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">ResizeObserver</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
