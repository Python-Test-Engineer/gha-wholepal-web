"use client";

import { useState, useEffect } from "react";
import {
  Search,
  X,
  ChevronDown,
  FileDown,
  ShoppingBag,
  TrendingUp,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Download,
  Clock,
  Filter,
  MoreHorizontal,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";

const generateSalesData = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = new Date().getMonth();

  return months.map((month, index) => {
    const base = 20000 + Math.random() * 35000;
    const growth =
      index <= currentMonth
        ? (index / currentMonth) * (Math.random() * 0.4 + 0.8)
        : null; // Future months don't have data

    return {
      name: month,
      revenue: growth !== null ? Math.round(base * growth) : null,
      profit:
        growth !== null
          ? Math.round(base * growth * (0.2 + Math.random() * 0.15))
          : null,
      target: Math.round(base * 1.2),
    };
  });
};

const generateProductCategoryData = () => {
  const categories = [
    { name: "Snacks", value: Math.round(1000 + Math.random() * 2000) },
    { name: "Beverages", value: Math.round(1000 + Math.random() * 2000) },
    { name: "Confectionery", value: Math.round(1000 + Math.random() * 2000) },
    { name: "Dairy", value: Math.round(1000 + Math.random() * 2000) },
    { name: "Organic", value: Math.round(1000 + Math.random() * 2000) },
  ];

  return categories;
};

const generateDownloadActivityData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return days.map((day) => ({
    name: day,
    downloads: Math.round(50 + Math.random() * 150),
    views: Math.round(100 + Math.random() * 300),
  }));
};

const generateTopCustomersData = () => {
  const customers = [
    "Oceanside Retail",
    "Metro Supermarkets",
    "Golden Foods Co.",
    "Fresh Market Chain",
    "North Valley Stores",
  ];

  return customers.map((customer) => ({
    name: customer,
    downloads: Math.round(10 + Math.random() * 50),
    orders: Math.round(5 + Math.random() * 30),
    revenue: Math.round(2000 + Math.random() * 10000),
  }));
};

const generateRecentActivity = () => {
  const activities = [
    {
      type: "product_added",
      user: "John Smith",
      product: "Product 12",
      time: "35 minutes ago",
    },
    {
      type: "download_completed",
      user: "Oceanside Retail",
      file: "Invoice_1042.pdf",
      time: "1 hour ago",
    },
    {
      type: "order_placed",
      user: "Metro Supermarkets",
      orderNumber: "ORD-4392",
      time: "3 hours ago",
    },
    {
      type: "product_updated",
      user: "Sarah Johnson",
      product: "Product 8",
      time: "5 hours ago",
    },
    {
      type: "download_failed",
      user: "Golden Foods Co.",
      file: "Contract_3921.pdf",
      time: "6 hours ago",
    },
  ];

  return activities;
};

