console.log("Hello World")

let myLibrary = [];

function Book(title, author, pages, read) {
    if (!new.target){
        throw Error("Must use new operator to create object")
    }
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.toggleReadStatus = function () {
    this.read = !this.read;
}

function saveLibrary() {
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function loadLibrary() {
    const storedLibrary = JSON.parse(localStorage.getItem("myLibrary")) || [];
    myLibrary = storedLibrary.map(book => Object.assign(new Book(), book));
}

function updateStats() {
    const book_total_display = document.querySelector("#total-books");
    const book_read_display = document.querySelector("#read-books");
    const book_unread_display = document.querySelector("#unread-books")

    const book_total = myLibrary.length;
    const book_read = myLibrary.reduce((count, book) => {
        return book.read ? count+1: count;
    }, 0);
    const book_unread = book_total - book_read;

    book_total_display.innerText = book_total;
    book_read_display.innerText = book_read;
    book_unread_display.innerText = book_unread;
}

function addBookToLibrary(title, author, pages, read) {
    let book = new Book(title, author, pages, read);
    myLibrary.push(book);
    saveLibrary();
}

function displayBooks(library) {
    const grid = document.querySelector(".books-container");
    grid.innerHTML = "";

    for(let i = 0; i<library.length; i++) {
        const book_item = document.createElement("div");
        book_item.classList.add("book-item");

        book_item.setAttribute("data-id", library[i].id);

        const book_title = document.createElement("p");
        book_title.innerText = library[i].title;

        const book_author = document.createElement("p");
        book_author.innerText = library[i].author;

        const book_pages = document.createElement("p");
        book_pages.innerText = library[i].pages;

        const book_read = document.createElement("button");
        library[i].read? book_read.classList.add("read") : book_read.classList.add("unread");
        library[i].read? book_read.innerText = "Completed" : book_read.innerText = "Unread";

        const remove_btn = document.createElement("button");
        remove_btn.innerText = "Remove";

        book_item.appendChild(book_title);
        book_item.appendChild(book_author);
        book_item.appendChild(book_pages);
        book_item.appendChild(book_read);
        book_item.appendChild(remove_btn);
        grid.appendChild(book_item);
    }
}

const add_book_btn = document.querySelector("#add-book");
const modal_overlay = document.querySelector(".modal-overlay");
const modal = document.querySelector(".modal");
add_book_btn.addEventListener("click", function() {
    modal_overlay.classList.add("active");
    modal.classList.add("active");
});

modal_overlay.addEventListener("click", function() {
    modal_overlay.classList.remove("active");
    modal.classList.remove("active");
});

modal.addEventListener("click", (event) =>{
    event.stopPropagation();
});

const submit_add_book_btn = document.querySelector("#submit-book");
submit_add_book_btn.addEventListener("click", (event) =>{
    event.preventDefault();

    const title = document.querySelector('input[name="title"]').value.trim();
    const author = document.querySelector('input[name="author"]').value.trim();
    const pages = document.querySelector('input[name="pages"]').value.trim();
    const completed = document.querySelector('#read').checked;

    const title_req = document.querySelector("#title-req");
    const author_req = document.querySelector("#author-req");
    const pages_req = document.querySelector("#pages-req");

    title_req.style.display = "none";
    author_req.style.display = "none";
    pages_req.style.display = "none";

    let hasError = false;
    
    if (!title) {
        title_req.style.display = "block";
        hasError = true;
    }

    if (!author) {
        author_req.style.display = "block";
        hasError = true;
    }

    if (!pages) {     
        pages_req.style.display = "block";
        hasError = true;
    }

    if (hasError) return;
    
    addBookToLibrary(title, author, pages, completed);
    displayBooks(myLibrary)
    modal_overlay.classList.remove("active");
    modal.classList.remove("active");
    document.querySelector("form").reset();
    updateStats();    
});

document.querySelector(".books-container").addEventListener("click", function (event) {
    const bookId = event.target.closest('.book-item').getAttribute('data-id');
    const bookToEdit = myLibrary.find(book => book.id === bookId);

    if (event.target && event.target.innerText === "Remove") {
        const index = myLibrary.indexOf(bookToEdit);
        if (index !== -1) {
            myLibrary.splice(index, 1);
        }

        event.target.closest('.book-item').remove();
    }

    if (event.target && event.target.innerText === "Completed" || event.target && event.target.innerText === "Unread") {
        bookToEdit.toggleReadStatus();
        
        event.target.classList.toggle("read", bookToEdit.read);
        event.target.classList.toggle("unread", !bookToEdit.read);
        event.target.innerText = bookToEdit.read ? "Completed" : "Unread";
    }

    saveLibrary();
    updateStats();
})

loadLibrary();
updateStats();
displayBooks(myLibrary);