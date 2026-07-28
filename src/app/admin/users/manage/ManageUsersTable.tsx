'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { deleteParticipant, deleteParticipants } from '@/app/actions';
import styles from './page.module.css';

type Participant = {
  id: string;
  nickname: string;
  animal: string;
  colors: string[];
  fullName: string;
  phone: string;
  createdAt: Date;
};

export default function ManageUsersTable({ initialParticipants }: { initialParticipants: Participant[] }) {
  const [participants, setParticipants] = useState(initialParticipants);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Sync state when server component data refetches
  useEffect(() => {
    setParticipants(initialParticipants);
  }, [initialParticipants]);

  // Auto-refresh the page data every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 15000);
    return () => clearInterval(interval);
  }, [router]);

  const filteredParticipants = participants.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.nickname.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.animal.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    startTransition(async () => {
      const result = await deleteParticipant(id);
      if (result.success) {
        setParticipants((prev) => prev.filter((p) => p.id !== id));
        const newSelected = new Set(selectedIds);
        newSelected.delete(id);
        setSelectedIds(newSelected);
        router.refresh();
      } else {
        alert(result.error || 'Failed to delete user');
      }
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} users?`)) return;

    startTransition(async () => {
      const result = await deleteParticipants(Array.from(selectedIds));
      if (result.success) {
        setParticipants((prev) => prev.filter((p) => !selectedIds.has(p.id)));
        setSelectedIds(new Set());
        setLastSelectedIndex(null);
        router.refresh();
      } else {
        alert(result.error || 'Failed to delete users');
      }
    });
  };

  const handleCheckboxClick = (e: React.MouseEvent, index: number, id: string) => {
    const next = new Set(selectedIds);
    const isSelecting = !next.has(id);

    if (e.shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);

      for (let i = start; i <= end; i++) {
        const rowId = filteredParticipants[i].id;
        if (isSelecting) {
          next.add(rowId);
        } else {
          next.delete(rowId);
        }
      }
    } else {
      if (isSelecting) {
        next.add(id);
      } else {
        next.delete(id);
      }
    }

    setSelectedIds(next);
    setLastSelectedIndex(index);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredParticipants.length && filteredParticipants.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredParticipants.map((p) => p.id)));
    }
    setLastSelectedIndex(null);
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h2 className={styles.tableTitle}>
          User Data Log
        </h2>
        <span className={styles.tableCount}>{participants.length} registered</span>
      </div>

      <div className={styles.tableControls}>
        <input
          type="text"
          placeholder="Search users..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {selectedIds.size > 0 && (
          <button
            onClick={handleBulkDelete}
            disabled={isPending}
            className={styles.bulkDeleteBtn}
          >
            DELETE SELECTED ({selectedIds.size})
          </button>
        )}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '40px', paddingLeft: '24px' }}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={filteredParticipants.length > 0 && selectedIds.size === filteredParticipants.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Timestamp</th>
              <th>Full Name</th>
              <th>Nickname</th>
              <th>Contact</th>
              <th>Details</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants.map((item, index) => (
              <tr key={item.id} className={selectedIds.has(item.id) ? styles.selectedRow : ''}>
                <td style={{ paddingLeft: '24px' }}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedIds.has(item.id)}
                    onChange={() => { }}
                    onClick={(e) => handleCheckboxClick(e, index, item.id)}
                  />
                </td>
                <td className={styles.textMuted}>
                  {new Date(item.createdAt).toLocaleDateString()} <br /> {new Date(item.createdAt).toLocaleTimeString()}
                </td>
                <td className={styles.textHighlight}>{item.fullName}</td>
                <td className={`${styles.monoText} ${styles.textHighlight}`}>{item.nickname}</td>
                <td>
                  <div className={styles.detailsList}>
                    <span className={styles.textMuted}>{item.phone}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.detailsList}>
                    <span className={styles.textMuted}>Animal: <span className={styles.textHighlight}>{item.animal}</span></span>
                    <span className={styles.textMuted}>Colors: <span className={styles.textHighlight}>{item.colors.join(', ')}</span></span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isPending}
                    className={styles.deleteBtn}
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
            {filteredParticipants.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-geist-mono), monospace' }}>
                  {participants.length === 0 ? 'No user records found.' : 'No users match your search.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
