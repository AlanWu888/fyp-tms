## [0.25] - 17/04/2024

Clean Up

## Fixes

- time totals previosuly broken but are now fixed, 1 + "1:000" previously returned 11, now returns 2

## Removed

- Console.log statements in the code

## [0.24] - 07/04/2024

Additional Fixes

## Added

- suggestive inputs for task descriptions when adding tasks

## Fixes

- time totals in project view instead of "00:00" placeholder

## [0.23] - 07/04/2024

Fixes

## Added

- added error message to reset password page
- added no entries message to reports page
- routing paths between reports and projects
- added disabled button state to invoice tasks picker
- manage screen task folding

## Fixes

- error messages for new Password form updated
- api route protection for password resetting
- only allow for unique emails: admin edit user
- fixed timesheets uploading to the wrong day: timesheets previously uploaded to the day prior
- Renamed time entry edit modal
- fixed NaN:NaN on week view
- manager's manage values: now displaying error messages
- manager add to project: renamed modal
- manager add to project: only allow when the email is in the system
- manager invoices: added disabled state to invoice tasks picker
- manager manage: routing fixes
- date picker in reports/view-task now functional

## Removed

- TODO list
- User Reports page

## [0.22] - 03/04/2024

BT-57 Clean up functions

## Added

- Ability to delete projects from the system
- Updated Access Denied page

## Fixes

- Modal padding in BT-62
- User permissions shown in AddUser and EditUser
- API route protection

## [0.21] - 26/03/2024

-- no ticket

## Fixes

- filteredData key splitter in Manager's user breakdown changed from "-" to a unique string

## [0.20] - 26/03/2024

BT-62 Change alerts to modals

## Added

- Changed nearly all alerts and window.confirms into modals:
  - Manager
    - Removing users from projects
    - Adding a new project
  - Admin
    - Edit user
    - Remove user
  - User
    - Removing timesheet entries
    - Updating password modals

## [0.19] - 24/03/2024

-- no ticket

## Fixes

- Renamed application name
- Fixed user generation txt file, email provided name field

## [0.18] - 24/03/2024

BT-33 User Screens

## Added

- Time entry screens added for users
- Projects screen added for users, with some changes made
  - Users cannot add users to the project, or see project budget

## Fixes

- Navbar links for users

## [0.17] - 23/03/2024

BT-61 Invoicing

## Added

- Invoicing feature added, can select tasks to include into an invoice
- Update Task rates on invoicing page

## Fixes

- Build Errors:
  - build error fix: 215:56 Error: can be escaped with , , , . react/no-nescaped-entities
  - renamed UserBreakdownTotal to solve build error

## Removed

- JSON display for manager projects
- old admin page

## [0.16] - 22/03/2024

BT-60 Create Reports Screen

## Added

- Reports screen as per designs with clickable links to explore timesheet entries
- Created Manage page to support Report functionality

## Fixes

- Timesheet entry functionality that was broken is now fixed (previously could not add an entry due to misnaming variables in a refactor)

## [0.15] - 17/03/2024

BT-55 Duplicate Entries on Day view (fix)

## Fixes

- Fixed duplicate key issue and removed comments

## [0.14] - 17/03/2024

BT-54 Duplicate Entries on Day view (fix)

## Fixes

- Does not allow for multiple day view entries anymore, fixed by setting the time of an entry to 0

## [0.13] - 17/03/2024

BT-56 Reset Password Screen

## Added

- Added ability for users to reset their passwords based on associated email
- use of SendGrid for emails

## [0.12] - 16/03/2024

BT-32 Admin UI Screen

## Added

- Admin users can add, remove and edit users on the timesheet management system

## [0.11] - 15/03/2024

BT-36 Projects Screen

## Added

- Manager user can see the projects screen, can also add and manage projects using UI
- Users can only see the projects they are a part of
- Updates to projects will update the repsective project logs
- Calendar picker component

## Fixes

- Disable state added to custom button component

## [0.10] - 08/03/2024

BT-35 Timesheet week view

## Added

- Time page header, able to choose between week and day view (completely functional)
- Live data displayed to Week Time tab for manager users
- Ability to add, edit and delete a timesheet entry on the week view

## Fixes

- Day view now displays Monday to Sunday rather than Sunday to Monday
- Disabled state added to Button component (styling)

## [0.09] - 04/03/2024

BT-37 Timesheet day view

## Added

- Time page header, able to choose between week and day view (non functional at the moment)
- Live data to Time tab and Project tab for manager users
- Ability to add, edit and delete a timesheet entry

## Fixes

- Changes made to api/Timesheet, removed entries property in the Timesheet mongoose schema
- Removed console.logs in across the repository

## [0.08] - 29/02/2024

BT-50 Add log out functionality for all users

## Added

- Logout capability using next.js api auth signout route
- Changes made to redirect routes for different user types

## Fixes

- Brought back middleware route authorisation

## [0.07] - 20/02/2024

BT-52 Create Figma Components

### Added

- API routes available:
  - Users: GET, POST, PATCH, DELETE
  - Projects: GET, POST, PATCH, DELETE
  - Timesheets: GET, POST, PATCH, DELETE
  - Tasks: GET, POST, PATCH, DELETE
  - Clients: GET, POST, PATCH, DELETE
  - LogMessages: GET, POST
- User session information added to manager's screen (for development purposes only)

## Fixes

- Added a Development collection to mongoDB

---

## [0.06] - 17/02/2024

BT-51 Create Figma Components

### Added

- Created re-usable button component
- Created select/dropdown menu component
- Created checkbox component

---

## [0.05] - 15/02/2024

BT-49 change text input to dropdown menu in user creation form

### Fixes

- Text input for user role changed to dropdown menu

---

## [0.04] - 15/02/2024

BT-29 change text input to dropdown menu in user creation form

### Added

- Added additional mongoose models to support user functionality in the timesheet management system
- Added GET and POST API methods to MongoDB (temporary APIs while additional API designs are done)

---

## [0.03] - 01/02/2024

BT-48 Add loading spinner to cover the role-redirect screen

### Added

- Loading spinner when redirecting users
- Added Bast Inc Logo to loading screen

### Fixes

- Admin pages were not routed properly previously, this has been fixed
- Admin Navbar is now showing
- General formatting

---

## [0.02] - 01/02/2024

BT-45 Create Navbars for different users

### Added

- Navbar UI for different users types
- Changed font style to Mulish (as per designs)

---

## [0.01] - 01/02/2024

BT-46 Create login page

### Added

- Login / Logout / Authentication capability
- Connection with MongoDB
- Add/Create user capability
- Role-based authorization
- Redirect on authentication
- Added prettier command
