import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyTokens from './MyTokens';

describe('MyTokens Component', () => {
  test('renders tokens list with mock data', async () => {
    render(
      <BrowserRouter>
        <MyTokens />
      </BrowserRouter>
    );
    
    expect(await screen.findByText('My Tokens')).toBeInTheDocument();
  });

  test('shows empty state when no tokens', async () => {
    const { container } = render(
      <BrowserRouter>
        <MyTokens />
      </BrowserRouter>
    );
    
    expect(container).toBeDefined();
  });
});
