import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../__mocks__/handlersUtils';
import App, { notificationOptions } from '../App';
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
  const now = formatDate(new Date());

  const testEvent = createRandomEvent({
    date: now,
  });

  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.
    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await typeEventForm(testEvent, user);
    await user.click(screen.getByRole('button', { name: /일정 추가/ }));

    const eventList = screen.getByTestId(/event-list/);

    const eventItem = await within(eventList).findByTestId(/event-/);
    const [, ...rest] = (eventItem.dataset.testid ?? '').split('-');
    await checkEventItem({ ...testEvent, id: rest.join('-') });
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
    setupMockHandlerUpdating([testEvent]);

    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await user.click(await screen.findByLabelText(/Edit event/));

    const updatedEvent = {
      ...testEvent,
      title: '업데이트 된 테스트 일정',
      startTime: '14:00',
      endTime: '15:00',
      description: '업데이트 된 테스트 설명',
      location: '업데이트 된 테스트 위치',
    };

    await typeEventForm(updatedEvent, user);
    await user.click(screen.getByRole('button', { name: /일정 수정/ }));
    await checkEventItem(updatedEvent);
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
    setupMockHandlerDeletion([testEvent]);

    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await user.click(await screen.findByLabelText(/Delete event/));
    expect(screen.queryByTestId(`event-${testEvent.id}`)).not.toBeInTheDocument();
  });
});

describe('일정 뷰', () => {
  const fakeDate = new Date('2025-02-02');

  beforeEach(() => {
    vi.setSystemTime(fakeDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
    const testDate = formatDate(new Date('2025-02-11'));

    const testEvent = createRandomEvent({
      date: testDate,
    });

    setupMockHandlerCreation([testEvent]);

    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await user.selectOptions(await screen.findByLabelText(/view/), 'Week');
    expect(screen.queryByTestId(new RegExp(`event-${testEvent.id}`))).not.toBeInTheDocument();
  });

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {
    const testDate = formatDate(new Date('2025-02-02'));

    const testEvent = createRandomEvent({
      date: testDate,
    });

    setupMockHandlerCreation([testEvent]);

    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await user.selectOptions(await screen.findByLabelText(/view/), 'Week');
    await checkEventItem(testEvent);
  });

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
    setupMockHandlerCreation([]);

    renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const eventList = screen.getByTestId(/event-list/);
    expect(within(eventList).queryByText(/검색 결과가 없습니다./)).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
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

    renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await checkEventItem(testEvent1);
    await checkEventItem(testEvent2);
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
    const 신정 = new Date('2024-01-01');
    vi.setSystemTime(신정);

    renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    expect(screen.queryByText(/신정/)).toBeInTheDocument();
  });
});

describe('검색 기능', () => {
  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const eventList = screen.getByTestId('event-list');
    expect(within(eventList).queryByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
    const testDate = formatDate(new Date());

    const testEvent = createRandomEvent({
      title: '팀 회의',
      date: testDate,
    });

    setupMockHandlerCreation([testEvent]);

    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await user.type(screen.getByLabelText(/일정 검색/), '팀 회의');
    await checkEventItem(testEvent);
  });

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
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

    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await user.type(screen.getByLabelText(/일정 검색/), '팀 회의');
    await checkEventItem(testEvent1);
    expect(screen.queryByTestId(`event-${testEvent2.id}`)).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText(/일정 검색/));
    await checkEventItem(testEvent1);
    await checkEventItem(testEvent2);
  });
});

describe('일정 충돌', () => {
  const testDate = formatDate(new Date());

  const testEvent = createRandomEvent({
    date: testDate,
    startTime: '13:00',
    endTime: '14:00',
  });

  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {
    setupMockHandlerCreation([testEvent]);

    const additionalEvent = createRandomEvent({
      date: testDate,
      startTime: '13:00',
      endTime: '14:00',
    });

    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await typeEventForm(additionalEvent, user);
    await user.click(screen.getByRole('button', { name: /일정 추가/ }));
    expect(screen.queryByText(/일정 겹침 경고/)).toBeInTheDocument();
  });

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {
    const additionalEvent = createRandomEvent({
      date: testDate,
      startTime: '14:00',
      endTime: '15:00',
    });

    setupMockHandlerCreation([testEvent, additionalEvent]);

    const { user } = renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const eventItem = await screen.findByTestId(`event-${additionalEvent.id}`);
    await user.click(await within(eventItem).findByLabelText(/Edit event/));

    const updatedEvent = {
      ...testEvent,
      startTime: '13:30',
    };

    await typeEventForm(updatedEvent, user);
    await user.click(screen.getByRole('button', { name: /일정 수정/ }));
    expect(screen.queryByText(/일정 겹침 경고/)).toBeInTheDocument();
  });
});

describe('알림', () => {
  const now = new Date('2025-02-02T13:00:00');

  beforeEach(() => {
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {
    const testDate = formatDate(new Date('2025-02-02'));

    const testEvent = createRandomEvent({
      date: testDate,
      startTime: '13:09',
      endTime: '14:00',
      notificationTime: 10,
    });

    setupMockHandlerCreation([testEvent]);

    renderWithUser(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    expect(
      await screen.findByText(new RegExp(`10분 후 ${testEvent.title} 일정이 시작됩니다.`))
    ).toBeInTheDocument();
  });
});
