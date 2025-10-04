# Career Navigator - Smart Job Recommender

Career Navigator is a web application designed to help users find suitable job roles by leveraging their professional portfolio and resume. It provides a personalized dashboard, AI-powered career guidance, and tools to track job applications and skill development.

## 🚀 Project Status

This project is currently in the initial development phase. The frontend is built with React, Vite, and `shadcn/ui`, and it includes a landing page, authentication, and a user dashboard. The backend is powered by Supabase, with a database schema designed to support user profiles, job applications, certifications, and more.

While the core AI/ML features for resume analysis and job matching are not yet implemented, the application provides a solid foundation for future development.

## 🛠️ Tech Stack

- **Frontend:**
  - [React](https://reactjs.org/)
  - [Vite](https://vitejs.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/)
- **Backend:**
  - [Supabase](https://supabase.io/) (PostgreSQL, Authentication, Storage)
- **Deployment:** (Not yet configured)

## ⚙️ Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [bun](https://bun.sh/) (or npm/yarn)
- [Supabase Account](https://supabase.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/career-navigator.git
   cd career-navigator
   ```

2. **Install dependencies:**
   ```sh
   bun install
   ```

3. **Set up Supabase:**
   - Create a new project on [Supabase](https://supabase.com/).
   - Go to the **SQL Editor** and run the SQL script from `supabase/migrations/20251004065518_e5199070-cdd9-4fcd-99f5-235933a9e3c0.sql` to create the database tables.
   - In your Supabase project settings, go to **API** and find your Project URL and `anon` public key.

4. **Configure environment variables:**
   - Create a `.env` file in the root of the project.
   - Add your Supabase URL and public key to the `.env` file:
     ```
     VITE_SUPABASE_URL=YOUR_SUPABASE_URL
     VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_ANON_KEY
     ```

5. **Run the development server:**
   ```sh
   bun run dev
   ```
   The application will be available at `http://localhost:5173`.

## 🗃️ Database Schema

The database schema is defined in the Supabase migration file. It includes the following tables:

- `profiles`: Stores user profile information.
- `certifications`: Stores user certifications.
- `job_applications`: Tracks user job applications.
- `career_chats`: Stores the history of AI-powered career chats.
- `user_settings`: Manages user-specific settings like themes and notifications.

Row Level Security (RLS) is enabled on all tables to ensure that users can only access their own data.

## 🗺️ Future Roadmap

- ✅ **Real Authentication:** Implemented Supabase authentication for secure user login and registration.
- **Connect Dashboard to Backend:** Fetch and display user data from Supabase on the dashboard.
- **Resume Upload and Parsing:** Allow users to upload their resumes and parse them to extract key information.
- **AI/ML Integration:**
  - Integrate a pre-trained NLP model (e.g., BERT) for semantic analysis of resumes and job descriptions.
  - Develop a recommendation engine to match users with suitable job roles.
- **Job Board Integration:** Fetch job listings from external APIs (e.g., LinkedIn, Indeed).
- **User Feedback Loop:** Implement a system for users to provide feedback on job recommendations, which can be used to fine-tune the recommendation model.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
