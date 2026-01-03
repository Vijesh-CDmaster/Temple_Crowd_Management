import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VirtualQueue from './VirtualQueue';

describe('VirtualQueue Component', () => {
  test('renders booking wizard steps', async () => {
    render(
      <BrowserRouter>
        <VirtualQueue />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Virtual Queue')).toBeInTheDocument();
    expect(screen.getByText('Select Temple')).toBeInTheDocument();
  });
});
