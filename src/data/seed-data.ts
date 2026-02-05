/**
 * Seed data for LingoCards - Built-in decks with English-Polish vocabulary
 */

import { repository } from './local-repository';

interface SeedCard {
  front: string;
  back: string;
  example?: string;
}

const basicsA1: SeedCard[] = [
  { front: 'hello', back: 'cześć', example: 'Hello, how are you?' },
  { front: 'goodbye', back: 'do widzenia', example: 'Goodbye, see you tomorrow!' },
  { front: 'please', back: 'proszę', example: 'Could you help me, please?' },
  { front: 'thank you', back: 'dziękuję', example: 'Thank you very much!' },
  { front: 'yes', back: 'tak', example: 'Yes, I agree.' },
  { front: 'no', back: 'nie', example: 'No, I don\'t think so.' },
  { front: 'good', back: 'dobry', example: 'This is a good book.' },
  { front: 'bad', back: 'zły', example: 'That\'s a bad idea.' },
  { front: 'big', back: 'duży', example: 'It\'s a big house.' },
  { front: 'small', back: 'mały', example: 'She has a small dog.' },
  { front: 'water', back: 'woda', example: 'Can I have some water?' },
  { front: 'food', back: 'jedzenie', example: 'The food is delicious.' },
  { front: 'house', back: 'dom', example: 'Welcome to my house.' },
  { front: 'car', back: 'samochód', example: 'I have a new car.' },
  { front: 'book', back: 'książka', example: 'I\'m reading a good book.' },
  { front: 'friend', back: 'przyjaciel', example: 'She is my best friend.' },
  { front: 'family', back: 'rodzina', example: 'My family is very important to me.' },
  { front: 'time', back: 'czas', example: 'What time is it?' },
  { front: 'day', back: 'dzień', example: 'Have a nice day!' },
  { front: 'night', back: 'noc', example: 'Good night, sleep well.' },
  { front: 'morning', back: 'poranek', example: 'Good morning, everyone!' },
  { front: 'evening', back: 'wieczór', example: 'See you this evening.' },
  { front: 'today', back: 'dzisiaj', example: 'What are you doing today?' },
  { front: 'tomorrow', back: 'jutro', example: 'See you tomorrow!' },
  { front: 'yesterday', back: 'wczoraj', example: 'I saw him yesterday.' },
  { front: 'now', back: 'teraz', example: 'I need to go now.' },
  { front: 'later', back: 'później', example: 'I\'ll call you later.' },
  { front: 'here', back: 'tutaj', example: 'Come here, please.' },
  { front: 'there', back: 'tam', example: 'Put it over there.' },
  { front: 'where', back: 'gdzie', example: 'Where are you going?' },
  { front: 'what', back: 'co', example: 'What is this?' },
  { front: 'who', back: 'kto', example: 'Who is that person?' },
  { front: 'when', back: 'kiedy', example: 'When will you arrive?' },
  { front: 'why', back: 'dlaczego', example: 'Why are you late?' },
  { front: 'how', back: 'jak', example: 'How are you?' },
  { front: 'I', back: 'ja', example: 'I am a student.' },
  { front: 'you', back: 'ty', example: 'You are very kind.' },
  { front: 'he', back: 'on', example: 'He is my brother.' },
  { front: 'she', back: 'ona', example: 'She is a doctor.' },
  { front: 'we', back: 'my', example: 'We are friends.' },
  { front: 'they', back: 'oni', example: 'They are students.' },
  { front: 'to be', back: 'być', example: 'I want to be happy.' },
  { front: 'to have', back: 'mieć', example: 'I have a question.' },
  { front: 'to do', back: 'robić', example: 'What do you do?' },
  { front: 'to go', back: 'iść', example: 'Let\'s go to the park.' },
  { front: 'to come', back: 'przyjść', example: 'Please come with me.' },
  { front: 'to see', back: 'widzieć', example: 'I can see you.' },
  { front: 'to know', back: 'wiedzieć', example: 'I don\'t know the answer.' },
  { front: 'to think', back: 'myśleć', example: 'I think you\'re right.' },
  { front: 'to want', back: 'chcieć', example: 'I want to learn English.' },
];

