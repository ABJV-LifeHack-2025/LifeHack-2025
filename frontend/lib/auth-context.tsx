"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  toggleFavorite: (brandId: string) => void
  isFavorite: (brandId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database for demo
const mockUsers: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    name: "Demo User",
    favorites: ["6", "5"], // Patagonia and Apple as initial favorites
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(mockUsers)

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem("user")
    const savedUsers = localStorage.getItem("users")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Mock login - in real app, this would call an API
    const foundUser = users.find((u) => u.email === email)

    if (!foundUser) {
      return { success: false, error: "No account found with this email address" }
    }

    // In a real app, you'd verify the password hash
    if (email === "demo@example.com" && password === "password") {
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))
      return { success: true }
    }

    // For demo purposes, accept any password for registered users
    if (foundUser && password.length >= 6) {
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))
      return { success: true }
    }

    return { success: false, error: "Invalid password" }
  }

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    // Validate input
    if (!name.trim()) {
      return { success: false, error: "Name is required" }
    }

    if (!email.trim()) {
      return { success: false, error: "Email is required" }
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" }
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return { success: false, error: "An account with this email already exists" }
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      name: name.trim(),
      favorites: [],
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    setUser(newUser)

    // Save to localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    localStorage.setItem("user", JSON.stringify(newUser))

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const toggleFavorite = (brandId: string) => {
    if (!user) return

    const updatedUser = {
      ...user,
      favorites: user.favorites.includes(brandId)
        ? user.favorites.filter((id) => id !== brandId)
        : [...user.favorites, brandId],
    }

    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))

    // Update users array
    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))
  }

  const isFavorite = (brandId: string): boolean => {
    return user?.favorites.includes(brandId) || false
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
