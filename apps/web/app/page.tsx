import Link from 'next/link';

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
