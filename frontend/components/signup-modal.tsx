"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { UserPlus, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signup } = useAuth()

  const validateForm = () => {
    if (!name.trim()) {
      setError("Name is required")
      return false
    }

    if (!email.trim()) {
      setError("Email is required")
      return false
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    const result = await signup(name, email, password)

    if (result.success) {
      onClose()
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
    } else {
      setError(result.error || "Failed to create account")
    }

    setIsLoading(false)
  }

  const handleSwitchToLogin = () => {
    setName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setError("")
    onSwitchToLogin()
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" }
    if (password.length < 6) return { strength: 1, label: "Too short", color: "text-red-500" }
    if (password.length < 8) return { strength: 2, label: "Weak", color: "text-orange-500" }
    if (password.length < 12) return { strength: 3, label: "Good", color: "text-yellow-500" }
    return { strength: 4, label: "Strong", color: "text-green-500" }
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create Account
          </DialogTitle>
          <DialogDescription>Join our community of conscious consumers</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {password && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex-1 bg-gray-200 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      passwordStrength.strength === 1
                        ? "w-1/4 bg-red-500"
                        : passwordStrength.strength === 2
                          ? "w-2/4 bg-orange-500"
                          : passwordStrength.strength === 3
                            ? "w-3/4 bg-yellow-500"
                            : passwordStrength.strength === 4
                              ? "w-full bg-green-500"
                              : "w-0"
                    }`}
                  />
                </div>
                <span className={passwordStrength.color}>{passwordStrength.label}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <div className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-3 w-3" />
                Passwords do not match
              </div>
            )}
            {confirmPassword && password === confirmPassword && password.length >= 6 && (
              <div className="flex items-center gap-1 text-sm text-green-500">
                <CheckCircle className="h-3 w-3" />
                Passwords match
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleSwitchToLogin}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Why create an account?</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-600 space-y-1">
            <div>• Save your favorite ethical brands</div>
            <div>• Get personalized recommendations</div>
            <div>• Track your sustainable shopping journey</div>
            <div>• Stay updated on ESG news</div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
