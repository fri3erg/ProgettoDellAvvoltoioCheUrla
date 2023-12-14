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
  const filteredUsers = await filterUsers({ name: 'John' }); // Pass your filter criteria here

  console.log('Filtered Users:', filteredUsers);

  // Close the connection
  client.close();
});


//Ipotetico html ancora da fare
document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filterForm');
    filterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      filterUsers();
    });
  });
  
  async function filterUsers() {
    const name = document.getElementById('name').value;
    const popularity = parseInt(document.getElementById('popularity').value, 10);
  
    const criteria = {};
  
    if (name) {
      criteria.name = name;
    }
  
    if (!isNaN(popularity)) {
      criteria.popularity = { $gte: popularity };
    }
  
    try {
      const result = await usersCollection.find(criteria).toArray();
      displayResult(result);
    } catch (error) {
      console.error('Error filtering users:', error);
      displayResult([]);
    }
  }
  
  function displayResult(users) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '';
  
    if (users.length === 0) {
      resultContainer.textContent = 'No users found.';
      return;
    }
  
    const userList = document.createElement('ul');
    users.forEach(user => {
      const listItem = document.createElement('li');
      listItem.textContent = `${user.name} - Popularity: ${user.popularity}`;
      userList.appendChild(listItem);
    });
  
    resultContainer.appendChild(userList);
  }
  