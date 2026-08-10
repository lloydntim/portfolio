import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HeroImage } from './HeroImage';

describe('HeroImage', () => {
  it('renders the accented title and subtitle', () => {
    render(<HeroImage titleAccent="Product" titleRest="Engineer" subtitle="Building useful, scalable software." />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Product Engineer');
    expect(screen.getByText('Building useful, scalable software.')).toBeInTheDocument();
  });
});
