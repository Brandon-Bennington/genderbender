import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap'; // Import Bootstrap components

function MainApp() {
  const [movieTitle, setMovieTitle] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const genres = ['Action', 'Comedy', 'Drama', 'Family', 'Fantasy', 'Horror', 'Sci-Fi', 'Thriller'];

  const performGenreBendRequest = async (movieTitle, genre) => {
    console.log(`Making request for movie title: ${movieTitle}, genre: ${genre}`);
    try {
      setLoading(true);
      setSelectedGenre(genre);
      const response = await axios.get(`/api/genre-bend/${movieTitle}/${genre}`);
      console.log('Response received from API:', response);
      setResult(response.data);
    } catch (error) {
      console.error('Error occurred while making request:', error);
      if (error.response) {
        console.log('Error response received from server:', error.response);
        if (error.response.status === 404) {
          setResult('Movie not found. Please try another title.');
        } else {
          setResult('An error occurred while processing your request. Please try again.');
        }
      } else if (error.request) {
        console.log('Request made but no response received:', error.request);
        setResult('Network error. Please check your connection and try again.');
      } else {
        console.log('Unexpected error occurred:', error.message);
        setResult('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
      setSelectedGenre(null);
    }
  };
  
  return (
    <Container style={{ width: '100%' }} className="App mt-5">
      <Row className="justify-content-md-center h-100">
        <Col xs={12} className="my-auto">
          <h1>Genre Bend</h1>
          <Form
            id="genre-bend-form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Form.Group as={Row} controlId="movie-title">
              <Form.Label column sm={2}>
                Movie Title:
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  required
                  value={movieTitle}
                  onChange={(e) => setMovieTitle(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Row className="genre-buttons">
              {genres.map((genre) => (
                <Col key={genre} sm={2}>
                  <Button
                    variant="primary"
                    onClick={() => performGenreBendRequest(movieTitle, genre)}
                    disabled={loading}
                    className="w-100"
                  >
                    {loading && selectedGenre === genre ? 'Loading...' : genre}
                  </Button>
                </Col>
              ))}
            </Row>
            <Row className="justify-content-md-center mt-5">
              <Col xs={12}>
                <Card>
                  <Card.Header as="h2">Genre-Bent Version</Card.Header>
                  <Card.Body>
                    <Card.Text id="result">{result}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default MainApp;
