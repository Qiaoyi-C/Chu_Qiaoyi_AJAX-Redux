(() => {
    const characterList = document.querySelector("#character-list"); 
    const movieContent = document.querySelector("#movie-content");   
    const loadingIcon = document.querySelector("#loading-icon");  
    const logo = document.querySelector(".header img");
    const baseURL = "https://swapi.dev/api/";

    gsap.from(logo, {
        opacity: 0,
        scale: 0.2, 
        y: -100, 
        duration: 1.5, 
        ease: "power2.out"
    });

    function getCharacters() {
        loadingIcon.style.display = "block"; 

        fetch(`${baseURL}people/`)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch character data");
            return response.json();
        })
        .then(data => {
            loadingIcon.style.display = "none"; 
            const characters = data.results;
            const ul = document.createElement("ul");

            characters.forEach((character) => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.textContent = character.name;
                a.href = "#";  
                a.dataset.films = JSON.stringify(character.films);  
                a.addEventListener("click", getMovies);
                li.appendChild(a);
                ul.appendChild(li);
            });

            characterList.innerHTML = "";  
            characterList.appendChild(ul);

            gsap.from("#character-list li", {
                opacity: 0,
                y: 20,
                stagger: 0.1,
                duration: 0.8,
                ease: "power2.out"
            });
        })
        .catch(error => {
            console.error(error);
            characterList.innerHTML = `<p class="error">Unable to fetch character data. Please try again later.</p>`;
        });
    }

    function getMovies(event) {
        event.preventDefault();
        const films = JSON.parse(event.currentTarget.dataset.films);  
        movieContent.innerHTML = "<p>Loading...</p>";
        loadingIcon.style.display = "block";

        
        Promise.all(films.map(filmURL => 
            fetch(filmURL)
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch movie data");
                return response.json();
            })
        ))
        .then(movieData => {
            loadingIcon.style.display = "none"; 
            movieContent.innerHTML = ""; 

            movieData.forEach(movie => {
                const movieBox = document.createElement("div");
                movieBox.classList.add("movie-box");

                const movieTitle = document.createElement("h3");
                movieTitle.textContent = movie.title;

                const movieCrawl = document.createElement("p");
                movieCrawl.textContent = movie.opening_crawl;

                const moviePoster = document.createElement("img");
                moviePoster.src = `images/${movie.episode_id}.jpg`;  
                moviePoster.alt = movie.title;

                movieBox.appendChild(movieTitle);
                movieBox.appendChild(movieCrawl);
                movieBox.appendChild(moviePoster);
                movieContent.appendChild(movieBox);
            });

            
            gsap.from(".movie-box", {
                opacity: 0,
                scale: 0.8,
                stagger: 0.2,
                duration: 0.8,
                ease: "back.out(1.5)"
            });

        })
        .catch(error => {
            console.error(error);
            movieContent.innerHTML = `<p class="error">Unable to fetch movie data. Please try again later.</p>`;
        });
    }

    getCharacters();
})();