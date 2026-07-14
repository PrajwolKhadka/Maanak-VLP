import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ContinueCard from '@/components/dashboard/ContinueCard';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));

const props = {
  chapterName: 'Laws of Thermodynamics',
  lessonTitle: 'First Law',
  percentage: 75,
  completedLessons: 15,
  totalLessons: 20,
  lessonId: 'lesson123',
  topicId: 'thermodynamics',
};

describe('ContinueCard', () => {
  it('should render chapter name', () => {
    render(<ContinueCard {...props} />);
    expect(screen.getByText('Laws of Thermodynamics')).toBeInTheDocument();
  });

  it('should render lesson title', () => {
    render(<ContinueCard {...props} />);
    expect(screen.getByText('First Law')).toBeInTheDocument();
  });

  it('should render percentage', () => {
    render(<ContinueCard {...props} />);
    expect(screen.getByText(/75%/)).toBeInTheDocument();
  });

  it('should render lesson progress', () => {
    render(<ContinueCard {...props} />);
    expect(screen.getByText('15/20 Lessons')).toBeInTheDocument();
  });

  it('should render resume button', () => {
    render(<ContinueCard {...props} />);
    expect(screen.getByText(/Resume Lesson/)).toBeInTheDocument();
  });
});