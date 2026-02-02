"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import { cn } from "@/lib/utils"
import {
  Receipt,
  LayoutDashboard,
  Settings,
  CircleHelp,
  MoreVertical,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
  ArrowLeft,
  ShoppingBag,
  Coffee,
  Utensils,
  Car,
  Store,
  CreditCard,
  Calendar,
  MapPin,
  Hash,
  Download,
  Share2,
  CheckCircle2,
  Landmark,
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

// Extended receipt data with item-level details
const receiptsData: Record<string, {
  id: string
  merchant: string
  merchantAddress: string
  amount: number
  tax: number
  subtotal: number
  date: string
  dateDisplay: string
  category: string
  paymentMethod: string
  cardLast4: string
  transactionId: string
  items: Array<{
    name: string
    quantity: number
    unitPrice: number
    totalPrice: number
    sku?: string
  }>
}> = {
  rcpt_001: {
    id: "rcpt_001",
    merchant: "Whole Foods Market",
    merchantAddress: "1234 Market Street, San Francisco, CA 94102",
    amount: 87.45,
    tax: 7.23,
    subtotal: 80.22,
    date: "2025-02-01",
    dateDisplay: "February 1, 2025 at 2:34 PM",
    category: "groceries",
    paymentMethod: "Visa",
    cardLast4: "4242",
    transactionId: "txn_8f7e6d5c4b3a2",
    items: [
      { name: "Organic Bananas", quantity: 1, unitPrice: 1.99, totalPrice: 1.99, sku: "SKU-001" },
      { name: "Avocados (3 pack)", quantity: 2, unitPrice: 4.99, totalPrice: 9.98, sku: "SKU-002" },
      { name: "Organic Whole Milk", quantity: 1, unitPrice: 6.49, totalPrice: 6.49, sku: "SKU-003" },
      { name: "Free Range Eggs (12)", quantity: 1, unitPrice: 7.99, totalPrice: 7.99, sku: "SKU-004" },
      { name: "Sourdough Bread", quantity: 1, unitPrice: 5.99, totalPrice: 5.99, sku: "SKU-005" },
      { name: "Organic Spinach", quantity: 2, unitPrice: 4.49, totalPrice: 8.98, sku: "SKU-006" },
      { name: "Greek Yogurt", quantity: 3, unitPrice: 2.99, totalPrice: 8.97, sku: "SKU-007" },
      { name: "Almond Butter", quantity: 1, unitPrice: 11.99, totalPrice: 11.99, sku: "SKU-008" },
      { name: "Organic Blueberries", quantity: 1, unitPrice: 6.99, totalPrice: 6.99, sku: "SKU-009" },
      { name: "Sparkling Water (6 pack)", quantity: 1, unitPrice: 5.99, totalPrice: 5.99, sku: "SKU-010" },
      { name: "Mixed Nuts", quantity: 1, unitPrice: 3.89, totalPrice: 3.89, sku: "SKU-011" },
      { name: "Dark Chocolate Bar", quantity: 1, unitPrice: 0.97, totalPrice: 0.97, sku: "SKU-012" },
    ],
  },
  rcpt_002: {
    id: "rcpt_002",
    merchant: "Starbucks",
    merchantAddress: "567 Coffee Lane, San Francisco, CA 94103",
    amount: 6.75,
    tax: 0.56,
    subtotal: 6.19,
    date: "2025-02-01",
    dateDisplay: "February 1, 2025 at 9:15 AM",
    category: "coffee",
    paymentMethod: "Apple Pay",
    cardLast4: "4242",
    transactionId: "txn_9a8b7c6d5e4f",
    items: [
      { name: "Grande Caramel Macchiato", quantity: 1, unitPrice: 5.45, totalPrice: 5.45 },
      { name: "Butter Croissant", quantity: 1, unitPrice: 0.74, totalPrice: 0.74 },
    ],
  },
  rcpt_003: {
    id: "rcpt_003",
    merchant: "Shell Gas Station",
    merchantAddress: "890 Highway 101, San Francisco, CA 94104",
    amount: 52.30,
    tax: 4.33,
    subtotal: 47.97,
    date: "2025-01-31",
    dateDisplay: "January 31, 2025 at 5:45 PM",
    category: "gas",
    paymentMethod: "Visa",
    cardLast4: "4242",
    transactionId: "txn_1b2c3d4e5f6g",
    items: [
      { name: "Regular Unleaded (12.5 gal)", quantity: 1, unitPrice: 47.97, totalPrice: 47.97 },
    ],
  },
  rcpt_004: {
    id: "rcpt_004",
    merchant: "Chipotle",
    merchantAddress: "234 Burrito Blvd, San Francisco, CA 94105",
    amount: 14.25,
    tax: 1.18,
    subtotal: 13.07,
    date: "2025-01-31",
    dateDisplay: "January 31, 2025 at 12:30 PM",
    category: "dining",
    paymentMethod: "Mastercard",
    cardLast4: "8888",
    transactionId: "txn_2c3d4e5f6g7h",
    items: [
      { name: "Chicken Burrito Bowl", quantity: 1, unitPrice: 10.50, totalPrice: 10.50 },
      { name: "Chips & Guacamole", quantity: 1, unitPrice: 2.57, totalPrice: 2.57 },
    ],
  },
  rcpt_005: {
    id: "rcpt_005",
    merchant: "Target",
    merchantAddress: "456 Shopping Center Dr, San Francisco, CA 94106",
    amount: 156.80,
    tax: 12.98,
    subtotal: 143.82,
    date: "2025-01-30",
    dateDisplay: "January 30, 2025 at 3:20 PM",
    category: "shopping",
    paymentMethod: "Visa",
    cardLast4: "4242",
    transactionId: "txn_3d4e5f6g7h8i",
    items: [
      { name: "Wireless Earbuds", quantity: 1, unitPrice: 49.99, totalPrice: 49.99, sku: "TGT-001" },
      { name: "Phone Charger Cable", quantity: 2, unitPrice: 12.99, totalPrice: 25.98, sku: "TGT-002" },
      { name: "Cotton T-Shirt", quantity: 3, unitPrice: 14.99, totalPrice: 44.97, sku: "TGT-003" },
      { name: "Hand Soap (3 pack)", quantity: 1, unitPrice: 8.99, totalPrice: 8.99, sku: "TGT-004" },
      { name: "Notebook Set", quantity: 1, unitPrice: 6.99, totalPrice: 6.99, sku: "TGT-005" },
      { name: "Snack Bars (12 pack)", quantity: 1, unitPrice: 5.99, totalPrice: 5.99, sku: "TGT-006" },
      { name: "Water Bottle", quantity: 1, unitPrice: 0.91, totalPrice: 0.91, sku: "TGT-007" },
    ],
  },
  rcpt_006: {
    id: "rcpt_006",
    merchant: "Trader Joe's",
    merchantAddress: "789 Grocery Ave, San Francisco, CA 94107",
    amount: 68.92,
    tax: 5.70,
    subtotal: 63.22,
    date: "2025-01-29",
    dateDisplay: "January 29, 2025 at 6:15 PM",
    category: "groceries",
    paymentMethod: "Visa",
    cardLast4: "4242",
    transactionId: "txn_4e5f6g7h8i9j",
    items: [
      { name: "Everything But The Bagel", quantity: 1, unitPrice: 2.99, totalPrice: 2.99 },
      { name: "Mandarin Orange Chicken", quantity: 2, unitPrice: 4.99, totalPrice: 9.98 },
      { name: "Cauliflower Gnocchi", quantity: 2, unitPrice: 2.99, totalPrice: 5.98 },
      { name: "Dark Chocolate Peanut Butter Cups", quantity: 1, unitPrice: 4.49, totalPrice: 4.49 },
      { name: "Organic Pasta Sauce", quantity: 2, unitPrice: 3.49, totalPrice: 6.98 },
      { name: "Cheese Crunchies", quantity: 1, unitPrice: 2.49, totalPrice: 2.49 },
      { name: "Triple Ginger Snaps", quantity: 1, unitPrice: 3.99, totalPrice: 3.99 },
      { name: "Organic Brown Rice", quantity: 1, unitPrice: 3.49, totalPrice: 3.49 },
      { name: "Frozen Mango Chunks", quantity: 1, unitPrice: 2.99, totalPrice: 2.99 },
      { name: "Almond Milk", quantity: 2, unitPrice: 3.29, totalPrice: 6.58 },
      { name: "Vegetable Fried Rice", quantity: 2, unitPrice: 3.49, totalPrice: 6.98 },
      { name: "Cookie Butter", quantity: 1, unitPrice: 3.79, totalPrice: 3.79 },
      { name: "Pita Chips", quantity: 1, unitPrice: 2.49, totalPrice: 2.49 },
    ],
  },
  rcpt_007: {
    id: "rcpt_007",
    merchant: "Panera Bread",
    merchantAddress: "321 Bakery Way, San Francisco, CA 94108",
    amount: 18.45,
    tax: 1.53,
    subtotal: 16.92,
    date: "2025-01-29",
    dateDisplay: "January 29, 2025 at 12:00 PM",
    category: "dining",
    paymentMethod: "Apple Pay",
    cardLast4: "4242",
    transactionId: "txn_5f6g7h8i9j0k",
    items: [
      { name: "Broccoli Cheddar Soup (Bowl)", quantity: 1, unitPrice: 8.49, totalPrice: 8.49 },
      { name: "Half Caesar Salad", quantity: 1, unitPrice: 8.43, totalPrice: 8.43 },
    ],
  },
  rcpt_008: {
    id: "rcpt_008",
    merchant: "Costco",
    merchantAddress: "1000 Warehouse Blvd, San Francisco, CA 94109",
    amount: 234.56,
    tax: 19.42,
    subtotal: 215.14,
    date: "2025-01-28",
    dateDisplay: "January 28, 2025 at 2:30 PM",
    category: "shopping",
    paymentMethod: "Costco Visa",
    cardLast4: "1234",
    transactionId: "txn_6g7h8i9j0k1l",
    items: [
      { name: "Kirkland Paper Towels (12 pack)", quantity: 1, unitPrice: 24.99, totalPrice: 24.99 },
      { name: "Rotisserie Chicken", quantity: 2, unitPrice: 4.99, totalPrice: 9.98 },
      { name: "Kirkland Olive Oil (2L)", quantity: 1, unitPrice: 16.99, totalPrice: 16.99 },
      { name: "Mixed Berries (4 lb)", quantity: 1, unitPrice: 12.99, totalPrice: 12.99 },
      { name: "Croissants (12 pack)", quantity: 1, unitPrice: 5.99, totalPrice: 5.99 },
      { name: "Organic Ground Beef (4 lb)", quantity: 1, unitPrice: 28.99, totalPrice: 28.99 },
      { name: "Kirkland Bacon (4 pack)", quantity: 1, unitPrice: 18.99, totalPrice: 18.99 },
      { name: "Laundry Detergent", quantity: 1, unitPrice: 22.99, totalPrice: 22.99 },
      { name: "Dishwasher Pods (115 ct)", quantity: 1, unitPrice: 19.99, totalPrice: 19.99 },
      { name: "Kirkland Coffee Beans (2.5 lb)", quantity: 1, unitPrice: 14.99, totalPrice: 14.99 },
      { name: "Greek Yogurt (24 pack)", quantity: 1, unitPrice: 8.99, totalPrice: 8.99 },
      { name: "Organic Eggs (24 ct)", quantity: 1, unitPrice: 29.26, totalPrice: 29.26 },
    ],
  },
  rcpt_009: {
    id: "rcpt_009",
    merchant: "Starbucks",
    merchantAddress: "567 Coffee Lane, San Francisco, CA 94103",
    amount: 5.95,
    tax: 0.49,
    subtotal: 5.46,
    date: "2025-01-28",
    dateDisplay: "January 28, 2025 at 8:45 AM",
    category: "coffee",
    paymentMethod: "Apple Pay",
    cardLast4: "4242",
    transactionId: "txn_7h8i9j0k1l2m",
    items: [
      { name: "Grande Pike Place Roast", quantity: 1, unitPrice: 3.45, totalPrice: 3.45 },
      { name: "Blueberry Muffin", quantity: 1, unitPrice: 2.01, totalPrice: 2.01 },
    ],
  },
  rcpt_010: {
    id: "rcpt_010",
    merchant: "Chevron",
    merchantAddress: "555 Gas Station Rd, San Francisco, CA 94110",
    amount: 48.75,
    tax: 4.03,
    subtotal: 44.72,
    date: "2025-01-27",
    dateDisplay: "January 27, 2025 at 4:20 PM",
    category: "gas",
    paymentMethod: "Visa",
    cardLast4: "4242",
    transactionId: "txn_8i9j0k1l2m3n",
    items: [
      { name: "Premium Unleaded (11.2 gal)", quantity: 1, unitPrice: 44.72, totalPrice: 44.72 },
    ],
  },
  rcpt_011: {
    id: "rcpt_011",
    merchant: "Amazon Fresh",
    merchantAddress: "Online Order - Delivered",
    amount: 112.34,
    tax: 9.30,
    subtotal: 103.04,
    date: "2025-01-26",
    dateDisplay: "January 26, 2025 at 10:00 AM",
    category: "groceries",
    paymentMethod: "Amazon Visa",
    cardLast4: "5678",
    transactionId: "txn_9j0k1l2m3n4o",
    items: [
      { name: "Organic Chicken Breast (2 lb)", quantity: 2, unitPrice: 12.99, totalPrice: 25.98 },
      { name: "Fresh Salmon Fillet (1 lb)", quantity: 1, unitPrice: 14.99, totalPrice: 14.99 },
      { name: "Organic Mixed Greens", quantity: 2, unitPrice: 5.99, totalPrice: 11.98 },
      { name: "Cherry Tomatoes", quantity: 2, unitPrice: 4.49, totalPrice: 8.98 },
      { name: "Avocados (6 pack)", quantity: 1, unitPrice: 7.99, totalPrice: 7.99 },
      { name: "Organic Strawberries", quantity: 1, unitPrice: 6.99, totalPrice: 6.99 },
      { name: "Almond Milk (64 oz)", quantity: 2, unitPrice: 4.29, totalPrice: 8.58 },
      { name: "Whole Wheat Bread", quantity: 1, unitPrice: 4.49, totalPrice: 4.49 },
      { name: "Organic Hummus", quantity: 2, unitPrice: 3.99, totalPrice: 7.98 },
      { name: "Sparkling Water (12 pack)", quantity: 1, unitPrice: 5.08, totalPrice: 5.08 },
    ],
  },
  rcpt_012: {
    id: "rcpt_012",
    merchant: "McDonald's",
    merchantAddress: "888 Fast Food Ave, San Francisco, CA 94111",
    amount: 12.89,
    tax: 1.07,
    subtotal: 11.82,
    date: "2025-01-25",
    dateDisplay: "January 25, 2025 at 7:30 PM",
    category: "dining",
    paymentMethod: "Mastercard",
    cardLast4: "8888",
    transactionId: "txn_0k1l2m3n4o5p",
    items: [
      { name: "Big Mac", quantity: 1, unitPrice: 5.99, totalPrice: 5.99 },
      { name: "Medium Fries", quantity: 1, unitPrice: 2.79, totalPrice: 2.79 },
      { name: "Medium Coke", quantity: 1, unitPrice: 1.89, totalPrice: 1.89 },
      { name: "Apple Pie", quantity: 1, unitPrice: 1.15, totalPrice: 1.15 },
    ],
  },
}

const mainNavItems = [
  { name: "Home", href: "/consumer", icon: LayoutDashboard },
  { name: "Receipts", href: "/consumer/receipts", icon: Receipt },
  { name: "Accounts", href: "/consumer/accounts", icon: Landmark },
]

const bottomNavItems = [
  { name: "Settings", href: "/consumer/settings", icon: Settings },
  { name: "Get Help", href: "/contact", icon: CircleHelp },
]

export default function ReceiptDetailPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const params = useParams()
  const receiptId = params.id as string
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const receipt = receiptsData[receiptId]

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
      router.push(`/auth/login?returnTo=/consumer/receipts/${receiptId}`)
    }
  }, [user, isLoading, router, receiptId])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "groceries":
        return ShoppingBag
      case "coffee":
        return Coffee
      case "dining":
        return Utensils
      case "gas":
        return Car
      case "shopping":
        return Store
      default:
        return Receipt
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "groceries":
        return "bg-green-100 text-green-700"
      case "coffee":
        return "bg-amber-100 text-amber-700"
      case "dining":
        return "bg-orange-100 text-orange-700"
      case "gas":
        return "bg-blue-100 text-blue-700"
      case "shopping":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
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

  if (!receipt) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-[var(--muted)]">
            <Receipt className="h-8 w-8 text-[var(--muted-foreground)]" />
          </div>
          <h2 className="mt-4 text-lg font-medium">Receipt not found</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            The receipt you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/consumer/receipts"
            className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--primary)] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Receipts
          </Link>
        </div>
      </div>
    )
  }

  const CategoryIcon = getCategoryIcon(receipt.category)

  return (
    <div className="flex min-h-screen w-full bg-white overflow-x-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "hidden flex-col border-r border-[var(--border)] lg:flex transition-all duration-300 sticky top-0 h-screen",
        sidebarCollapsed ? "w-[60px]" : "w-[240px]"
      )}>
        {/* Logo */}
        <div className="flex h-14 items-center px-4">
          <Link href="/consumer">
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
                item.name === "Receipts"
                  ? "bg-[var(--muted)] font-medium text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
                sidebarCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && item.name}
            </Link>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-[var(--border)] px-3 py-2">
          {bottomNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              title={sidebarCollapsed ? item.name : undefined}
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
            <Link
              href="/consumer/receipts"
              className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Receipts</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center gap-2 rounded-md p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="flex items-center justify-center gap-2 rounded-md p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              <Download className="h-4 w-4" />
            </button>
          </div>
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
                      item.name === "Receipts"
                        ? "bg-[var(--muted)] font-medium text-[var(--foreground)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Bottom Navigation */}
              <div className="py-4 border-t border-[var(--border)]">
                {bottomNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
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
          <div className="mx-auto max-w-3xl space-y-6 w-full">
            {/* Receipt Header */}
            <div className="rounded-lg border border-[var(--border)] overflow-hidden">
              <div className="bg-gradient-to-r from-[var(--primary)]/5 to-transparent p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full",
                    getCategoryColor(receipt.category)
                  )}>
                    <CategoryIcon className="h-7 w-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h1 className="text-xl font-semibold">{receipt.merchant}</h1>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={cn("capitalize", getCategoryColor(receipt.category))}>
                            {receipt.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">Verified</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-2xl font-bold">${receipt.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Receipt Meta Info */}
              <div className="border-t border-[var(--border)] p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">Date & Time</p>
                    <p className="text-sm font-medium">{receipt.dateDisplay}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">Payment Method</p>
                    <p className="text-sm font-medium">{receipt.paymentMethod} •••• {receipt.cardLast4}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">Location</p>
                    <p className="text-sm font-medium">{receipt.merchantAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">Transaction ID</p>
                    <p className="text-sm font-medium font-mono">{receipt.transactionId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
                <h2 className="font-semibold">Items ({receipt.items.length})</h2>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {receipt.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 sm:px-6">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {item.quantity > 1 ? `${item.quantity} × $${item.unitPrice.toFixed(2)}` : `$${item.unitPrice.toFixed(2)}`}
                        </p>
                        {item.sku && (
                          <span className="text-xs text-[var(--muted-foreground)] font-mono">
                            {item.sku}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="font-semibold ml-4">${item.totalPrice.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="p-4 sm:p-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Subtotal</span>
                  <span>${receipt.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Tax</span>
                  <span>${receipt.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">${receipt.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Digital Receipt Notice */}
            <div className="rounded-lg bg-[var(--muted)]/50 p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)]">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Digital receipt delivered via Vero</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
