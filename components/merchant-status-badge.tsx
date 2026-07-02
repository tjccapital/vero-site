import { Badge } from "@/components/ui/badge"
import { Check, Clock, TrendingUp } from "lucide-react"

// Network-status badge for a catalog merchant, shared by the affiliate merchant
// detail page and the transaction "Merchant" card so they stay visually in sync.
export function MerchantStatusBadge({ status }: { status: string }) {
  if (status === "in_network") {
    return (
      <Badge variant="outline" className="gap-1 border-green-200 bg-green-50 text-green-700">
        <Check className="h-3 w-3" />
        In network
      </Badge>
    )
  }
  if (status === "pending") {
    return (
      <Badge variant="outline" className="gap-1 border-yellow-200 bg-yellow-50 text-yellow-700">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="gap-1 border-blue-200 bg-blue-50 text-blue-700">
      <TrendingUp className="h-3 w-3" />
      Prospect
    </Badge>
  )
}
