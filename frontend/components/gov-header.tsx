"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, Shield, User } from "lucide-react"

export function GovHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-border bg-card">
      {/* Top Bar - Saffron accent */}
      <div className="h-2 bg-secondary" />
      
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Left - Emblem and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-primary leading-tight">
                Government of India
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Ministry of Electronics &amp; Information Technology
              </p>
              <p className="text-xs text-secondary font-medium">
                Requirements Analysis Portal
              </p>
            </div>
          </div>

          {/* Right - User info and logout */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <User className="w-4 h-4" />
                  {user.name}
                </div>
                <p className="text-xs text-muted-foreground">{user.department}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar - Navy accent */}
      <div className="h-1 bg-primary" />
    </header>
  )
}
