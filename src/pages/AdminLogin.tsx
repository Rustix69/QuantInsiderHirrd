
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Shield } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@hirrd.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    
    if (success) {
      navigate("/admin/dashboard");
    }
  };

  return (
    <Layout showSidebar={false}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Button variant="ghost" asChild className="text-gray-400 hover:text-white">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
            </Button>
          </div>
          
          <Card className="bg-hirrd-secondary border-hirrd-border">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Admin Portal</span>
              </div>
              <CardTitle className="text-2xl text-white">Admin Access</CardTitle>
              <CardDescription className="text-gray-400">
                Sign in to the Hirrd admin dashboard
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Admin Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-hirrd-bg border-hirrd-border text-white"
                    placeholder="admin@hirrd.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-hirrd-bg border-hirrd-border text-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <p className="text-xs text-amber-400">
                    ⚠️ Admin access required. Use admin@hirrd.com for demo.
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Sign In
                    </>
                  )}
                </Button>
                
                <p className="text-center text-gray-400 text-sm">
                  Not an admin?{" "}
                  <Link to="/login" className="text-hirrd-accent hover:underline">
                    User login
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
