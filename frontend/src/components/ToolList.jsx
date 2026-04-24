// // src/components/ToolList.jsx

// import React from 'react';
// import useToolStore from '../store/ToolStore';
// import useTools from '../hooks/Tools';
// import { Link } from 'react-router-dom';

// const ToolList = () => {
//   const { filteredTools, loading, error } = useTools();
//   const { categories, selectedCategory, setSelectedCategory } = useToolStore();

//   if (loading) return <div className="text-center p-8">Loading tools...</div>;
//   if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;

//   return (
//     <div className="container mx-auto p-4 md:p-8">
//       <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">AI Tool Discovery</h1>

//       {/* Category Filter Section */}
//       <div className="flex flex-wrap justify-center gap-2 mb-8">
//         {categories.map((category) => (
//           <button
//             key={category}
//             onClick={() => setSelectedCategory(category)}
//             className={`px-4 py-2 rounded-full font-medium transition-colors duration-200
//               ${selectedCategory === category
//                 ? 'bg-indigo-600 text-white shadow-lg'
//                 : 'bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600'
//               }`}
//           >
//             {category.replace('_', ' ')}
//           </button>
//         ))}
//       </div>

//       {/* Tool Cards Grid */}
//       <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//         {filteredTools.length > 0 ? (
//           filteredTools.map((tool) => (
//             <div key={tool._id} className="bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
//               <div className="flex items-center mb-4">
//                 <img src={tool.logo} alt={`${tool.name} logo`} className="w-12 h-12 rounded-full mr-4 object-cover" />
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-800">{tool.name}</h2>
//                   <p className="text-sm text-gray-500">{tool.category.replace('_', ' ')}</p>
//                 </div>
//               </div>
//               <p className="text-gray-600 mb-4 line-clamp-3">{tool.description}</p>
//               <div className="flex flex-wrap gap-2 mb-4">
//                 {tool.useCases.map((useCase, index) => (
//                   <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
//                     {useCase}
//                   </span>
//                 ))}
//               </div>
//               <div className="text-sm text-gray-500">
//                 <p><strong>Pricing:</strong> {tool.pricing}</p>
//               </div>
//               <div className="mt-4 flex justify-between items-center">
//                 <a 
//                   href={tool.link} 
//                   target="_blank" 
//                   rel="noopener noreferrer" 
//                   className="inline-block bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
//                 >
//                   Visit Tool
//                 </a>
//                 <Link to={`/tools/${tool._id}`} className="text-indigo-600 text-sm font-medium hover:underline">
//                   View Reviews &rarr;
//                 </Link>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="col-span-full text-center text-gray-500">No tools found for this category.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ToolList;


// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from '../api/axios';
// import useAuthStore from '../store/AuthStore';
// import {Link} from 'react-router-dom';

// const ToolDetail = () => {
//   const { toolId } = useParams();
//   const [tool, setTool] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuthStore();

