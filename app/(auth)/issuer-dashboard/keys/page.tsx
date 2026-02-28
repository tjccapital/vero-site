"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import { cn } from "@/lib/utils"
import {
  Receipt,
  LayoutDashboard,
  Users,
  Key,
  Settings,
  CircleHelp,
  Search,
  MoreVertical,
  Code,
  FileBarChart,
  MoreHorizontal,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
} from "lucide-react"
import { VeroLogo, VeroLogoFull } from "@/components/ui/vero-logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Sample API keys data
const apiKeysData = [
  {
    id: "key_001",
    name: "Production API Key",
    prefix: "vero_live_",
    lastChars: "x4Kp",
    created: "2024-09-15",
    lastUsed: "2 minutes ago",
    status: "active",
    permissions: ["receipts:write", "receipts:read", "users:read"],
  },
  {
    id: "key_002",
    name: "Development API Key",
    prefix: "vero_test_",
    lastChars: "m9Qr",
    created: "2024-11-01",
    lastUsed: "3 days ago",
    status: "active",
    permissions: ["receipts:write", "receipts:read"],
  },
  {
    id: "key_003",
    name: "Analytics Integration",
    prefix: "vero_live_",
    lastChars: "j2Ws",
    created: "2024-08-20",
    lastUsed: "1 week ago",
    status: "active",
    permissions: ["receipts:read"],
  },
]

const DOCS_URL = "https://docs.veroreceipts.com"

const mainNavItems = [
  { name: "Overview", href: "/issuer-dashboard", icon: LayoutDashboard },
  { name: "Receipts", href: "/issuer-dashboard/receipts", icon: Receipt },
  { name: "Users", href: "/issuer-dashboard/users", icon: Users },
  { name: "API Keys", href: "/issuer-dashboard/keys", icon: Key, active: true },
]

const documentNavItems = [
  { name: "API Docs", href: DOCS_URL, icon: Code, external: true },
  { name: "Reports", href: DOCS_URL, icon: FileBarChart, external: true },
  { name: "More", href: DOCS_URL, icon: MoreHorizontal, external: true },
]

const bottomNavItems = [
  { name: "Settings", href: "/issuer-dashboard/settings", icon: Settings },
  { name: "Get Help", href: "/contact", icon: CircleHelp },
  { name: "Search", href: DOCS_URL, icon: Search, external: true },
]

