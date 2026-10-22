# TaskFlow - Demo Accounts

These are test accounts made only for the demo. They do not belong to real people.

| Role | Email | Password |
| --- | --- | --- |
| Owner (admin) | A@A.com | A@A.com |
| Member | M@A.com | M@A.com |

Login page: add the deployed link here after publishing.

## Demo project

Project name: Website Redesign (owner: A, member: M)

| Task | Status | Priority | Assigned to | Due date |
| --- | --- | --- | --- | --- |
| Build navbar | In progress | High | M | |
| Create login page | To do | Medium | nobody | |
| Test responsive layout | Done | Low | A | |
| Fix overdue bug | To do | High | M | the day before the demo |

There is also a second project called "Private project" owned by A. M is not a member of it, so it is used to show the "Access denied" page.

## What each account can do

| Action | Owner (A) | Member (M) |
| --- | --- | --- |
| See the project | Yes | Yes |
| Edit or delete the project | Yes | No |
| Add or remove members | Yes | No |
| Create tasks | Yes | Yes |
| Edit a task | Any task | Own tasks or tasks assigned to M |
| Change task status | Any task | Only tasks assigned to M |
| Delete a task | Any task | Only tasks M created |

## Short demo steps (5 minutes)

1. Log in as A. Show the dashboard (counts, projects, overdue tasks).
2. Open Website Redesign. Create a task, then search and filter.
3. Open Settings. Show the members list and try adding an email that does not exist.
4. Log in as M in a different browser. M sees the same project but no Settings button.
5. As M, change the status of a task assigned to M. Try a task that is not assigned to M (no controls shown).
6. As M, open the link of "Private project" to show Access denied.
7. Show the mobile layout (375px) and the Firestore rules screenshots.
