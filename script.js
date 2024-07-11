document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    searchBooks(query);
});

async function searchBooks(query, startIndex = 0) {
    console.log(`Searching for "${query}" starting at index ${startIndex}`); // Debugging log
    const response = await fetch(`/search?q=${query}&startIndex=${startIndex}`);
    const data = await response.json();
    console.log(data); // Debugging log: Check the API response
    displayBooks(data.items, query, startIndex, data.totalItems);
}

function displayBooks(books, query, startIndex, totalItems) {
    const booksContainer = document.getElementById('books');
    booksContainer.innerHTML = '';
    books.forEach(book => {
        const bookElement = document.createElement('a');
        bookElement.href = book.volumeInfo.infoLink;
        bookElement.target = '_blank'; // Open in a new tab
        bookElement.className = 'book';
        bookElement.innerHTML = `
            <h3>${book.volumeInfo.title}</h3>
            <p>${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author'}</p>
            <img src="${book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150'}" alt="${book.volumeInfo.title}">
            <button class="toggle-description">Show Description</button>
            <p class="description" style="display: none;">${book.volumeInfo.description ? book.volumeInfo.description : 'No description available'}</p>
        `;
        booksContainer.appendChild(bookElement);
    });

    document.querySelectorAll('.toggle-description').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the anchor from being triggered
            const description = event.target.nextElementSibling;
            if (description.style.display === 'none') {
                description.style.display = 'block';
                event.target.textContent = 'Hide Description';
            } else {
                description.style.display = 'none';
                event.target.textContent = 'Show Description';
            }
        });
    });

    // Add pagination controls
    const paginationControls = document.getElementById('pagination-controls');
    paginationControls.innerHTML = '';

    if (startIndex > 0) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
            console.log('Previous button clicked'); // Debugging log
            searchBooks(query, startIndex - 10);
        });
        paginationControls.appendChild(prevButton);
    }

    if (startIndex + 10 < totalItems) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => {
            console.log('Next button clicked'); // Debugging log
            searchBooks(query, startIndex + 10);
        });
        paginationControls.appendChild(nextButton);
    }
}
