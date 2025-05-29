
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Users, FileText, Shield } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.isAdmin ? '/admin/dashboard' : '/dashboard');
    }
  }, [user, navigate]);

  return (
    <Layout showSidebar={false}>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-hirrd-accent/10 to-blue-500/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="w-12 h-12 bg-hirrd-accent rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <span className="text-4xl font-bold gradient-text">Hirrd</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Modern Resume
                <span className="gradient-text block">Portal</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Streamline your hiring process with our beautiful candidate resume portal. 
                Upload resumes, manage candidates, and find the perfect fit for your team.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-hirrd-accent hover:bg-hirrd-accent/90 text-white">
                  <Link to="/register" className="flex items-center gap-2">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-gray-700 text-gray-300 hover:bg-hirrd-secondary">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-hirrd-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Why Choose Hirrd?</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Built for modern teams who value efficiency and beautiful user experiences
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-hirrd-secondary border-hirrd-border">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-hirrd-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-hirrd-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Candidate Management</h3>
                  <p className="text-gray-400">
                    Efficiently manage all your candidates in one beautiful dashboard
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-hirrd-secondary border-hirrd-border">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-hirrd-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-hirrd-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Resume Upload</h3>
                  <p className="text-gray-400">
                    Simple drag-and-drop resume uploads with instant preview
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-hirrd-secondary border-hirrd-border">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-hirrd-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-hirrd-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Admin Controls</h3>
                  <p className="text-gray-400">
                    Powerful admin dashboard with complete candidate oversight
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to streamline your hiring?</h2>
            <p className="text-gray-400 mb-8">
              Join hundreds of companies using Hirrd to find their next great hire
            </p>
            <Button asChild size="lg" className="bg-hirrd-accent hover:bg-hirrd-accent/90">
              <Link to="/register" className="flex items-center gap-2">
                Start Your Journey <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
