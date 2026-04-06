export type Section = "discover" | "matches" | "messages" | "profile" | "settings" | "support";

export const INTERESTS = [
  "Путешествия", "Кино", "Музыка", "Спорт", "Кулинария", "Книги",
  "Искусство", "Йога", "Танцы", "Фото", "Природа", "Игры", "Кофе", "Театр"
];

export const PROFILES = [
  { id: 1, name: "Алина", age: 26, city: "Москва", verified: true, online: true, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Alina&backgroundColor=ffb3ba", interests: ["Путешествия", "Йога", "Кино"], about: "Люблю утренний кофе, длинные прогулки и новые открытия. Ищу человека, с которым интересно молчать.", match: 94 },
  { id: 2, name: "Соня", age: 24, city: "Санкт-Петербург", verified: true, online: false, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Sonya&backgroundColor=c9b8f5", interests: ["Книги", "Театр", "Кофе"], about: "Читаю запоем, пью чай вёдрами. Обожаю Достоевского и шведский минимализм.", match: 88 },
  { id: 3, name: "Маша", age: 28, city: "Казань", verified: false, online: true, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Masha&backgroundColor=b8f5c9", interests: ["Спорт", "Природа", "Фото"], about: "Фотограф, бегун, немного перфекционист. Ищу приключения и хорошую компанию.", match: 81 },
  { id: 4, name: "Катя", age: 23, city: "Новосибирск", verified: true, online: false, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Katya&backgroundColor=f5d0b8", interests: ["Музыка", "Танцы", "Искусство"], about: "Играю на виолончели, люблю джаз и импрессионизм. Ищу того, кто не боится настоящего.", match: 76 },
  { id: 5, name: "Вика", age: 27, city: "Москва", verified: true, online: true, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Vika&backgroundColor=f5b8e8", interests: ["Кулинария", "Игры", "Кино"], about: "Шеф-повар по призванию и геймер по ночам. Хочу встретить умного и тёплого человека.", match: 92 },
  { id: 6, name: "Дима", age: 29, city: "Москва", verified: true, online: true, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Dima&backgroundColor=b8d4f5", interests: ["Спорт", "Путешествия", "Фото"], about: "Спортсмен и путешественник. Объездил 30 стран, ищу компаньона для следующих.", match: 87 },
];

export const MATCHES = [
  { id: 1, name: "Алина", age: 26, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Alina&backgroundColor=ffb3ba", lastMsg: "Привет! Как ты? 😊", time: "сейчас", unread: 2, online: true },
  { id: 5, name: "Вика", age: 27, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Vika&backgroundColor=f5b8e8", lastMsg: "Отличная идея, давай попробуем!", time: "5 мин", unread: 0, online: true },
  { id: 6, name: "Дима", age: 29, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Dima&backgroundColor=b8d4f5", lastMsg: "Можем встретиться в субботу?", time: "1 ч", unread: 1, online: false },
];

export const CHAT_MESSAGES = [
  { id: 1, from: "them", text: "Привет! Видела ты тоже любишь путешествия?", time: "14:20" },
  { id: 2, from: "me", text: "Да! Только вернулась из Бали 🌴", time: "14:21" },
  { id: 3, from: "them", text: "О, обожаю Бали! Где останавливалась?", time: "14:22" },
  { id: 4, from: "me", text: "В Убуде, там такая атмосфера... Хочется вернуться", time: "14:23" },
  { id: 5, from: "them", text: "Привет! Как ты? 😊", time: "14:35" },
];

export type Profile = typeof PROFILES[0];
export type Match = typeof MATCHES[0];
