import axios from "../api/axios";
import AnalyticsStore from "../store/AnalyticsStore";

const Analytics = () => {
  const { analytics, setAnalytics, addEvent, setLoading, setError } =
    AnalyticsStore();

  // 🔹 Fetch analytics (admin/startup dashboards)
  const fetchAnalytics = async (toolId, token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/analytics/tools/${toolId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Record analytics event (impression, click, engagement)
  const recordEvent = async (toolId, eventType, token) => {
    try {
      const response = await axios.post(
        "/analytics/tools",
        { toolId, eventType },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Add to local state
      addEvent(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to record event");
      throw err;
    }
  };

  return { analytics, fetchAnalytics, recordEvent };
};

export default Analytics;
