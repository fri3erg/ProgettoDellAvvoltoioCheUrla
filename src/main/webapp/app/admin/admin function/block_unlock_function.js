const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017'; //da verificare e modificare

// Database Name
const dbName = 'yourDatabaseName';   //da verificare e modificare

// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
  if (err) throw err;

  console.log('Connected to database');

  const db = client.db(dbName);
  const usersCollection = db.collection('users');

  // Example usage
  //const filteredUsers = await filterUsers({ name: 'John' }); // Pass your filter criteria here

  console.log('Filtered Users:', filteredUsers);// da modificare la funzione

  // Close the connection
  client.close();
});


// Function to block a user
async function blockUser(userId) {
  try {
    // Update the user's document in the database to set the blocked status to true
    await usersCollection.updateOne({ _id: userId }, { $set: { blocked: true } });
    console.log(`User with ID ${userId} has been blocked.`);
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
}

// Function to unlock a user
async function unlockUser(userId) {
  try {
    // Update the user's document in the database to set the blocked status to false
    await usersCollection.updateOne({ _id: userId }, { $set: { blocked: false } });
    console.log(`User with ID ${userId} has been unlocked.`);
  } catch (error) {
    console.error('Error unlocking user:', error);
    throw error;
  }
}
/*
// Function to send a message
async function sendMessage(senderId, receiverId, message) {
  try {
    // Check if the sender is blocked before allowing them to send a message
    const sender = await usersCollection.findOne({ _id: senderId });
    if (sender && !sender.blocked) {
      // Sender is not blocked, proceed to send the message
      // Implement the logic to store the message in the database or perform any other actions
      console.log(`Message sent from user ${senderId} to user ${receiverId}: ${message}`);
    } else {
      console.log(`User ${senderId} is blocked and cannot send messages.`);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Example usage
const userIdToBlock = 'user123';
const userIdToUnlock = 'user456';
const senderId = 'user789';
const receiverId = 'user456';
const message = 'Hello, how are you?';

// Block a user
blockUser(userIdToBlock);

// Attempt to send a message from a blocked user
sendMessage(userIdToBlock, receiverId, message);

// Unlock a user
unlockUser(userIdToUnlock);

// Send a message from an unlocked user
sendMessage(senderId, receiverId, message);*/
