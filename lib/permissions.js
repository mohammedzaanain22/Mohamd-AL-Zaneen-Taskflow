// These mirror firestore.rules. Rules are the real security; these only decide which buttons to show.

export function canEditTask(task, project, uid) {
  return project.ownerId === uid || task.createdBy === uid || task.assigneeId === uid;
}

export function canChangeStatus(task, project, uid) {
  return project.ownerId === uid || task.assigneeId === uid;
}

export function canDeleteTask(task, project, uid) {
  return project.ownerId === uid || task.createdBy === uid;
}