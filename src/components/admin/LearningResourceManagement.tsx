import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Edit, Trash2, BookOpen, Video, FileText, Brain, Trophy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Subject {
  id: string;
  name: string;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  grade: string;
  subject_id: string;
  is_premium: boolean;
  order_index: number;
  subjects: { name: string };
}

interface LearningTopic {
  id: string;
  title: string;
  description: string;
  module_id: string;
  estimated_duration: number;
  is_premium: boolean;
  order_index: number;
}

interface LearningResource {
  id: string;
  title: string;
  description: string;
  topic_id: string;
  resource_type: string;
  resource_url: string;
  content: string;
  is_premium: boolean;
  order_index: number;
}

const LearningResourceManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [openModuleDialog, setOpenModuleDialog] = useState(false);
  const [openTopicDialog, setOpenTopicDialog] = useState(false);
  const [openResourceDialog, setOpenResourceDialog] = useState(false);

  // Module form state
  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
    grade: "",
    subject_id: "",
    is_premium: false,
    order_index: 0
  });

  // Topic form state
  const [topicForm, setTopicForm] = useState({
    title: "",
    description: "",
    estimated_duration: 30,
    is_premium: false,
    order_index: 0
  });

  // Resource form state
  const [resourceForm, setResourceForm] = useState({
    title: "",
    description: "",
    resource_type: "notes",
    resource_url: "",
    content: "",
    is_premium: false,
    order_index: 0
  });

  useEffect(() => {
    fetchSubjects();
    fetchModules();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      fetchTopics(selectedModule);
    } else {
      setTopics([]);
      setSelectedTopic("");
    }
  }, [selectedModule]);

  useEffect(() => {
    if (selectedTopic) {
      fetchResources(selectedTopic);
    } else {
      setResources([]);
    }
  }, [selectedTopic]);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_modules')
        .select(`
          *,
          subjects (name)
        `)
        .order('order_index');

      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async (moduleId: string) => {
    try {
      const { data, error } = await supabase
        .from('learning_topics')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index');

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchResources = async (topicId: string) => {
    try {
      const { data, error } = await supabase
        .from('learning_resources')
        .select('*')
        .eq('topic_id', topicId)
        .order('order_index');

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleCreateModule = async () => {
    try {
      const { error } = await supabase
        .from('learning_modules')
        .insert([{
          ...moduleForm,
          created_by: user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Learning module created successfully"
      });

      setOpenModuleDialog(false);
      setModuleForm({
        title: "",
        description: "",
        grade: "",
        subject_id: "",
        is_premium: false,
        order_index: 0
      });
      fetchModules();
    } catch (error: any) {
      console.error('Error creating module:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create module",
        variant: "destructive"
      });
    }
  };

  const handleCreateTopic = async () => {
    if (!selectedModule) return;

    try {
      const { error } = await supabase
        .from('learning_topics')
        .insert([{
          ...topicForm,
          module_id: selectedModule
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Learning topic created successfully"
      });

      setOpenTopicDialog(false);
      setTopicForm({
        title: "",
        description: "",
        estimated_duration: 30,
        is_premium: false,
        order_index: 0
      });
      fetchTopics(selectedModule);
    } catch (error: any) {
      console.error('Error creating topic:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create topic",
        variant: "destructive"
      });
    }
  };

  const handleCreateResource = async () => {
    if (!selectedTopic) return;

    try {
      const { error } = await supabase
        .from('learning_resources')
        .insert([{
          ...resourceForm,
          topic_id: selectedTopic,
          created_by: user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Learning resource created successfully"
      });

      setOpenResourceDialog(false);
      setResourceForm({
        title: "",
        description: "",
        resource_type: "notes",
        resource_url: "",
        content: "",
        is_premium: false,
        order_index: 0
      });
      fetchResources(selectedTopic);
    } catch (error: any) {
      console.error('Error creating resource:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create resource",
        variant: "destructive"
      });
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module? This will also delete all associated topics and resources.')) return;

    try {
      const { error } = await supabase
        .from('learning_modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Module deleted successfully"
      });

      fetchModules();
      if (selectedModule === moduleId) {
        setSelectedModule("");
      }
    } catch (error: any) {
      console.error('Error deleting module:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete module",
        variant: "destructive"
      });
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'interactive': return <Brain className="h-4 w-4" />;
      case 'quiz': return <Trophy className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Learning Resources Management</h2>
        <Dialog open={openModuleDialog} onOpenChange={setOpenModuleDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Learning Module</DialogTitle>
              <DialogDescription>Add a new learning module to organize your content</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="module-title">Title</Label>
                <Input
                  id="module-title"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  placeholder="Enter module title"
                />
              </div>
              <div>
                <Label htmlFor="module-description">Description</Label>
                <Textarea
                  id="module-description"
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  placeholder="Enter module description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="module-grade">Grade</Label>
                  <Select value={moduleForm.grade} onValueChange={(value) => setModuleForm({ ...moduleForm, grade: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grade 8">Grade 8</SelectItem>
                      <SelectItem value="Grade 9">Grade 9</SelectItem>
                      <SelectItem value="Grade 10">Grade 10</SelectItem>
                      <SelectItem value="Grade 11">Grade 11</SelectItem>
                      <SelectItem value="Grade 12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="module-subject">Subject</Label>
                  <Select value={moduleForm.subject_id} onValueChange={(value) => setModuleForm({ ...moduleForm, subject_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="module-premium">Premium Content</Label>
                <Switch
                  id="module-premium"
                  checked={moduleForm.is_premium}
                  onCheckedChange={(checked) => setModuleForm({ ...moduleForm, is_premium: checked })}
                />
              </div>
              <Button onClick={handleCreateModule} className="w-full">
                Create Module
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Module Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Learning Module</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a module to manage" />
            </SelectTrigger>
            <SelectContent>
              {modules.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.title} ({module.subjects.name} - {module.grade})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Modules List */}
      <Card>
        <CardHeader>
          <CardTitle>All Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{module.title}</h3>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{module.subjects.name}</Badge>
                    <Badge variant="outline">{module.grade}</Badge>
                    {module.is_premium && <Badge>Premium</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteModule(module.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Topics Management */}
      {selectedModule && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Topics</CardTitle>
              <Dialog open={openTopicDialog} onOpenChange={setOpenTopicDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Topic
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Learning Topic</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="topic-title">Title</Label>
                      <Input
                        id="topic-title"
                        value={topicForm.title}
                        onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="topic-description">Description</Label>
                      <Textarea
                        id="topic-description"
                        value={topicForm.description}
                        onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="topic-duration">Estimated Duration (minutes)</Label>
                      <Input
                        id="topic-duration"
                        type="number"
                        value={topicForm.estimated_duration}
                        onChange={(e) => setTopicForm({ ...topicForm, estimated_duration: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="topic-premium">Premium Content</Label>
                      <Switch
                        id="topic-premium"
                        checked={topicForm.is_premium}
                        onCheckedChange={(checked) => setTopicForm({ ...topicForm, is_premium: checked })}
                      />
                    </div>
                    <Button onClick={handleCreateTopic} className="w-full">
                      Create Topic
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topics.map((topic) => (
                <div 
                  key={topic.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedTopic === topic.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedTopic(selectedTopic === topic.id ? "" : topic.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{topic.title}</h4>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{topic.estimated_duration} min</Badge>
                        {topic.is_premium && <Badge>Premium</Badge>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resources Management */}
      {selectedTopic && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resources</CardTitle>
              <Dialog open={openResourceDialog} onOpenChange={setOpenResourceDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Resource
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Learning Resource</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="resource-title">Title</Label>
                      <Input
                        id="resource-title"
                        value={resourceForm.title}
                        onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="resource-description">Description</Label>
                      <Textarea
                        id="resource-description"
                        value={resourceForm.description}
                        onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="resource-type">Resource Type</Label>
                      <Select value={resourceForm.resource_type} onValueChange={(value) => setResourceForm({ ...resourceForm, resource_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="notes">Notes</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="interactive">Interactive</SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
                          <SelectItem value="practice">Practice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="resource-url">Resource URL (optional)</Label>
                      <Input
                        id="resource-url"
                        value={resourceForm.resource_url}
                        onChange={(e) => setResourceForm({ ...resourceForm, resource_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="resource-content">Content</Label>
                      <Textarea
                        id="resource-content"
                        value={resourceForm.content}
                        onChange={(e) => setResourceForm({ ...resourceForm, content: e.target.value })}
                        placeholder="Enter resource content, notes, or instructions"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="resource-premium">Premium Content</Label>
                      <Switch
                        id="resource-premium"
                        checked={resourceForm.is_premium}
                        onCheckedChange={(checked) => setResourceForm({ ...resourceForm, is_premium: checked })}
                      />
                    </div>
                    <Button onClick={handleCreateResource} className="w-full">
                      Create Resource
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resources.map((resource) => (
                <div key={resource.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getResourceIcon(resource.resource_type)}
                      <div>
                        <h5 className="font-medium">{resource.title}</h5>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{resource.resource_type}</Badge>
                          {resource.is_premium && <Badge>Premium</Badge>}
                        </div>
                        {resource.resource_url && (
                          <a 
                            href={resource.resource_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline mt-1 block"
                          >
                            View Resource →
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LearningResourceManagement;