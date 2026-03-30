import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import DashboardPage from "@/pages/DashboardPage";
import ListPage from "@/pages/ListPage";
import { JobPostingsProvider } from "@/context/JobPostingsContext";

export default function App() {
  return (
    <JobPostingsProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </JobPostingsProvider>
  );
}
