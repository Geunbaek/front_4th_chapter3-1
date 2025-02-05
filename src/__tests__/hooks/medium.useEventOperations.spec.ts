import { act, renderHook, waitFor } from '@testing-library/react';

import { getEvents } from '../../__mocks__/events/api.ts';
import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../../__mocks__/handlersUtils.ts';
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { server } from '../../setupTests.ts';
import { createRandomEvent } from '../utils.ts';

const toast = vi.fn();

vi.mock('@chakra-ui/react', async () => {
  const original = await vi.importActual('@chakra-ui/react');
  return {
    ...original,
    useToast: () => toast,
  };
});

describe('useEventOperations', () => {
  afterEach(() => {
    toast.mockReset();
  });

  it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다', async () => {
    // Arrange
    const event1 = createRandomEvent();
    const event2 = createRandomEvent();
    const event3 = createRandomEvent();
    setupMockHandlerCreation([event1, event2, event3]);

    // Act
    const { result } = renderHook(() => useEventOperations(false));

    // Assert
    await waitFor(() => {
      expect(result.current.events).toEqual([event1, event2, event3]);
    });
  });

  it('정의된 이벤트 정보를 기준으로 적절하게 저장이 된다', async () => {
    // Arrange
    const event1 = createRandomEvent();
    const newEvent = createRandomEvent();
    setupMockHandlerCreation([event1]);

    // Act
    const { result } = renderHook(() => useEventOperations(false));

    act(() => {
      result.current.saveEvent(newEvent);
    });

    // Assert
    await waitFor(() => {
      expect(result.current.events).toEqual([event1, newEvent]);
    });
  });

  it("새로 정의된 'title', 'endTime' 기준으로 적절하게 일정이 업데이트 된다", async () => {
    // Arrange
    const event1 = createRandomEvent({
      startTime: '13:00',
      endTime: '14:00',
    });
    const updatedEvent = { ...event1, title: '업데이트된 이벤트', endTime: '15:00' };
    setupMockHandlerUpdating([event1]);

    // Act
    const { result } = renderHook(() => useEventOperations(true));

    act(() => {
      result.current.saveEvent(updatedEvent);
    });

    // Assert
    await waitFor(() => {
      expect(result.current.events).toEqual([updatedEvent]);
    });
  });

  it('존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다.', async () => {
    // Arrange
    const event = createRandomEvent();
    setupMockHandlerDeletion([event]);

    // Act
    const { result } = renderHook(() => useEventOperations(true));

    act(() => {
      result.current.deleteEvent(event.id);
    });

    // Assert
    await waitFor(() => {
      expect(result.current.events).toEqual([]);
    });
  });

  it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {
    // Arrange
    server.use(getEvents({ events: [] }, true));

    // Act
    renderHook(() => useEventOperations(false));

    // Assert
    await waitFor(() => {
      expect(toast).toBeCalledWith({
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: '이벤트 로딩 실패',
      });
    });
  });

  it("존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다", async () => {
    // Arrange
    const updatedEvent = createRandomEvent();
    setupMockHandlerUpdating([]);

    // Act
    const { result } = renderHook(() => useEventOperations(true));
    act(() => {
      result.current.saveEvent(updatedEvent);
    });

    // Assert
    await waitFor(() => {
      expect(toast).toBeCalledWith({
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: '일정 저장 실패',
      });
    });
  });

  it("네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다", async () => {
    // Arrange
    const event = createRandomEvent();
    setupMockHandlerDeletion([event], true);

    // Act
    const { result } = renderHook(() => useEventOperations(true));
    act(() => {
      result.current.deleteEvent(event.id);
    });

    // Assert
    await waitFor(() => {
      expect(toast).toBeCalledWith({
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: '일정 삭제 실패',
      });
    });
  });
});
