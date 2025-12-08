"use client";

import { useState } from "react";
import { initialStudents, Student, initialProjects } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Trash2, Edit2, X, Save, FolderGit2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Partial<Student> | null>(
    null
  );

  const getStudentProjectCount = (studentId: string) => {
    return initialProjects.filter((p) =>
      p.assignedMemberIds.includes(studentId)
    ).length;
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this student?")) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  const handleEdit = (student: Student) => {
    setCurrentStudent({ ...student });
    setIsPanelOpen(true);
  };

  const handleAddNew = () => {
    setCurrentStudent({
      name: "",
      email: "",
      role: "Student",
      status: "Active",
      phone: "",
      enrollmentNo: `DX-2024-${Math.floor(Math.random() * 1000)}`,
      joinedDate: new Date().toISOString().split("T")[0],
    });
    setIsPanelOpen(true);
  };

  const handleSave = () => {
    if (!currentStudent?.name || !currentStudent.email) return;

    if (currentStudent.id) {
      // Update
      setStudents(
        students.map((s) =>
          s.id === currentStudent.id ? (currentStudent as Student) : s
        )
      );
    } else {
      // Create
      const newStudent = {
        ...currentStudent,
        id: Math.random().toString(36).substr(2, 9),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentStudent.name}`,
      } as Student;
      setStudents([...students, newStudent]);
    }
    setIsPanelOpen(false);
  };

  return (
    <div className="space-y-6 relative h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage your students and team members.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-9 w-[250px] bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Student
          </Button>
        </div>
      </div>

      <div className="border border-border bg-card rounded-md overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-muted-foreground uppercase bg-secondary/30 font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Projects</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>
                        {student.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">
                        {student.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {student.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-gray-500/10">
                    {student.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <FolderGit2 className="h-4 w-4" />
                    <span className="font-mono">
                      {getStudentProjectCount(student.id)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      student.status === "Active" ? "default" : "secondary"
                    }
                    className={
                      student.status === "Active"
                        ? "bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-200"
                        : ""
                    }
                  >
                    {student.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {student.phone}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(student)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(student.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground"
                >
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-over Panel for Edit/Create */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsPanelOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-md bg-background h-full shadow-2xl p-6 border-l border-border flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold tracking-tight">
                {currentStudent?.id ? "Edit Student" : "New Student"}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPanelOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="text-sm font-medium leading-none">
                  Full Name
                </label>
                <Input
                  value={currentStudent?.name || ""}
                  onChange={(e) =>
                    setCurrentStudent((curr) => ({
                      ...curr,
                      name: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium leading-none">
                  Email Address
                </label>
                <Input
                  value={currentStudent?.email || ""}
                  onChange={(e) =>
                    setCurrentStudent((curr) => ({
                      ...curr,
                      email: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium leading-none">
                  Phone
                </label>
                <Input
                  value={currentStudent?.phone || ""}
                  onChange={(e) =>
                    setCurrentStudent((curr) => ({
                      ...curr,
                      phone: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium leading-none">
                    Role
                  </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                    value={currentStudent?.role || "Student"}
                    onChange={(e) =>
                      setCurrentStudent((curr) => ({
                        ...curr,
                        role: e.target.value as any,
                      }))
                    }
                  >
                    <option value="Student">Student</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium leading-none">
                    Status
                  </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                    value={currentStudent?.status || "Active"}
                    onChange={(e) =>
                      setCurrentStudent((curr) => ({
                        ...curr,
                        status: e.target.value as any,
                      }))
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border mt-auto">
              <Button className="w-full" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
