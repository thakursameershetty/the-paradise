'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteParticipant } from '@/app/actions';

type Participant = {
  id: string;
  nickname: string;
  animal: string;
  colors: string[];
  fullName: string;
  email: string;
  phone: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  createdAt: Date;
};

export default function ManageUsersTable({ initialParticipants }: { initialParticipants: Participant[] }) {
  const [participants, setParticipants] = useState(initialParticipants);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    startTransition(async () => {
      const result = await deleteParticipant(id);
      if (result.success) {
        setParticipants((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      } else {
        alert(result.error || 'Failed to delete user');
      }
    });
  };

  return (
    <div className="border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm rounded-sm overflow-hidden">
      <div className="border-b border-zinc-800 p-6 flex items-center justify-between bg-zinc-900/20">
          <h2 className="font-mono text-xs text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              User Data Log
          </h2>
          <span className="text-xs font-mono text-zinc-600">{participants.length} registered</span>
      </div>
      
      <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-mono text-[10px] uppercase tracking-widest bg-zinc-900/10">
                      <th className="p-4 font-normal">Timestamp</th>
                      <th className="p-4 font-normal">Full Name</th>
                      <th className="p-4 font-normal">Nickname</th>
                      <th className="p-4 font-normal">Contact</th>
                      <th className="p-4 font-normal">Details</th>
                      <th className="p-4 font-normal text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="font-mono text-sm text-zinc-300">
                  {participants.map((item) => (
                      <tr key={item.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                          <td className="p-4 text-zinc-500 whitespace-nowrap">
                              {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
                          </td>
                          <td className="p-4 text-white/90">{item.fullName}</td>
                          <td className="p-4 tabular-nums text-white/90">{item.nickname}</td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1 text-xs">
                              <span className="text-zinc-300">{item.email}</span>
                              <span className="text-zinc-500">{item.phone}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1 text-xs text-zinc-400">
                              <span>Animal: {item.animal}</span>
                              <span>Colors: {item.colors.join(', ')}</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                              <button 
                                onClick={() => handleDelete(item.id)}
                                disabled={isPending}
                                className="text-red-500 hover:text-red-400 text-[10px] uppercase tracking-wider px-3 py-1.5 border border-red-900/30 rounded-sm hover:bg-red-900/10 transition-colors disabled:opacity-50"
                              >
                                Delete
                              </button>
                          </td>
                      </tr>
                  ))}
                  {participants.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-zinc-600 font-mono text-sm">
                        No user records found.
                      </td>
                    </tr>
                  )}
              </tbody>
          </table>
      </div>
    </div>
  );
}
