import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import StatsCard from '@/components/dashboard/StatsCard';

describe('StatsCard', () => {
  it('should render label', () => {
    render(<StatsCard label="Total Quizzes" value={24} icon="✅" />);
    expect(screen.getByText('Total Quizzes')).toBeInTheDocument();
  });

  it('should render numeric value', () => {
    render(<StatsCard label="Total Quizzes" value={24} icon="✅" />);
    expect(screen.getByText('24')).toBeInTheDocument();
  });

  it('should render string value with percent', () => {
    render(<StatsCard label="Average Score" value="85%" icon="📊" />);
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('should render icon', () => {
    render(<StatsCard label="Accuracy" value="92%" icon="🎯" />);
    expect(screen.getByText('🎯')).toBeInTheDocument();
  });

  it('should render zero value', () => {
    render(<StatsCard label="Topics" value={0} icon="📖" />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});