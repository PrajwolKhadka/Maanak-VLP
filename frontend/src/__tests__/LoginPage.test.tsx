import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';
import api from '@/lib/axios';

jest.mock('@/lib/axios');
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => ({ get: jest.fn() }),
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: any) => <img src={src} alt={alt} className={className} />,
}));
jest.mock('@/store/authStore', () => ({
  useAuthStore: () => ({ setAuth: jest.fn() }),
}));

describe('LoginPage', () => {
  it('should render email and password fields', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('should render login button', () => {
    render(<LoginPage />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should render Google sign in button', () => {
    render(<LoginPage />);
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });

  it('should show error on failed login', async () => {
    (api.post as jest.Mock).mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeInTheDocument());
  });

  it('should render forgot password link', () => {
    render(<LoginPage />);
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
  });
});