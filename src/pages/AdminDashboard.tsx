import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, FileText, Download, Search, Filter, Eye, Calendar, TrendingUp, Shield } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for candidates
  const candidates = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      joinDate: "2024-01-15",
      resumeStatus: "uploaded",
      profileCompletion: 85,
      lastActive: "2 hours ago",
      skills: ["React", "TypeScript", "Node.js"]
    },
    {
      id: "2", 
      name: "Jane Smith",
      email: "jane@example.com",
      joinDate: "2024-01-20",
      resumeStatus: "uploaded",
      profileCompletion: 92,
      lastActive: "1 day ago",
      skills: ["Python", "Django", "PostgreSQL"]
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com", 
      joinDate: "2024-02-01",
      resumeStatus: "pending",
      profileCompletion: 60,
      lastActive: "3 days ago",
      skills: ["Java", "Spring", "AWS"]
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      joinDate: "2024-02-05",
      resumeStatus: "uploaded",
      profileCompletion: 78,
      lastActive: "5 hours ago",
      skills: ["Vue.js", "PHP", "MySQL"]
    }
  ];

  const stats = [
    {
      title: "Total Candidates",
      value: "247",
      description: "+12% from last month",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Resumes Uploaded",
      value: "189",
      description: "76% completion rate",
      icon: FileText,
      color: "text-green-400"
    },
    {
      title: "Active This Week",
      value: "98",
      description: "40% of total candidates",
      icon: TrendingUp,
      color: "text-hirrd-accent"
    },
    {
      title: "New This Month",
      value: "34",
      description: "+8% from last month",
      icon: Calendar,
      color: "text-purple-400"
    }
  ];

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

  // Redirect non-admin users to the regular dashboard
  if (!user.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard 👨‍💼</h1>
            <div className="flex items-center gap-2">
              <p className="text-gray-400">
                Manage candidates and oversee the hiring process
              </p>
              <Badge variant="outline" className="border-red-500 text-red-400">
                Admin
              </Badge>
            </div>
          </div>
          <div className="mt-4 lg:mt-0 flex gap-3">
            <Button variant="outline" className="border-hirrd-border text-gray-300">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button className="bg-hirrd-accent hover:bg-hirrd-accent/90">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
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

        {/* Candidates Table */}
        <Card className="bg-hirrd-secondary border-hirrd-border">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Candidate Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  View and manage all registered candidates
                </CardDescription>
              </div>
              <div className="mt-4 lg:mt-0 flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-hirrd-bg border-hirrd-border text-white w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-hirrd-border hover:bg-hirrd-bg/50">
                    <TableHead className="text-gray-300">Candidate</TableHead>
                    <TableHead className="text-gray-300">Join Date</TableHead>
                    <TableHead className="text-gray-300">Resume Status</TableHead>
                    <TableHead className="text-gray-300">Profile</TableHead>
                    <TableHead className="text-gray-300">Last Active</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id} className="border-hirrd-border hover:bg-hirrd-bg/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-hirrd-accent text-white text-sm">
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{candidate.name}</p>
                            <p className="text-sm text-gray-400">{candidate.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(candidate.joinDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={
                            candidate.resumeStatus === 'uploaded' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }
                        >
                          {candidate.resumeStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-hirrd-bg rounded-full h-2">
                            <div 
                              className="bg-hirrd-accent h-2 rounded-full" 
                              style={{ width: `${candidate.profileCompletion}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400">{candidate.profileCompletion}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400">{candidate.lastActive}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredCandidates.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No candidates found matching your search criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-hirrd-secondary border-hirrd-border">
            <CardHeader>
              <CardTitle className="text-white">Recent Registrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidates.slice(0, 3).map((candidate, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-hirrd-bg rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-hirrd-accent text-white text-sm">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{candidate.name}</p>
                    <p className="text-xs text-gray-400">Registered {new Date(candidate.joinDate).toLocaleDateString()}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={
                      candidate.resumeStatus === 'uploaded' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }
                  >
                    {candidate.resumeStatus}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-hirrd-secondary border-hirrd-border">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-hirrd-bg hover:bg-hirrd-accent text-white">
                <Download className="w-4 h-4 mr-2" />
                Download All Resumes
              </Button>
              <Button className="w-full justify-start bg-hirrd-bg hover:bg-hirrd-accent text-white">
                <Users className="w-4 h-4 mr-2" />
                Export Candidate List
              </Button>
              <Button className="w-full justify-start bg-hirrd-bg hover:bg-hirrd-accent text-white">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
