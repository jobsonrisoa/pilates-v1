import type { Metadata } from 'next';
import { DashboardContent } from './dashboard-content';

export const metadata: Metadata = {
  title: 'Dashboard | Pilates System',
  description: 'User dashboard for Pilates & Physiotherapy management',
};

export default function DashboardPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <DashboardContent />
    </main>
  );
}
