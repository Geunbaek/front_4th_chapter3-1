import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
} from '@chakra-ui/react';
import { RefObject } from 'react';

import { Event, EventForm } from '../types';

interface EventOverlapAlertDialogProps {
  isOpen: boolean;
  overlappingEvents: Event[];
  cancelRef: RefObject<HTMLButtonElement>;
  savedEvent: Event | EventForm;
  onConfirm: (event: Event | EventForm) => void;
  close: () => void;
}

function EventOverlapAlertDialog({
  isOpen,
  overlappingEvents,
  cancelRef,
  savedEvent,
  onConfirm,
  close,
}: EventOverlapAlertDialogProps) {
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={close}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            일정 겹침 경고
          </AlertDialogHeader>

          <AlertDialogBody>
            다음 일정과 겹칩니다:
            {overlappingEvents.map((event) => (
              <Text key={event.id}>
                {event.title} ({event.date} {event.startTime}-{event.endTime})
              </Text>
            ))}
            계속 진행하시겠습니까?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={close}>
              취소
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                close();
                onConfirm(savedEvent);
              }}
              ml={3}
            >
              계속 진행
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default EventOverlapAlertDialog;
