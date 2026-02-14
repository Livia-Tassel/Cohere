export const festivals = [
  {
    id: 'lunar-new-year-2026',
    emoji: '🎊',
    title: 'Happy Lunar New Year!',
    message: 'Wishing you prosperity and success in the Year of the Horse!',
    bgGradient: 'from-red-500 via-orange-500 to-yellow-500',
    startDate: '2026-01-29',
    endDate: '2026-02-14',
  },
  {
    id: 'valentines-day-2026',
    emoji: '💝',
    title: 'Happy Valentine\'s Day!',
    message: 'Spread the love and share knowledge with the community!',
    bgGradient: 'from-pink-500 via-rose-500 to-red-500',
    startDate: '2026-02-14',
    endDate: '2026-02-15',
  },
  {
    id: 'halloween-2026',
    emoji: '🎃',
    title: 'Happy Halloween!',
    message: 'No tricks, just treats of knowledge!',
    bgGradient: 'from-orange-600 via-purple-600 to-black',
    startDate: '2026-10-31',
    endDate: '2026-11-01',
  },
  {
    id: 'christmas-2026',
    emoji: '🎄',
    title: 'Merry Christmas!',
    message: 'Season\'s greetings from the Cohere community!',
    bgGradient: 'from-green-600 via-red-600 to-green-600',
    startDate: '2026-12-24',
    endDate: '2026-12-26',
  },
  {
    id: 'new-year-2027',
    emoji: '🎆',
    title: 'Happy New Year!',
    message: 'Cheers to new beginnings and endless learning!',
    bgGradient: 'from-blue-600 via-purple-600 to-pink-600',
    startDate: '2026-12-31',
    endDate: '2027-01-02',
  },
];

export const getActiveFestival = () => {
  const now = new Date();
  return festivals.find(festival => {
    const start = new Date(festival.startDate);
    const end = new Date(festival.endDate);
    return now >= start && now <= end;
  });
};