const dailyA2: SeedCard[] = [
  { front: 'coffee', back: 'kawa', example: 'I need a cup of coffee.' },
  { front: 'tea', back: 'herbata', example: 'Would you like some tea?' },
  { front: 'breakfast', back: 'śniadanie', example: 'What did you have for breakfast?' },
  { front: 'lunch', back: 'obiad', example: 'Let\'s meet for lunch.' },
  { front: 'dinner', back: 'kolacja', example: 'Dinner is ready!' },
  { front: 'weather', back: 'pogoda', example: 'The weather is nice today.' },
  { front: 'rain', back: 'deszcz', example: 'It\'s going to rain tomorrow.' },
  { front: 'sun', back: 'słońce', example: 'The sun is shining.' },
  { front: 'cold', back: 'zimno', example: 'It\'s very cold outside.' },
  { front: 'hot', back: 'gorąco', example: 'It\'s too hot today.' },
  { front: 'work', back: 'praca', example: 'I have a lot of work to do.' },
  { front: 'school', back: 'szkoła', example: 'The children are at school.' },
  { front: 'shop', back: 'sklep', example: 'I\'m going to the shop.' },
  { front: 'market', back: 'rynek', example: 'Let\'s go to the market.' },
  { front: 'money', back: 'pieniądze', example: 'I don\'t have enough money.' },
  { front: 'buy', back: 'kupić', example: 'I want to buy a new phone.' },
  { front: 'sell', back: 'sprzedać', example: 'Are you selling your car?' },
  { front: 'price', back: 'cena', example: 'What\'s the price?' },
  { front: 'cheap', back: 'tani', example: 'This restaurant is cheap.' },
  { front: 'expensive', back: 'drogi', example: 'That watch is too expensive.' },
  { front: 'phone', back: 'telefon', example: 'Can I use your phone?' },
  { front: 'computer', back: 'komputer', example: 'My computer is broken.' },
  { front: 'internet', back: 'internet', example: 'Do you have internet here?' },
  { front: 'email', back: 'e-mail', example: 'Send me an email.' },
  { front: 'address', back: 'adres', example: 'What\'s your address?' },
  { front: 'street', back: 'ulica', example: 'I live on this street.' },
  { front: 'city', back: 'miasto', example: 'What city are you from?' },
  { front: 'country', back: 'kraj', example: 'Which country do you live in?' },
  { front: 'travel', back: 'podróżować', example: 'I love to travel.' },
  { front: 'holiday', back: 'wakacje', example: 'Where are you going on holiday?' },
  { front: 'hotel', back: 'hotel', example: 'We stayed in a nice hotel.' },
  { front: 'restaurant', back: 'restauracja', example: 'Let\'s eat at that restaurant.' },
  { front: 'ticket', back: 'bilet', example: 'I need to buy a ticket.' },
  { front: 'train', back: 'pociąg', example: 'The train leaves at 3 PM.' },
  { front: 'bus', back: 'autobus', example: 'Take the bus to the city center.' },
  { front: 'airport', back: 'lotnisko', example: 'How do I get to the airport?' },
  { front: 'doctor', back: 'lekarz', example: 'I need to see a doctor.' },
  { front: 'hospital', back: 'szpital', example: 'The hospital is nearby.' },
  { front: 'medicine', back: 'lekarstwo', example: 'Take this medicine twice a day.' },
  { front: 'happy', back: 'szczęśliwy', example: 'I\'m so happy to see you!' },
  { front: 'sad', back: 'smutny', example: 'Why do you look sad?' },
  { front: 'tired', back: 'zmęczony', example: 'I\'m very tired today.' },
  { front: 'hungry', back: 'głodny', example: 'I\'m really hungry.' },
  { front: 'thirsty', back: 'spragniony', example: 'I\'m thirsty, can I have water?' },
  { front: 'ready', back: 'gotowy', example: 'Are you ready to go?' },
  { front: 'busy', back: 'zajęty', example: 'Sorry, I\'m busy right now.' },
  { front: 'free', back: 'wolny', example: 'Are you free this evening?' },
  { front: 'important', back: 'ważny', example: 'This is very important.' },
  { front: 'easy', back: 'łatwy', example: 'English is easy!' },
  { front: 'difficult', back: 'trudny', example: 'This exercise is difficult.' },
];

