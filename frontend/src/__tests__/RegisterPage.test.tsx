import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@/app/(auth)/register/page';

jest.mock('@/lib/axios');
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} />
  ),
}));
jest.mock('@/store/authStore', () => ({
  useAuthStore: () => ({ setAuth: jest.fn() }),
}));

describe('RegisterPage', () => {
  it('should render signup button', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('button', { name: /Signup/i })).toBeInTheDocument();
  });

  it('should show error if passwords do not match', async () => {
    render(<RegisterPage />);

    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
    const confirmInput = document.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
    const checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement;

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different123' } });
    fireEvent.click(checkbox); // Agree to terms

    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('should show error if terms not agreed', async () => {
    render(<RegisterPage />);

    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
    const confirmInput = document.querySelector('input[name="confirmPassword"]') as HTMLInputElement;

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

    await waitFor(() => {
      expect(screen.getByText('Please agree to terms and conditions')).toBeInTheDocument();
    });
  });

  it('should render login link', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
  });
});