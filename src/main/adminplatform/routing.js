// Updated routing file to dynamically load content and associated JS files

function navigateTo(route) {
  console.log(`Navigating to ${route}`);
  switch (route) {
    case '#/home':
      loadPageContent('home.html', 'home.js');
      break;
    case '#/profile':
      loadPageContent('profile.html', 'profile.js');
      break;
    case '#/settings':
      loadPageContent('settings.html', 'settings.js');
      break;
    default:
      loadNotFoundPage();
      break;
  }
}

async function loadPageContent(page, script) {
  try {
    const response = await fetch(page);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const pageContent = await response.text();
    document.getElementById('app-content').innerHTML = pageContent;

    // Dynamically load the associated JavaScript file
    const scriptElement = document.createElement('script');
    scriptElement.src = script;
    document.head.appendChild(scriptElement);
  } catch (error) {
    console.error('Error loading page content:', error);
    loadNotFoundPage();
  }
}

function loadNotFoundPage() {
  document.getElementById('app-content').innerHTML = '<h2>404 Not Found</h2>';
}
