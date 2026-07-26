import { redirect } from 'next/navigation';

export default function FeedPage() {
  // If someone directly lands on /feed without the state from /explore,
  // we redirect them back to /explore so they can create their Paradise ID.
  redirect('/explore');
}
