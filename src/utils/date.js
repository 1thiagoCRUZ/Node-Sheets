export function now() {
  return new Date().toISOString();
}

export function timeToSeconds(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    
    const parts = timeStr.trim().split(':').map(Number); 
    
    let seconds = 0;
    
    if (parts.length === 3) {
        seconds = (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    } 
    else if (parts.length === 2) {
        seconds = (parts[0] * 60) + parts[1];
    }
    
    return seconds;
}