import React, { useState, useContext, useMemo } from 'react';
import { Outlet } from 'react-router-dom';

import NotificationsContext from '~/contexts/Notifications';
import UserContext from '~/contexts/User';
import { Notification } from '~/components/Notification';
import { Menu } from '~/components/Menu';
import Theme, { Container, Notifications } from './styles';

export function Layout() {
  const [notifications, setNotifications] = useState([]);
  const { token } = useContext(UserContext);
  const context = useMemo(
    () => ({
      list: notifications,
      update: (callback) => {
        callback((notification) => {
          setNotifications([...notifications, notification]);
        });
      },
    }),
    [notifications]
  );

  return (
    <Container>
      <Theme />
      <NotificationsContext.Provider value={context}>
        <Notifications>
          {notifications.map((notification) => (
            <Notification
              data-testid={`notification_${notification.id}`}
              key={notification.id}
              title={notification.title}
              message={notification.message}
              onClose={() => {
                setNotifications(
                  notifications.filter((n) => n.id !== notification.id)
                );
              }}
              show={notification.show}
            />
          ))}
        </Notifications>
        {token && <Menu />}
        <Outlet />
      </NotificationsContext.Provider>
    </Container>
  );
}
