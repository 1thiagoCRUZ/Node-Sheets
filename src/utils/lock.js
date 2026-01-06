let running = false;

export function acquireLock() {
  if (running) return false;
  running = true;
  return true;
}

export function releaseLock() {
  running = false;
}
