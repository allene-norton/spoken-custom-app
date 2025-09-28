"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function ComingSoon() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email subscription logic here
    setIsSubscribed(true)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Logo/Brand Section */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Podcast Network Dashboard</h1>
          <p className="text-xl text-muted-foreground text-pretty">Exciting Features Coming Soon!</p>
        </div>

        {/* Main Content */}
        <Card className="border-2 border-primary/20">
          <CardContent className="p-8 space-y-6">
            {/* Illustration/Icon */}
            <div className="flex justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19c-5 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 9a3 3 0 016 0v5a3 3 0 01-6 0V9z"
                  />
                </svg>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">We're Building Something Amazing</h2>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                We're working hard to bring you powerful tools to manage your podcasts effortlessly. Our comprehensive
                dashboard will help you track analytics, manage episodes, and grow your audience with professional-grade
                features designed for podcast networks.
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-4 py-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-foreground">Analytics</h3>
                <p className="text-sm text-muted-foreground">Detailed insights and metrics</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg mx-auto flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-foreground">Management</h3>
                <p className="text-sm text-muted-foreground">Easy episode and content control</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-accent/10 rounded-lg mx-auto flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-foreground">Growth</h3>
                <p className="text-sm text-muted-foreground">Tools to expand your reach</p>
              </div>
            </div>

            {/* Email Subscription */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Stay Updated!</h3>
              {isSubscribed ? (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-primary font-medium">Thank you for subscribing!</p>
                  <p className="text-sm text-muted-foreground mt-1">We'll notify you when the dashboard is ready.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="submit" className="px-6">
                    Notify Me
                  </Button>
                </form>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Questions? Contact us at{" "}
            <a href="mailto:support@example.com" className="text-primary hover:underline">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
