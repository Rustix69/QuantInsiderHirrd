
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, FileText, Upload, Save, Calendar, MapPin, Mail, Phone } from "lucide-react";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [location, setLocation] = useState("San Francisco, CA");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateProfile({ name, email, bio });
    setIsEditing(false);
  };

  const skills = ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"];

  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            <p className="text-gray-400">Manage your personal information and resume</p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
            className={isEditing ? "border-hirrd-border text-gray-300" : "bg-hirrd-accent hover:bg-hirrd-accent/90"}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-hirrd-secondary border-hirrd-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-hirrd-accent text-white text-xl font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                    <p className="text-gray-400">Software Developer</p>
                    <Badge variant="secondary" className="bg-hirrd-accent/20 text-hirrd-accent mt-1">
                      Active
                    </Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-hirrd-bg border-hirrd-border text-white"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-hirrd-bg border-hirrd-border text-white"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-hirrd-bg border-hirrd-border text-white"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-300">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-hirrd-bg border-hirrd-border text-white"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-hirrd-bg border-hirrd-border text-white min-h-[100px]"
                    placeholder="Tell us about yourself..."
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave} className="bg-hirrd-accent hover:bg-hirrd-accent/90">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="border-hirrd-border text-gray-300">
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-hirrd-secondary border-hirrd-border">
              <CardHeader>
                <CardTitle className="text-white">Skills</CardTitle>
                <CardDescription className="text-gray-400">
                  Your technical skills and expertise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-hirrd-bg text-gray-300">
                      {skill}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button variant="ghost" size="sm" className="text-hirrd-accent hover:bg-hirrd-accent/20">
                      + Add Skill
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Resume & Quick Stats */}
          <div className="space-y-6">
            {/* Resume */}
            <Card className="bg-hirrd-secondary border-hirrd-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-hirrd-bg rounded-lg border border-hirrd-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-hirrd-accent/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-hirrd-accent" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">resume_john_doe.pdf</p>
                      <p className="text-xs text-gray-400">1.2 MB • Uploaded 2 days ago</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Active
                  </Badge>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="border-hirrd-border text-gray-300 hover:bg-hirrd-bg">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New
                  </Button>
                  <Button variant="ghost" className="text-gray-400 hover:text-white">
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-hirrd-secondary border-hirrd-border">
              <CardHeader>
                <CardTitle className="text-white">Profile Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-hirrd-accent" />
                  <div>
                    <p className="text-sm text-white">Member since</p>
                    <p className="text-xs text-gray-400">January 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-hirrd-accent" />
                  <div>
                    <p className="text-sm text-white">Profile views</p>
                    <p className="text-xs text-gray-400">47 this month</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-hirrd-accent" />
                  <div>
                    <p className="text-sm text-white">Resume downloads</p>
                    <p className="text-xs text-gray-400">12 this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-hirrd-secondary border-hirrd-border">
              <CardHeader>
                <CardTitle className="text-white">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{location}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
