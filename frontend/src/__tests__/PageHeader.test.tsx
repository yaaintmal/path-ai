// React import not required with new JSX transform
import { render, screen, fireEvent } from '@testing-library/react';
import PageHeader from '../components/ui/PageHeader';

describe('PageHeader', () => {
  it('renders title and subtitle and back button', () => {
    const onBack = jest.fn();
    render(<PageHeader title="Test Title" subtitle="A subtitle" onBack={onBack} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('A subtitle')).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /back/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onBack).toHaveBeenCalled();
  });

  it('renders without subtitle and back button', () => {
    render(<PageHeader title="Only Title" />);
    expect(screen.getByText('Only Title')).toBeInTheDocument();
    expect(screen.queryByText('A subtitle')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
  });
});
