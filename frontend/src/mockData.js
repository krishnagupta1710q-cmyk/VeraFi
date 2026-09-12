/**
 * VeraFi Mock Datasets
 * Pre-loaded data for offline demo, test runs, and judge pitches.
 */

export const SAMPLE_DATASETS = {
  kirana_store: {
    id: "sample_kirana",
    merchant_name: "Sharma Ji Kirana & General Store",
    business_type: "Grocery & Daily Essentials",
    location: "Alambagh, Lucknow",
    period: "August 2026",
    currency: "INR",
    image_url: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800",
    summary: {
      total_inflow: 42500,
      total_outflow: 28400,
      net_balance: 14100,
      total_transactions: 8,
      active_days: 6
    },
    transactions: [
      { id: "tx_1", date: "2026-08-01", customer_name: "Ramesh Kumar", type: "jama", amount: 2800, balance: 2800, category: "sales", note: "Atta, Rice 25kg" },
      { id: "tx_2", date: "2026-08-02", customer_name: "Gupta Dairy", type: "udhar", amount: 1400, balance: 1400, category: "inventory", note: "Milk & Paneer stock" },
      { id: "tx_3", date: "2026-08-03", customer_name: "Anita Sharma", type: "jama", amount: 3500, balance: 4900, category: "sales", note: "Monthly grocery bill" },
      { id: "tx_4", date: "2026-08-04", customer_name: "Pooja Provisions", type: "udhar", amount: 2100, balance: 2800, category: "inventory", note: "Refined Oil cartons" },
      { id: "tx_5", date: "2026-08-05", customer_name: "Suresh Tea Stall", type: "jama", amount: 4200, balance: 7000, category: "sales", note: "Sugar & Tea supply" },
      { id: "tx_6", date: "2026-08-06", customer_name: "Deepak Verma", type: "jama", amount: 3100, balance: 10100, category: "sales", note: "Spices & pulses" },
      { id: "tx_7", date: "2026-08-06", customer_name: "Mishra Ji", type: "jama", amount: 1800, balance: 11900, category: "sales", note: "Soap & detergent" },
      { id: "tx_8", date: "2026-08-07", customer_name: "Wholesale Mandi", type: "udhar", amount: 5000, balance: 6900, category: "inventory", note: "Grains replenishment" }
    ],
    verascore: {
      score: 745,
      grade: "A",
      risk_level: "Low Risk",
      max_eligible_loan: 35000,
      factors: {
        volume_score: 84,
        consistency_score: 80,
        diversity_score: 75,
        cadence_score: 72
      },
      recommendation: "Highly eligible for microloan up to ₹35,000 at 1.2% monthly interest with weekly flexible EMI.",
      flags: []
    }
  },

  tea_stall: {
    id: "sample_tea",
    merchant_name: "Raju Chai & Snacks Corner",
    business_type: "Tea & Street Food",
    location: "Civil Lines, Kanpur",
    period: "August 2026",
    currency: "INR",
    image_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800",
    summary: {
      total_inflow: 26800,
      total_outflow: 18200,
      net_balance: 8600,
      total_transactions: 6,
      active_days: 5
    },
    transactions: [
      { id: "tx_10", date: "2026-08-01", customer_name: "Daily Cash Counter", type: "jama", amount: 4500, balance: 4500, category: "sales", note: "Morning & evening tea sales" },
      { id: "tx_11", date: "2026-08-02", customer_name: "Yadav Milk Vendor", type: "udhar", amount: 3200, balance: 1300, category: "inventory", note: "Milk 60 liters" },
      { id: "tx_12", date: "2026-08-03", customer_name: "Nearby Coaching Staff", type: "jama", amount: 2800, balance: 4100, category: "sales", note: "Weekly tea subscription" },
      { id: "tx_13", date: "2026-08-04", customer_name: "Bakery Supplies", type: "udhar", amount: 1500, balance: 2600, category: "inventory", note: "Biscuits & rusk stock" },
      { id: "tx_14", date: "2026-08-05", customer_name: "Daily Cash Counter", type: "jama", amount: 5100, balance: 7700, category: "sales", note: "Snacks & chai revenue" }
    ],
    verascore: {
      score: 685,
      grade: "B+",
      risk_level: "Moderate Risk",
      max_eligible_loan: 20000,
      factors: {
        volume_score: 70,
        consistency_score: 75,
        diversity_score: 62,
        cadence_score: 68
      },
      recommendation: "Eligible for microloan up to ₹20,000 with daily micro-deduction repayment.",
      flags: []
    }
  }
};

export const INITIAL_LENDER_LOANS = [
  {
    id: "loan_101",
    merchant_name: "Sharma Ji Kirana Store",
    business_type: "Grocery & Essentials",
    location: "Lucknow, UP",
    requested_amount: 25000,
    verascore: 745,
    risk_level: "Low Risk",
    monthly_turnover: 42500,
    status: "pending",
    applied_at: "2 hours ago",
    sample_key: "kirana_store"
  },
  {
    id: "loan_102",
    merchant_name: "Raju Chai & Snacks Corner",
    business_type: "Tea & Street Food",
    location: "Kanpur, UP",
    requested_amount: 15000,
    verascore: 685,
    risk_level: "Moderate Risk",
    monthly_turnover: 26800,
    status: "pending",
    applied_at: "5 hours ago",
    sample_key: "tea_stall"
  },
  {
    id: "loan_103",
    merchant_name: "Verma Dairy & Sweets",
    business_type: "Dairy Farm",
    location: "Varanasi, UP",
    requested_amount: 35000,
    verascore: 590,
    risk_level: "High Risk",
    monthly_turnover: 19000,
    status: "rejected",
    applied_at: "1 day ago",
    sample_key: "kirana_store"
  }
];

