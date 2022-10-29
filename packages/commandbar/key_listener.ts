const onKeydown = (e, key: string, cb?: () => void) => {
  if (e.key === key && (e.metaKey || e.ctrlKey)) {
    if (cb) cb();
    e.preventDefault();
  }
};

export const listenForKeys = (key: string, label: string, cb: () => void) => {
  window.addEventListener(label, (e) => onKeydown(e, key, cb));
};

export const removeKeyListener = (key: string, label: string) => {
  window.removeEventListener(label, (e) => onKeydown(e, key));
};
