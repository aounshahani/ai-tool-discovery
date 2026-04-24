import Collection from "../model/Bookmark.js";

// 1️⃣ Create a new collection
export const createCollection = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id; // assuming JWT middleware sets req.user

    const collection = new Collection({ name, description, user: userId });
    await collection.save();

    res.status(201).json(collection);
  } catch (err) {
    res.status(500).json({ error: "Failed to create collection" });
  }
};

// 2️⃣ Add a tool to a collection
export const addToolToCollection = async (req, res) => {
  try {
    const { collectionId, toolId } = req.body;
    const userId = req.user.id;

    const collection = await Collection.findOne({ _id: collectionId, user: userId });
    if (!collection) return res.status(404).json({ error: "Collection not found" });

    // prevent duplicate tool
    if (collection.tools.some(t => t.tool.toString() === toolId)) {
      return res.status(400).json({ error: "Tool already in collection" });
    }

    collection.tools.push({ tool: toolId });
    await collection.save();

    res.status(200).json(collection);
  } catch (err) {
    res.status(500).json({ error: "Failed to add tool" });
  }
};

// 3️⃣ Remove a tool from a collection
export const removeToolFromCollection = async (req, res) => {
  try {
    const { collectionId, toolId } = req.body;
    const userId = req.user.id;

    const collection = await Collection.findOne({ _id: collectionId, user: userId });
    if (!collection) return res.status(404).json({ error: "Collection not found" });

    collection.tools = collection.tools.filter(t => t.tool.toString() !== toolId);
    await collection.save();

    res.status(200).json(collection);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove tool" });
  }
};

// 4️⃣ Get all collections for a user
export const getUserCollections = async (req, res) => {
  try {
    const userId = req.user.id;

    const collections = await Collection.find({ user: userId })
      .populate("tools.tool", "name logo category description");

    res.status(200).json(collections);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch collections" });
  }
};

// 5️⃣ Delete a collection
export const deleteCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const userId = req.user.id;

    const collection = await Collection.findOneAndDelete({ _id: collectionId, user: userId });
    if (!collection) return res.status(404).json({ error: "Collection not found" });

    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete collection" });
  }
};
