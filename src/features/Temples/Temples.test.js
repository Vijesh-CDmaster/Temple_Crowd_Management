import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Temples from './Temples';

describe('Temples Component', () => {
  test('renders temples list with search', () => {
    render(
      <BrowserRouter>
        <Temples />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Sacred Temples of Gujarat')).toBeInTheDocument();
    expect(screen.getByText('Somnath Temple')).toBeInTheDocument();
  });

  test('shows search input and filters', () => {
    render(
      <BrowserRouter>
        <Temples />
      </BrowserRouter>
    );
    
    expect(screen.getByPlaceholderText(/search temples/i)).toBeInTheDocument();
  });
});