export default function Dashboard() {
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [downloadActivity, setDownloadActivity] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("This Year");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredKpiMetrics, setFilteredKpiMetrics] = useState([]);
  const [showChartMenus, setShowChartMenus] = useState({
    revenue: false,
    categories: false,
    downloads: false,
    customers: false,
    activity: false,
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

  const generateKpiMetrics = (period: string) => {
    const periodMultipliers = {
      "This Week": {
        products: 0.15,
        downloads: 0.1,
        customers: 0.2,
        revenue: 0.08,
      },
      "This Month": {
        products: 0.4,
        downloads: 0.35,
        customers: 0.5,
        revenue: 0.3,
      },
      "This Quarter": {
        products: 0.7,
        downloads: 0.65,
        customers: 0.8,
        revenue: 0.6,
      },
      "This Year": { products: 1, downloads: 1, customers: 1, revenue: 1 },
    };

    const multiplier = get(periodMultipliers, [period]);

    return [
      {
        title: "Total Products",
        value: Math.round(452 * multiplier.products).toLocaleString(),
        change: `+${Math.round(12 * multiplier.products)}%`,
        isPositive: true,
        icon: <Package className="h-8 w-8 text-blue-500" />,
        bgColor: "bg-blue-50",
        searchTerms: ["products", "catalog", "items"],
      },
      {
        title: "Total Downloads",
        value: Math.round(2891 * multiplier.downloads).toLocaleString(),
        change: `+${Math.round(24 * multiplier.downloads)}%`,
        isPositive: true,
        icon: <Download className="h-8 w-8 text-green-500" />,
        bgColor: "bg-green-50",
        searchTerms: ["downloads", "files", "documents"],
      },
      {
        title: "Active Suppliers",
        value: Math.round(128 * multiplier.customers).toLocaleString(),
        change: `+${Math.round(8 * multiplier.customers)}%`,
        isPositive: true,
        icon: <Users className="h-8 w-8 text-purple-500" />,
        bgColor: "bg-purple-50",
        searchTerms: ["customers", "clients", "users", "accounts"],
      },
    ];
  };

  const kpiMetrics = generateKpiMetrics("This Year");

  const timePeriods = ["This Week", "This Month", "This Quarter", "This Year"];

  const generateTimeBasedData = (period: string) => {
    switch (period) {
      case "This Week":
        return {
          sales: Array(7)
            .fill()
            .map((_, i) => ({
              name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
              revenue: Math.round(5000 + Math.random() * 8000),
              profit: Math.round(1500 + Math.random() * 3000),
              target: Math.round(8000 + Math.random() * 3000),
            })),
          downloads: Array(7)
            .fill()
            .map((_, i) => ({
              name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
              downloads: Math.round(30 + Math.random() * 80),
              views: Math.round(50 + Math.random() * 150),
            })),
          categories: [
            { name: "Snacks", value: Math.round(200 + Math.random() * 600) },
            { name: "Beverages", value: Math.round(200 + Math.random() * 600) },
            {
              name: "Confectionery",
              value: Math.round(200 + Math.random() * 600),
            },
            { name: "Dairy", value: Math.round(200 + Math.random() * 600) },
            { name: "Organic", value: Math.round(200 + Math.random() * 600) },
          ],
        };
      case "This Month":
        return {
          sales: Array(30)
            .fill()
            .map((_, i) => ({
              name: (i + 1).toString(),
              revenue: Math.round(4000 + Math.random() * 10000),
              profit: Math.round(1200 + Math.random() * 4000),
              target: Math.round(9000 + Math.random() * 4000),
            })),
          downloads: Array(4)
            .fill()
            .map((_, i) => ({
              name: `Week ${i + 1}`,
              downloads: Math.round(100 + Math.random() * 300),
              views: Math.round(200 + Math.random() * 400),
            })),
          categories: [
            { name: "Snacks", value: Math.round(400 + Math.random() * 1200) },
            {
              name: "Beverages",
              value: Math.round(400 + Math.random() * 1200),
            },
            {
              name: "Confectionery",
              value: Math.round(400 + Math.random() * 1200),
            },
            { name: "Dairy", value: Math.round(400 + Math.random() * 1200) },
            { name: "Organic", value: Math.round(400 + Math.random() * 1200) },
          ],
        };
      case "This Quarter":
        return {
          sales: Array(3)
            .fill()
            .map((_, i) => ({
              name: ["Jan", "Feb", "Mar"][i],
              revenue: Math.round(15000 + Math.random() * 30000),
              profit: Math.round(4000 + Math.random() * 12000),
              target: Math.round(30000 + Math.random() * 15000),
            })),
          downloads: Array(3)
            .fill()
            .map((_, i) => ({
              name: ["Jan", "Feb", "Mar"][i],
              downloads: Math.round(400 + Math.random() * 800),
              views: Math.round(700 + Math.random() * 1200),
            })),
          categories: [
            { name: "Snacks", value: Math.round(600 + Math.random() * 1800) },
            {
              name: "Beverages",
              value: Math.round(600 + Math.random() * 1800),
            },
            {
              name: "Confectionery",
              value: Math.round(600 + Math.random() * 1800),
            },
            { name: "Dairy", value: Math.round(600 + Math.random() * 1800) },
            { name: "Organic", value: Math.round(600 + Math.random() * 1800) },
          ],
        };
      case "This Year":
      default:
        return {
          sales: generateSalesData(),
          downloads: generateDownloadActivityData(),
          categories: generateProductCategoryData(),
        };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const timeData = generateTimeBasedData("This Year");

        setSalesData(timeData.sales);
        setCategoryData(timeData.categories);
        setDownloadActivity(timeData.downloads);
        setTopCustomers(generateTopCustomersData());
        setRecentActivity(generateRecentActivity());
        setFilteredKpiMetrics(generateKpiMetrics("This Year"));
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    setIsLoading(true);

    setTimeout(() => {
      try {
        const timeData = generateTimeBasedData(selectedTimePeriod);

        setSalesData(timeData.sales);
        setCategoryData(timeData.categories);
        setDownloadActivity(timeData.downloads);

        setFilteredKpiMetrics(generateKpiMetrics(selectedTimePeriod));

        setIsLoading(false);
      } catch (err) {
        setError("Failed to update dashboard data.");
        console.error("Error updating dashboard data:", err);
        setIsLoading(false);
      }
    }, 800);
  }, [selectedTimePeriod]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredKpiMetrics(generateKpiMetrics(selectedTimePeriod));
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const allMetrics = generateKpiMetrics(selectedTimePeriod);

    const filtered = allMetrics.filter(
      (metric) =>
        metric.title.toLowerCase().includes(term) ||
        metric.searchTerms.some((searchTerm) => searchTerm.includes(term))
    );

    setFilteredKpiMetrics(filtered);
  }, [searchTerm, selectedTimePeriod]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-border rounded-md shadow-sm">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.name.includes("revenue") || entry.name.includes("profit")
                ? formatCurrency(entry.value)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "product_added":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "download_completed":
        return <Download className="h-5 w-5 text-green-500" />;
      case "order_placed":
        return <ShoppingBag className="h-5 w-5 text-purple-500" />;
      case "product_updated":
        return <RefreshCw className="h-5 w-5 text-amber-500" />;
      case "download_failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-foreground mb-2">Error Loading Dashboard</p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-6 bg-background">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your business performance
          </p>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {filteredKpiMetrics.length === 0 && searchTerm.trim() !== "" ? (
            <div className="lg:col-span-4 p-8 bg-card rounded-lg shadow-sm border border-border flex flex-col items-center justify-center">
              <Filter className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-foreground mb-2">No matching metrics found</p>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search term
              </p>
              <Button
                onClick={() => setSearchTerm("")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            filteredKpiMetrics.map(
              (
                metric: {
                  title: string;
                  value: number;
                  change: string;
                  isPositive: boolean;
                  icon: React.ReactNode;
                  bgColor: string;
                  searchTerms: string[];
                },
                index
              ) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-card rounded-lg p-4 shadow-sm border border-border"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-muted-foreground text-sm">
                        {metric.title}
                      </p>
                      <h3 className="text-2xl font-bold text-foreground mt-1">
                        {metric.value}
                      </h3>
                      <div
                        className={`flex items-center mt-1 ${
                          metric.isPositive ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {metric.isPositive ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        <span className="text-sm font-medium">
                          {metric.change} from last period
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${metric.bgColor}`}>
                      {metric.icon}
                    </div>
                  </div>
                </motion.div>
              )
            )
          )}
        </div>

        {/* Filters and Time Period Selector */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-border text-foreground flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="relative md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search dashboard..."
                className="bg-muted border-none pl-10 text-foreground placeholder:text-muted-foreground h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Time Period:</span>
            <div className="flex">
              {timePeriods.map((period) => (
                <Button
                  key={period}
                  variant={selectedTimePeriod === period ? "default" : "ghost"}
                  className={`text-sm ${
                    selectedTimePeriod === period
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setSelectedTimePeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart - 2/3 width */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-card p-4 rounded-lg shadow-sm border border-border lg:col-span-2"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-foreground font-medium">
                  Revenue & Profit
                </h3>
                <p className="text-muted-foreground text-sm">
                  Monthly performance analysis
                </p>
              </div>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={salesData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) => `$${value / 1000}k`}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0088FE"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#00C49F"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Profit"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#d1d5db"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    name="Target"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </motion.div> */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-card p-4 rounded-lg shadow-sm border border-border lg:col-span-2"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-foreground font-medium">Your Suppliers</h3>
                <p className="text-muted-foreground text-sm">
                  Suppliers by revenue and activity
                </p>
              </div>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                      Supplier Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                      Products
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                      Downloads
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                      Growth
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topCustomers.map((customer, index) => (
                    <tr key={index} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-foreground font-medium">
                        {customer.name}
                      </td>
                      <td className="px-4 py-3 text-foreground/80">
                        {customer.downloads}
                      </td>
                      <td className="px-4 py-3 text-foreground/80">
                        {customer.orders}
                      </td>
                      <td className="px-4 py-3 text-foreground/80">
                        {formatCurrency(customer.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Product Categories - 1/3 width */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-card p-4 rounded-lg shadow-sm border border-border"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-foreground font-medium">
                  Product Categories
                </h3>
                <p className="text-muted-foreground text-sm">
                  Distribution by category
                </p>
              </div>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <div className="h-64 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </motion.div> */}

          {/* Download Activity - 1/2 width */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-card p-4 rounded-lg shadow-sm border border-border"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-foreground font-medium">
                  Download Activity
                </h3>
                <p className="text-muted-foreground text-sm">
                  Downloads and views by day
                </p>
              </div>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={downloadActivity}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="downloads"
                    fill="#8884d8"
                    name="Downloads"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="views"
                    fill="#82ca9d"
                    name="Views"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </motion.div> */}

          {/* Top Customers Table - 1/2 width */}

          {/* Recent Activity - Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-card p-4 rounded-lg shadow-sm border border-border"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-foreground font-medium">Recent Activity</h3>
                <p className="text-muted-foreground text-sm">
                  Latest system events
                </p>
              </div>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    {index < recentActivity.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2"></div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div className="text-foreground font-medium">
                        {activity.type === "product_added" &&
                          `${activity.user} added ${activity.product}`}
                        {activity.type === "download_completed" &&
                          `${activity.user} downloaded ${activity.file}`}
                        {activity.type === "order_placed" &&
                          `${activity.user} placed order ${activity.orderNumber}`}
                        {activity.type === "product_updated" &&
                          `${activity.user} updated ${activity.product}`}
                        {activity.type === "download_failed" &&
                          `${activity.user} failed to download ${activity.file}`}
                      </div>
                      <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                      {activity.type === "product_added" &&
                        "A new product was added to the catalog"}
                      {activity.type === "download_completed" &&
                        "File was successfully downloaded"}
                      {activity.type === "order_placed" &&
                        "New order was placed in the system"}
                      {activity.type === "product_updated" &&
                        "Product information was updated"}
                      {activity.type === "download_failed" &&
                        "There was an error downloading the file"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
