export const isStoreOpen = (): boolean => {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Makassar',
      hour: 'numeric',
      hourCycle: 'h23',
    });
    
    const currentHourStr = formatter.format(now);
    const currentHour = parseInt(currentHourStr, 10);
    
    return currentHour >= 9 && currentHour < 22;
  } catch (error) {
    // fallback if timezone not supported
    const hours = new Date().getHours();
    return hours >= 9 && hours < 22;
  }
};
