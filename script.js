// Function to generate a random string for the short URL path
function generateRandomString() {
  const length = 6;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

// Function to get the hostname from a URL
function getHostname(url) {
  const parser = document.createElement('a');
  parser.href = url;
  return parser.hostname;
}

// Function to shorten the URL
async function shortenURL() {
  let urlInput = document.getElementById("urlInput").value;
  let expirationSelect = document.getElementById("expirationSelect");
  let expirationTime = expirationSelect.value;

  if (!urlInput) {
      alert("Please enter a URL");
      return;
  }

  try {
      // Generate a random string for the short URL path
      const shortPath = generateRandomString();
      // Form the shortened URL with the generated path
      const shortUrl = `https://${getHostname(urlInput)}/${shortPath}`;

      // Add the shortened URL directly to the list
      addToURLList(shortUrl, urlInput, expirationTime, shortPath);

      // Update UI with the shortened URL
      updateUI(shortUrl);

      // Save the shortened URL to local storage
      saveToLocalStorage(shortPath, { originalURL: urlInput, expirationTime });
  } catch (error) {
      console.error('Error shortening URL:', error);
  }
}

// Function to delete the shortened URL
function deleteShortenedURL() {
  let shortPath = this.getAttribute("data-shortpath");
  let shortUrl = `https://${window.location.hostname}/${shortPath}`;
  removeFromLocalStorage(shortPath);
  this.parentNode.parentNode.remove();
}

// Function to update the UI with the shortened URL
function updateUI(shortenedURL) {
  let shortenedURLDisplay = document.getElementById("shortenedURL");
  shortenedURLDisplay.innerHTML = shortenedURL;
  shortenedURLDisplay.href = shortenedURL;
  document.getElementById("result").style.display = "block";
}

// Function to add the shortened URL to the list
function addToURLList(shortenedURL, originalURL, expirationTime, shortPath) {
  let urlList = document.getElementById("urlList");
  let listItem = document.createElement("li");
  listItem.id = shortPath; // Set id for the list item
  let link = document.createElement("a");
  link.href = originalURL; // Set href to the original long URL
  link.target = "_blank";
  link.textContent = shortenedURL;

  let span = document.createElement("span");
  let deleteIcon = document.createElement("i");
  deleteIcon.className = "fa fa-trash text-danger p-2 pointer";
  deleteIcon.setAttribute("data-shortpath", shortPath);
  deleteIcon.onclick = deleteShortenedURL;

  span.appendChild(deleteIcon);

  listItem.appendChild(link);
  listItem.appendChild(span);
  urlList.appendChild(listItem);

  // Save the shortened URL to local storage
  saveToLocalStorage(shortPath, { originalURL, expirationTime });
}

// Function to save the shortened URL to local storage
function saveToLocalStorage(shortPath, data) {
  localStorage.setItem(shortPath, JSON.stringify(data));
}

// Function to remove the shortened URL from local storage
function removeFromLocalStorage(shortPath) {
  localStorage.removeItem(shortPath);
}

// Function to initialize the page
window.onload = function() {
  let urlList = document.getElementById("urlList");

  // Populate the list with existing items from local storage
  for (let i = 0; i < localStorage.length; i++) {
      const shortPath = localStorage.key(i);
      const storedData = JSON.parse(localStorage.getItem(shortPath));

      if (storedData) {
          const { originalURL, expirationTime } = storedData;
          const shortURL = `https://${getHostname(originalURL)}/${shortPath}`;
          addToURLList(shortURL, originalURL, expirationTime, shortPath);

          // Check if the item has expired, and if so, remove it
          const currentTime = new Date().getTime();
          const expirationTimestamp = new Date(expirationTime).getTime();
          if (currentTime > expirationTimestamp) {
              removeFromLocalStorage(shortPath);
              urlList.removeChild(document.getElementById(shortPath));
          }
      }
  }
};
function login() {
  alert('Diqka shkoi keq!');
}