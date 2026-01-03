import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Maps from './Maps';

describe('Maps Component', () => {
  test('renders map header and search', () => {
    render(
      <BrowserRouter>
        <Maps />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Temple Maps')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search temples...')).toBeInTheDocument();
  });

  test('shows temple count', () => {
    render(
      <BrowserRouter>
        <Maps />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Total Temples')).toBeInTheDocument();
  });
});
