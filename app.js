document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search');
    const searchResultsContainer = document.querySelector('.searchresult-res');
    const randomResSection = document.querySelector('.random-res');
    const modal = document.getElementById('modal');
    const overlay = document.getElementById('overlay');
    const popupImage = document.getElementById('popupImage');
    const popupText = document.querySelector('.popup-text');

    function fetchRandomImage() {
        fetch('https://www.themealdb.com/api/json/v1/1/random.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const randomImageUrl = data.meals[0].strMealThumb;
                const mealname = data.meals[0].strMeal;
                randomResSection.innerHTML = `
                    <div class="text">
                        <h2>What’s There in our plate today</h2>
                    </div>
                    <div class="imgbg">
                        <div>
                            <img class="randomimg" src="${randomImageUrl}" alt="">
                        </div>
                        <div class="food">
                            <h2>${mealname}</h2>
                        </div>
                    </div>
                `;
            })
            .catch(error => {
                console.error('Error fetching random image:', error);
            });
    }

    function showModal(imageUrl, ingredients) {
        popupImage.src = imageUrl;
        popupText.innerHTML = ingredients;

        modal.classList.add('active');
        overlay.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }

    fetchRandomImage();

    searchInput.addEventListener('input', function (event) {
        const searchTerm = event.target.value;

        searchResultsContainer.innerHTML = '';

        if (searchTerm !== '') {
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    data.meals.forEach(meal => {
                        const imageUrl = meal.strMealThumb;
                        const foodName = meal.strMeal;

                        const searchResultItem = document.createElement('div');
                        searchResultItem.classList.add('searchimg');

                        searchResultItem.innerHTML = `
                            <div>
                                <img class="randomimg" src="${imageUrl}" alt="${foodName}">
                            </div>
                            <div class="food">
                                <h2>${foodName}</h2>
                            </div>`;

                        searchResultsContainer.appendChild(searchResultItem);
                    });
                })
                .catch(error => {
                    console.error('Error fetching search results:', error);
                });
        }
    });

    // popup part
    searchResultsContainer.addEventListener('click', function (event) {
        const clickedElement = event.target;

        if (clickedElement.tagName === 'IMG') {
            const imageUrl = clickedElement.src;
            const foodName = clickedElement.alt;
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`)
                .then(response => response.json())
                .then(data => {
                    const meal = data.meals[0];
                    const ingredients = meal.strIngredient1 + ', ' + meal.strIngredient2 + ', ' + meal.strIngredient3;
                    showModal(imageUrl, ingredients);
                })
                .catch(error => {
                    console.error('Error fetching ingredients:', error);
                });
        }
    });
    document.querySelector('.close-button').addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
});



  


  