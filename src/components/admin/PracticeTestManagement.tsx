import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Clock, Users, BarChart3 } from "lucide-react";

interface PracticeTest {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration: number; // minutes
  questions_count: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  attempts: number;
  average_score: number;
}

interface Question {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correct_answer: string;
  explanation?: string;
  points: number;
}

export const PracticeTestManagement = () => {
  const [tests, setTests] = useState<PracticeTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<PracticeTest | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [newTest, setNewTest] = useState({
    title: '',
    subject: '',
    grade: '',
    duration: 60,
    difficulty: 'Medium' as const
  });
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    type: 'multiple_choice' as const,
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    points: 1
  });
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockTests: PracticeTest[] = [
      {
        id: '1',
        title: 'Grade 12 Mathematics - Calculus',
        subject: 'Mathematics',
        grade: 'Grade 12',
        duration: 90,
        questions_count: 25,
        difficulty: 'Hard',
        status: 'published',
        created_at: '2024-03-01',
        attempts: 142,
        average_score: 78
      },
      {
        id: '2',
        title: 'Grade 11 Physics - Mechanics',
        subject: 'Physical Sciences',
        grade: 'Grade 11',
        duration: 60,
        questions_count: 20,
        difficulty: 'Medium',
        status: 'published',
        created_at: '2024-02-28',
        attempts: 89,
        average_score: 72
      },
      {
        id: '3',
        title: 'Grade 10 English - Comprehension',
        subject: 'English',
        grade: 'Grade 10',
        duration: 45,
        questions_count: 15,
        difficulty: 'Easy',
        status: 'draft',
        created_at: '2024-03-15',
        attempts: 0,
        average_score: 0
      }
    ];
    setTests(mockTests);
  }, []);

  const handleCreateTest = () => {
    const test: PracticeTest = {
      id: Date.now().toString(),
      ...newTest,
      questions_count: 0,
      status: 'draft',
      created_at: new Date().toISOString().split('T')[0],
      attempts: 0,
      average_score: 0
    };

    setTests([...tests, test]);
    setNewTest({
      title: '',
      subject: '',
      grade: '',
      duration: 60,
      difficulty: 'Medium'
    });
    setIsCreateDialogOpen(false);
    toast({
      title: "Practice test created",
      description: "New practice test has been created successfully.",
    });
  };

  const handleDeleteTest = (testId: string) => {
    setTests(tests.filter(test => test.id !== testId));
    toast({
      title: "Practice test deleted",
      description: "Practice test has been deleted successfully.",
    });
  };

  const handlePublishTest = (testId: string) => {
    setTests(tests.map(test => 
      test.id === testId 
        ? { ...test, status: 'published' as const }
        : test
    ));
    toast({
      title: "Practice test published",
      description: "Practice test is now available to students.",
    });
  };

  const handleAddQuestion = () => {
    if (!selectedTest) return;

    const question: Question = {
      id: Date.now().toString(),
      ...newQuestion
    };

    setQuestions([...questions, question]);
    setTests(tests.map(test => 
      test.id === selectedTest.id 
        ? { ...test, questions_count: test.questions_count + 1 }
        : test
    ));

    setNewQuestion({
      question: '',
      type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      points: 1
    });

    toast({
      title: "Question added",
      description: "New question has been added to the test.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500';
      case 'draft':
        return 'bg-yellow-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Practice Test Management</h2>
          <p className="text-muted-foreground">Create and manage practice tests for students</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Test
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Practice Test</DialogTitle>
              <DialogDescription>
                Set up a new practice test for students to attempt.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Test Title</Label>
                <Input
                  id="title"
                  value={newTest.title}
                  onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                  placeholder="e.g., Grade 12 Mathematics - Algebra"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={newTest.subject} onValueChange={(value) => setNewTest({ ...newTest, subject: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physical Sciences">Physical Sciences</SelectItem>
                      <SelectItem value="Life Sciences">Life Sciences</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Afrikaans">Afrikaans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select value={newTest.grade} onValueChange={(value) => setNewTest({ ...newTest, grade: value })}>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newTest.duration}
                    onChange={(e) => setNewTest({ ...newTest, duration: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={newTest.difficulty} onValueChange={(value) => setNewTest({ ...newTest, difficulty: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateTest}>Create Test</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Tests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.filter(t => t.status === 'published').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.reduce((sum, test) => sum + test.attempts, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(tests.reduce((sum, test, _, arr) => sum + test.average_score, 0) / tests.length) || 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Tests</CardTitle>
          <CardDescription>Manage all practice tests and their questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject/Grade</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.title}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{test.subject}</div>
                      <div className="text-sm text-muted-foreground">{test.grade}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {test.duration}m
                    </div>
                  </TableCell>
                  <TableCell>{test.questions_count}</TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(test.difficulty)}>
                      {test.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-white ${getStatusColor(test.status)}`}>
                      {test.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{test.attempts}</TableCell>
                  <TableCell>{test.average_score}%</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTest(test);
                          setIsQuestionDialogOpen(true);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      {test.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePublishTest(test.id)}
                        >
                          Publish
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTest(test.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Question Dialog */}
      <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Question to {selectedTest?.title}</DialogTitle>
            <DialogDescription>
              Create a new question for this practice test.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                placeholder="Enter the question text..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Question Type</Label>
                <Select value={newQuestion.type} onValueChange={(value) => setNewQuestion({ ...newQuestion, type: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                    <SelectItem value="true_false">True/False</SelectItem>
                    <SelectItem value="short_answer">Short Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={newQuestion.points}
                  onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) })}
                />
              </div>
            </div>
            {newQuestion.type === 'multiple_choice' && (
              <div className="space-y-2">
                <Label>Answer Options</Label>
                {newQuestion.options.map((option, index) => (
                  <Input
                    key={index}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newQuestion.options];
                      newOptions[index] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: newOptions });
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                ))}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="correct_answer">Correct Answer</Label>
              <Input
                id="correct_answer"
                value={newQuestion.correct_answer}
                onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })}
                placeholder="Enter the correct answer..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="explanation">Explanation (Optional)</Label>
              <Textarea
                id="explanation"
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                placeholder="Explain why this is the correct answer..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddQuestion}>Add Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};