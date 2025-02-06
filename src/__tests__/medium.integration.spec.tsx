import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../__mocks__/handlersUtils';
import App from '../App';
import { notificationOptions } from '../constants';
import { Event, EventForm } from '../types';
import { createRandomEvent } from './utils';
import { formatDate } from '../utils/dateUtils';

const renderWithUser = (...props: Parameters<typeof render>) => {
  const user = userEvent.setup();
  return {
    user,
    ...render(...props),
  };
};

const typeEventForm = async (eventForm: EventForm, user: UserEvent) => {
  const { title, date, startTime, endTime, description, location, category, notificationTime } =
    eventForm;

  await user.clear(await screen.findByLabelText(/제목/));
  await user.type(await screen.findByLabelText(/제목/), title);

  await user.clear(await screen.findByLabelText(/날짜/));
  await user.type(await screen.findByLabelText(/날짜/), date);

  await user.clear(await screen.findByLabelText(/시작 시간/));
  await user.type(await screen.findByLabelText(/시작 시간/), startTime);

  await user.clear(await screen.findByLabelText(/종료 시간/));
  await user.type(await screen.findByLabelText(/종료 시간/), endTime);

  await user.clear(await screen.findByLabelText(/설명/));
  await user.type(await screen.findByLabelText(/설명/), description);

  await user.clear(await screen.findByLabelText(/위치/));
  await user.type(await screen.findByLabelText(/위치/), location);

  await user.selectOptions(await screen.findByLabelText(/카테고리/), category);

  const notificationOption = notificationOptions.find(
    (notificationOption) => notificationOption.value === notificationTime
  );

  await user.selectOptions(await screen.findByLabelText(/알림 설정/), notificationOption!.label);
};

const checkEventItem = async (event: Event) => {
  const { id, title, date, startTime, endTime, description, location, category, notificationTime } =
    event;

  const eventItem = await screen.findByTestId(new RegExp(`event-${id}`));

  expect(await within(eventItem).findByText(title)).toBeInTheDocument();
  expect(await within(eventItem).findByText(date)).toBeInTheDocument();
  expect(await within(eventItem).findByText(`${startTime} - ${endTime}`)).toBeInTheDocument();
  expect(await within(eventItem).findByText(description)).toBeInTheDocument();
  expect(await within(eventItem).findByText(location)).toBeInTheDocument();
  expect(await within(eventItem).findByText(new RegExp(`${category}`))).toBeInTheDocument();

  const notificationOption = notificationOptions.find(
    (notificationOption) => notificationOption.value === notificationTime
  );

  expect(
    await within(eventItem).findByText(new RegExp(`${notificationOption!.label}`))
  ).toBeInTheDocument();
};

describe('일정 CRUD 및 기본 기능', () => {
  it('새로운 일정을 생성하면, 모든 입력값이 이벤트 리스트에 올바르게 반영된다.', async () => {
    // Arrange
    setupMockHandlerCreation([]);
    const now = formatDate(new Date());
    const testEvent = createRandomEvent({
      date: now,
    });

    // act
    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await typeEventForm(testEvent, user);
    await user.click(screen.getByRole('button', { name: /일정 추가/ }));

    // Assert
    const eventList = screen.getByTestId(/event-list/);
    const eventItem = await within(eventList).findByTestId(/event-/);
    const [, ...rest] = (eventItem.dataset.testid ?? '').split('-');
    await checkEventItem({ ...testEvent, id: rest.join('-') });
  });

  it('기존 일정을 수정하면, 변경된 정보가 이벤트 리스트에 반영된다.', async () => {
    // Arrange
    const now = formatDate(new Date());
    const testEvent = createRandomEvent({
      date: now,
    });

    const updatedEvent = {
      ...testEvent,
      title: '업데이트 된 테스트 일정',
      startTime: '14:00',
      endTime: '15:00',
      description: '업데이트 된 테스트 설명',
      location: '업데이트 된 테스트 위치',
    };

    setupMockHandlerUpdating([testEvent]);

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await user.click(await screen.findByLabelText(/Edit event/));
    await typeEventForm(updatedEvent, user);
    await user.click(screen.getByRole('button', { name: /일정 수정/ }));

    // Assert
    await checkEventItem(updatedEvent);
  });

  it('일정을 삭제하면 해당 이벤트가 리스트에서 제거되어야 한다.', async () => {
    // Arrange
    const now = formatDate(new Date());
    const testEvent = createRandomEvent({
      date: now,
    });
    setupMockHandlerDeletion([testEvent]);

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );
    await user.click(await screen.findByLabelText(/Delete event/));

    // Assert
    expect(screen.queryByTestId(`event-${testEvent.id}`)).not.toBeInTheDocument();
  });
});

