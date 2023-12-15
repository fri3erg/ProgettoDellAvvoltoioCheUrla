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
  //const filteredUsers = await filterUsers({ name: 'John' }); // Da cambiare la funzione

  console.log('Filtered Users:', filteredUsers);

  // Close the connection
  client.close();
});

async function setCharacterLimit(userId, newCharacterLimit) {
    try {
      // Update the user's document in the database to set the new character limit
      await usersCollection.updateOne({ _id: userId }, { $set: { maxCharacterLimit: newCharacterLimit } });
      console.log(`Character limit updated for user ${userId}: ${newCharacterLimit}`);
    } catch (error) {
      console.error('Error setting character limit:', error);
      throw error;
    }
  }
/*  
  // Function to send a message with a character limit
  async function sendMessage(senderId, receiverId, message) {
    try {
      // Check if the sender is blocked before allowing them to send a message
      const sender = await usersCollection.findOne({ _id: senderId });
      if (sender && !sender.blocked) {
        // Sender is not blocked, check character limit
        const maxCharacterLimit = sender.maxCharacterLimit || 50; // Default to 50 if not set
        if (message.length <= maxCharacterLimit) {
          // Message length is within the allowed limit, proceed to send the message
          // Implement the logic to store the message in the database or perform any other actions
          console.log(`Message sent from user ${senderId} to user ${receiverId}: ${message}`);
        } else {
          console.log(`Message exceeds the maximum character limit of ${maxCharacterLimit}.`);
        }
      } else {
        console.log(`User ${senderId} is blocked and cannot send messages.`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
*/