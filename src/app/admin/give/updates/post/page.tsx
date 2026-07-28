'use client';

import { useState, useEffect } from 'react';
import { createAdminPost, getPosts, deleteAdminPost } from '@/app/actions';
import { formatPostContent } from '@/components/ui/post-card';
import styles from './page.module.css';
export default function AdminPostPage() {
  const [activeTab, setActiveTab] = useState<'publish' | 'manage'>('publish');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    const result = await getPosts();
    if (result.success && result.posts) {
      setPosts(result.posts);
    }
    setIsLoadingPosts(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const confirmDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    const result = await deleteAdminPost(postToDelete);
    if (result.success) {
      setMessage({ type: 'success', text: 'Post deleted successfully!' });
      fetchPosts();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to delete post.' });
    }
    setIsDeleting(false);
    setPostToDelete(null);
  };

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const mediaFile = formData.get('mediaFile') as File;

    if (mediaFile && mediaFile.size > 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be below 1MB.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await createAdminPost(formData);

      if (result.success) {
        setMessage({ type: 'success', text: 'Post created successfully!' });
        (e.target as HTMLFormElement).reset();
        fetchPosts(); // Refresh the list
        setTimeout(() => setActiveTab('manage'), 1500); // Switch to manage tab after success
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create post.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.blurOverlay}></div>

      <div className={styles.tabsContainer}>
        <div className={`${styles.tabSlider} ${activeTab === 'publish' ? styles.slidePublish : styles.slideManage}`}></div>
        <button
          className={`${styles.tabBtn} ${activeTab === 'publish' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('publish')}
        >
          PUBLISH
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'manage' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          MANAGE
        </button>
      </div>

      <div className={styles.contentWrapper}>
        {activeTab === 'publish' ? (
          <div className={styles.formContainer}>
            <h1 className={styles.title}>PUBLISH UPDATE</h1>

            {message && (
              <div className={`${styles.message} ${styles[message.type]}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.formGroup} style={{ gap: '1.2rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="content" className={styles.label}>Post Content</label>
                <textarea
                  id="content"
                  name="content"
                  required
                  placeholder="What's the update?"
                  className={styles.textarea}
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mediaFile" className={styles.label}>MEDIA UPLOAD</label>
                <input
                  type="file"
                  id="mediaFile"
                  name="mediaFile"
                  accept="image/*,video/*"
                  className={styles.input}
                  style={{ padding: '9px 16px', background: 'rgba(0, 0, 0, 0.4)', color: 'rgba(255, 255, 255, 0.8)' }}
                />
              </div>

              <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                {isSubmitting ? 'Publishing...' : 'Publish Update'}
              </button>
            </form>
          </div>
        ) : (
          <div className={styles.postsSection}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search posts..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isLoadingPosts ? (
              <div className={styles.postsList}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`${styles.postCard} animate-pulse`}>
                    <div className={styles.postCardTop}>
                      <div className={styles.postContent} style={{ width: '100%' }}>
                        <div style={{ height: '20px', width: '90%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '12px' }} />
                        <div style={{ height: '20px', width: '60%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '24px' }} />
                        <div style={{ height: '14px', width: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                      </div>
                      <div className={styles.postMedia} style={{ background: 'rgba(255,255,255,0.1)' }} />
                    </div>
                    <div className={styles.postCardBottom}>
                      <div style={{ height: '44px', width: '110px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No posts found.</p>
            ) : (
              <div className={styles.postsList}>
                {filteredPosts.map((post) => (
                  <div key={post.id} className={styles.postCard}>
                    <div className={styles.postCardTop}>
                      <div className={styles.postContent}>
                        <p className={styles.postText}>{formatPostContent(post.content)}</p>
                        <div className={styles.postMeta}>
                          <span>{new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}</span>
                          <span>• {post.likes} likes, {post.comments} comments</span>
                        </div>
                      </div>

                      {post.image && (
                        <div className={styles.postMedia}>
                          {post.image.match(/\.(mp4|webm)$/i) ? (
                            <video src={post.image} className={styles.videoPreview} muted loop playsInline />
                          ) : (
                            <img src={post.image} alt="Post media" className={styles.mediaPreview} />
                          )}
                        </div>
                      )}
                    </div>

                    <div className={styles.postCardBottom}>
                      <button
                        onClick={() => setPostToDelete(post.id)}
                        className={styles.deleteBtn}
                        title="Delete Post"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {postToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Delete Post</h2>
            <p className={styles.modalText}>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => setPostToDelete(null)}
                disabled={isDeleting}
              >
                CANCEL
              </button>
              <button
                className={styles.modalConfirmBtn}
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'DELETING...' : 'DELETE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
