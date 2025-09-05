"use client";

import { useEffect, useRef, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Crown,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
  Search,
  RefreshCcw,
  TrendingUp,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import UsersSkeleton from "./UsersSkeleton";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { useDebounce } from "use-debounce";
import AddRoleModal from "./AddRoleModal";
import EditRoleModal from "./EditRoleModal";
import DeleteRoleModal from "./DeleteRoleModal";
import AssignRoleModal from "./AssignRoleModal";
import UserDetailModal from "./UserDetailModal";
import ForbiddenActionModal from "@/components/ForbiddenActionModal";
import { toast } from "react-toastify";

type User = {
  phone_number: number;
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  last_login: string;
  phone?: string;
  location?: string;
  avatar?: string;
  orders_count?: number;
  total_spent?: number;
};

type Role = {
  id: number;
  name: string;
  permissions: string[];
  user_count: number;
  description: string;
  created_at: string;
};

const UserRoleManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Add modal state handlers in component state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedRoleName, setSelectedRoleName] = useState<string>("");

  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false);

  const [isForbiddenModelOpen, setIsForbiddenModelOpen] = useState(false);

  const handleRoleUpdated = () => {
    fetchData(true);
    toast.success("Role updated successfully!");
  };

  const handleRoleDeleted = (detail:any) => {
    fetchData(true);
    toast.success(detail);
  };

  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const [staffUsers, setStaffUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Dummy data
  // const dummyUsers: User[] = [
  //   {
  //     id: 1,
  //     username: "john_doe",
  //     email: "john@example.com",
  //     role: "admin",
  //     status: "active",
  //     created_at: "2024-01-15T10:30:00Z",
  //     last_login: "2024-07-16T09:15:00Z",
  //     phone: "+1234567890",
  //     location: "New York, NY",
  //     orders_count: 25,
  //     total_spent: 1250.5,
  //   },
  //   {
  //     id: 2,
  //     username: "jane_smith",
  //     email: "jane@example.com",
  //     role: "manager",
  //     status: "active",
  //     created_at: "2024-02-20T14:45:00Z",
  //     last_login: "2024-07-15T16:30:00Z",
  //     phone: "+1234567891",
  //     location: "Los Angeles, CA",
  //     orders_count: 18,
  //     total_spent: 890.25,
  //   },
  //   {
  //     id: 3,
  //     username: "mike_wilson",
  //     email: "mike@example.com",
  //     role: "staff",
  //     status: "active",
  //     created_at: "2024-03-10T11:20:00Z",
  //     last_login: "2024-07-14T12:45:00Z",
  //     phone: "+1234567892",
  //     location: "Chicago, IL",
  //     orders_count: 12,
  //     total_spent: 450.75,
  //   },
  //   {
  //     id: 4,
  //     username: "sarah_jones",
  //     email: "sarah@example.com",
  //     role: "customer",
  //     status: "inactive",
  //     created_at: "2024-04-05T09:15:00Z",
  //     last_login: "2024-07-10T08:20:00Z",
  //     phone: "+1234567893",
  //     location: "Houston, TX",
  //     orders_count: 8,
  //     total_spent: 320.0,
  //   },
  //   {
  //     id: 5,
  //     username: "david_brown",
  //     email: "david@example.com",
  //     role: "customer",
  //     status: "active",
  //     created_at: "2024-05-12T13:30:00Z",
  //     last_login: "2024-07-16T10:00:00Z",
  //     phone: "+1234567894",
  //     location: "Phoenix, AZ",
  //     orders_count: 35,
  //     total_spent: 1875.3,
  //   },
  //   {
  //     id: 6,
  //     username: "emma_davis",
  //     email: "emma@example.com",
  //     role: "staff",
  //     status: "pending",
  //     created_at: "2024-06-08T15:45:00Z",
  //     last_login: "2024-07-12T14:15:00Z",
  //     phone: "+1234567895",
  //     location: "Denver, CO",
  //     orders_count: 5,
  //     total_spent: 125.5,
  //   },
  // ];

  // const dummyRoles: Role[] = [
  //   {
  //     id: 1,
  //     name: "admin",
  //     permissions: ["read", "write", "delete", "manage_users", "manage_roles"],
  //     user_count: 1,
  //     description: "Full system access with all permissions",
  //     created_at: "2024-01-01T00:00:00Z",
  //   },
  //   {
  //     id: 2,
  //     name: "manager",
  //     permissions: ["read", "write", "manage_orders", "view_reports"],
  //     user_count: 1,
  //     description: "Can manage orders and view reports",
  //     created_at: "2024-01-01T00:00:00Z",
  //   },
  //   {
  //     id: 3,
  //     name: "staff",
  //     permissions: ["read", "write", "process_orders"],
  //     user_count: 2,
  //     description: "Can process orders and basic operations",
  //     created_at: "2024-01-01T00:00:00Z",
  //   },
  //   {
  //     id: 4,
  //     name: "customer",
  //     permissions: ["read", "place_orders", "view_profile"],
  //     user_count: 2,
  //     description: "Standard customer access",
  //     created_at: "2024-01-01T00:00:00Z",
  //   },
  // ];

  const fetchData = async (showloading = true) => {
    try {
      if (showloading) setLoading(true);

      const [userRes, roleRes, statRes] = await Promise.all([
        axiosWithCsrf.get("/api/users/", {
          params: {
            page: currentPage,
            limit: 4, // customize as needed
            status: statusFilter,
            role: roleFilter,
            search: searchTerm,
          },
        }),
        axiosWithCsrf.get("/api/roles/"),
        axiosWithCsrf.get("/api/user-stats/"),
      ]);

      setUsers(userRes.data.results);
      setTotalPages(userRes.data.total_pages);
      setCurrentPage(userRes.data.current_page);
      setRoles(roleRes.data);

      // Optional: if you want to use real stats
      const stats = statRes.data;
      setActiveUsers(stats.active_users);
      setInactiveUsers(stats.inactive_users);
      setStaffUsers(stats.staff_users);
      setTotalRevenue(stats.total_revenue);
    } catch (error) {
      console.error("Failed to fetch users and roles:", error);
    } finally {
      if (showloading) setLoading(false);
    }
  };

  const handleRoleCreated = () => {
    fetchData(true); // This already fetches users and roles
    toast.success(`Role added successfully!`);
  };
  const firstRun = useRef(true);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData(firstRun.current);
      firstRun.current = false;
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [debouncedSearch, currentPage, statusFilter, roleFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "inactive":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4 text-purple-500" />;
      case "manager":
        return <Shield className="w-4 h-4 text-blue-500" />;
      case "staff":
        return <UserCheck className="w-4 h-4 text-green-500" />;
      case "customer":
        return <Users className="w-4 h-4 text-gray-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "staff":
        return "bg-green-100 text-green-800 border-green-200";
      case "customer":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // const filteredUsers = users.filter(user => {
  //   const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesStatus = statusFilter === "all" || user.status === statusFilter;
  //   const matchesRole = roleFilter === "all" || user.role === roleFilter;
  //   return matchesSearch && matchesStatus && matchesRole;
  // });

  

  if (loading) {
    return <UsersSkeleton />;
  }

  return (
    <div className="p-2 md:p-2 lg:p-4 xl:p-6 bg-gray-50 min-h-screen">
      {/* Refresh Button */}
      <div className="flex items-center mb-3 justify-start">
        <button
          onClick={() => fetchData(true)}
          className="flex items-center gap-1 text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
          title="Refresh Data"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              User & Role Management
            </h1>
            <p className="text-gray-600">
              Manage users, roles, and permissions
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Inactive Users
              </p>
              <p className="text-2xl font-bold text-red-600">{inactiveUsers}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Staff Users</p>
              <p className="text-2xl font-bold text-yellow-600">
                {staffUsers}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-600">
                Rs {Number(totalRevenue).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("users")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("roles")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "roles"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Roles ({roles.length})
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "users" && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  Filters:
                </span>
              </div>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="server">Server</option>
                <option value="cashier">Cashier</option>
                <option value="intern">Intern</option>
                <option value="trainer">Trainer</option>
                <option value="customer">Customer</option>
                <option value="intern_manager">Intern Manager</option>
              </select>

              <button onClick={()=> window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/users/?export=csv`, "_blank")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium">
                <Download className="w-4 h-4" />
                Export CSV
              </button>

              {/* <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium">
                <Plus className="w-4 h-4" />
                Add User
              </button> */}
            </div>
          </div>

          {/* Search */}
          <div className="mb-6 flex items-center justify-between shadow-sm bg-white rounded-lg p-4 border border-gray-200">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by username or email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                All Users ({users.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-blue-600">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {getRoleIcon(user.role)}
                          {user.role}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {getStatusIcon(user.status)}
                          {user.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                          {user.phone_number && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              {user.phone_number}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.orders_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Rs {Number(user.total_spent || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.last_login)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setIsViewUserModalOpen(true);
                              setSelectedUserId(user.id);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUserId(user.id); // 👈 set the selected user
                              setIsAssignModalOpen(true); // 👈 open the modal
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                           onClick={()=> setIsForbiddenModelOpen(true)}
                           className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No users found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "roles" && (
        <>
          {/* Role Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Role Management
              </h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Role
              </button>
            </div>
          </div>

          <AddRoleModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onRoleCreated={handleRoleCreated}
          />

          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div
                key={role.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${getRoleColor(role.name)
                        .replace("text-", "bg-")
                        .replace("border-", "")
                        .replace("800", "100")}`}
                    >
                      {getRoleIcon(role.name)}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 capitalize">
                        {role.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {role.user_count} users
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedRoleId(role.id);
                        setEditModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedRoleId(role.id);
                        setSelectedRoleName(role.name);
                        setDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{role.description}</p>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Permissions:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {formatPermission(permission)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Created: {formatDate(role.created_at)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* edit and delete modals  */}
      <EditRoleModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        roleId={selectedRoleId!}
        onRoleUpdated={handleRoleUpdated}
      />
      <DeleteRoleModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        roleId={selectedRoleId!}
        roleName={selectedRoleName}
        onRoleDeleted={handleRoleDeleted}
      />

      <AssignRoleModal
        isOpen={isAssignModalOpen}
        userId={selectedUserId} // 👈 pass the selected user ID
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedUserId(null);
        }}
        onRoleAssigned={(details: any) => {
          setIsAssignModalOpen(false);
          setSelectedUserId(null);
          fetchData(false); // optional: refresh data
          toast.success(details);
        }}
        onStatusUpdate={(details: any) => {
          setIsAssignModalOpen(false);
          setSelectedUserId(null);
          fetchData(false);
          toast.success(details);
        }}
      />

      <UserDetailModal
        isOpen={isViewUserModalOpen}
        onClose={() => setIsViewUserModalOpen(false)}
        userId={selectedUserId}
      />

      <ForbiddenActionModal
        isOpen={isForbiddenModelOpen}
        onClose={() => setIsForbiddenModelOpen(false)}
        message="Sorry! We intentionaly blocked this action because deleting the User will delete all the users records. So if you want to delete the User please simply set the user status to inactive!"
      />

      {/* Pagination */}
      <div className="flex justify-center p-6 border-t border-gray-200 mt-6 gap-2">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="px-4 bg-gray-200 text-sm rounded-lg disabled:opacity-50"
        >
          First
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-1 bg-blue-700 text-sm text-white rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-1 text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-1 bg-blue-700 text-sm text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="px-4 bg-gray-200 text-sm rounded-lg disabled:opacity-50"
        >
          Last
        </button>
      </div>
    </div>
  );
};

function formatPermission(perm: any) {
  if (typeof perm === "string") {
    return perm.replace("_", " ");
  }
  return String(perm);
}

export default UserRoleManagement;
