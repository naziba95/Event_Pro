const UserProfile = require('../model/userProfile');

// Create a user profile
const createUserProfile = async (req, res) => {
  try {
    const { userId, name, bio, interests, phone, email, address } = req.body;
    
    // Check if a user profile with the given userId already exists
    const existingUserProfile = await UserProfile.findOne({ userId });

    if (existingUserProfile) {
      return res.status(409).json({ error: 'User profile already exists' });
    }

    const userProfile = await UserProfile.create({
      userId,
      name,
      bio,
      interests,
      phone,
      email,
      address,
      profilePic: req.file ? req.file.path : null, // Use req.file.path to get the file path
    });

    res.status(201).json(userProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a user profile by authenticated userId
const updateUserProfile = async (req, res) => {
  try {
    const { name, bio, interests, phone, email, address } = req.body;
    const { profileId } = req.params;
    const userId = req.user._id; // Get authenticated userId from req.user
    console.log(userId)

    console.log(req.params)

    const userProfile = await UserProfile.findOneAndUpdate(
      { profileId }, // Find the profile with matching authenticated userId
      {
        ...(req.file && { profilePic: req.file.path }), // Check if req.file exists before updating profilePic
        name,
        bio,
        interests,
        phone,
        email,
        address
      },
      { new: true }
    );

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json(userProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a user profile by authenticated userId
const getUserProfile = async (req, res) => {
  try {
    const { profileId } = req.params; // Get authenticated userId from req.user

    const userProfile = await UserProfile.findOne({ profileId }); // Use findOne with authenticated userId

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json(userProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createUserProfile,
  updateUserProfile,
  getUserProfile
};