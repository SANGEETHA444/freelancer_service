import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FreeReviewsFeedback = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [averageRating, setAverageRating] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchReviews(); fetchAverageRating()
  }, [token, page, navigate])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const res = await fetch(`http://localhost:5000/api/reviews/user/${userId}?page=${page}&limit=10`, { headers: { 'Content-Type': 'application/json' } })
      if (!res.ok) throw new Error('Failed to fetch reviews')
      const data = await res.json()
      setReviews(data.reviews || []); setTotalPages(data.pages || 1)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const fetchAverageRating = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/user/${userId}/rating`, { headers: { 'Content-Type': 'application/json' } })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setAverageRating(data.averageRating || 0)
    } catch { }
  }

  const renderStars = r => (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= r ? '#fbbf24' : '#2a2a2a', fontSize: 16 }}>★</span>)}
    </div>
  )

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="t-page-header">
        <h1 className="t-page-title">Reviews & Feedback</h1>
        <p className="t-page-subtitle">See what clients say about your work</p>
      </div>

      {/* Rating summary */}
      <div className="t-card" style={{ marginBottom: 20, padding: '22px 26px', background: 'linear-gradient(135deg,#0a0a0a,#1a2a1a)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <p style={{ fontSize: 12, color: 'rgba(34,197,94,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Your Average Rating</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 48, fontWeight: 800, color: 'var(--green-dark)', lineHeight: 1 }}>{averageRating.toFixed(1)}</span>
          <div>
            {renderStars(Math.round(averageRating))}
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{reviews.length} reviews</p>
          </div>
        </div>
      </div>

      {error && <div className="t-alert t-alert-error">{error}</div>}

      {loading ? (
        <div className="t-spinner"><div className="t-spin" /><span>Loading reviews…</span></div>
      ) : reviews.length === 0 ? (
        <div className="t-card"><div className="t-empty">
          <p className="t-empty-title">No reviews yet</p>
          <p className="t-empty-text">Complete projects and clients can leave you feedback</p>
        </div></div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reviews.map(review => (
              <div key={review._id} className="t-card" style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 2 }}>{review.reviewer?.firstName} {review.reviewer?.lastName}</h3>
                    <p style={{ fontSize: 12, color: 'var(--muted)' }}>{review.reviewer?.title || 'Client'}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {renderStars(review.rating)}
                    <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {review.comment && <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 12 }}>{review.comment}</p>}
                <span className="t-badge t-badge-green" style={{ textTransform: 'capitalize' }}>{review.reviewType} Review</span>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="t-pages">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="t-page-btn">‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, i, arr) => (
                  <React.Fragment key={p}>
                    {i > 0 && arr[i - 1] !== p - 1 && <span style={{ color: 'var(--muted)', padding: '0 4px' }}>…</span>}
                    <button onClick={() => setPage(p)} className={`t-page-btn${page === p ? ' active' : ''}`}>{p}</button>
                  </React.Fragment>
                ))}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="t-page-btn">›</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default FreeReviewsFeedback
