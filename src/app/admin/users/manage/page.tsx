import { getParticipants } from '@/app/actions';
import ManageUsersTable from './ManageUsersTable';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    <div className={styles.main}>
      <div className={styles.blurOverlay}></div>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>MANAGE USERS</h1>
        <ManageUsersTable initialParticipants={participants || []} />
      </div>
    </div>
  );
}
