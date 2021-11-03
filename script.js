const resultsNav = document.getElementById("resultsNav");
const favoritessNav = document.getElementById("favoritessNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

// NASA API
const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  console.log("The page and current array:", page, currentArray);
  currentArray.forEach((result) => {
    // Card container
    const card = document.createElement("div");
    card.classList.add("card");
    // Link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View full image";
    link.target = "_blank";
    // Image
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "NASA picture of the day";
    image.loading = "lazy";
    image.classList.add("card-img-top");
    // Card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // Card title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    // Save text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "Add to favorites";
      saveText.setAttribute("onclick", `saveFavorite('${result.url}')`);
    } else {
      saveText.textContent = "Remove favorite";
      saveText.setAttribute("onclick", `removeFavorite('${result.url}')`);
    }
    // Card text
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = result.explanation;
    // Footer container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    // Picture date
    const pictureDate = document.createElement("strong");
    pictureDate.textContent = result.date;
    // Copyright
    const copyrightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${copyrightResult}`;
    // Append
    footer.append(pictureDate, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

function updateDOM(page) {
  // Get favorites from local storage
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
    console.log("Favorites from local storage:", favorites);
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
}

// Get 10 images from NASA API
async function getNasaPictures() {
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM("favorites");
  } catch (error) {
    // Catch error here
  }
}

// Add result to favorites
function saveFavorite(itemUrl) {
  // Loop through results array to select favorite
  resultsArray.forEach((item) => {
    // if (item.url.includes(itemUrl)) {
    if (item.url === itemUrl && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      // Show save confirmation for two seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // Set favorites in local storage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

// Remove item from favorites
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    // Set favorites in local storage
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDOM("favorites");
  }
}

// On load
getNasaPictures();
