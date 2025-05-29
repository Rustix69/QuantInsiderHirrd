
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout showSidebar={false}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="bg-hirrd-secondary border-hirrd-border max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl font-bold gradient-text mb-2">404</div>
              <div className="w-16 h-16 bg-hirrd-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
            <p className="text-gray-400 mb-6">
              Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-hirrd-accent hover:bg-hirrd-accent/90">
                <Link to="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.history.back()} className="border-hirrd-border text-gray-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-hirrd-border">
              <p className="text-sm text-gray-500">
                If you believe this is an error, please contact support.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NotFound;
