import { getServerAuthSession } from '@/auth';
import { redirect } from 'next/navigation';
import ConnectedUsersList from '../components/data/ConnectedUsersList';
import AdminStats from '../components/data/AdminStats';
import AdminFeedbackList from '../components/data/AdminFeedbackList';
import AdminJobsQueue from '../components/data/AdminJobsQueue';

export default async function AdminPage() {
  const session = await getServerAuthSession();

  if (!session || session.user.role !== 'admin') {
    redirect('/home');
  }

  return (
    <>
      <div className='flex gap-8 mb-10'>
        <div className='p-4'>
          <h1 className='text-xl font-bold'>Panneau Admin</h1>
          <ConnectedUsersList />
        </div>
        <AdminStats />
      </div>
      <AdminFeedbackList />
      <AdminJobsQueue />
      <div className='h-32'></div>
    </>
  );
}
