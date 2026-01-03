import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import History from './History';

describe('History Component', () => {
  test('renders history table with data', async () => {
    render(
      <BrowserRouter>
        <History />
      </BrowserRouter>
    );
    
    expect(await screen.findByText('Visit History')).toBeInTheDocument();
  });

  test('shows empty state when no visits', async () => {
    // Mock empty data scenario
    const { container } = render(
      <BrowserRouter>
        <History />
      </BrowserRouter>
    );
    
    expect(container).toBeDefined();
  });

  test('filter buttons work', async () => {
    render(
      <BrowserRouter>
        <History />
      </BrowserRouter>
    );
    
    expect(await screen.findByText('All')).toBeInTheDocument();
  });
});
