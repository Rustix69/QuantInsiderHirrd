import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, User, Calendar, TrendingUp, CheckCircle } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Profile Completion",
      value: "85%",
      description: "Complete your profile to stand out",
      icon: User,
      color: "text-blue-400"
    },
    {
      title: "Resume Status",
      value: "Uploaded",
      description: "Last updated 2 days ago",
      icon: FileText,
      color: "text-green-400"
    },
    {
      title: "Applications",
      value: "12",
      description: "Active applications this month",
      icon: TrendingUp,
      color: "text-hirrd-accent"
    },
    {
      title: "Profile Views",
      value: "47",
      description: "Views in the last 30 days",
      icon: CheckCircle,
      color: "text-purple-400"
    }
  ];

  const recentActivity = [
    { action: "Profile updated", time: "2 hours ago" },
    { action: "Resume uploaded", time: "2 days ago" },
    { action: "Account created", time: "1 week ago" }
  ];

  if (!user) return null;
  
  // Redirect admin users to the admin dashboard
  if (user.isAdmin) {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-gray-400">
              Here's what's happening with your profile today.
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button asChild className="bg-hirrd-accent hover:bg-hirrd-accent/90">
              <Link to="/profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-hirrd-secondary border-hirrd-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Resume Section */}
          <div className="lg:col-span-2">
            <Card className="bg-hirrd-secondary border-hirrd-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Resume Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Keep your resume updated and ready for opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-hirrd-bg rounded-lg border border-hirrd-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-hirrd-accent/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-hirrd-accent" />
                    </div>
                    <div>
                      <p className="text-white font-medium">resume_john_doe.pdf</p>
                      <p className="text-sm text-gray-400">Uploaded 2 days ago • 1.2 MB</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Active
                  </Badge>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="border-hirrd-border text-gray-300 hover:bg-hirrd-bg">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New
                  </Button>
                  <Button variant="ghost" className="text-gray-400 hover:text-white">
                    Preview
                  </Button>
                  <Button variant="ghost" className="text-gray-400 hover:text-white">
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="bg-hirrd-secondary border-hirrd-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-hirrd-bg rounded-lg">
                    <div className="w-2 h-2 bg-hirrd-accent rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-hirrd-accent/10 to-blue-500/10 border-hirrd-accent/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold text-white mb-2">Ready to take the next step?</h3>
                <p className="text-gray-300">Complete your profile and start applying to opportunities.</p>
              </div>
              <div className="flex gap-3">
                <Button asChild variant="outline" className="border-hirrd-accent text-hirrd-accent hover:bg-hirrd-accent hover:text-white">
                  <Link to="/profile">Complete Profile</Link>
                </Button>
                <Button className="bg-hirrd-accent hover:bg-hirrd-accent/90">
                  Browse Jobs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
