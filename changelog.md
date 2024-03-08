## [0.10] - 08/03/2024

BT-37 Timesheet week view

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
