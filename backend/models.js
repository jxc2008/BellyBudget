// models.js
import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  cuisine: String,
  rating: Number
});

// Create geospatial index on location
RestaurantSchema.index({ location: '2dsphere' });

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  bankAccountId: String // Store bank account reference if needed
});

const User = mongoose.model('User', UserSchema);

const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weeklyBudget: { type: Number, required: true },
  remainingBudget: { type: Number, required: true },
  weekStart: { type: Date, default: Date.now }
});

const Budget = mongoose.model('Budget', BudgetSchema);

// Export models for use in other files
export default {
  Restaurant,
  User,
  Budget
};