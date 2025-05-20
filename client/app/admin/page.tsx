// app/admin/page.tsx
import { getServerAuthSession } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerAuthSession();

  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold'>Panneau Admin</h1>
    </div>
  );
}
