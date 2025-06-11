"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  BarChart3,
  Settings,
  CheckCircle,
  Clock,
  PieChart,
  FileText,
  DollarSign,
  Shield,
  UserPlus,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react"
import { type Language, getTranslation } from "@/lib/translations"

type Currency = "USD" | "EUR" | "GBP"

interface AdminPanelProps {
  currentLanguage: Language
  currentCurrency: Currency
}

interface PendingUser {
  id: string
  username: string
  email: string
  phone?: string
  registrationDate: string
  ipAddress: string
  deviceInfo: string
  verificationStatus: "pending" | "verified" | "rejected"
  documents?: string[]
  notes?: string
}

interface AdminAccount {
  id: string
  username: string
  email: string
  role: "super_admin" | "admin" | "moderator"
  lastLogin: string
  status: "active" | "suspended"
  twoFactorEnabled: boolean
  createdBy: string
  permissions: string[]
}

export default function AdminPanel({ currentLanguage, currentCurrency }: AdminPanelProps) {
  const t = (key: keyof typeof import("@/lib/translations").translations.en, params?: Record<string, string>) => {
    try {
      return getTranslation(currentLanguage, key, params)
    } catch (error) {
      // Fallback to English key if translation fails
      return key.toString()
    }
  }

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [loginError, setLoginError] = useState("")

  // Admin management states
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false)
  const [newAdminData, setNewAdminData] = useState({
    username: "",
    email: "",
    role: "admin" as "super_admin" | "admin" | "moderator",
    permissions: [] as string[],
  })

  // User approval states
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([
    {
      id: "1",
      username: "gmku01028",
      email: "gmku01028@gmail.com",
      phone: "+1-555-0123",
      registrationDate: "2024-12-02",
      ipAddress: "192.168.1.100",
      deviceInfo: "Chrome 120.0 on Windows 11",
      verificationStatus: "pending",
      documents: ["id_verification.pdf", "address_proof.pdf"],
      notes: "User submitted all required documents",
    },
    {
      id: "2",
      username: "john_doe_2024",
      email: "john.doe@example.com",
      phone: "+1-555-0456",
      registrationDate: "2024-12-01",
      ipAddress: "10.0.0.50",
      deviceInfo: "Safari 17.0 on macOS",
      verificationStatus: "pending",
      documents: ["passport.pdf"],
      notes: "Missing address verification",
    },
    {
      id: "3",
      username: "restaurant_owner_1",
      email: "owner@bistro.com",
      phone: "+1-555-0789",
      registrationDate: "2024-11-30",
      ipAddress: "172.16.0.25",
      deviceInfo: "Firefox 119.0 on Ubuntu",
      verificationStatus: "pending",
      documents: ["business_license.pdf", "tax_id.pdf"],
      notes: "Business account application",
    },
  ])

  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([
    {
      id: "1",
      username: "super_admin",
      email: "admin@tipyoulater.com",
      role: "super_admin",
      lastLogin: "2024-12-02T10:30:00Z",
      status: "active",
      twoFactorEnabled: true,
      createdBy: "system",
      permissions: ["all"],
    },
    {
      id: "2",
      username: "john_admin",
      email: "john@tipyoulater.com",
      role: "admin",
      lastLogin: "2024-12-01T15:45:00Z",
      status: "active",
      twoFactorEnabled: true,
      createdBy: "super_admin",
      permissions: ["user_management", "analytics", "payments"],
    },
  ])

  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null)
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "verified" | "rejected">("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Analytics data
  const analyticsData = {
    totalUsers: 15847,
    pendingApprovals: pendingUsers.filter((u) => u.verificationStatus === "pending").length,
    approvedToday: 23,
    rejectedToday: 5,
    totalRevenue: 284750,
    monthlyGrowth: 12.5,
    activeAdmins: adminAccounts.filter((a) => a.status === "active").length,
  }

  // Simple and reliable login function
  const handleLogin = () => {
    try {
      if (isLocked) {
        setLoginError("Account is temporarily locked. Please try again later.")
        return
      }

      // Clear previous errors
      setLoginError("")

      // Trim whitespace and convert to lowercase for comparison
      const inputUsername = username.toLowerCase().trim()
      const inputPassword = password.trim()

      // Valid credentials - simple and reliable
      const validCredentials = [
        { username: "admin", password: "admin123" },
        { username: "demo", password: "demo123" },
        { username: "test", password: "test123" },
        { username: "super_admin", password: "admin2024" },
        { username: "yock.sys", password: "password123" },
      ]

      const isValidLogin = validCredentials.some(
        (cred) => inputUsername === cred.username.toLowerCase() && inputPassword === cred.password,
      )

      if (isValidLogin) {
        // Successful login
        setIsLoggedIn(true)
        setShowLoginModal(false)
        setUsername("")
        setPassword("")
        setLoginAttempts(0)
        setLoginError("")
      } else {
        // Failed login
        const newAttempts = loginAttempts + 1
        setLoginAttempts(newAttempts)

        if (newAttempts >= 3) {
          setIsLocked(true)
          setLoginError("Too many failed attempts. Account locked for 30 seconds.")
          setTimeout(() => {
            setIsLocked(false)
            setLoginAttempts(0)
            setLoginError("")
          }, 30000)
        } else {
          setLoginError(`Invalid credentials. ${3 - newAttempts} attempts remaining.`)
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("Login failed. Please try again.")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowLoginModal(true)
    setUsername("")
    setPassword("")
    setLoginError("")
    setLoginAttempts(0)
  }

  const handleUserAction = (userId: string, action: "approve" | "reject", notes?: string) => {
    try {
      setPendingUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                verificationStatus: action === "approve" ? "verified" : "rejected",
                notes: notes || user.notes,
              }
            : user,
        ),
      )
      setSelectedUser(null)
      setShowUserDetailsModal(false)
    } catch (error) {
      console.error("User action error:", error)
    }
  }

  const handleCreateAdmin = () => {
    try {
      const newAdmin: AdminAccount = {
        id: Date.now().toString(),
        ...newAdminData,
        lastLogin: "Never",
        status: "active",
        twoFactorEnabled: false,
        createdBy: "super_admin",
      }
      setAdminAccounts((prev) => [...prev, newAdmin])
      setNewAdminData({
        username: "",
        email: "",
        role: "admin",
        permissions: [],
      })
      setShowCreateAdminModal(false)
    } catch (error) {
      console.error("Create admin error:", error)
    }
  }

  const filteredUsers = pendingUsers.filter((user) => {
    try {
      const matchesStatus = filterStatus === "all" || user.verificationStatus === filterStatus
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesSearch
    } catch (error) {
      console.error("Filter error:", error)
      return true
    }
  })

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return dateString
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string }> = {
      pending: { className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      verified: { className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      rejected: { className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
      active: { className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
      suspended: { className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
    }

    const config = variants[status] || variants.pending
    return <Badge className={config.className}>{status}</Badge>
  }

  // Show login modal if not logged in
  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-white">Admin Dashboard</h2>
            <p className="text-xl text-gray-300 mb-8">Please login to continue</p>
            <Button
              size="lg"
              onClick={() => setShowLoginModal(true)}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              disabled={isLocked}
            >
              {isLocked ? "Account Locked" : "Login to Admin Panel"}
            </Button>
            {isLocked && <p className="text-red-400 mt-4">Account temporarily locked. Try again in 30 seconds.</p>}
          </div>
        </div>

        {/* Enhanced Login Modal */}
        <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-center">
                <Shield className="w-5 h-5" />
                Admin Login
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">🔑 Working Credentials:</h4>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <p>
                    <strong>admin</strong> / <strong>admin123</strong>
                  </p>
                  <p>
                    <strong>demo</strong> / <strong>demo123</strong>
                  </p>
                  <p>
                    <strong>test</strong> / <strong>test123</strong>
                  </p>
                </div>
              </div>

              {loginError && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {loginError}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Username</label>
                <Input
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLocked}
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    disabled={isLocked}
                    className="text-center pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLocked}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                disabled={isLocked}
                size="lg"
              >
                {isLocked ? "🔒 Account Locked" : "🚀 Login"}
              </Button>
              {loginAttempts > 0 && !isLocked && (
                <p className="text-center text-sm text-yellow-600">⚠️ {3 - loginAttempts} attempts remaining</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUsername("admin")
                  setPassword("admin123")
                }}
                className="text-xs"
                disabled={isLocked}
              >
                📝 admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUsername("demo")
                  setPassword("demo123")
                }}
                className="text-xs"
                disabled={isLocked}
              >
                📝 demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUsername("test")
                  setPassword("test123")
                }}
                className="text-xs"
                disabled={isLocked}
              >
                📝 test
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center py-8 px-6 bg-gradient-to-br from-slate-800/50 to-purple-800/50 backdrop-blur-sm rounded-3xl border border-white/10">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">Admin Dashboard</h1>
            <p className="text-xl text-gray-300">Secure administrative control panel</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Shield className="w-4 h-4 mr-1" />
              Authenticated
            </Badge>
            <Button onClick={handleLogout} variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Logout
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border-blue-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{analyticsData.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-300">Total Users</div>
              <div className="text-sm text-blue-400 mt-2">↑ {analyticsData.monthlyGrowth}%</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm border-yellow-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{analyticsData.pendingApprovals}</div>
              <div className="text-sm text-gray-300">Pending Approvals</div>
              <div className="text-sm text-yellow-400 mt-2">Requires attention</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border-green-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{analyticsData.approvedToday}</div>
              <div className="text-sm text-gray-300">Approved Today</div>
              <div className="text-sm text-green-400 mt-2">+{analyticsData.approvedToday} new users</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">${analyticsData.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-300">Total Revenue</div>
              <div className="text-sm text-purple-400 mt-2">This month</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending-users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-white/10">
            <TabsTrigger value="pending-users" className="flex items-center gap-2 data-[state=active]:bg-white/10">
              <UserCheck className="w-4 h-4" />
              Pending Users
            </TabsTrigger>
            <TabsTrigger value="admin-accounts" className="flex items-center gap-2 data-[state=active]:bg-white/10">
              <Shield className="w-4 h-4" />
              Admin Accounts
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-white/10">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-white/10">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Pending Users Tab */}
          <TabsContent value="pending-users" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Pending User Approvals
                  </CardTitle>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    {analyticsData.pendingApprovals} Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-700/50 border-white/10 text-white"
                      />
                    </div>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 bg-slate-700/50 border border-white/10 rounded-md text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Users List */}
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-white/10 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{user.username}</h3>
                          <p className="text-sm text-gray-400">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(user.verificationStatus)}
                            <span className="text-xs text-gray-500">
                              Registered: {formatDate(user.registrationDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserDetailsModal(true)
                          }}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {user.verificationStatus === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleUserAction(user.id, "reject")}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUserAction(user.id, "approve")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <UserCheck className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Accounts Tab */}
          <TabsContent value="admin-accounts" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Admin Account Management
                  </CardTitle>
                  <Button onClick={() => setShowCreateAdminModal(true)} className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Admin
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminAccounts.map((admin) => (
                    <div
                      key={admin.id}
                      className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                          {admin.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{admin.username}</h3>
                          <p className="text-sm text-gray-400">{admin.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              {admin.role.replace("_", " ")}
                            </Badge>
                            {getStatusBadge(admin.status)}
                            {admin.twoFactorEnabled && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <Shield className="w-3 h-3 mr-1" />
                                2FA
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {admin.role !== "super_admin" && (
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">User Registration Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <TrendingUp className="w-16 h-16 mx-auto mb-4" />
                      <p>User registration analytics</p>
                      <p className="text-sm mt-2">Charts would be rendered here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Approval Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <PieChart className="w-16 h-16 mx-auto mb-4" />
                      <p>Approval rate: 94.2%</p>
                      <p className="text-sm mt-2">Visualization would be here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Require 2FA for all admins</h3>
                    <p className="text-sm text-gray-400">Force two-factor authentication for all admin accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Auto-approve verified users</h3>
                    <p className="text-sm text-gray-400">Automatically approve users with complete verification</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Email notifications</h3>
                    <p className="text-sm text-gray-400">Send email alerts for pending approvals</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Details Modal */}
        <Dialog open={showUserDetailsModal} onOpenChange={setShowUserDetailsModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>User Details: {selectedUser?.username}</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Username</label>
                    <p className="text-lg">{selectedUser.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-lg">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-lg">{selectedUser.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Registration Date</label>
                    <p className="text-lg">{formatDate(selectedUser.registrationDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">IP Address</label>
                    <p className="text-lg">{selectedUser.ipAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Device Info</label>
                    <p className="text-lg">{selectedUser.deviceInfo}</p>
                  </div>
                </div>

                {selectedUser.documents && selectedUser.documents.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Submitted Documents</label>
                    <div className="mt-2 space-y-2">
                      {selectedUser.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <FileText className="w-4 h-4" />
                          <span>{doc}</span>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={selectedUser.notes || ""}
                    onChange={(e) => setSelectedUser({ ...selectedUser, notes: e.target.value })}
                    placeholder="Add notes about this user..."
                    className="mt-2"
                  />
                </div>

                {selectedUser.verificationStatus === "pending" && (
                  <div className="flex gap-4">
                    <Button
                      variant="destructive"
                      onClick={() => handleUserAction(selectedUser.id, "reject", selectedUser.notes)}
                      className="flex-1"
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Reject User
                    </Button>
                    <Button
                      onClick={() => handleUserAction(selectedUser.id, "approve", selectedUser.notes)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Approve User
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Admin Modal */}
        <Dialog open={showCreateAdminModal} onOpenChange={setShowCreateAdminModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Admin Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input
                  placeholder="Enter username"
                  value={newAdminData.username}
                  onChange={(e) => setNewAdminData({ ...newAdminData, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Enter email"
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <select
                  value={newAdminData.role}
                  onChange={(e) => setNewAdminData({ ...newAdminData, role: e.target.value as any })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <Button onClick={handleCreateAdmin} className="w-full">
                Create Admin Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
