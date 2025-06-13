import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, FileText, Upload, Save, Calendar, MapPin, Mail, Phone, Briefcase, GraduationCap, Plus, Trash2 } from "lucide-react";
import supabase from "@/utils/supabase";
import { toast } from "@/hooks/use-toast";

// Define types for education and experience
interface Education {
  id: string;
  profile_id?: string;
  institute: string;
  course: string;
  start_date: string;
  end_date: string | null;
}

interface Experience {
  id: string;
  profile_id?: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
}

// Helper function to format dates
const formatDate = (date: string | null): string => {
  if (!date) return "Present";
  const [year, month] = date.split('-');
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Education and Experience states
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);

  // Fetch profile and education data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Update profile states
        if (profileData) {
          setName(profileData.name || user.name);
          setEmail(profileData.email || user.email);
          setBio(profileData.bio || "");
          setPhone(profileData.phone || "");
          setLocation(profileData.location || "");
        }

        // Fetch education data
        const { data: educationData, error: educationError } = await supabase
          .from('education')
          .select('*')
          .eq('profile_id', user.id)
          .order('start_date', { ascending: false });

        if (educationError) throw educationError;
        if (educationData) {
          setEducation(educationData);
        }

        // Fetch experience data
        const { data: experienceData, error: experienceError } = await supabase
          .from('experience')
          .select('*')
          .eq('profile_id', user.id)
          .order('start_date', { ascending: false });

        if (experienceError) throw experienceError;
        if (experienceData) {
          setExperience(experienceData);
        }
      } catch (error: any) {
        console.error('Error fetching profile data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data: " + error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Update profile in Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name,
          email,
          bio,
          phone,
          location,
        });

      if (profileError) throw profileError;

      // Update education records
      // First, delete existing education records
      const { error: deleteError } = await supabase
        .from('education')
        .delete()
        .eq('profile_id', user.id);

      if (deleteError) throw deleteError;

      // Then, insert new education records
      if (education.length > 0) {
        const { error: educationError } = await supabase
          .from('education')
          .insert(
            education.map(edu => ({
              profile_id: user.id,
              institute: edu.institute,
              course: edu.course,
              start_date: edu.start_date,
              end_date: edu.end_date
            }))
          );

        if (educationError) throw educationError;
      }

      // Update experience records
      // First, delete existing experience records
      const { error: deleteExpError } = await supabase
        .from('experience')
        .delete()
        .eq('profile_id', user.id);

      if (deleteExpError) throw deleteExpError;

      // Then, insert new experience records
      if (experience.length > 0) {
        const { error: experienceError } = await supabase
          .from('experience')
          .insert(
            experience.map(exp => ({
              profile_id: user.id,
              company: exp.company,
              role: exp.role,
              start_date: exp.start_date,
              end_date: exp.end_date
            }))
          );

        if (experienceError) throw experienceError;
      }

      // Update context
      updateProfile({ name, email, bio });
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile data: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institute: "",
      course: "",
      start_date: "",
      end_date: null
    };
    setEducation([...education, newEducation]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: "",
      role: "",
      start_date: "",
      end_date: null
    };
    setExperience([...experience, newExperience]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | null) => {
    setExperience(experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter(exp => exp.id !== id));
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

            {/* Education */}
            <Card className="bg-hirrd-secondary border-hirrd-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your educational background
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {education.map((edu, index) => (
                  <div key={edu.id} className="p-4 bg-hirrd-bg rounded-lg border border-hirrd-border space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="text-white font-medium">{edu.course || (isEditing ? "New Education" : "")}</h4>
                        <p className="text-gray-400 text-sm">{edu.institute}</p>
                        <p className="text-gray-500 text-xs">
                          {edu.start_date} - {edu.end_date ? edu.end_date : "Present"}
                        </p>
                      </div>
                      {isEditing && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 h-auto"
                          onClick={() => removeEducation(edu.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    {isEditing && (
                      <div className="grid gap-3 pt-2">
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor={`institute-${edu.id}`} className="text-gray-300 text-xs">Institute</Label>
                            <Input
                              id={`institute-${edu.id}`}
                              value={edu.institute}
                              onChange={(e) => updateEducation(edu.id, "institute", e.target.value)}
                              className="bg-hirrd-bg border-hirrd-border text-white h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`course-${edu.id}`} className="text-gray-300 text-xs">Course/Degree</Label>
                            <Input
                              id={`course-${edu.id}`}
                              value={edu.course}
                              onChange={(e) => updateEducation(edu.id, "course", e.target.value)}
                              className="bg-hirrd-bg border-hirrd-border text-white h-8 text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor={`startDate-${edu.id}`} className="text-gray-300 text-xs">Start Date</Label>
                            <Input
                              id={`startDate-${edu.id}`}
                              value={edu.start_date}
                              onChange={(e) => updateEducation(edu.id, "start_date", e.target.value)}
                              placeholder="YYYY-MM"
                              className="bg-hirrd-bg border-hirrd-border text-white h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`endDate-${edu.id}`} className="text-gray-300 text-xs">End Date</Label>
                            <Input
                              id={`endDate-${edu.id}`}
                              value={edu.end_date ? edu.end_date : ""}
                              onChange={(e) => updateEducation(edu.id, "end_date", e.target.value)}
                              placeholder="YYYY-MM or Present"
                              className="bg-hirrd-bg border-hirrd-border text-white h-8 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {isEditing && (
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed border-hirrd-border text-gray-300 hover:bg-hirrd-bg"
                    onClick={addEducation}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="bg-hirrd-secondary border-hirrd-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Experience
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your work history and professional experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="p-4 bg-hirrd-bg rounded-lg border border-hirrd-border space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="text-white font-medium">{exp.role || (isEditing ? "New Position" : "")}</h4>
                        <p className="text-gray-400 text-sm">{exp.company}</p>
                        <p className="text-gray-500 text-xs">
                          {exp.start_date} - {exp.end_date || "Present"}
                        </p>
                      </div>
                      {isEditing && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 h-auto"
                          onClick={() => removeExperience(exp.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    {isEditing && (
                      <div className="grid gap-3 pt-2">
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor={`company-${exp.id}`} className="text-gray-300 text-xs">Company</Label>
                            <Input
                              id={`company-${exp.id}`}
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                              className="bg-hirrd-bg border-hirrd-border text-white h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`role-${exp.id}`} className="text-gray-300 text-xs">Role/Position</Label>
                            <Input
                              id={`role-${exp.id}`}
                              value={exp.role}
                              onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                              className="bg-hirrd-bg border-hirrd-border text-white h-8 text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor={`startDate-${exp.id}`} className="text-gray-300 text-xs">Start Date</Label>
                            <Input
                              id={`startDate-${exp.id}`}
                              value={exp.start_date}
                              onChange={(e) => updateExperience(exp.id, "start_date", e.target.value)}
                              placeholder="YYYY-MM"
                              className="bg-hirrd-bg border-hirrd-border text-white h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`endDate-${exp.id}`} className="text-gray-300 text-xs">End Date</Label>
                            <Input
                              id={`endDate-${exp.id}`}
                              value={exp.end_date || ""}
                              onChange={(e) => updateExperience(exp.id, "end_date", e.target.value || null)}
                              placeholder="YYYY-MM or Present"
                              className="bg-hirrd-bg border-hirrd-border text-white h-8 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {isEditing && (
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed border-hirrd-border text-gray-300 hover:bg-hirrd-bg"
                    onClick={addExperience}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
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
