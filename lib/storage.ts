export function store(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function retrieve(key: string) {
  return localStorage.getItem(key);
}

export function clear(key: string) {
  localStorage.removeItem(key);
}
