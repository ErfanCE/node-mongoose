const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();

// ODM
mongoose
  .connect('mongodb://localhost:27017/workolo')
  .then(() => {
    console.log('[i] Database connected');
  })
  .catch((err) => {
    console.log('[i] database connection error:');
    console.log(err.message);
  });

// Schema & Model
const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', UserSchema);

app.use(express.json());
app.use(morgan('dev'));

// Read
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});

    // const users = await User.find(
    //   { city: 'abhar' },
    //   { firstname: 1, lastname: 1, _id: 0 }
    // );

    res.status(200).json({
      data: users
    });
  } catch (error) {}
});

// Create
app.post('/add-user', async (req, res) => {
  try {
    const userData = req.body;

    // Create: 1st solution
    // const user = new User(userData); // BSON documnet
    // await user.save();

    // Create: 2nd solution
    await User.create(userData);

    console.log('[+] user added successfully');

    res.status(200).json({
      message: '[+] data added successfully'
    });
  } catch (err) {
    console.log('[-] user creation error:');
    console.log(err.message);

    res.status(500).json({
      message: 'something went wrong'
    });
  }
});

// update by id
app.patch('/users/:userId', async (req, res) => {
  try {
    // const user = await User.updateOne({ _id: req.params.userId }, req.body);
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true
    });

    res.status(200).json({
      result: 'user updated successfully',
      data: user
    });
  } catch (err) {
    console.log('[-] user creation error:');
    console.log(err.message);

    res.status(500).json({
      message: 'something went wrong'
    });
  }
});

// delete by id
app.delete('/users/:userId', async (req, res) => {
  try {
    // const result = await User.deleteOne({ _id: req.params.userId });
    const user = await User.findByIdAndDelete(req.params.userId);

    res.status(200).json({
      result: 'user deleted successfully',
      data: user
    });
  } catch (err) {
    console.log('[-] user creation error:');
    console.log(err.message);

    res.status(500).json({
      message: 'something went wrong'
    });
  }
});

app.listen(8000, () => console.log('[i] Listening on :8000 ...'));
