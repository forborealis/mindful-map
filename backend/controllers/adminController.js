const User = require('../models/User');
const Prompt = require('../models/Prompt');
const MoodLog = require('../models/MoodLog');
const Forum = require('../models/Forum'); // Assuming you have a Forum model
const jwt = require("jsonwebtoken");

exports.dashboard = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Admin Dashboard',
  });
};

exports.getMonthlyUsers = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const users = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const monthlyUserData = users.map(user => ({
      month: new Date(0, user._id - 1).toLocaleString('default', { month: 'long' }),
      count: user.count,
    }));

    res.status(200).json(monthlyUserData);
  } catch (error) {
    console.error('Error fetching monthly users:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getActiveUsers = async (req, res) => {
  try {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const activeUsers = await MoodLog.aggregate([
      {
        $match: {
          date: {
            $gte: twoWeeksAgo,
          },
        },
      },
      {
        $group: {
          _id: '$user',
          lastLogDate: { $max: '$date' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          email: '$user.email',
          name: '$user.name',
          lastLogDate: 1,
        },
      },
    ]);

    res.status(200).json(activeUsers);
  } catch (error) {
    console.error('Error fetching active users:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getInactiveUsers = async (req, res) => {
  try {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const activeUsers = await MoodLog.aggregate([
      {
        $match: {
          date: {
            $gte: twoWeeksAgo,
          },
        },
      },
      {
        $group: {
          _id: '$user',
        },
      },
    ]);

    const activeUserIds = activeUsers.map(user => user._id.toString());

    const inactiveUsers = await User.find({
      _id: { $nin: activeUserIds },
    }).select('name email');

    res.status(200).json(inactiveUsers);
  } catch (error) {
    console.error('Error fetching inactive users:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const activeUsers = await MoodLog.aggregate([
      {
        $match: {
          date: { $gte: twoWeeksAgo },
        },
      },
      {
        $group: {
          _id: "$user",
        },
      },
    ]);

    const activeUserIds = activeUsers.map(user => user._id.toString());

    const users = await User.find({ role: 'user' }).select('name email avatar isDeactivated createdAt deactivatedAt');

    const usersWithStatus = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isDeactivated: user.isDeactivated,
      createdAt: user.createdAt.toISOString(),
      status: activeUserIds.includes(user._id.toString()) ? 'Active' : 'Inactive',
    }));

    res.json(usersWithStatus);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

exports.softDelete = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isDeactivated = true;
    user.deactivatedAt = new Date();
    await user.save();

    res.json({ message: "User deactivated successfully", deactivatedAt: user.deactivatedAt });
  } catch (error) {
    console.error("Error deactivating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.reactivate = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.deactivatedAt) {
      return res.status(400).json({ message: "Deactivation timestamp not found" });
    }

    const now = new Date();
    const deactivatedAt = new Date(user.deactivatedAt);
    const hoursSinceDeactivation = (now - deactivatedAt) / (1000 * 60 * 60); 

    if (hoursSinceDeactivation < 24) {
      return res.status(403).json({ message: `Reactivation is only allowed after 24 hours.` });
    }

    user.isDeactivated = false;
    user.deactivatedAt = null;
    await user.save();

    res.json({ message: "User reactivated successfully" });
  } catch (error) {
    console.error("Error reactivating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body; 
    await User.updateMany(
      { _id: { $in: ids } },
      { $set: { isDeactivated: true } }
    );

    res.json({ message: "Selected users deactivated successfully" });
  } catch (error) {
    console.error("Error in bulk soft delete:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find().populate("createdBy", "name email");
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prompts", error });
  }
};

exports.addPrompt = async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const newPrompt = await Prompt.create({ 
      question, 
      createdBy: req.user.id 
    });

    res.status(201).json(newPrompt);
  } catch (error) {
    console.error("Error adding prompt:", error);if (error.code === 11000) {

      return res.status(400).json({
        message: "This prompt already exists!",
        code: 11000,
      });
    }

    res.status(500).json({ message: "Error adding prompt", error: error.message });
  }
};

exports.deletePrompt = async (req, res) => {
  try {
    const { id } = req.params;
    await Prompt.findByIdAndDelete(id);
    res.status(200).json({ message: "Prompt deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting prompt", error });
  }
};

exports.getDailyForumEngagement = async (req, res) => {
  try {
    const dailyEngagement = await Forum.aggregate([
      { $unwind: "$discussions" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$discussions.createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dailyEngagementData = dailyEngagement.map(data => ({
      date: data._id,
      count: data.count,
    }));

    res.status(200).json(dailyEngagementData);
  } catch (error) {
    console.error('Error fetching daily forum engagement:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// New function to get weekly forum engagement
exports.getWeeklyForumEngagement = async (req, res) => {
  try {
    const weeklyEngagement = await Forum.aggregate([
      { $unwind: "$discussions" },
      {
        $group: {
          _id: { $isoWeek: "$discussions.createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const weeklyEngagementData = weeklyEngagement.map(data => ({
      week: data._id,
      count: data.count,
    }));

    res.status(200).json(weeklyEngagementData);
  } catch (error) {
    console.error('Error fetching weekly forum engagement:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};