"use client"

import { useCallback, useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import { cn } from "@/lib/utils"
import {
  Receipt,
  LayoutDashboard,
  Settings,
  CircleHelp,
  Search,
  MoreVertical,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
  Gift,
  Copy,
  Check,
  ShoppingBag,
  Coffee,
  Utensils,
  Car,
  Zap,
  Store,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Landmark,
  Plus,
  CreditCard,
  CheckCircle2,
  Circle,
  FileText,
  Loader2,
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
import { PlaidLinkButton } from "@/components/plaid-link-button"
import {
  createLinkToken,
  exchangePublicToken,
  fetchPlaidAccounts,
  type PlaidAccount,
} from "@/lib/plaid"
import {
  fetchTransactions,
  transactionDisplayName,
  type Transaction,
} from "@/lib/transactions"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

// Sample receipts shown in the "Recent Transactions" card while we're still
// loading or before the user has connected an account. Once /api/transactions
// returns rows, this fallback is replaced by real data.
const recentReceipts = [
  {
    id: "rcpt_001",
    merchant: "Whole Foods Market",
    amount: 87.45,
    date: "Today, 2:34 PM",
    category: "groceries",
    items: 12,
  },
  {
    id: "rcpt_002",
    merchant: "Starbucks",
    amount: 6.75,
    date: "Today, 9:15 AM",
    category: "coffee",
    items: 2,
  },
  {
    id: "rcpt_003",
    merchant: "Shell Gas Station",
    amount: 52.30,
    date: "Yesterday, 5:45 PM",
    category: "gas",
    items: 1,
  },
  {
    id: "rcpt_004",
    merchant: "Chipotle",
    amount: 14.25,
    date: "Yesterday, 12:30 PM",
    category: "dining",
    items: 3,
  },
  {
    id: "rcpt_005",
    merchant: "Target",
    amount: 156.80,
    date: "Jan 30, 3:20 PM",
    category: "shopping",
    items: 8,
  },
]

