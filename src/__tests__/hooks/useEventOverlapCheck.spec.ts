import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, it, expect } from 'vitest';

import useEventOverlapCheck from '../../hooks/useEventOverlapCheck';
import { createRandomEvent } from '../utils';

describe('useEventOverlapCheck 훅', () => {
  it('겹치는 일정이 있을 경우 true를 반환해야 한다', () => {
    // Arrange
    const event = createRandomEvent({
      title: '테스트 일정',
      date: '2025-02-10',
      startTime: '10:00',
      endTime: '11:00',
    });
    const newEvent = createRandomEvent({
      title: '겹치는 일정',
      date: '2025-02-10',
      startTime: '10:30',
      endTime: '11:30',
    });

    // Act
    const { result } = renderHook(() => useEventOverlapCheck([event]));

    let isOverlap;
    act(() => {
      isOverlap = result.current.checkOverlap(newEvent);
    });

    // Assert
    expect(isOverlap).toBe(true);
    expect(result.current.overlappingEvents.length).toBe(1);
  });

  it('겹치는 일정이 없을 경우 false를 반환해야 한다', () => {
    // Arrange
    const event = createRandomEvent({
      title: '테스트 일정',
      date: '2025-02-10',
      startTime: '10:00',
      endTime: '11:00',
    });
    const newEvent = createRandomEvent({
      title: '겹치지 않는 일정',
      date: '2025-02-11',
      startTime: '12:00',
      endTime: '13:00',
    });

    // Act
    const { result } = renderHook(() => useEventOverlapCheck([event]));
    const isOverlap = result.current.checkOverlap(newEvent);

    // Assert
    expect(isOverlap).toBe(false);
    expect(result.current.overlappingEvents.length).toBe(0);
  });
});
