import ProtectedRoute from "@/components/ProtectedRoute";
import { DashBoardClient } from "@/components/DashboardClient";

export default async function Dashboard() {

  return (
    <ProtectedRoute>
      <DashBoardClient/>
    </ProtectedRoute>
  );
}
