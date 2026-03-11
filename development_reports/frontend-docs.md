# Project Documentation: FCBook Frontend

## Overview

This project is a Vue 3 + Vite-based frontend for the "FastCat" booking and management system. It provides modules for port, vessel, route, schedule, and rate management, as well as booking and user authentication. The UI is styled with Tailwind CSS and includes modular components and views for maintainability.

---

## Project Structure

- **index.html**: Entry HTML file for the app.
- **package.json**: Project metadata, dependencies, and scripts.
- **vite.config.js**: Vite configuration, including plugins for Vue and Tailwind CSS.
- **src/**: Main source folder
  - **main.js**: App entry point, sets up Vue, router, and global components.
  - **App.vue**: Root component, sets up layout and router view.
  - **assets/**: Static assets and main CSS files (Tailwind and custom styles).
  - **components/**: Reusable Vue components (modals, forms, sidebar, etc.).
  - **router/**: Vue Router configuration and route guards.
  - **views/**: Page-level Vue components for each module/feature.
    - **ratePassengerTemplates/**: Submodules for rate and passenger type management.

---

## Key Features

- **Authentication**: JWT-based login with route guards to protect pages.
- **Sidebar Navigation**: Collapsible sidebar with links to all modules.
- **Modules**:
  - **Ports**: Manage port information.
  - **Vessels**: Manage vessel data.
  - **Routes**: Manage travel routes.
  - **Schedule**: Manage schedules for vessels/routes.
  - **Rates/Passenger Types**: Manage rates and passenger types.
  - **Teller Booking**: Booking interface for tellers.
- **Reusable Modals**: For creating/editing ports, vessels, routes, schedules, rates, etc.
- **Tailwind CSS**: Utility-first styling for rapid UI development.

---

## Main Dependencies

- **vue**: UI framework (Vue 3)
- **vue-router**: Routing
- **@heroicons/vue** and **lucide-vue-next**: Icon libraries
- **tailwindcss**: CSS framework
- **vite**: Build tool

---

## Routing

Routes are defined in `src/router/index.js` and include guards for authentication. Main routes:

- `/` (Login)
- `/dashboard` (Home)
- `/create-port`, `/vessels`, `/routes`, `/schedule`, `/rates-discounts` (Management modules)
- `/teller-booking` (Booking)

---

## Styling

- **src/assets/main.css**: Tailwind and custom utility classes
- **src/style.css**: Base styles and resets

---

## How to Run

- `npm install` to install dependencies
- `npm run dev` to start development server
- `npm run build` to build for production

---

## File/Folder Reference

- **components/**: All modal dialogs, sidebar, headers, and forms
- **views/**: Main pages for each module
- **router/**: Routing logic and guards
- **assets/**: Images, icons, and CSS

---

## Contribution

- Follow Vue 3 composition API and SFC best practices
- Use Tailwind utility classes for styling
- Keep components modular and reusable

---

## License

See `README.md` for license and additional info.
