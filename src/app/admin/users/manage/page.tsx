import { getParticipants } from '@/app/actions';
import ManageUsersTable from './ManageUsersTable';

export const metadata = {
  title: 'Manage Users | The Paradise',
};

export default async function ManageUsersPage() {
  const { participants, success, error } = await getParticipants();

  if (!success) {
    return (
      <div className="p-8 text-red-500 font-mono">
        Error loading users: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-mono uppercase tracking-widest mb-8 text-zinc-300">Manage Users</h1>
        <ManageUsersTable initialParticipants={participants || []} />
      </div>
    </div>
  );
}
