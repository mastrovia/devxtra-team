export type ProjectStatus = "Pending" | "In Progress" | "Completed" | "On Hold";

export type Project = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  dueDate: string;
  assignedMemberIds: string[]; // Refers to Student.id
  tags: string[];
  link?: string;
  images?: string[];
  metrics?: string;
};

export type StudentStatus = "Active" | "Inactive" | "Alumni";

export type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrollmentNo: string;
  role: "Student" | "Team Lead" | "Member";
  status: StudentStatus;
  joinedDate: string;
  avatar?: string;
};

export const initialStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@devxtra.com",
    phone: "+1 234 567 890",
    enrollmentNo: "DX-2024-001",
    role: "Team Lead",
    status: "Active",
    joinedDate: "2024-01-15",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@devxtra.com",
    phone: "+1 987 654 321",
    enrollmentNo: "DX-2024-002",
    role: "Member",
    status: "Active",
    joinedDate: "2024-02-01",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice.j@devxtra.com",
    phone: "+1 555 000 111",
    enrollmentNo: "DX-2024-003",
    role: "Student",
    status: "Inactive",
    joinedDate: "2024-03-10",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
  },
];

export const initialProjects: Project[] = [
  {
    id: "p1",
    title: "E-Commerce Revamp",
    description: "Redesigning the main checkout flow for better conversion.",
    status: "In Progress",
    startDate: "2024-01-20",
    dueDate: "2024-03-01",
    assignedMemberIds: ["1", "2"],
    tags: ["Next.js", "Stripe"],
    link: "https://example.com/ecommerce",
    images: ["https://placehold.co/600x400"],
    metrics: "+20% Conversion",
  },
  {
    id: "p2",
    title: "Internal Dashboard",
    description: "Building the admin panel for staff management.",
    status: "Pending",
    startDate: "2024-04-01",
    dueDate: "2024-05-15",
    assignedMemberIds: ["1"],
    tags: ["React", "Internal"],
    images: [],
    metrics: "MVP Phase",
  },
  {
    id: "p3",
    title: "Portfolio Site",
    description: "Simple portfolio for a client.",
    status: "Completed",
    startDate: "2023-11-01",
    dueDate: "2023-12-01",
    assignedMemberIds: ["2"],
    tags: ["HTML", "CSS"],
    link: "https://example.com/portfolio",
    images: ["https://placehold.co/600x400/orange/white"],
    metrics: "100/100 Lighthouse",
  },
];
