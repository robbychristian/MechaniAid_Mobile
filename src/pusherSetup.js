import Pusher from 'pusher-js/react-native';
import { useEffect } from 'react';

// Initialize Pusher
const pusher = new Pusher('ae0c5d19ecd79d6052a5', {
  cluster: 'ap1',
});
const channel = pusher.subscribe(`booking.${5}`);

const useBookingNotifications = (onBookingAccepted) => {
  useEffect(() => {
    channel.bind('BookingAccepted', function(data) {
      onBookingAccepted(data);
    });

    return () => {
      channel.unbind('BookingAccepted');
    };
  }, [onBookingAccepted]);
};

export default useBookingNotifications;