describe('일정 뷰', () => {
  beforeEach(() => {
    const fakeDate = new Date('2025-02-02');
    vi.setSystemTime(fakeDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('주간 뷰를 선택하면, 해당 주에 일정이 없을 경우 이벤트가 표시되지 않는다.', async () => {
    // Arrange
    const testDate = formatDate(new Date('2025-02-11'));
    const testEvent = createRandomEvent({
      date: testDate,
    });
    setupMockHandlerCreation([testEvent]);

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );
    await user.selectOptions(await screen.findByLabelText(/view/), 'Week');

    // Assert
    expect(screen.queryByTestId(new RegExp(`event-${testEvent.id}`))).not.toBeInTheDocument();
  });

  it('주간 뷰에서, 해당 주의 일정이 정확하게 표시된다.', async () => {
    // Arrange
    const testDate = formatDate(new Date('2025-02-02'));
    const testEvent = createRandomEvent({
      date: testDate,
    });
    setupMockHandlerCreation([testEvent]);

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );
    await user.selectOptions(await screen.findByLabelText(/view/), 'Week');

    // Assert
    await checkEventItem(testEvent);
  });

  it('월간 뷰에서 일정이 없으면 "검색 결과가 없습니다." 메시지가 표시되어야 한다.', async () => {
    // Arrange
    setupMockHandlerCreation([]);

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );
    await user.selectOptions(await screen.findByLabelText(/view/), 'Month');

    // Assert
    const eventList = screen.getByTestId(/event-list/);
    expect(within(eventList).queryByText(/검색 결과가 없습니다./)).toBeInTheDocument();
  });

  it('월간 뷰에서, 여러 일정이 올바르게 표시된다.', async () => {
    // Arrange
    const testEvent1 = createRandomEvent({
      date: formatDate(new Date('2025-02-03')),
      startTime: '13:00',
      endTime: '14:00',
    });
    const testEvent2 = createRandomEvent({
      date: formatDate(new Date('2025-02-03')),
      startTime: '14:00',
      endTime: '15:00',
    });
    setupMockHandlerCreation([testEvent1, testEvent2]);

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );
    await user.selectOptions(await screen.findByLabelText(/view/), 'Month');

    // Assert
    await checkEventItem(testEvent1);
    await checkEventItem(testEvent2);
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시된다.', async () => {
    // Arrange
    const 신정 = new Date('2024-01-01');
    vi.setSystemTime(신정);

    // Act
    renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    // Assert
    expect(screen.queryByText(/신정/)).toBeInTheDocument();
  });
});

describe('검색 기능', () => {
  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    // Arrange
    setupMockHandlerCreation([]);

    // Act
    renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    // Assert
    const eventList = screen.getByTestId('event-list');
    expect(within(eventList).queryByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it('"팀 회의" 검색 시, 해당 제목을 가진 이벤트만 리스트에 노출된다.', async () => {
    // Arrange
    const testDate = formatDate(new Date());
    const testEvent = createRandomEvent({
      title: '팀 회의',
      date: testDate,
    });
    setupMockHandlerCreation([testEvent]);

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );
    await user.type(screen.getByLabelText(/일정 검색/), '팀 회의');

    // Assert
    await checkEventItem(testEvent);
  });

  it('검색어를 삭제하면 전체 이벤트 리스트가 복원된다.', async () => {
    // Arrange
    const testDate = formatDate(new Date());
    const testEvent1 = createRandomEvent({
      title: '팀 회의',
      date: testDate,
      startTime: '13:00',
      endTime: '14:00',
    });
    const testEvent2 = createRandomEvent({
      title: '테스트 일정',
      date: testDate,
      startTime: '14:00',
      endTime: '15:00',
    });
    setupMockHandlerCreation([testEvent1, testEvent2]);

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );
    await user.type(screen.getByLabelText(/일정 검색/), '팀 회의');
    await user.clear(screen.getByLabelText(/일정 검색/));

    // Assert
    await checkEventItem(testEvent1);
    await checkEventItem(testEvent2);
  });
});

describe('일정 충돌', () => {
  it('동일 시간대에 새로운 일정을 추가하면, 충돌 경고 메시지가 노출된다.', async () => {
    // Arrange
    const testDate = formatDate(new Date());
    const testEvent = createRandomEvent({
      date: testDate,
      startTime: '13:00',
      endTime: '14:00',
    });
    const additionalEvent = createRandomEvent({
      date: testDate,
      startTime: '13:00',
      endTime: '14:00',
    });
    setupMockHandlerCreation([testEvent]);

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );
    await typeEventForm(additionalEvent, user);
    await user.click(screen.getByRole('button', { name: /일정 추가/ }));

    // Assert
    expect(screen.queryByText(/일정 겹침 경고/)).toBeInTheDocument();
  });

  it('기존 일정 수정 시, 시간 충돌이 발생하면 충돌 경고 메시지가 표시된다.', async () => {
    // Arrange
    const testDate = formatDate(new Date());
    const testEvent = createRandomEvent({
      date: testDate,
      startTime: '13:00',
      endTime: '14:00',
    });
    const additionalEvent = createRandomEvent({
      date: testDate,
      startTime: '14:00',
      endTime: '15:00',
    });
    const updatedEvent = {
      ...additionalEvent,
      startTime: '13:30',
    };
    setupMockHandlerCreation([testEvent, additionalEvent]);

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );
    const eventItem = await screen.findByTestId(`event-${additionalEvent.id}`);
    await user.click(await within(eventItem).findByLabelText(/Edit event/));
    await typeEventForm(updatedEvent, user);
    await user.click(screen.getByRole('button', { name: /일정 수정/ }));

    // Assert
    expect(screen.queryByText(/일정 겹침 경고/)).toBeInTheDocument();
  });
});

describe('알림', () => {
  beforeEach(() => {
    const now = new Date('2025-02-02T13:00:00');
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('알림 설정이 10분 전일 경우, "10분 후 [이벤트 제목] 일정이 시작됩니다."라는 메시지가 표시된다.', async () => {
    // Arrange
    const testDate = formatDate(new Date('2025-02-02'));
    const testEvent = createRandomEvent({
      date: testDate,
      startTime: '13:09',
      endTime: '14:00',
      notificationTime: 10,
    });
    setupMockHandlerCreation([testEvent]);

    // Act
    renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    // Assert
    expect(
      await screen.findByText(new RegExp(`10분 후 ${testEvent.title} 일정이 시작됩니다.`))
    ).toBeInTheDocument();
  });
});
