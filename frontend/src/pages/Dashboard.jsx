import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../api/axios";
import {
  Bookmark,
  Star,
  MessageSquare,
  Plus,
  BarChart2,
  Users,
  Package,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Sparkles
} from "lucide-react";

const StatCard = ({ icon: Icon, label, value, trend, color = "primary", link }) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    yellow: "bg-yellow-100 text-yellow-600"
  };

  const content = (
    <div className={`p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all ${link ? 'cursor-pointer' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className="flex items-center text-sm text-green-600">
            <TrendingUp size={14} className="mr-1" />
            {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-card-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }
  return content;
};

const QuickActionCard = ({ icon: Icon, title, description, to, color = "primary" }) => {
  const colorClasses = {
    primary: "bg-primary/5 border-primary/20 hover:bg-primary/10",
    green: "bg-green-50 border-green-200 hover:bg-green-100"
  };

  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all border ${colorClasses[color]}`}
    >
      <div className={`p-3 rounded-full mb-3 ${color === 'green' ? 'bg-green-100' : 'bg-primary/10'}`}>
        <Icon size={28} className={color === 'green' ? 'text-green-600' : 'text-primary'} />
      </div>
      <span className={`font-semibold ${color === 'green' ? 'text-green-700' : 'text-card-foreground'}`}>{title}</span>
      <span className={`text-sm ${color === 'green' ? 'text-green-600' : 'text-muted-foreground'}`}>{description}</span>
    </Link>
  );
};

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    reviewsCount: 0,
    bookmarksCount: 0,
    toolsSubmitted: 0,
    // Creator stats
    totalImpressions: 0,
    totalClicks: 0,
    pendingTools: 0,
    approvedTools: 0,
    // Admin stats
    totalUsers: 0,
    totalTools: 0,
    pendingModeration: 0,
    totalReviews: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (token && user) {
      fetchDashboardData();
    }
  }, [token, user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch user reviews count
      const reviewsRes = await axios.get("/reviews/users/me/reviews");
      const reviewsCount = reviewsRes.data?.reviews?.length || reviewsRes.data?.length || 0;

      // Fetch bookmarks count
      const bookmarksRes = await axios.get("/bookmarks");
      const collectionsData = bookmarksRes.data?.collections || bookmarksRes.data || [];
      const bookmarksCount = collectionsData.length;
      const totalSavedTools = collectionsData.reduce((acc, col) => acc + (col.tools?.length || 0), 0);

      let creatorStats = { toolsSubmitted: 0, pendingTools: 0, approvedTools: 0, totalImpressions: 0, totalClicks: 0 };
      let adminStats = { totalUsers: 0, totalTools: 0, pendingModeration: 0, totalReviews: 0 };

      // Fetch creator-specific stats
      if (user?.role === "startup") {
        try {
          const myToolsRes = await axios.get("/tools/user/my-tools");
          const tools = myToolsRes.data?.tools || [];
          creatorStats.toolsSubmitted = tools.length;
          creatorStats.pendingTools = tools.filter(t => t.status === "pending").length;
          creatorStats.approvedTools = tools.filter(t => t.status === "approved").length;

          // Calculate total impressions and clicks from analytics if available
          creatorStats.totalImpressions = tools.reduce((acc, t) => acc + (t.impressions || 0), 0);
          creatorStats.totalClicks = tools.reduce((acc, t) => acc + (t.clicks || 0), 0);
        } catch (err) {
          console.error("Error fetching creator stats:", err);
        }
      }

      // Fetch admin-specific stats
      if (user?.role === "admin") {
        try {
          const platformRes = await axios.get("/admin/analytics/platform-stats");
          adminStats = {
            totalUsers: platformRes.data.totalUsers || 0,
            totalTools: platformRes.data.totalTools || 0,
            pendingModeration: platformRes.data.pendingTools || 0,
            totalReviews: platformRes.data.totalReviews || 0
          };
        } catch (err) {
          console.error("Error fetching admin stats:", err);
        }
      }

      setStats({
        reviewsCount,
        bookmarksCount,
        totalSavedTools,
        ...creatorStats,
        ...adminStats
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "startup": return "Creator";
      case "admin": return "Administrator";
      default: return "User";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} />
                <span className="text-sm opacity-90">Welcome back</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{user.name}</h1>
              <p className="opacity-90">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                {getRoleLabel(user.role)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid - Role Based */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Common stats for all users */}
          <StatCard
            icon={Star}
            label="Reviews Written"
            value={loading ? "..." : stats.reviewsCount}
            color="yellow"
            link="/bookmarks"
          />
          <StatCard
            icon={Bookmark}
            label="Saved Collections"
            value={loading ? "..." : stats.bookmarksCount}
            color="purple"
            link="/bookmarks"
          />

          {/* User-only stats */}
          {user.role === "user" && (
            <>
              <StatCard
                icon={Package}
                label="Tools Saved"
                value={loading ? "..." : stats.totalSavedTools || 0}
                color="blue"
                link="/bookmarks"
              />
              <StatCard
                icon={MessageSquare}
                label="Discover Tools"
                value="Browse"
                color="primary"
                link="/tools"
              />
            </>
          )}

          {/* Creator/Startup stats */}
          {user.role === "startup" && (
            <>
              <StatCard
                icon={Package}
                label="Tools Submitted"
                value={loading ? "..." : stats.toolsSubmitted}
                color="blue"
                link="/creator/dashboard"
              />
              <StatCard
                icon={CheckCircle}
                label="Approved Tools"
                value={loading ? "..." : stats.approvedTools}
                color="green"
                link="/creator/dashboard"
              />
            </>
          )}

          {/* Admin stats */}
          {user.role === "admin" && (
            <>
              <StatCard
                icon={Users}
                label="Total Users"
                value={loading ? "..." : stats.totalUsers}
                color="blue"
                link="/admin/users"
              />
              <StatCard
                icon={AlertCircle}
                label="Pending Moderation"
                value={loading ? "..." : stats.pendingModeration}
                color="orange"
                link="/admin/tools"
              />
            </>
          )}
        </div>

        {/* Creator-specific: Pending Tools Alert */}
        {user.role === "startup" && stats.pendingTools > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="text-yellow-600" size={24} />
              <div>
                <p className="font-medium text-yellow-800">
                  {stats.pendingTools} tool{stats.pendingTools > 1 ? 's' : ''} pending review
                </p>
                <p className="text-sm text-yellow-600">Your submitted tools are being reviewed by our team.</p>
              </div>
            </div>
            <Link to="/creator/dashboard" className="text-yellow-700 hover:text-yellow-800 font-medium flex items-center gap-1">
              View <ChevronRight size={16} />
            </Link>
          </div>
        )}

        {/* Admin-specific: Quick Overview */}
        {user.role === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <BarChart2 size={20} className="text-primary" />
                Platform Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Total Tools</span>
                  <span className="font-semibold text-card-foreground">{stats.totalTools}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Total Reviews</span>
                  <span className="font-semibold text-card-foreground">{stats.totalReviews}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="font-semibold text-card-foreground">{stats.totalUsers}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Shield size={20} className="text-primary" />
                Admin Quick Links
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/admin/tools" className="p-3 bg-secondary/50 hover:bg-secondary rounded-lg text-center transition-colors">
                  <Package size={20} className="mx-auto mb-1 text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">Moderate Tools</span>
                </Link>
                <Link to="/admin/users" className="p-3 bg-secondary/50 hover:bg-secondary rounded-lg text-center transition-colors">
                  <Users size={20} className="mx-auto mb-1 text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">Manage Users</span>
                </Link>
                <Link to="/admin/reviews" className="p-3 bg-secondary/50 hover:bg-secondary rounded-lg text-center transition-colors">
                  <MessageSquare size={20} className="mx-auto mb-1 text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">Reviews</span>
                </Link>
                <Link to="/admin/analytics" className="p-3 bg-secondary/50 hover:bg-secondary rounded-lg text-center transition-colors">
                  <BarChart2 size={20} className="mx-auto mb-1 text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">Analytics</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-card-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <QuickActionCard
              icon={Package}
              title="Browse Tools"
              description="Discover AI tools"
              to="/tools"
            />

            <QuickActionCard
              icon={Bookmark}
              title="My Bookmarks"
              description="Saved collections"
              to="/bookmarks"
            />

            {user.role === "startup" && (
              <QuickActionCard
                icon={Plus}
                title="Submit Tool"
                description="Add your AI tool"
                to="/tools/new"
                color="green"
              />
            )}

            {user.role === "startup" && (
              <QuickActionCard
                icon={BarChart2}
                title="Creator Dashboard"
                description="Manage your tools"
                to="/creator/dashboard"
              />
            )}

            {user.role === "admin" && (
              <QuickActionCard
                icon={Shield}
                title="Admin Panel"
                description="Manage platform"
                to="/admin"
              />
            )}
          </div>
        </div>

        {/* Recent Activity / Tips Section */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-card-foreground mb-4">
            {user.role === "user" ? "Get Started" : "Tips"}
          </h2>
          <div className="space-y-3">
            {user.role === "user" && (
              <>
                <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                  <Star className="text-yellow-500 mt-0.5" size={18} />
                  <div>
                    <p className="font-medium text-card-foreground">Rate and review tools</p>
                    <p className="text-sm text-muted-foreground">Help others by sharing your experience with AI tools.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                  <Bookmark className="text-purple-500 mt-0.5" size={18} />
                  <div>
                    <p className="font-medium text-card-foreground">Create collections</p>
                    <p className="text-sm text-muted-foreground">Organize your favorite tools into custom collections.</p>
                  </div>
                </div>
              </>
            )}
            {user.role === "startup" && (
              <>
                <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                  <TrendingUp className="text-green-500 mt-0.5" size={18} />
                  <div>
                    <p className="font-medium text-card-foreground">Promote your tools</p>
                    <p className="text-sm text-muted-foreground">Feature your approved tools to get more visibility.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                  <BarChart2 className="text-blue-500 mt-0.5" size={18} />
                  <div>
                    <p className="font-medium text-card-foreground">Track analytics</p>
                    <p className="text-sm text-muted-foreground">Monitor impressions, clicks, and engagement for your tools.</p>
                  </div>
                </div>
              </>
            )}
            {user.role === "admin" && (
              <>
                <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                  <CheckCircle className="text-green-500 mt-0.5" size={18} />
                  <div>
                    <p className="font-medium text-card-foreground">Review pending submissions</p>
                    <p className="text-sm text-muted-foreground">Approve or reject new tool submissions from creators.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                  <AlertCircle className="text-orange-500 mt-0.5" size={18} />
                  <div>
                    <p className="font-medium text-card-foreground">Monitor reports</p>
                    <p className="text-sm text-muted-foreground">Handle reported reviews and tool issues promptly.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
