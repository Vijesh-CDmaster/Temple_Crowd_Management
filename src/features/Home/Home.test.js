import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

describe('Home Component', () => {
  test('renders hero section with exact copy text', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Welcome to TempleConnect')).toBeInTheDocument();
    expect(screen.getByText('Your guide to divine pilgrimage experience in Gujarat')).toBeInTheDocument();
    expect(screen.getByText('Book Darshan')).toBeInTheDocument();
  });

  test('renders features section', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Features for a Blessed Journey')).toBeInTheDocument();
  });

  test('renders popular temples', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Popular Gujarat Temples')).toBeInTheDocument();
    expect(screen.getByText('Somnath Temple')).toBeInTheDocument();
  });
});