const businessB1: SeedCard[] = [
  { front: 'meeting', back: 'spotkanie', example: 'We have a meeting at 10 AM.' },
  { front: 'project', back: 'projekt', example: 'I\'m working on a new project.' },
  { front: 'deadline', back: 'termin', example: 'The deadline is next Friday.' },
  { front: 'client', back: 'klient', example: 'Our client is very satisfied.' },
  { front: 'customer', back: 'klient', example: 'We need to listen to our customers.' },
  { front: 'colleague', back: 'kolega z pracy', example: 'My colleagues are very helpful.' },
  { front: 'manager', back: 'menedżer', example: 'I need to speak with the manager.' },
  { front: 'employee', back: 'pracownik', example: 'We have 50 employees.' },
  { front: 'salary', back: 'pensja', example: 'What\'s the average salary here?' },
  { front: 'contract', back: 'umowa', example: 'Please sign the contract.' },
  { front: 'agreement', back: 'porozumienie', example: 'We reached an agreement.' },
  { front: 'invoice', back: 'faktura', example: 'I\'ll send you the invoice tomorrow.' },
  { front: 'payment', back: 'płatność', example: 'The payment is due next week.' },
  { front: 'budget', back: 'budżet', example: 'We need to stay within budget.' },
  { front: 'profit', back: 'zysk', example: 'Our profit increased this year.' },
  { front: 'loss', back: 'strata', example: 'The company suffered a loss.' },
  { front: 'marketing', back: 'marketing', example: 'Our marketing strategy is working.' },
  { front: 'sales', back: 'sprzedaż', example: 'Sales are up this quarter.' },
  { front: 'report', back: 'raport', example: 'I need to finish this report.' },
  { front: 'presentation', back: 'prezentacja', example: 'Great presentation!' },
  { front: 'schedule', back: 'harmonogram', example: 'What\'s your schedule today?' },
  { front: 'appointment', back: 'spotkanie', example: 'I have an appointment at 3 PM.' },
  { front: 'conference', back: 'konferencja', example: 'Are you going to the conference?' },
  { front: 'workshop', back: 'warsztat', example: 'I attended a useful workshop.' },
  { front: 'training', back: 'szkolenie', example: 'We offer training for new employees.' },
  { front: 'skill', back: 'umiejętność', example: 'Communication is an important skill.' },
  { front: 'experience', back: 'doświadczenie', example: 'Do you have any experience in sales?' },
  { front: 'qualification', back: 'kwalifikacja', example: 'What are your qualifications?' },
  { front: 'resume', back: 'CV', example: 'Please send us your resume.' },
  { front: 'interview', back: 'rozmowa kwalifikacyjna', example: 'I have a job interview tomorrow.' },
  { front: 'hire', back: 'zatrudnić', example: 'We need to hire more staff.' },
  { front: 'promote', back: 'awansować', example: 'She was promoted to manager.' },
  { front: 'resign', back: 'zrezygnować', example: 'He decided to resign.' },
  { front: 'strategy', back: 'strategia', example: 'What\'s your business strategy?' },
  { front: 'goal', back: 'cel', example: 'Our goal is to expand internationally.' },
  { front: 'target', back: 'cel', example: 'We reached our sales target.' },
  { front: 'challenge', back: 'wyzwanie', example: 'This is a big challenge for us.' },
  { front: 'opportunity', back: 'okazja', example: 'This is a great opportunity.' },
  { front: 'risk', back: 'ryzyko', example: 'We need to minimize the risk.' },
  { front: 'decision', back: 'decyzja', example: 'We need to make a decision soon.' },
  { front: 'solution', back: 'rozwiązanie', example: 'I think I found a solution.' },
  { front: 'problem', back: 'problem', example: 'We have a problem with the system.' },
  { front: 'issue', back: 'problem', example: 'Let\'s discuss this issue.' },
  { front: 'priority', back: 'priorytet', example: 'What\'s your top priority?' },
  { front: 'urgent', back: 'pilny', example: 'This is urgent!' },
  { front: 'postpone', back: 'przełożyć', example: 'Can we postpone the meeting?' },
  { front: 'confirm', back: 'potwierdzić', example: 'Please confirm your attendance.' },
  { front: 'cancel', back: 'odwołać', example: 'I need to cancel my appointment.' },
  { front: 'negotiate', back: 'negocjować', example: 'We need to negotiate the price.' },
  { front: 'collaborate', back: 'współpracować', example: 'Let\'s collaborate on this project.' },
];

export async function seedDatabase(): Promise<void> {
  // Create built-in decks
  const basicsDecks = await repository.createDeck({
    name: 'Podstawy (A1)',
    description: '50 najczęstszych słów angielskich dla początkujących',
    isBuiltIn: true,
  });

  const dailyDeck = await repository.createDeck({
    name: 'Codzienny angielski (A2)',
    description: '50 słów z życia codziennego',
    isBuiltIn: true,
  });

  const businessDeck = await repository.createDeck({
    name: 'Praca i biznes (B1)',
    description: '50 słów biznesowych i związanych z pracą',
    isBuiltIn: true,
  });

  // Add cards to decks
  const createCards = async (deckId: string, cards: SeedCard[]) => {
    for (const card of cards) {
      await repository.createCard({
        deckId,
        front: card.front,
        back: card.back,
        example: card.example,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: new Date(),
      });
    }
  };

  await createCards(basicsDecks.id, basicsA1);
  await createCards(dailyDeck.id, dailyA2);
  await createCards(businessDeck.id, businessB1);

  console.log('Database seeded successfully!');
}
