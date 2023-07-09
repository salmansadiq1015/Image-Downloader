const imagesWrapper = document.getElementById("images");
const loadMore = document.querySelector(".loadMore");
const searchInput = document.querySelector(".search-box>input");
const searchbtn = document.querySelector(".search-box>.searchbtn");
const lightBox = document.querySelector(".lightBox");
const closeBtn = document.querySelector(".closebtn");
const downloadImgBtn = document.querySelector(".fa-download");

const apiKey = "Gu7jC9oxAPYcQMfef5KRcNn9oqwglvAvynoeMruLCEYV0qPqKbcxyG5w";
const perPage = 16;
let currentPage = 1;
let searchItem = null;

// Download Images

const downloadImg = (imgURL) => {
  fetch(imgURL)
    .then((res) => res.blob())
    .then((file) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("Failed to download Images😰 "));
};

// DOwnload ImageDetail Btn

// Show Image Details
const showLightBox = (name, img) => {
  lightBox.querySelector("img").src = img;
  lightBox.querySelector("span").innerText = name;
  downloadImgBtn.setAttribute("data-img", img);
  lightBox.classList.add("show");
  document.body.style.overflowY = "hidden";
};

// CLose Detail Box
closeBtn.addEventListener("click", () => {
  lightBox.classList.remove("show");
  document.body.style.overflowY = "auto";
});
lightBox.addEventListener("click", () => {
  lightBox.classList.remove("show");
  document.body.style.overflowY = "auto";
});

// Get Images
const generateHTML = (images) => {
  imagesWrapper.innerHTML += images.map(
    (image) =>
      `
    <li class="card" onClick="showLightBox( '${image.photographer}','${image.src.large2x}')">
    <img src=${image.src.large2x} alt="" />
    <div class="details">
      <div class="photographer">
        <i class="fa-solid fa-camera"></i>
        <span>${image.photographer}</span>
      </div>
      <button class="downloadbtn" onClick="downloadImg('${image.src.large2x};event.stopPropagation();')">
        <i class="fa-solid fa-download"></i>
      </button>
    </div>
  </li>
  `
  );
};

const getImages = (apiURL) => {
  // When Images Loading
  loadMore.innerText = "Loading...";
  loadMore.classList.add("disabled");

  // Fetching Images by API Call
  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      generateHTML(data.photos);

      // Complete Loading
      loadMore.innerText = "Load More";
      loadMore.classList.remove("disabled");
    })
    .catch(() =>
      alert("Failed to Load Images 😥  Check your internet connection💤")
    );

  // Fetch Code
};

// Load More Images
const loadMoreImages = () => {
  currentPage += 1;
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  // Search Query If you Search
  apiURL = searchItem
    ? `https://api.pexels.com/v1/search?query=${searchItem}&page=${currentPage}&per_page=${perPage}`
    : apiURL;
  getImages(apiURL);
};

// Search Images
const loadSearchImages = (e) => {
  if (e.target.value === "") return (searchItem = null);
  if (e.key === "Enter") {
    currentPage = 1;
    searchItem = e.target.value;
    imagesWrapper.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/search?query=${searchItem}&page=${currentPage}&per_page=${perPage}`
    );
  }
};

// Search Btn Working
function searchImages() {
  currentPage = 1;
  const keyword = searchInput.value;
  imagesWrapper.innerHTML = "";
  getImages(
    `https://api.pexels.com/v1/search?query=${keyword}&page=${currentPage}&per_page=${perPage}`
  );
}

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);

// Load more Btn Functionality
loadMore.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
downloadImgBtn.addEventListener("click", (e) =>
  downloadImg(e.target.dataset.img)
);
searchbtn.addEventListener("click", searchImages);

// ----------------------------------------------------->
