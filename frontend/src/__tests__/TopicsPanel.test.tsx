import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import TopicsPanel from '@/components/layout/TopicsPanel';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('next/link', () => ({ __esModule: true, default: ({ children, href }: any) => <a href={href}>{children}</a> }));

const mockCategories = [
  {
    category: 'Physical Chemistry',
    subjects: [
      { id: 'thermodynamics', name: 'Thermodynamics' },
      { id: 'electrochemistry', name: 'Electrochemistry' },
    ],
  },
];

describe('TopicsPanel', () => {
  it('should render category name', () => {
    render(<TopicsPanel categories={mockCategories} onClose={jest.fn()} />);
    expect(screen.getByText('Physical Chemistry')).toBeInTheDocument();
  });

  it('should render topic names', () => {
    render(<TopicsPanel categories={mockCategories} onClose={jest.fn()} />);
    expect(screen.getByText('Thermodynamics')).toBeInTheDocument();
    expect(screen.getByText('Electrochemistry')).toBeInTheDocument();
  });

  it('should call onClose when X button clicked', () => {
    const onClose = jest.fn();
    render(<TopicsPanel categories={mockCategories} onClose={onClose} />);
    fireEvent.click(screen.getByText('✕'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should show loading when categories empty', () => {
    render(<TopicsPanel categories={[]} onClose={jest.fn()} />);
    expect(screen.getByText('Loading topics...')).toBeInTheDocument();
  });

  it('should render Get Started link', () => {
    render(<TopicsPanel categories={mockCategories} onClose={jest.fn()} />);
    expect(screen.getByText('Get Started →')).toBeInTheDocument();
  });
});