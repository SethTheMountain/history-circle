import { useState } from 'react';
import { FaTrash, FaReply } from 'react-icons/fa';

export default function Post({ post, userId, onDelete, onReply, onDeleteReply }) {
    const isAuthor = post.user_id === userId;
    const [replyContent, setReplyContent] = useState('');

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (replyContent.trim()) {
            onReply(post.id, replyContent);
            setReplyContent('');
        }
    };

    return (
        <div className="post">
            <p className="post-username">{post.username}</p>
            <p>{post.content}</p>
            <p className="post-timestamp">{new Date(post.created_at).toLocaleString()}</p>
            {isAuthor && (
                <button
                    onClick={() => onDelete(post.id)}
                    className="delete-button"
                >
                    <FaTrash style={{ marginRight: '0.5rem' }} /> Delete
                </button>
            )}
            <div className="replies-container">
                {post.replies && post.replies.length > 0 && (
                    <div>
                        <h4>Replies:</h4>
                        {post.replies.map((reply) => (
                            <div key={reply.id} className="reply">
                                <p className="reply-username">{reply.username}: {reply.content}</p>
                                <p className="post-timestamp">{new Date(reply.created_at).toLocaleString()}</p>
                                {reply.user_id === userId && (
                                    <button
                                        onClick={() => onDeleteReply(reply.id)}
                                        className="delete-button"
                                    >
                                        <FaTrash style={{ marginRight: '0.5rem' }} /> Delete
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <form onSubmit={handleReplySubmit} className="reply-form">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="reply-textarea"
                    />
                    <button type="submit" className="form-button">
                        <FaReply style={{ marginRight: '0.5rem' }} /> Reply
                    </button>
                </form>
            </div>
        </div>
    );
}