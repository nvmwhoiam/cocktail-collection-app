const favorites = JSON.parse(localStorage.getItem('favoriteCocktails') || '{}');

const cocktailGrid = document.querySelector("#cocktailGrid");

window.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('assets/json/cocktails.json');
        const jsonData = await response.json();

        for (const cocktail of jsonData) {
            createCard(cocktail);
        }

        initFavorites();

    } catch (error) {
        console.error('Error loading cocktails:', error);
    }
});

function createCard(cocktail) {
    const formatMeasurements = (measurements) => {
        return measurements.map(m => `${m.amount} ${m.unit}`).join(' / ');
    };

    const HTMLBlock = `
        <div class="cocktail_card" data-id=${cocktail.id} data-alcohol="${cocktail.alcohol}" data-favorite="false">

            <div class="cocktail_header">

                <div class="header_type">
                    <small class="alcohol_type">
                        ${cocktail.alcohol}
                    </small>

                    <small class="cocktail_type">
                        ${cocktail.is}
                    </small>
                </div>

                <div class="header_content">

                    <h2 class="cocktail_name">
                        ${cocktail.name}
                    </h2>

                    <button type="button" class="favorite_button btn_icon_sm" aria-label="Favourite cocktail">
                        <i class="icon_heart-regular"></i>
                    </button>
                </div>

            </div>

            <div class="cocktail_content">

                <ul class="ingredients_list">

                    ${cocktail.ingredients.map(ingredient => `
                        <li class="ingredient_item">
                            <span>${ingredient.spirit}</span>
                            <small class="measurements">
                               ${formatMeasurements(ingredient.measurements)}
                            </small>
                        </li>
                    `).join('')}

                </ul>

                <div class="cocktail_glass">
                    <span class="content_title">Glass:</span>
                    <p>${cocktail.glass}</p>
                </div>

                <div class="cocktail_garnish">
                    <span class="content_title">Garnish:</span>
                    <p>${cocktail.garnish}</p>
                </div>

                <div class="instructions">
                    <span class="content_title">Instructions:</span>
                    <p>${cocktail.method}</p>
                </div>

            </div>
        </div>`;

    if (cocktailGrid) {
        cocktailGrid.insertAdjacentHTML("beforeend", HTMLBlock);
    }
}

function initFavorites() {
    document.querySelectorAll('.cocktail_card').forEach(card => {
        const cocktailID = card.getAttribute('data-id');
        const favoriteButton = card.querySelector('.favorite_button');

        if (favorites[cocktailID]) {
            favoriteButton.classList.add('active');
            card.setAttribute('data-favorite', 'true');
        }
    });
}

document.addEventListener('click', (e) => {
    const favoriteButton = e.target.closest('.favorite_button');
    if (favoriteButton) {
        const cocktailCard = favoriteButton.closest('.cocktail_card');
        const cocktailId = cocktailCard.getAttribute('data-id');

        const isFavorite = favoriteButton.classList.toggle('active');
        cocktailCard.setAttribute('data-favorite', isFavorite.toString());

        if (isFavorite) {
            favorites[cocktailId] = true;
        } else {
            delete favorites[cocktailId];
        }

        localStorage.setItem('favoriteCocktails', JSON.stringify(favorites));
    }
});

document.addEventListener('input', (e) => {
    const searchInput = e.target.closest('[name="search"]');
    if (searchInput) {
        const searchTerm = searchInput.value.toLowerCase();
        const cocktailCards = cocktailGrid.querySelectorAll('.cocktail_card');

        cocktailCards.forEach(card => {
            const cocktailName = card.querySelector('.cocktail_name').textContent.toLowerCase();
            if (cocktailName.includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
});

document.addEventListener('change', (e) => {
    const alcoholFilter = e.target.closest('#alcoholFilter');
    if (alcoholFilter) {
        const selectedValue = e.target.value.toLowerCase();
        const cocktailCards = document.querySelectorAll('.cocktail_card');

        cocktailCards.forEach(card => {
            const cardAlcohol = card.getAttribute('data-alcohol').toLowerCase();
            if (selectedValue === 'all' || cardAlcohol === selectedValue) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
});