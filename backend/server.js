const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/todotracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Mongoose Schemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  dob: String,
});

// The Task schema now includes inProgress: Boolean
const TaskSchema = new mongoose.Schema({
  category: String, // college, personal, home
  title: String,
  description: String,
  startDate: String,
  endDate: String,
  status: String, // pending, in progress, done
  inProgress: Boolean, // <--- THIS FIELD IS REQUIRED!
  userEmail: String, // Associated user
});

// New Feedback schema to store sheets per user
const FeedbackSchema = new mongoose.Schema({
  userEmail: String, // Associated user
  sheets: [
    {
      month: String,           // Optional, or use array index for month
      action: String,
      worst: String,
      prevent: String,
      repair: String,
      longterm: String,
    },
  ],
});

const User = mongoose.model('User', UserSchema);
const Task = mongoose.model('Task', TaskSchema);
const Feedback = mongoose.model('Feedback', FeedbackSchema);

app.use(cors());
app.use(bodyParser.json());

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { name, email, password, dob } = req.body;
  try {
    const user = new User({ name, email, password, dob });
    await user.save();
    res.json({ message: 'Signup successful!' });
  } catch (err) {
    res.status(400).json({ message: 'User already exists or error!' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  res.json({ message: 'Login successful!', user });
});

// Get all tasks for a user
app.get('/tasks', async (req, res) => {
  const { email, date } = req.query;
  let filter = { userEmail: email };
  if (date) filter.startDate = date; // or your chosen field
  const tasks = await Task.find(filter);
  res.json(tasks);
});

// Add a new task
app.post('/tasks/:category', async (req, res) => {
  const { category } = req.params;
  const { title, description, startDate, endDate, status, userEmail } = req.body;
  try {
    const task = new Task({
      title,
      description,
      startDate,
      endDate,
      status,
      inProgress: false,
      userEmail,
      category,
    });
    await task.save();
    res.json({ message: 'Task added', task });
  } catch (err) {
    res.status(500).json({ message: 'Error saving task' });
  }
});

// PATCH endpoint supports both status and inProgress update
app.patch('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = {};
    if (req.body.status !== undefined) updateFields.status = req.body.status;
    if (req.body.inProgress !== undefined) updateFields.inProgress = req.body.inProgress;
    const task = await Task.findByIdAndUpdate(id, updateFields, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status/inProgress' });
  }
});

// DELETE endpoint (for single task)
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted!', id });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed.' });
  }
});

// ------------------- FEEDBACK ENDPOINTS -------------------

// Get feedback sheets for a user
app.get('/feedback', async (req, res) => {
  const { email } = req.query;
  const feedback = await Feedback.findOne({ userEmail: email });
  res.json(feedback ? feedback.sheets : []);
});

// Update or create feedback sheets for a user
app.post('/feedback', async (req, res) => {
  const { email, sheets } = req.body;
  try {
    const feedback = await Feedback.findOneAndUpdate(
      { userEmail: email },
      { sheets },
      { upsert: true, new: true }
    );
    res.json({ message: 'Feedback updated', sheets: feedback.sheets });
  } catch (err) {
    res.status(500).json({ message: 'Error updating feedback' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
