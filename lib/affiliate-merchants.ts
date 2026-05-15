export type MerchantStatus = "in_network" | "prospect" | "pending"

export type AffiliateMerchant = {
  id: string
  name: string
  category: string
  address: string
  city: string
  state: string
  zip: string
  posSystem: string
  status: MerchantStatus
  estimatedValue: number
  reward: number
  monthlyTransactions: number
  /** ISO date string, only set when status === "in_network". */
  signedUpAt?: string
  /** Affiliate handle credited with the signup. */
  signedUpBy?: string
  contactEmail?: string
  contactPhone?: string
  notes?: string
}

export const affiliateMerchants: AffiliateMerchant[] = [
  {
    id: "mer_001",
    name: "Sunrise Coffee Co.",
    category: "Coffee Shop",
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    posSystem: "Square",
    status: "in_network",
    estimatedValue: 4800,
    reward: 240,
    monthlyTransactions: 3200,
    signedUpAt: "2026-03-12",
    signedUpBy: "you",
    contactEmail: "hello@sunrisecoffee.com",
    contactPhone: "(415) 555-0123",
  },
  {
    id: "mer_002",
    name: "Bay Bites Burgers",
    category: "Quick Service Restaurant",
    address: "742 Embarcadero",
    city: "San Francisco",
    state: "CA",
    zip: "94111",
    posSystem: "Toast",
    status: "prospect",
    estimatedValue: 7200,
    reward: 360,
    monthlyTransactions: 5400,
    contactEmail: "owner@baybitesburgers.com",
    contactPhone: "(415) 555-0188",
    notes: "Owner expressed interest at the May SF food expo. Follow up next week.",
  },
  {
    id: "mer_003",
    name: "Northgate Books",
    category: "Specialty Retail",
    address: "1290 Solano Ave",
    city: "Berkeley",
    state: "CA",
    zip: "94706",
    posSystem: "Lightspeed",
    status: "prospect",
    estimatedValue: 2400,
    reward: 120,
    monthlyTransactions: 1100,
    contactEmail: "manager@northgatebooks.com",
  },
  {
    id: "mer_004",
    name: "Pacific Pet Supply",
    category: "Specialty Retail",
    address: "55 Marina Blvd",
    city: "San Francisco",
    state: "CA",
    zip: "94123",
    posSystem: "Square",
    status: "pending",
    estimatedValue: 3600,
    reward: 180,
    monthlyTransactions: 2150,
    contactEmail: "info@pacificpet.com",
    notes: "Signed onboarding agreement — waiting on POS technician to finish install.",
  },
  {
    id: "mer_005",
    name: "Highline Wine Bar",
    category: "Bar & Lounge",
    address: "412 Hayes Street",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    posSystem: "Clover",
    status: "in_network",
    estimatedValue: 5400,
    reward: 270,
    monthlyTransactions: 2900,
    signedUpAt: "2026-02-04",
    signedUpBy: "you",
    contactEmail: "team@highlinewine.com",
  },
  {
    id: "mer_006",
    name: "Cedar & Stone Yoga",
    category: "Health & Fitness",
    address: "318 Valencia St",
    city: "San Francisco",
    state: "CA",
    zip: "94103",
    posSystem: "Mindbody",
    status: "prospect",
    estimatedValue: 1800,
    reward: 90,
    monthlyTransactions: 720,
    contactEmail: "studio@cedarstoneyoga.com",
  },
  {
    id: "mer_007",
    name: "Mission Hardware",
    category: "Home & Hardware",
    address: "2401 Mission St",
    city: "San Francisco",
    state: "CA",
    zip: "94110",
    posSystem: "Square",
    status: "prospect",
    estimatedValue: 6000,
    reward: 300,
    monthlyTransactions: 3800,
    contactEmail: "frontdesk@missionhardware.com",
    notes: "Family-owned for 32 years. Decision-maker is the owner's daughter.",
  },
  {
    id: "mer_008",
    name: "Foglight Florist",
    category: "Specialty Retail",
    address: "1872 Polk St",
    city: "San Francisco",
    state: "CA",
    zip: "94109",
    posSystem: "Shopify POS",
    status: "in_network",
    estimatedValue: 2100,
    reward: 105,
    monthlyTransactions: 980,
    signedUpAt: "2026-04-22",
    signedUpBy: "you",
    contactEmail: "orders@foglightflorist.com",
  },
]

export function getMerchantById(id: string): AffiliateMerchant | undefined {
  return affiliateMerchants.find((m) => m.id === id)
}
