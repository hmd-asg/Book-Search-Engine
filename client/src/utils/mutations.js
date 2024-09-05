import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_BOOK = gql`
mutation saveBook($input: saveBookInput!) {
    saveBook(input: $input) {
      username
      savedBooks {
        title
        link
        image
        description
        bookId
        authors
      }
    }
  }
`;

export const DELETE_BOOK = gql`
mutation removeBook($bookId: String) {
    removeBook(bookId: $bookId) {
      savedBooks {
        title
        link
        image
        description
        bookId
        authors
      }
    }
  }
`;
