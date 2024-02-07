function generateRandomString() {
  const length = 6;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

function getHostname(url) {
  const parser = document.createElement('a');
  parser.href = url;
  return parser.hostname;
}

async function shortenURL() {
  let urlInput = document.getElementById("urlInput").value;
  let expirationSelect = document.getElementById("expirationSelect");
  let expirationTime = expirationSelect.value;

  if (!urlInput) {
      alert("Please enter a URL");
      return;
  }

  try {
      const shortPath = generateRandomString();
      const shortUrl = `https://${getHostname(urlInput)}/${shortPath}`;

      addToURLList(shortUrl, urlInput, expirationTime, shortPath);

      updateUI(shortUrl);

      saveToLocalStorage(shortPath, { originalURL: urlInput, expirationTime });
  } catch (error) {
      console.error('Error shortening URL:', error);
  }
}

document.getElementById("shortenBtn").addEventListener("click", function() {
  let urlInput = document.getElementById("urlInput");
  urlInput.value = "";
});

function deleteShortenedURL() {
  let shortPath = this.getAttribute("data-shortpath");
  let shortUrl = `https://${window.location.hostname}/${shortPath}`;
  removeFromLocalStorage(shortPath);
  this.parentNode.parentNode.remove();
}

function updateUI(shortenedURL) {
  let shortenedURLDisplay = document.getElementById("shortenedURL");
  shortenedURLDisplay.innerHTML = shortenedURL;
  shortenedURLDisplay.href = shortenedURL;
  document.getElementById("result").style.display = "block";
}

function addToURLList(shortenedURL, originalURL, expirationTime, shortPath) {
  let urlList = document.getElementById("urlList");
  let listItem = document.createElement("li");
  listItem.id = shortPath; 
  let link = document.createElement("a");
  link.href = originalURL; 
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

  saveToLocalStorage(shortPath, { originalURL, expirationTime });

  if (expirationTime) {
    const expirationTimestamp = new Date().getTime() + parseInt(expirationTime);

    setTimeout(() => {
      removeFromLocalStorage(shortPath);
      urlList.removeChild(listItem);
    }, expirationTimestamp - new Date().getTime());
  }
}

function saveToLocalStorage(shortPath, data) {
  localStorage.setItem(shortPath, JSON.stringify(data));
}

function removeFromLocalStorage(shortPath) {
  localStorage.removeItem(shortPath);
}

window.onload = function() {
  let urlList = document.getElementById("urlList");

  for (let i = 0; i < localStorage.length; i++) {
      const shortPath = localStorage.key(i);
      const storedData = JSON.parse(localStorage.getItem(shortPath));

      if (storedData) {
          const { originalURL, expirationTime } = storedData;
          const shortURL = `https://${getHostname(originalURL)}/${shortPath}`;
          addToURLList(shortURL, originalURL, expirationTime, shortPath);

          if (expirationTime) {
            const currentTime = new Date().getTime();
            const expirationTimestamp = new Date(expirationTime).getTime();
            if (currentTime > expirationTimestamp) {
                removeFromLocalStorage(shortPath);
                urlList.removeChild(document.getElementById(shortPath));
            }
          }
      }
  }
};
function login() {
  alert('Diqka shkoi keq!');
}