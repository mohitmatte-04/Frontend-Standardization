import { describe, it, expect } from '@jest/globals';
import { render, screen } from '../setup/test-utils';
import HomePage from '@/app/page';

describe('HomePage', () => {
    it('renders the main heading', () => {
        render(<HomePage />);
        const heading = screen.getByRole('heading', {
            name: /Next.js Standardization Template/i,
        });
        expect(heading).toBeInTheDocument();
    });

    it('renders feature cards', () => {
        render(<HomePage />);
        expect(screen.getByText(/Components/i)).toBeInTheDocument();
        expect(screen.getByText(/Authentication/i)).toBeInTheDocument();
        expect(screen.getByText(/Best Practices/i)).toBeInTheDocument();
    });
});