//   // State for new review form
//   const [newReview, setNewReview] = useState({ title: '', comment: '', rating: 5 });

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [toolRes, reviewsRes] = await Promise.all([
//           axios.get(`/tools/${toolId}`), // You'd need to add this API route
//           axios.get(`/reviews/tools/${toolId}`)
//         ]);
//         setTool(toolRes.data);
//         setReviews(reviewsRes.data);
//       } catch (err) {
//         setError('Failed to load tool or reviews.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [toolId]);

//   const handleReviewSubmit = async (e) => {
//       e.preventDefault();
//       try {
//           const res = await axios.post(`/reviews/tools/${toolId}`, newReview);
//           setReviews([...reviews, res.data]);
//           setNewReview({ title: '', comment: '', rating: 5 });
//       } catch (err) {
//           console.error('Failed to submit review.', err);
//       }
//   };

//   if (loading) return <div className="text-center p-8">Loading...</div>;
//   if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
//   if (!tool) return <div className="text-center p-8">Tool not found.</div>;

//   return (
//     <div className="container mx-auto p-4 md:p-8">
//       <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
//         <div className="flex items-center mb-4">
//           <img src={tool.logo} alt={`${tool.name} logo`} className="w-16 h-16 rounded-full mr-4" />
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
//             <p className="text-md text-gray-500">{tool.category.replace('_', ' ')}</p>
//           </div>
//         </div>
//         <p className="text-gray-700 mb-4">{tool.description}</p>
//         <div className="flex flex-wrap gap-2 mb-4">
//           {tool.useCases.map((useCase, index) => (
//             <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
//               {useCase}
//             </span>
//           ))}
//         </div>
//         <p className="text-sm text-gray-500"><strong>Pricing:</strong> {tool.pricing}</p>
//         <div className="mt-6">
//           <a href={tool.link} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
//             Visit Tool
//           </a>
//         </div>
//       </div>

//       {/* Reviews Section */}
//       <div className="bg-white rounded-xl shadow-lg p-8">
//         <h2 className="text-2xl font-bold mb-4">Reviews</h2>
//         {user ? (
//           <form onSubmit={handleReviewSubmit} className="mb-6 space-y-4">
//             <h3 className="text-lg font-semibold">Write a Review</h3>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Title</label>
//               <input type="text" value={newReview.title} onChange={(e) => setNewReview({ ...newReview, title: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Comment</label>
//               <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required></textarea>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Rating</label>
//               <select value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required>
//                 {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
//               </select>
//             </div>
//             <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Submit Review</button>
//           </form>
//         ) : (
//           <p className="text-center text-gray-600">Please <Link to="/login" className="text-indigo-600 hover:underline">log in</Link> to leave a review.</p>
//         )}

//         {reviews.length > 0 ? (
//           <div className="space-y-4">
//             {reviews.map(review => (
//               <div key={review._id} className="border-b pb-4">
//                 <div className="flex justify-between items-center">
//                   <h4 className="font-semibold">{review.title}</h4>
//                   <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
//                 </div>
//                 <p className="text-sm text-gray-600">{review.comment}</p>
//                 <p className="text-xs text-gray-500 mt-1">Reviewed by: {review.user?.name || 'Anonymous'}</p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500">No reviews yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ToolDetail;


// src/components/ToolList.jsx
import React, { useEffect, useRef, useState } from 'react';
import useToolStore from '../store/ToolStore';
import useTools from '../hooks/Tools';
import { Link } from 'react-router-dom';
import Analytics from '../hooks/Analytics';
import { useSelector } from 'react-redux';
import { Bookmark } from 'lucide-react';
import SaveToolModal from './SaveToolModal';
import useBookmarks from '../hooks/Bookmarks';
import NavBar from './NavBar';

// Public header for non-logged-in users
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
            className="bg-card text-primary px-4 py-2 rounded-lg font-medium hover:bg-secondary transition-colors"
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

const ToolList = () => {
  const { filteredTools, loading, error } = useTools();
  const { categories, selectedCategory, setSelectedCategory } = useToolStore();
  const { recordEvent } = Analytics();
  const { token, user } = useSelector((state) => state.auth);
  const { bookmarks } = useBookmarks();

  // Modal state
  const [activeToolId, setActiveToolId] = useState(null);

  // Track already recorded impressions to prevent duplicates
  const recordedImpressions = useRef(new Set());

  // Create observer for tool cards
  useEffect(() => {
    if (!token || filteredTools.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const toolId = entry.target.getAttribute('data-toolid');
            if (toolId && !recordedImpressions.current.has(toolId)) {
              recordEvent(toolId, 'impression', token).catch(() => { });
              recordedImpressions.current.add(toolId);
            }
          }
        });
      },
      { threshold: 0.3 } // 30% of card visible = impression
    );

    // Observe each tool card
    const cards = document.querySelectorAll('.tool-card');
    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
    };
  }, [filteredTools, token, recordEvent]);

  // Helper to check if tool is saved
  const isToolSaved = (toolId) => {
    return bookmarks.some(collection =>
      collection.tools?.some(t => t.tool === toolId || t.tool._id === toolId)
    );
  };

  if (loading) return <div className="text-center p-8 text-muted-foreground">Loading tools...</div>;
  if (error) return <div className="text-center p-8 text-destructive">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Conditional Navigation */}
      {user ? <NavBar /> : <PublicHeader />}

      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-extrabold text-foreground text-center mb-8">
          AI Tool Discovery
        </h1>

        {/* Category Filter Section */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200
                ${selectedCategory === category
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary'
                }`}
            >
              {category.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Tool Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => {
              const isSaved = isToolSaved(tool._id);
              return (
                <div
                  key={tool._id}
                  data-toolid={tool._id}
                  className="tool-card bg-card rounded-xl shadow-md overflow-hidden p-6 border border-border hover:shadow-xl transition-shadow duration-300 relative group"
                >
                  {/* Save Button (Absolute Top Right) - Only for logged in users */}
                  {user && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveToolId(tool._id);
                      }}
                      className="absolute top-4 right-4 p-2 bg-card/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-secondary transition-all z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title={isSaved ? "Saved" : "Save"}
                    >
                      <Bookmark
                        size={20}
                        className={isSaved ? "fill-foreground text-foreground" : "text-muted-foreground"}
                      />
                    </button>
                  )}

                  <div className="flex items-center mb-4">
                    <img
                      src={tool.logo}
                      alt={`${tool.name} logo`}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-card-foreground">
                        {tool.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {tool.category.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {tool.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.useCases.map((useCase, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      <strong className="text-card-foreground">Pricing:</strong> {tool.pricing}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <a
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                      onClick={() =>
                        token && tool?._id && recordEvent(tool._id, 'click', token)
                      }
                    >
                      Visit Tool
                    </a>
                    <Link
                      to={`/tools/${tool._id}`}
                      className="text-primary text-sm font-medium hover:underline"
                      onClick={() =>
                        token &&
                        tool?._id &&
                        recordEvent(tool._id, 'click', token)
                      }
                    >
                      View Reviews &rarr;
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              No tools found for this category.
            </p>
          )}
        </div>

        {/* Save Modal */}
        <SaveToolModal
          isOpen={!!activeToolId}
          onClose={() => setActiveToolId(null)}
          toolId={activeToolId}
        />
      </div>
    </div>
  );
};

export default ToolList;
