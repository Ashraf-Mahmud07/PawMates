type InAppNotification = {
  id?: string;
  title?: string;
  body?: string;
  data?: any;
};

let handlers: ((n: InAppNotification) => void)[] = [];

export function showInAppNotification(notification: InAppNotification) {
  handlers.forEach((h) => h(notification));
}

export function onInAppNotification(handler: (n: InAppNotification) => void) {
  handlers.push(handler);
  return () => {
    handlers = handlers.filter((h) => h !== handler);
  };
}

export default { showInAppNotification, onInAppNotification };
