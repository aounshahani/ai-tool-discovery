// import Review from "../model/Review.js";

// // @desc    Bulk delete reviews (for spam removal)
// // @route   DELETE /api/admin/reviews/bulk
// // @access  Private/Admin
// export const bulkDeleteReviews = async (req, res) => {
//     try {
//         const { reviewIds } = req.body;

//         if (!reviewIds || !Array.isArray(reviewIds) || reviewIds.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Review IDs array is required"
//             });
//         }

//         const result = await Review.deleteMany({ _id: { $in: reviewIds } });

//         res.status(200).json({
//             success: true,
//             message: `${result.deletedCount} reviews deleted successfully`,
//             deletedCount: result.deletedCount
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server error",
//             error: error.message
//         });
//     }
// };
