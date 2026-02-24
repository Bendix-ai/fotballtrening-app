import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { toJSON } = render(<ProgressBar progress={0.5} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render with 0% progress', () => {
    const { toJSON } = render(<ProgressBar progress={0} />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
    // The fill bar should have width: '0%'
    if (tree && 'children' in tree && tree.children) {
      const fillBar = tree.children[0] as { props: { style: { width: string }[] | { width: string } } };
      const style = Array.isArray(fillBar.props.style)
        ? fillBar.props.style.find((s: Record<string, unknown>) => 'width' in s)
        : fillBar.props.style;
      expect(style?.width).toBe('0%');
    }
  });

  it('should render with 100% progress', () => {
    const { toJSON } = render(<ProgressBar progress={1} />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
    if (tree && 'children' in tree && tree.children) {
      const fillBar = tree.children[0] as { props: { style: { width: string }[] | { width: string } } };
      const style = Array.isArray(fillBar.props.style)
        ? fillBar.props.style.find((s: Record<string, unknown>) => 'width' in s)
        : fillBar.props.style;
      expect(style?.width).toBe('100%');
    }
  });

  it('should clamp progress above 1 to 100%', () => {
    const { toJSON } = render(<ProgressBar progress={1.5} />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
    if (tree && 'children' in tree && tree.children) {
      const fillBar = tree.children[0] as { props: { style: { width: string }[] | { width: string } } };
      const style = Array.isArray(fillBar.props.style)
        ? fillBar.props.style.find((s: Record<string, unknown>) => 'width' in s)
        : fillBar.props.style;
      expect(style?.width).toBe('100%');
    }
  });

  it('should clamp progress below 0 to 0%', () => {
    const { toJSON } = render(<ProgressBar progress={-0.5} />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
    if (tree && 'children' in tree && tree.children) {
      const fillBar = tree.children[0] as { props: { style: { width: string }[] | { width: string } } };
      const style = Array.isArray(fillBar.props.style)
        ? fillBar.props.style.find((s: Record<string, unknown>) => 'width' in s)
        : fillBar.props.style;
      expect(style?.width).toBe('0%');
    }
  });

  it('should handle NaN progress as 0%', () => {
    const { toJSON } = render(<ProgressBar progress={NaN} />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
    if (tree && 'children' in tree && tree.children) {
      const fillBar = tree.children[0] as { props: { style: { width: string }[] | { width: string } } };
      const style = Array.isArray(fillBar.props.style)
        ? fillBar.props.style.find((s: Record<string, unknown>) => 'width' in s)
        : fillBar.props.style;
      expect(style?.width).toBe('0%');
    }
  });

  it('should render with custom height', () => {
    const { toJSON } = render(<ProgressBar progress={0.5} height={8} />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
    // Check the container has height 8
    if (tree && 'props' in tree) {
      const containerStyle = Array.isArray(tree.props.style)
        ? tree.props.style.find((s: Record<string, unknown>) => 'height' in s)
        : tree.props.style;
      expect(containerStyle?.height).toBe(8);
    }
  });

  it('should render with custom colors', () => {
    const { toJSON } = render(
      <ProgressBar progress={0.5} color="#FF0000" backgroundColor="#CCCCCC" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('should render with custom style', () => {
    const { toJSON } = render(
      <ProgressBar progress={0.5} style={{ marginTop: 10 }} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('should render 50% progress correctly', () => {
    const { toJSON } = render(<ProgressBar progress={0.5} />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
    if (tree && 'children' in tree && tree.children) {
      const fillBar = tree.children[0] as { props: { style: { width: string }[] | { width: string } } };
      const style = Array.isArray(fillBar.props.style)
        ? fillBar.props.style.find((s: Record<string, unknown>) => 'width' in s)
        : fillBar.props.style;
      expect(style?.width).toBe('50%');
    }
  });
});
