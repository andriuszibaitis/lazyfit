"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Loader2,
  Trash2,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface UserQuestion {
  id: string;
  userId: string;
  question: string;
  status: string;
  answer: string | null;
  answeredAt: string | null;
  answeredBy: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export default function ClientQuestionsPage() {
  const [questions, setQuestions] = useState<UserQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Answer dialog
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<UserQuestion | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [statusFilter]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const url = statusFilter === "all"
        ? "/api/admin/user-questions"
        : `/api/admin/user-questions?status=${statusFilter}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (err) {
      setError("Nepavyko gauti klausimų");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAnswer = (question: UserQuestion) => {
    setSelectedQuestion(question);
    setAnswerText(question.answer || "");
    setIsAnswerDialogOpen(true);
  };

  const handleSaveAnswer = async () => {
    if (!selectedQuestion) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/user-questions/${selectedQuestion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: answerText,
          status: answerText.trim() ? "answered" : selectedQuestion.status,
        }),
      });

      if (response.ok) {
        setSuccess("Atsakymas išsaugotas");
        setIsAnswerDialogOpen(false);
        fetchQuestions();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Nepavyko išsaugoti atsakymo");
      }
    } catch (err) {
      setError("Nepavyko išsaugoti atsakymo");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStatus = async (question: UserQuestion, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/user-questions/${question.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setSuccess("Statusas atnaujintas");
        fetchQuestions();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError("Nepavyko atnaujinti statuso");
      console.error(err);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) return;

    try {
      const response = await fetch(`/api/admin/user-questions/${selectedQuestion.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess("Klausimas ištrintas");
        setIsDeleteDialogOpen(false);
        fetchQuestions();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Nepavyko ištrinti klausimo");
      }
    } catch (err) {
      setError("Nepavyko ištrinti klausimo");
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            Laukia
          </span>
        );
      case "answered":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Atsakyta
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="w-3 h-3" />
            Uždaryta
          </span>
        );
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("lt-LT", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
          <span className="ml-3 text-dark-grey">Kraunama...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-black">Klientų klausimai</h1>
            <p className="text-sm text-dark-grey mt-1">
              Peržiūrėkite ir atsakykite į klientų užduotus klausimus
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtruoti pagal statusą" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Visi klausimai</SelectItem>
                <SelectItem value="pending">Laukiantys</SelectItem>
                <SelectItem value="answered">Atsakyti</SelectItem>
                <SelectItem value="closed">Uždaryti</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Questions Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Klientas</TableHead>
                <TableHead>Klausimas</TableHead>
                <TableHead>Statusas</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Veiksmai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-dark-grey">
                    Nėra klausimų
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-black">
                          {question.user.name || "Nenurodyta"}
                        </p>
                        <p className="text-sm text-dark-grey">{question.user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="line-clamp-2 text-sm">{question.question}</p>
                    </TableCell>
                    <TableCell>{getStatusBadge(question.status)}</TableCell>
                    <TableCell className="text-sm text-dark-grey">
                      {formatDate(question.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenAnswer(question)}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {question.answer ? "Peržiūrėti" : "Atsakyti"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedQuestion(question);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Answer Dialog */}
        <Dialog open={isAnswerDialogOpen} onOpenChange={setIsAnswerDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Klausimas</DialogTitle>
            </DialogHeader>
            {selectedQuestion && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-dark-grey">
                      Nuo: <span className="font-medium text-black">{selectedQuestion.user.name || selectedQuestion.user.email}</span>
                    </p>
                    <p className="text-sm text-dark-grey">
                      {formatDate(selectedQuestion.createdAt)}
                    </p>
                  </div>
                  <p className="text-black">{selectedQuestion.question}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Jūsų atsakymas
                  </label>
                  <Textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Įveskite atsakymą..."
                    rows={5}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-black">Statusas:</label>
                  <Select
                    value={selectedQuestion.status}
                    onValueChange={(value) => handleUpdateStatus(selectedQuestion, value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Laukia</SelectItem>
                      <SelectItem value="answered">Atsakyta</SelectItem>
                      <SelectItem value="closed">Uždaryta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAnswerDialogOpen(false)}>
                Atšaukti
              </Button>
              <Button onClick={handleSaveAnswer} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saugoma...
                  </>
                ) : (
                  "Išsaugoti atsakymą"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ištrinti klausimą?</AlertDialogTitle>
              <AlertDialogDescription>
                Ar tikrai norite ištrinti šį klausimą? Šis veiksmas negrįžtamas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Atšaukti</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteQuestion}
                className="bg-red-500 hover:bg-red-600"
              >
                Ištrinti
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
