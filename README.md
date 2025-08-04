# HARD

## 7주차 과제 체크포인트

### 기본과제

- [x] 총 11개의 파일, 115개의 단위 테스트를 무사히 작성하고 통과시킨다.

#### 질문

> Q. handlersUtils에 남긴 질문에 답변해주세요.

인자로 받은 event 를 핸들링하도록 하여 각 테스트에서 독립적인 환경을 만들었습니다.

- setupMockHandlerCreation
  1. initEvent 를 인자로 받아 저장
  2. server.use 함수를 이용해 기존 모킹 함수를 덮어 씌운다.
     - getEvent
     - createEvents 
     
- setupMockHandlerUpdating
  1. initEvent 를 인자로 받아 저장
  2. server.use 함수를 이용해 기존 모킹 함수를 덮어 씌운다.
     - getEvent
     - updateEvent 

- setupMockHandlerDeletion
  1. initEvent 를 인자로 받아 저장
  2. server.use 함수를 이용해 기존 모킹 함수를 덮어 씌운다.
     - getEvent
     - deleteEvent 

각 api 모킹 함수들은 isError라는 인자로 함께 받아 에러 상황을 쉽게 연출할수 있도록 설계했습니다.

- getEvent : mockData 라는 객체를 인자로 받아 GET '/api/events' 요청에 해당 인자의 events를 반환한다.

```js
export const getEvents = (mockData: { events: Event[] }, isError?: boolean) => {
  return http.get('/api/events', () => {
    if (isError) return HttpResponse.json(null, { status: 500 });

    return HttpResponse.json(mockData);
  });
};
```

- createEvents : mockData 라는 객체를 인자로 받아 POST '/api/events' 요청에 해당 인자의 events 에 새로운 event를 추가하고 새로 추가된 event 를 반환한다.

```js
export const createEvent = (mockData: { events: Event[] }, isError?: boolean) => {
  return http.post('/api/events', async ({ request }) => {
    if (isError) return HttpResponse.json(null, { status: 500 });

    const eventForm = (await request.json()) as EventForm | Event;

    const newEvent = makeNewEvent(eventForm);
    mockData.events = addEvent(mockData.events, newEvent);

    return HttpResponse.json(newEvent, { status: 201 });
  });
};
```

- updateEvent : mockData 라는 객체를 인자로 받아 PUT '/api/events/:id' 요청에 해당 인자의 events 에 event를 업데이트하고 새로 업데이트된 event 를 반환한다.

```js
export const updateEvent = (mockData: { events: Event[] }, isError?: boolean) => {
  return http.put('/api/events/:id', async ({ params, request }) => {
    if (isError) return HttpResponse.json(null, { status: 500 });

    const { id } = params;
    const foundEvent = mockData.events.find((event) => event.id === id);

    if (!foundEvent) return HttpResponse.json(null, { status: 404 });

    const updatedEventForm = (await request.json()) as EventForm;
    const updatedEvent: Event = { id: id as string, ...updatedEventForm };
    mockData.events = mockData.events.map((event) => (event.id === id ? updatedEvent : event));

    return HttpResponse.json(updatedEvent);
  });
};
```

- deleteEvent : mockData 라는 객체를 인자로 받아 DELETE '/api/events/:id' 요청에 해당 인자의 events 에서 param으로 받은 id 와 동일한 event 를 삭제한다.

```js
export const deleteEvent = (mockData: { events: Event[] }, isError?: boolean) => {
  return http.delete('/api/events/:id', async ({ params }) => {
    if (isError) return HttpResponse.json(null, { status: 500 });

    const { id } = params;
    const foundEvent = mockData.events.find((event) => event.id === id);

    if (!foundEvent) return HttpResponse.json(null, { status: 404 });

    mockData.events = mockData.events.filter((event) => event.id !== id);

    return new HttpResponse(null, { status: 204 });
  });
};

```

> Q. 테스트를 독립적으로 구동시키기 위해 작성했던 설정들을 소개해주세요.

1. `vi.useRealTimers`
- mock 타이머(useFakeTimers, setSystemTime)를 해제하고 실제 타이머를 사용하도록 설정하는 함수입니다.

2. createRandomEvent
- 매 테스트마다 적절한 event 를 생성하기 위해 fakerjs 를 활용해서 event를 생성하는 함수를 만들어 사용했습니다.

```js
export const createRandomEvent = (overwrites: Partial<Event> = {}): Event => {
  const { startTime: randomStartTime, endTime: RandomEndTime } = getRandomTimeRange();

  const {
    id = faker.string.uuid(),
    title = faker.word.noun({ length: { min: 2, max: 5 } }),
    date = formatDate(faker.date.anytime()),
    startTime = randomStartTime,
    endTime = RandomEndTime,
    description = faker.lorem.sentence(),
    location = faker.location.city(),
    category = faker.helpers.arrayElement(categories),
    repeat = {
      type: 'none',
      interval: 0,
    },
    notificationTime = faker.helpers.arrayElement(
      notificationOptions.map((option) => option.value)
    ),
  } = overwrites;

  return {
    id,
    title,
    date,
    startTime,
    endTime,
    description,
    location,
    category,
    repeat,
    notificationTime,
  };
};

```

### 심화 과제

- [x] App 컴포넌트 적절한 단위의 컴포넌트, 훅, 유틸 함수로 분리했는가?
- [x] 해당 모듈들에 대한 적절한 테스트를 2개 이상 작성했는가?
