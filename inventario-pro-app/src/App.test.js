import { render, screen } from '@testing-library/react';
import App from './App';

test('redirige a login cuando no hay sesion activa', () => {
  render(<App />);
  const heading = screen.getByText(/iniciar sesion/i);
  expect(heading).toBeInTheDocument();
});
