"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VeroLogoFull } from "@/components/ui/vero-logo"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const success = await login(username, password)

    if (success) {
      router.push("/dashboard")
    } else {
      setError("Invalid username or password")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--muted)] p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <Link href="/" className="flex items-center justify-center mb-4">
                <VeroLogoFull height={32} className="text-[var(--foreground)]" />
              </Link>
              <CardTitle className="text-xl">Merchant Dashboard</CardTitle>
              <CardDescription>
                Sign in to manage your receipts and payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  {error && (
                    <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="#"
                        className="ml-auto text-sm text-[var(--primary)] hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </form>
              <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
                <p>Demo credentials:</p>
                <p className="font-mono text-xs mt-1">
                  Username: <span className="text-[var(--foreground)]">vero</span> | Password: <span className="text-[var(--foreground)]">receipts</span>
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-[var(--muted-foreground)]">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-[var(--primary)]">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-[var(--primary)]">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  )
}
