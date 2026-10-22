# TaskFlow - Test Results

Name: Mohammed Al-Zaneen
Date tested: ____________
Browser: Chrome
Tested on: localhost / deployed link (write which one)

Test accounts: A = project owner, B = member, C = not a member

## Test cases

| ID | What I tested | Expected | Result | Notes |
| --- | --- | --- | --- | --- |
| TC-01 | Register with valid data | Account and profile created | | |
| TC-02 | Register with wrong email | Error shown, nothing saved | | |
| TC-03 | Log in then refresh | Still logged in | | |
| TC-04 | Open dashboard while logged out | Goes to login | | |
| TC-05 | Create a project, refresh | Project is still there | | |
| TC-06 | Edit project as a member | Not allowed | | |
| TC-07 | Add an existing user as member | Member sees the project | | |
| TC-08 | Add an email that is not registered | Error, nobody added | | |
| TC-09 | Create task without a title | Cannot save | | |
| TC-10 | Change task status | New status stays after refresh | | |
| TC-11 | Filter by high priority | Only high tasks shown | | |
| TC-12 | Search by title | Only matching tasks shown | | |
| TC-13 | Open a project link of someone else | Access denied | | |
| TC-14 | Try a forbidden action (see below) | Rules reject it | | |
| TC-15 | Mobile width 375px | Nothing broken | | |
| TC-16 | Internet off, try to save | Error shown, no fake success | | |

## Firestore rules check (Rules Playground)

| Action | Account | Expected | Result |
| --- | --- | --- | --- |
| Delete project | B (member) | Denied | Denied |
| Delete project | A (owner) | Allowed | Allowed |

Screenshots: docs/screenshots/07-rules-denied-member.png and 07b-rules-allowed-owner.png

## Problems I found and fixed

- 

## Known limitations

- Only one person can be assigned to a task.
- Filtering and search run in the browser, so it is meant for small projects.
