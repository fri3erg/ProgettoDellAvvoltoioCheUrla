// Entry point for your application

document.addEventListener('DOMContentLoaded', function () {
  // Initialize your app here
  initApp();
});

async function initApp() {
  try {
    // Add event listeners or other initialization code here
    navigateTo('#/'); // Default route
    // Example GET request with parameters
    const userId = 123;
    const userData = await getData(`/user/${userId}`, { filter: 'details' });
    console.log('User data:', userData);

    // Example POST request
    const newPostData = {
      title: 'New Post',
      content: 'This is a new post.',
    };
    const newPostResponse = await postData('/posts', newPostData);
    console.log('New post response:', newPostResponse);
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}
