import React, { useState, useEffect } from "react";
import ImageUpload from "../ImageUpload";
import { useSelector } from "react-redux";
import axios from "../../api/axios";

const ToolForm = ({ onSubmit, token, initialData = null, isEditing = false, onCancel }) => {
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: initialData?.name || "",
    logo: initialData?.logo || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    pricing: initialData?.pricing || "",
    useCases: initialData?.useCases ? initialData.useCases.join(", ") : "",
    integrationOptions: initialData?.integrationOptions ? initialData.integrationOptions.join(", ") : "",
    link: initialData?.link || "",
  });

  const [useUrlInput, setUseUrlInput] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  // Check if initial category is custom
  useEffect(() => {
    if (categories.length > 0 && form.category && !categories.some(c => c.slug === form.category)) {
      setIsCustomCategory(true);
    }
  }, [categories, form.category]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageUploadComplete = (uploadedAsset) => {
    setForm({ ...form, logo: uploadedAsset.imageUrl });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...form,
      useCases: form.useCases.split(",").map((u) => u.trim()),
      integrationOptions: form.integrationOptions ? form.integrationOptions.split(",").map((u) => u.trim()) : [],
    };
    onSubmit(formattedData, token);
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 md:px-6">
      <div className="max-w-2xl mx-auto bg-card border border-border shadow-lg rounded-2xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-card-foreground mb-6">
          {isEditing ? "Edit Tool" : "Add New Tool"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tool Name */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Tool Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. ChatGPT"
            />
          </div>

          {/* Logo - Image Upload or URL */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-card-foreground">
                Tool Logo
              </label>
              <button
                type="button"
                onClick={() => setUseUrlInput(!useUrlInput)}
                className="text-xs text-primary hover:underline"
              >
                {useUrlInput ? "Use Image Upload" : "Use URL Instead"}
              </button>
            </div>

            {useUrlInput ? (
              <input
                type="text"
                name="logo"
                value={form.logo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/logo.png"
              />
            ) : (
              <div>
                {!form.logo ? (
                  <ImageUpload
                    onUploadComplete={handleImageUploadComplete}
                    assetType="tool_logo"
                    tags={["tool", "logo"]}
                  />
                ) : (
                  <div className="border border-border rounded-lg p-4 bg-secondary/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={form.logo}
                          alt="Logo preview"
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-card-foreground">
                            Logo uploaded successfully
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Ready to submit
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, logo: "" })}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Category
            </label>
            <div className="space-y-2">
              <select
                name="categorySelect"
                value={categories.some(c => c.slug === form.category) ? form.category : (form.category ? 'custom' : '')}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'custom') {
                    if (categories.some(c => c.slug === form.category)) {
                      setForm({ ...form, category: '' });
                    }
                  } else {
                    setForm({ ...form, category: val });
                  }
                }}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a category (Optional)</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
                <option value="custom">➕ Create New / Other</option>
              </select>

              {/* Show input if "custom" is selected OR if the current category is not in the list (and not empty) */}
              {(categories.length > 0 && !categories.some(c => c.slug === form.category) && form.category !== '') ||
                (categories.length > 0 && categories.some(c => c.slug !== form.category) && document.querySelector('select[name="categorySelect"]')?.value === 'custom') ? (
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter custom category name"
                />
              ) : null}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Short description of the tool..."
            ></textarea>
          </div>

          {/* Pricing */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Pricing
            </label>
            <input
              type="text"
              name="pricing"
              value={form.pricing}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Free / Subscription / One-time"
            />
          </div>

          {/* Use Cases */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Use Cases (comma separated)
            </label>
            <input
              type="text"
              name="useCases"
              value={form.useCases}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Content creation, Marketing, Research"
            />
          </div>

          {/* Integration Options */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Integrations (comma separated)
            </label>
            <input
              type="text"
              name="integrationOptions"
              value={form.integrationOptions || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Slack, Zapier, Discord"
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Tool Link
            </label>
            <input
              type="url"
              name="link"
              value={form.link}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => onCancel ? onCancel() : window.history.back()}
              className="w-1/3 bg-secondary text-secondary-foreground py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {isEditing ? "Update Tool" : "Save Tool"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ToolForm;
