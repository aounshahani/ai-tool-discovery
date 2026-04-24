import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useSelector } from 'react-redux';
import { Bookmark, Flag, ExternalLink, Star, MessageSquare } from 'lucide-react';
import SaveToolModal from '../components/SaveToolModal';
import useBookmarks from '../hooks/Bookmarks';
import ToolRecommendations from '../components/ToolRecommendations';
import NavBar from '../components/NavBar';

const PublicHeader = () => (
  <nav className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex-shrink-0 flex items-center">
          <Link to="/tools" className="text-2xl font-bold tracking-wide flex items-center gap-2">
            AI.Discover
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-primary-foreground/10 text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary-foreground/20 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

const ToolDetail = () => {
  const { toolId } = useParams();
  const [tool, setTool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [newReview, setNewReview] = useState({ title: '', comment: '', rating: 5 });

  // Bookmark logic
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const { bookmarks } = useBookmarks();
  const isSaved = bookmarks.some(collection =>
    collection.tools?.some(t => t.tool === toolId || t.tool._id === toolId)
  );

  // Report logic
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState({ reason: 'broken_link', description: '' });

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/tools/${toolId}/report`, reportData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsReportModalOpen(false);
      alert("Report submitted successfully. Thank you!");
      setReportData({ reason: 'broken_link', description: '' });
    } catch (error) {
      console.error("Report error:", error);
      alert("Failed to submit report. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [toolRes, reviewsRes] = await Promise.all([
          axios.get(`/tools/${toolId}`),
          axios.get(`/reviews/tools/${toolId}`)
        ]);
        setTool(toolRes.data);
        // Check if reviews response has data array
        setReviews(reviewsRes.data.data || reviewsRes.data || []);
      } catch (err) {
        setError('Failed to load tool or reviews.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toolId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/reviews/tools/${toolId}`, newReview);
      // Backend returns { success, message, data: reviewObject }
      if (res.data.success && res.data.data) {
        setReviews([...reviews, res.data.data]);
        setNewReview({ title: '', comment: '', rating: 5 });
        alert(res.data.message || 'Review submitted successfully!');
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to submit review';
      alert(errorMsg);
    }
  };

  if (loading) return <div className="text-center p-8 text-muted-foreground">Loading...</div>;
  if (error) return <div className="text-center p-8 text-destructive">{error}</div>;
  if (!tool) return <div className="text-center p-8 text-muted-foreground">Tool not found.</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {user ? <NavBar /> : <PublicHeader />}

      <div className="container mx-auto p-4 md:p-8 space-y-8">
        {/* Tool Header & Info */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex items-start gap-6">
              {tool.logo && (
                <img
                  src={tool.logo}
                  alt={`${tool.name} logo`}
                  className="w-20 h-20 rounded-xl object-cover border border-border bg-secondary/10"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-card-foreground mb-2">{tool.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {tool.category?.replace('_', ' ')}
                  </span>
                  <span className="text-muted-foreground text-sm flex items-center gap-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    {tool.averageRating ? tool.averageRating.toFixed(1) : 'New'} ({reviews.length} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              {user && (
                <button
                  onClick={() => setIsSaveModalOpen(true)}
                  className={`p-3 rounded-lg border transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none ${isSaved
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-secondary border-transparent text-muted-foreground hover:bg-secondary/80"
                    }`}
                  title={isSaved ? "Saved to collection" : "Save to collection"}
                >
                  <Bookmark size={20} className={isSaved ? "fill-current" : ""} />
                  <span className="md:hidden">Save</span>
                </button>
              )}
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground font-medium px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none"
              >
                Visit Website <ExternalLink size={18} />
              </a>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground mb-2">About</h2>
              <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-card-foreground mb-3">Use Cases</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.useCases?.map((useCase, index) => (
                    <span key={index} className="bg-secondary text-secondary-foreground text-xs font-medium px-3 py-1.5 rounded-lg">
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-card-foreground mb-3">Integrations</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.integrationOptions && tool.integrationOptions.length > 0 ? (
                    tool.integrationOptions.map((option, index) => (
                      <span key={index} className="bg-secondary text-secondary-foreground border border-border text-xs font-medium px-3 py-1.5 rounded-lg">
                        {option}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">No integrations listed</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex flex-wrap justify-between items-center gap-4">
              <div className="text-sm">
                <span className="font-medium text-card-foreground">Pricing: </span>
                <span className="text-muted-foreground">{tool.pricing}</span>
              </div>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="text-muted-foreground hover:text-destructive text-sm flex items-center gap-1 transition-colors"
              >
                <Flag size={14} /> Report Issue
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-2">
            <MessageSquare className="text-primary" /> Reviews
          </h2>

          {user ? (
            <form onSubmit={handleReviewSubmit} className="mb-8 bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Write a Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Title</label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                    maxLength={100}
                    placeholder="Summarize your experience"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className={`p-1 rounded-full transition-colors ${newReview.rating >= star ? 'text-yellow-400' : 'text-muted-foreground/30'}`}
                      >
                        <Star size={24} className={newReview.rating >= star ? "fill-current" : ""} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Comment</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                    maxLength={1000}
                    placeholder="Share your thoughts..."
                  ></textarea>
                </div>
                <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors">
                  Submit Review
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-secondary/30 p-6 rounded-xl border border-border text-center mb-8">
              <p className="text-muted-foreground">
                Please <Link to="/login" className="text-primary hover:underline font-medium">log in</Link> to leave a review.
              </p>
            </div>
          )}

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review._id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-card-foreground">{review.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-muted-foreground/30"} />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">• {new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    By {review.user?.name || 'Anonymous'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No reviews yet. Be the first to review!
            </div>
          )}
        </div>

        {/* Recommendations */}
        <ToolRecommendations category={tool.category} currentToolId={tool._id} />

        {/* Save Modal */}
        <SaveToolModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          toolId={toolId}
        />

        {/* Report Modal */}
        {isReportModalOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsReportModalOpen(false)}>
            <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4 text-card-foreground">Report Issue</h3>
              <form onSubmit={handleReportSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Reason</label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    value={reportData.reason}
                    onChange={e => setReportData({ ...reportData, reason: e.target.value })}
                  >
                    <option value="broken_link">Broken Link</option>
                    <option value="inappropriate_content">Inappropriate Content</option>
                    <option value="incorrect_info">Incorrect Information</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Description</label>
                  <textarea
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    rows="3"
                    value={reportData.description}
                    onChange={e => setReportData({ ...reportData, description: e.target.value })}
                    required
                    placeholder="Please provide details..."
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 font-medium transition-colors"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolDetail;