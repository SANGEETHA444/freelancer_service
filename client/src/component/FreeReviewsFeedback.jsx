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
    if (!token) {
      navigate('/login')
      return
    }
    fetchReviews()
    fetchAverageRating()
  }, [token, page, navigate])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `http://localhost:5000/api/reviews/user/${userId}?page=${page}&limit=10`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }

      const data = await response.json()
      setReviews(data.reviews || [])
      setTotalPages(data.pages || 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchAverageRating = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews/user/${userId}/rating`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch rating')
      }

      const data = await response.json()
      setAverageRating(data.averageRating || 0)
    } catch (err) {
      console.error('Error fetching rating:', err)
    }
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Rating */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Reviews & Feedback</h1>
          
          {/* Average Rating Card */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Your Average Rating</p>
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</h2>
                  <div>
                    {renderStars(Math.round(averageRating))}
                    <p className="text-sm text-gray-600 mt-1">{reviews.length} reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-2">No reviews yet</p>
            <p className="text-sm text-gray-500">Complete projects and clients can leave you feedback</p>
          </div>
        ) : (
          <>
            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200">
                  {/* Reviewer Info and Rating */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {review.reviewer?.firstName} {review.reviewer?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{review.reviewer?.title || 'Client'}</p>
                    </div>
                    <div className="text-right">
                      {renderStars(review.rating)}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Review Comment */}
                  {review.comment && (
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                  )}

                  {/* Review Type Badge */}
                  <div className="flex justify-between items-center">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize">
                      {review.reviewType} Review
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .map((p, index, arr) => (
                      <React.Fragment key={p}>
                        {index > 0 && arr[index - 1] !== p - 1 && <span className="px-2">...</span>}
                        <button
                          onClick={() => setPage(p)}
                          className={`px-3 py-2 rounded-lg ${
                            page === p
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    ))}
                </div>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default FreeReviewsFeedback