export default function IssuerKeysPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRegenerateModal, setShowRegenerateModal] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [newKeyName, setNewKeyName] = useState("")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [showNewKey, setShowNewKey] = useState(false)
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login?returnTo=/issuer-dashboard/keys")
    }
  }, [user, isLoading, router])

  const handleCopyKey = (keyId: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(keyId)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleCreateKey = () => {
    // In a real app, this would make an API call
    const newKey = `vero_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    setGeneratedKey(newKey)
    setShowNewKey(true)
    setShowCreateModal(false)
    setNewKeyName("")
  }

  const handleRegenerateKey = (keyId: string) => {
    // In a real app, this would make an API call
    const newKey = `vero_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    setGeneratedKey(newKey)
    setShowNewKey(true)
    setShowRegenerateModal(null)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <VeroLogo size={48} spinning className="text-[var(--primary)]" />
          <p className="text-sm text-[var(--muted-foreground)]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "hidden flex-col border-r border-[var(--border)] lg:flex transition-all duration-300 h-full",
        sidebarCollapsed ? "w-[60px]" : "w-[240px]"
      )}>
        {/* Logo */}
        <div className="flex h-14 items-center px-4">
          <Link href="/issuer-dashboard">
            {!sidebarCollapsed && <VeroLogoFull height={20} className="text-[var(--foreground)]" />}
            {sidebarCollapsed && <VeroLogo size={20} className="text-[var(--foreground)]" />}
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {mainNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              title={sidebarCollapsed ? item.name : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                item.active
                  ? "bg-[var(--muted)] font-medium text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
                sidebarCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && item.name}
            </Link>
          ))}

          {/* Documents Section */}
          {!sidebarCollapsed && (
            <div className="pt-4">
              <p className="px-3 py-2 text-xs font-medium text-[var(--muted-foreground)]">
                Resources
              </p>
              {documentNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          )}
          {sidebarCollapsed && (
            <div className="pt-4 space-y-1">
              {documentNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  title={item.name}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center justify-center rounded-md px-2 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <item.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-[var(--border)] px-3 py-2">
          {bottomNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              title={sidebarCollapsed ? item.name : undefined}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
                sidebarCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && item.name}
            </Link>
          ))}
        </div>

        {/* User Profile */}
        <div className="border-t border-[var(--border)] p-3">
          {sidebarCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center justify-center" title={user.email || user.name || "User"}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.picture || undefined} alt={user.name || "User"} />
                    <AvatarFallback className="bg-[var(--muted)] text-sm">
                      {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild className="text-red-600">
                  <a href="/auth/logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.picture || undefined} alt={user.name || "User"} />
                <AvatarFallback className="bg-[var(--muted)] text-sm">
                  {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden" title={user.email || undefined}>
                <p className="truncate text-sm font-medium">{user.name || "User"}</p>
                <p className="truncate text-xs text-[var(--muted-foreground)]">{user.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-md p-1 hover:bg-[var(--muted)]">
                    <MoreVertical className="h-4 w-4 text-[var(--muted-foreground)]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild className="text-red-600">
                    <a href="/auth/logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b border-[var(--border)] px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center rounded-md p-1.5 hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            {/* Desktop sidebar toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center rounded-md p-1.5 hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
            <span className="text-sm font-medium">API Keys</span>
          </div>
          <Link href="/issuer-dashboard" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            Back to Dashboard
          </Link>
        </header>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-14 z-50 bg-white overflow-y-auto">
            <div className="px-4 py-4">
              {/* User Profile at top */}
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.picture || undefined} alt={user.name || "User"} />
                  <AvatarFallback className="bg-[var(--muted)] text-sm">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden" title={user.email || undefined}>
                  <p className="truncate text-sm font-medium">{user.name || "User"}</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">{user.email}</p>
                </div>
              </div>

              {/* Main Navigation */}
              <nav className="py-4 space-y-1">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors",
                      item.active
                        ? "bg-[var(--muted)] font-medium text-[var(--foreground)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Documents Section */}
              <div className="py-4 border-t border-[var(--border)]">
                <p className="px-3 py-2 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
                  Resources
                </p>
                {documentNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => !item.external && setMobileMenuOpen(false)}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Bottom Navigation */}
              <div className="py-4 border-t border-[var(--border)]">
                {bottomNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => !item.external && setMobileMenuOpen(false)}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Logout */}
              <div className="pt-4 border-t border-[var(--border)]">
                <a
                  href="/auth/logout"
                  className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  Log out
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6 w-full">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">API Keys</h1>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Manage your API keys for receipt integration
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create API Key
              </button>
            </div>

            {/* New Key Alert */}
            {showNewKey && generatedKey && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-green-800">API Key Generated</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Copy your new API key now. You won&apos;t be able to see it again.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <code className="flex-1 rounded-md bg-white border border-green-200 px-3 py-2 font-mono text-sm break-all">
                        {generatedKey}
                      </code>
                      <button
                        onClick={() => handleCopyKey("new", generatedKey)}
                        className="flex h-9 items-center gap-2 rounded-md border border-green-300 bg-white px-3 text-sm hover:bg-green-50"
                      >
                        {copiedKey === "new" ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setShowNewKey(false)
                        setGeneratedKey(null)
                      }}
                      className="mt-3 text-sm text-green-700 hover:text-green-800 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* API Keys Table */}
            <div className="rounded-lg border border-[var(--border)]">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Key</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Last Used</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeysData.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4 text-[var(--muted-foreground)] hidden sm:block" />
                          <span className="font-medium text-sm">{apiKey.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <code className="rounded bg-[var(--muted)] px-2 py-1 font-mono text-xs">
                          {apiKey.prefix}...{apiKey.lastChars}
                        </code>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[var(--muted-foreground)] hidden lg:table-cell">
                        {apiKey.lastUsed}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => setShowRegenerateModal(apiKey.id)}
                            className="flex h-8 items-center gap-1.5 rounded-md border border-[var(--border)] px-2 text-sm hover:bg-[var(--muted)]"
                            title="Regenerate key"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Regenerate</span>
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(apiKey.id)}
                            className="flex h-8 items-center gap-1.5 rounded-md border border-red-200 px-2 text-sm text-red-600 hover:bg-red-50"
                            title="Delete key"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </div>

            {/* Security Best Practices */}
            <div className="rounded-lg border border-[var(--border)] p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-[var(--primary)] mt-0.5" />
                <div>
                  <h3 className="font-semibold">Security Best Practices</h3>
                  <ul className="mt-2 space-y-2 text-sm text-[var(--muted-foreground)]">
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--primary)]">•</span>
                      <span>Never share your API keys or commit them to version control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--primary)]">•</span>
                      <span>Use environment variables to store API keys in your applications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--primary)]">•</span>
                      <span>Rotate your keys periodically and whenever team members leave</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--primary)]">•</span>
                      <span>Use separate keys for development and production environments</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Documentation Link */}
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Need help integrating?</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Check out our API documentation for code examples and integration guides.
                  </p>
                </div>
                <Link
                  href={DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors"
                >
                  <Code className="h-4 w-4" />
                  View Docs
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 mx-4">
            <h2 className="text-lg font-semibold">Create API Key</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Give your API key a name to help identify its purpose.
            </p>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1.5">Key Name</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production API Key"
                className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewKeyName("")
                }}
                className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                disabled={!newKeyName.trim()}
                className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regenerate Key Modal */}
      {showRegenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 mx-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Regenerate API Key</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  This will invalidate the current key and generate a new one. Any applications using the current key will stop working.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowRegenerateModal(null)}
                className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRegenerateKey(showRegenerateModal)}
                className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700"
              >
                Regenerate Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Key Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 mx-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Delete API Key</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Are you sure you want to delete this API key? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)]"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
