// AuthPage.jsx
import React from 'react';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import { Container, Row, Col } from 'react-bootstrap'; // Import Bootstrap components

function AuthPage({ onLogin, onSignup }) {
  return (
    <Container fluid className="mt-5"> {/* Change here */}
      <h1 className="text-center mb-5">Welcome to Genre Bend!</h1>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Login onLogin={onLogin} />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={{ span: 6, offset: 3 }}>
          <Signup onSignup={onSignup} />
        </Col>
      </Row>
    </Container>
  );
}

export default AuthPage;
