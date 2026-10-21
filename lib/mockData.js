export const mockUsers = [
  { uid: "u1", displayName: "Sara", email: "owner@example.test" },
  { uid: "u2", displayName: "Omar", email: "member@example.test" },
];

export const mockUser = mockUsers[0];

export const mockProjects = [
  {
    id: "p1",
    name: "Website Redesign",
    description: "Redesign the company website.",
    ownerId: "u1",
    memberIds: ["u1", "u2"],
  },
];

export const mockTasks = [
  { id: "t1", projectId: "p1", title: "Build navbar", description: "", status: "in_progress", priority: "high", assigneeId: "u2", createdBy: "u1", dueDate: "2026-10-30" },
  { id: "t2", projectId: "p1", title: "Create login page", description: "", status: "todo", priority: "medium", assigneeId: null, createdBy: "u1", dueDate: "2026-11-02" },
  { id: "t3", projectId: "p1", title: "Test responsive layout", description: "", status: "done", priority: "low", assigneeId: "u1", createdBy: "u1", dueDate: null },
  { id: "t4", projectId: "p1", title: "Fix overdue bug", description: "", status: "todo", priority: "high", assigneeId: "u2", createdBy: "u1", dueDate: "2026-10-20" },
];