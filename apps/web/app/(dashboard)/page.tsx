import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Pilates System',
  description: 'User dashboard for Pilates & Physiotherapy management',
};

export default function DashboardPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Dashboard placeholder.</p>
    </main>
  );
}
