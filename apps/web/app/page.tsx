import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Pilates System</h1>
      <p>Projeto inicial (App Router).</p>
      <ul>
        <li>
          <Link href="/login">Ir para login</Link>
        </li>
        <li>
          <Link href="/dashboard">Ir para dashboard</Link>
        </li>
      </ul>
    </main>
  );
}


