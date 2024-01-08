import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookManagement() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    publishedYear: '',
  });
  const [updateBookData, setUpdateBookData] = useState({
    id: null,
    title: '',
    author: '',
    publishedYear: '',
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    // Fetch books from the backend when the component mounts
    axios.get('http://localhost:3003/books')
      .then(response => setBooks(response.data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  const addBook = () => {
    axios.post('http://localhost:3003/books/add', newBook)
      .then(response => setBooks([...books, response.data]))
      .catch(error => console.error('Error adding book:', error));

    setNewBook({
      title: '',
      author: '',
      publishedYear: '',
    });
  };

  const updateBook = () => {
    axios.put(`http://localhost:3003/books/update/${updateBookData.id}`, updateBookData)
      .then(response => {
        const updatedBooks = books.map(book => {
          if (book.id === updateBookData.id) {
            return { ...book, ...updateBookData };
          }
          return book;
        });
        setBooks(updatedBooks);
        setShowUpdateForm(false); // Close the update form after successful update
      })
      .catch(error => console.error('Error updating book:', error));
  };

  const deleteBook = (bookId) => {
    axios.delete(`http://localhost:3003/books/delete/${bookId}`)
      .then(response => {
        const updatedBooks = books.filter(book => book.id !== bookId);
        setBooks(updatedBooks);
      })
      .catch(error => console.error('Error deleting book:', error));
  };

  const openUpdateForm = (book) => {
    setUpdateBookData(book);
    setShowUpdateForm(true);
  };

  const closeUpdateForm = () => {
    setUpdateBookData({
      id: null,
      title: '',
      author: '',
      publishedYear: '',
    });
    setShowUpdateForm(false);
  };

  return (
    <div>
      <h1>Book Management</h1>
      <ul>
        {books.map(book => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author}, published in {book.publishedYear}
            <button onClick={() => openUpdateForm(book)}>Update</button>
            <button onClick={() => deleteBook(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          type="text"
          placeholder="Published Year"
          value={newBook.publishedYear}
          onChange={(e) => setNewBook({ ...newBook, publishedYear: e.target.value })}
        />
        <button onClick={addBook}>Add Book</button>
      </div>

      {showUpdateForm && (
        <div>
          <h2>Update Book</h2>
          <input
            type="text"
            placeholder="Title"
            value={updateBookData.title}
            onChange={(e) => setUpdateBookData({ ...updateBookData, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Author"
            value={updateBookData.author}
            onChange={(e) => setUpdateBookData({ ...updateBookData, author: e.target.value })}
          />
          <input
            type="text"
            placeholder="Published Year"
            value={updateBookData.publishedYear}
            onChange={(e) => setUpdateBookData({ ...updateBookData, publishedYear: e.target.value })}
          />
          <button onClick={updateBook}>Update Book</button>
          <button onClick={closeUpdateForm}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default BookManagement;
