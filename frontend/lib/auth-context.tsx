"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  department: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for the portal
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "admin@gov.in": {
    password: "admin123",
    user: {
      id: "1",
      name: "Dr. Rajesh Kumar",
      email: "admin@gov.in",
      department: "Ministry of Electronics & IT",
      role: "System Administrator"
    }
  },
  "officer@gov.in": {
    password: "officer123",
    user: {
      id: "2",
      name: "Priya Sharma",
      email: "officer@gov.in",
      department: "National Informatics Centre",
      role: "Technical Officer"
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const stored = sessionStorage.getItem("gov_user")
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const demoUser = DEMO_USERS[email.toLowerCase()]
    if (demoUser && demoUser.password === password) {
      setUser(demoUser.user)
      sessionStorage.setItem("gov_user", JSON.stringify(demoUser.user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem("gov_user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
