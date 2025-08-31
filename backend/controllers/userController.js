const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');
const logger = require('../utils/logger');

class UserController {
  async register(req, res) {
    try {
      const { name, email, password, role, profile } = req.body;

      // Validation
      if (!name || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, password, and role are required'
        });
      }

      if (!['candidate', 'hr'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Role must be either "candidate" or "hr"'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Create new user
      const user = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role,
        profile: profile || {}
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        keys.jwtSecret,
        { expiresIn: keys.jwtExpire }
      );

      logger.info(`New user registered: ${email} as ${role}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          token
        }
      });

    } catch (error) {
      logger.error('User registration failed:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password, role } = req.body;

      // Validation
      if (!email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, and role are required'
        });
      }

      // Find user by email
      const user = await User.findOne({ 
        email: email.toLowerCase().trim(), 
        isActive: true 
      });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check role
      if (user.role !== role) {
        return res.status(401).json({
          success: false,
          message: `Invalid role. This account is registered as ${user.role}`
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        keys.jwtSecret,
        { expiresIn: keys.jwtExpire }
      );

      logger.info(`User logged in: ${email} as ${role}`);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token
        }
      });

    } catch (error) {
      logger.error('User login failed:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  }

  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Failed to get user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user data'
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const { name, profile } = req.body;
      const userId = req.user.id;

      const updateData = {};
      if (name) updateData.name = name.trim();
      if (profile) updateData.profile = profile;

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });

    } catch (error) {
      logger.error('Profile update failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }
  }
}

module.exports = new UserController();