process.env.JWT_SECRET = 'testsecret';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '@/components/layout/Sidebar';

jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('@/store/authStore', () => ({
  useAuthStore: () => ({
    user: { username: 'Prajwol', email: 'test@test.com', avatar: null, streak: 5 },
    logout: jest.fn(),
  }),
}));

jest.mock('@/components/layout/ProfileModal', () => ({
  __esModule: true,
  default: ({ onClose }: any) => (
    <div data-testid="profile-modal">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe('Sidebar', () => {
  it('should render logo', () => {
    render(<Sidebar />);
    expect(screen.getByAltText('Maanak')).toBeInTheDocument();
  });

  it('should render username', () => {
    render(<Sidebar />);
    expect(screen.getByText('Prajwol')).toBeInTheDocument();
  });

  it('should render all nav items', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Topics')).toBeInTheDocument();
    expect(screen.getByText('Quizzes')).toBeInTheDocument();
  });

  it('should render logout button', () => {
    render(<Sidebar />);
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  it('should open profile modal on user click', () => {
    render(<Sidebar />);
    fireEvent.click(screen.getByText('View profile'));
    expect(screen.getByTestId('profile-modal')).toBeInTheDocument();
  });
});