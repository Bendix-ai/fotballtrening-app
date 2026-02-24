import React from 'react';
import { Animated } from 'react-native';
import { render } from '@testing-library/react-native';
import { LoadingSkeleton, SkeletonCard } from '../LoadingSkeleton';

// Mock Animated.loop and Animated.timing to avoid native driver issues in tests
jest.spyOn(Animated, 'timing').mockReturnValue({
  start: jest.fn(),
  stop: jest.fn(),
  reset: jest.fn(),
} as unknown as Animated.CompositeAnimation);

jest.spyOn(Animated, 'sequence').mockReturnValue({
  start: jest.fn(),
  stop: jest.fn(),
  reset: jest.fn(),
} as unknown as Animated.CompositeAnimation);

jest.spyOn(Animated, 'loop').mockReturnValue({
  start: jest.fn(),
  stop: jest.fn(),
  reset: jest.fn(),
} as unknown as Animated.CompositeAnimation);

describe('LoadingSkeleton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { toJSON } = render(<LoadingSkeleton />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render with default props', () => {
    const { toJSON } = render(<LoadingSkeleton />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('should render with custom width and height', () => {
    const { toJSON } = render(<LoadingSkeleton width={200} height={24} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render with custom borderRadius', () => {
    const { toJSON } = render(<LoadingSkeleton borderRadius={16} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render with percentage width', () => {
    const { toJSON } = render(<LoadingSkeleton width="70%" />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render with custom style', () => {
    const { toJSON } = render(
      <LoadingSkeleton style={{ marginTop: 10 }} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('should start the animation on mount', () => {
    render(<LoadingSkeleton />);
    expect(Animated.loop).toHaveBeenCalled();
  });
});

describe('SkeletonCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { toJSON } = render(<SkeletonCard />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render with custom style', () => {
    const { toJSON } = render(<SkeletonCard style={{ marginTop: 20 }} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render multiple skeleton elements inside the card', () => {
    const { toJSON } = render(<SkeletonCard />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
    // SkeletonCard contains multiple LoadingSkeleton children within a card View
    if (tree && 'children' in tree) {
      expect(tree.children).toBeTruthy();
      expect(tree.children!.length).toBeGreaterThan(0);
    }
  });
});
