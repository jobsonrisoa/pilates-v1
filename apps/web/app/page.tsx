import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Pilates & Physiotherapy Management System',
};

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Pilates System</h1>
      <p>Initial project (App Router).</p>
      <ul>
        <li>
          <Link href="/login">Go to login</Link>
        </li>
        <li>
          <Link href="/dashboard">Go to dashboard</Link>
        </li>
      </ul>
    </main>
  );
}
