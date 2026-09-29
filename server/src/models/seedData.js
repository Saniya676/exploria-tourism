import bcrypt from 'bcryptjs';
import { query, queryOne } from '../config/db.js';

export async function populateSeedData() {
  console.log('[Seed] Seeding database tables with verified initial data...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Clear existing
  await query('DELETE FROM chat_messages');
  await query('DELETE FROM guide_availability');
  await query('DELETE FROM favorites');
  await query('DELETE FROM reviews');
  await query('DELETE FROM bookings');
  await query('DELETE FROM guide_requests');
  await query('DELETE FROM inquiries');
  await query('DELETE FROM package_itineraries');
  await query('DELETE FROM packages');
  await query('DELETE FROM adventures');
  await query('DELETE FROM destinations');
  await query('DELETE FROM guides');
  await query('DELETE FROM users');

  // 2. Users
  const users = [
    { id: 1, name: 'Admin System', email: 'admin@exploria.com', phone: '+1 555-0100', password: passwordHash, role: 'ADMIN', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', bio: 'Exploria Administrator & Operations Director' },
    { id: 2, name: 'Aarav Sharma', email: 'aarav.guide@exploria.com', phone: '+91 9876543210', password: passwordHash, role: 'GUIDE', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', bio: 'Certified Himalayan Mountaineer with 8+ years experience guiding high-altitude treks.' },
    { id: 3, name: 'Elena Rostova', email: 'elena.guide@exploria.com', phone: '+91 9812345678', password: passwordHash, role: 'GUIDE', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', bio: 'PADI Master Scuba Diver and coastal watersports expert based in Goa.' },
    { id: 4, name: 'Rohan Verma', email: 'rohan.guide@exploria.com', phone: '+91 9898989898', password: passwordHash, role: 'GUIDE', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', bio: 'Rishikesh Rafting & Bungee Safety Instructor.' },
    { id: 5, name: 'Maya Lin', email: 'maya.user@exploria.com', phone: '+1 555-0199', password: passwordHash, role: 'USER', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', bio: 'Avid traveler and mountain trekking enthusiast.' },
    { id: 6, name: 'David Chen', email: 'david.user@exploria.com', phone: '+1 555-0188', password: passwordHash, role: 'USER', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200', bio: 'Adventure seeker interested in scuba diving and coastal expeditions.' }
  ];

  for (const u of users) {
    await query(
      'INSERT INTO users (id, name, email, phone, password, role, avatar, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [u.id, u.name, u.email, u.phone, u.password, u.role, u.avatar, u.bio]
    );
  }

  // 3. Guides
  const guides = [
    { id: 1, user_id: 2, location: 'Manali, Himachal Pradesh', experience_years: 8, languages: JSON.stringify(['English', 'Hindi', 'Pahari']), specializations: JSON.stringify(['Trekking', 'Camping', 'Skiing']), hourly_rate: 35.00, rating: 4.95, reviews_count: 42 },
    { id: 2, user_id: 3, location: 'Panaji, Goa', experience_years: 6, languages: JSON.stringify(['English', 'Hindi', 'Konkani', 'Russian']), specializations: JSON.stringify(['Scuba Diving', 'Kayaking', 'Water Sports']), hourly_rate: 30.00, rating: 4.88, reviews_count: 38 },
    { id: 3, user_id: 4, location: 'Rishikesh, Uttarakhand', experience_years: 7, languages: JSON.stringify(['English', 'Hindi', 'Garhwali']), specializations: JSON.stringify(['Rafting', 'Bungee Jumping', 'Paragliding']), hourly_rate: 32.00, rating: 4.92, reviews_count: 51 }
  ];

  for (const g of guides) {
    await query(
      'INSERT INTO guides (id, user_id, location, experience_years, languages, specializations, hourly_rate, rating, reviews_count, availability_status, is_approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)',
      [g.id, g.user_id, g.location, g.experience_years, g.languages, g.specializations, g.hourly_rate, g.rating, g.reviews_count, 'AVAILABLE']
    );
  }

  // 4. Destinations
  const destinations = [
    { id: 1, name: 'Manali', country_state: 'Himachal Pradesh, India', description: 'Nestled in the high Himalayas, Manali offers snow-capped peaks, lush pine valleys, Solang valley adventures, and ancient temples.', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000', best_time: 'October to May', estimated_budget: 450.00, popular_activities: JSON.stringify(['Trekking', 'Paragliding', 'Skiing', 'Camping']), featured: 1, rating: 4.90 },
    { id: 2, name: 'Goa', country_state: 'Goa, India', description: 'India beach capital featuring golden sun-kissed beaches, vibrant nightlife, Portuguese colonial architecture, and world-class scuba diving.', image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000', best_time: 'November to February', estimated_budget: 380.00, popular_activities: JSON.stringify(['Scuba Diving', 'Water Sports', 'Beach Hopping', 'Kayaking']), featured: 1, rating: 4.85 },
    { id: 3, name: 'Rishikesh', country_state: 'Uttarakhand, India', description: 'The Yoga Capital of the World and India top adventure hub, famous for white-water Ganges rafting, giant bungee jumps, and spiritual ghats.', image_url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=1000', best_time: 'September to June', estimated_budget: 300.00, popular_activities: JSON.stringify(['White Water Rafting', 'Bungee Jumping', 'Cliff Jumping', 'Camping']), featured: 1, rating: 4.92 },
    { id: 4, name: 'Leh-Ladakh', country_state: 'Union Territory, India', description: 'Land of high passes, surreal turquoise Pangong lake, lunar landscapes, ancient Buddhist monasteries, and ultimate motorcycling.', image_url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=80&w=1000', best_time: 'May to September', estimated_budget: 750.00, popular_activities: JSON.stringify(['Motorcycling', 'High Altitude Trekking', 'Camping', 'Photography']), featured: 1, rating: 4.98 },
    { id: 5, name: 'Kerala', country_state: 'Kerala, India', description: 'God Own Country, famed for tranquil backwater houseboats, misty tea gardens of Munnar, wildlife safaris, and pristine coastal beaches.', image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1000', best_time: 'September to March', estimated_budget: 500.00, popular_activities: JSON.stringify(['Houseboat Cruise', 'Tea Plantation Walk', 'Bamboo Rafting', 'Ayurveda']), featured: 1, rating: 4.88 },
    { id: 6, name: 'Sikkim', country_state: 'Sikkim, India', description: 'Jewel of the Eastern Himalayas, home to Mt. Kanchenjunga, serene glacial lakes like Tsomgo, alpine meadows, and Buddhist heritage.', image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1000', best_time: 'March to June & Oct to Dec', estimated_budget: 420.00, popular_activities: JSON.stringify(['Trekking', 'Yak Safari', 'Monastery Tour', 'River Rafting']), featured: 0, rating: 4.80 },
    { id: 7, name: 'Andaman Islands', country_state: 'Union Territory, India', description: 'Tropical paradise with crystal-clear turquoise waters, pristine Radhanagar beach, coral reef snorkeling, and historic Cellular Jail.', image_url: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&q=80&w=1000', best_time: 'October to May', estimated_budget: 650.00, popular_activities: JSON.stringify(['Deep Sea Diving', 'Sea Walking', 'Snorkeling', 'Glass Bottom Boat']), featured: 1, rating: 4.94 },
    { id: 8, name: 'Coorg', country_state: 'Karnataka, India', description: 'The Scotland of India, characterized by sprawling coffee plantations, cascading waterfalls like Abbey Falls, misty hills, and trekking trails.', image_url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=1000', best_time: 'October to March', estimated_budget: 320.00, popular_activities: JSON.stringify(['Coffee Plantation Tour', 'Trekking', 'River Rafting', 'Waterfall Rappelling']), featured: 0, rating: 4.75 },
    { id: 9, name: 'Kashmir', country_state: 'Jammu & Kashmir, India', description: 'Paradise on Earth featuring iconic Shikara rides on Dal Lake, Gulmarg cable car, lush Betaab valley, and winter ski slopes.', image_url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=1000', best_time: 'March to October', estimated_budget: 600.00, popular_activities: JSON.stringify(['Shikara Ride', 'Skiing', 'Gondola Ride', 'Trekking']), featured: 1, rating: 4.96 },
    { id: 10, name: 'Jaisalmer', country_state: 'Rajasthan, India', description: 'The Golden City of Thar desert, boasting majestic Jaisalmer Fort, overnight desert dunes camping, camel safaris, and cultural folk dances.', image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1000', best_time: 'October to March', estimated_budget: 350.00, popular_activities: JSON.stringify(['Camel Safari', 'Dune Bashing', 'Desert Camping', 'Fort Exploration']), featured: 0, rating: 4.82 }
  ];

  for (const d of destinations) {
    await query(
      'INSERT INTO destinations (id, name, country_state, description, image_url, best_time, estimated_budget, popular_activities, featured, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [d.id, d.name, d.country_state, d.description, d.image_url, d.best_time, d.estimated_budget, d.popular_activities, d.featured, d.rating]
    );
  }

  // 5. Adventures
  const adventures = [
    { id: 1, destination_id: 1, name: 'Hampta Pass Trek', category: 'Trekking', description: 'Crossing dramatic green Kullu valley to stark high-altitude desert of Lahaul with panoramic snow views.', duration: '5 Days', difficulty: 'Moderate', price: 199.00, best_time: 'June to October', safety_info: 'Must carry insulated clothes and sturdy trekking shoes.', required_equipment: 'Trekking boots, Thermal layers, Rucksack, Rain jacket', image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' },
    { id: 2, destination_id: 2, name: 'Grande Island Deep Scuba Diving', category: 'Scuba Diving', description: 'Dive into underwater tropical coral reefs with certified PADI dive masters and spot exotic marine species.', duration: '1 Day', difficulty: 'Easy', price: 75.00, best_time: 'October to April', safety_info: 'Includes full safety briefing and equipment check.', required_equipment: 'Wetsuit, Mask & Snorkel, Fins (Provided)', image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800' },
    { id: 3, destination_id: 3, name: 'Ganges Grade IV White Water Rafting', category: 'Rafting', description: 'Conquer famous rapids like Roller Coaster and Golf Course along 24km of wild river stretch.', duration: '1 Day', difficulty: 'Moderate', price: 45.00, best_time: 'September to June', safety_info: 'Helmets and lifejackets mandatory.', required_equipment: 'Lifejacket, Helmet, Paddle (Provided)', image_url: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&q=80&w=800' },
    { id: 4, destination_id: 3, name: 'Jumpin Heights 83m Bungee Jump', category: 'Bungee Jumping', description: 'Highest cantilevered bungee jump over a rocky cliff and lush river stream in Rishikesh.', duration: '4 Hours', difficulty: 'Hard', price: 60.00, best_time: 'Round the year', safety_info: 'Designed by New Zealand experts.', required_equipment: 'Comfortable attire, Closed shoes', image_url: 'https://images.unsplash.com/photo-1512412046876-f386342eddb3?auto=format&fit=crop&q=80&w=800' },
    { id: 5, destination_id: 1, name: 'Solang Valley Paragliding Expedition', category: 'Paragliding', description: 'Soar high like a bird above pine-covered mountains with qualified tandem pilots.', duration: '2 Hours', difficulty: 'Easy', price: 50.00, best_time: 'October to May', safety_info: 'Tandem pilots with 500+ flight hours.', required_equipment: 'Windbreaker jacket, Sunglasses', image_url: 'https://images.unsplash.com/photo-1516592673884-4a382d427493?auto=format&fit=crop&q=80&w=800' }
  ];

  for (const a of adventures) {
    await query(
      'INSERT INTO adventures (id, destination_id, name, category, description, duration, difficulty, price, best_time, safety_info, required_equipment, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [a.id, a.destination_id, a.name, a.category, a.description, a.duration, a.difficulty, a.price, a.best_time, a.safety_info, a.required_equipment, a.image_url]
    );
  }

  // 6. Packages
  const packages = [
    { id: 1, destination_id: 1, adventure_id: 1, title: 'Ultimate Alpine Manali Adventure & Hampta Trek', cover_image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000', description: 'A complete 5-day Himalayan escape featuring Solang valley paragliding, riverside camping, and the iconic Hampta Pass crossover trek.', duration_days: 5, price: 299.00, difficulty: 'Moderate', best_season: 'June - October', included_services: JSON.stringify(['3-Star Hotel Stay & Alpine Tents', 'All Meals (Breakfast, Lunch, Dinner)', 'Certified Mountain Guide', 'Trek Permits & Safety Gear']), excluded_services: JSON.stringify(['Personal Expenses', 'Flight Tickets']), max_participants: 12, rating: 4.95, reviews_count: 34, featured: 1 },
    { id: 2, destination_id: 2, adventure_id: 2, title: 'Goa Sun, Sea & Scuba Discovery Expedition', cover_image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000', description: 'Immerse yourself in coastal paradise with boat cruises to Grande Island, PADI scuba diving session, underwater photography, and beach bonfire.', duration_days: 4, price: 249.00, difficulty: 'Easy', best_season: 'November - February', included_services: JSON.stringify(['Luxury Beach Resort Stay', 'PADI Diving Session & Video', 'Daily Breakfast & Seafood BBQ', 'Speedboat Transfers']), excluded_services: JSON.stringify(['Alcoholic Beverages', 'Shopping']), max_participants: 15, rating: 4.88, reviews_count: 29, featured: 1 },
    { id: 3, destination_id: 3, adventure_id: 3, title: 'Rishikesh Thrill Seeker & River Rafting Weekend', cover_image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=1000', description: 'Action-packed weekend featuring 24km river rafting, 83m bungee jump, luxury cliffside glamping, Ganga Aarti tour, and evening bonfire.', duration_days: 3, price: 179.00, difficulty: 'Hard', best_season: 'September - June', included_services: JSON.stringify(['Riverside Luxury Glamping', '24km River Rafting Trip', 'Bungee Jumping Ticket', 'All Meals & Campfire']), excluded_services: JSON.stringify(['Video Footage Fee']), max_participants: 10, rating: 4.92, reviews_count: 45, featured: 1 },
    { id: 4, destination_id: 4, adventure_id: null, title: 'Ladakh High Passes & Pangong Lake Grand Odyssey', cover_image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=80&w=1000', description: 'Traverse Khardung La (world high pass), camp beneath starry skies at Pangong Tso Lake, explore Nubra Valley double-humped camel safari.', duration_days: 7, price: 699.00, difficulty: 'Hard', best_season: 'May - September', included_services: JSON.stringify(['Boutique Hotel & Lake Camps', 'Royal Enfield Bike or SUV', 'Inner Line Permits & Oxygen']), excluded_services: JSON.stringify(['Flight Tickets']), max_participants: 8, rating: 4.98, reviews_count: 52, featured: 1 },
    { id: 5, destination_id: 5, adventure_id: null, title: 'Kerala Backwaters & Periyar Jungle Explorer', cover_image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1000', description: 'Relax on a private houseboat cruise through Alleppey backwaters, walk through tea estates of Munnar, and join a night jungle safari.', duration_days: 6, price: 450.00, difficulty: 'Easy', best_season: 'September - March', included_services: JSON.stringify(['Private Houseboat Night Stay', 'Heritage Resort Stays', 'Periyar National Park Safari']), excluded_services: JSON.stringify(['Spa Treatments']), max_participants: 14, rating: 4.86, reviews_count: 21, featured: 1 }
  ];

  for (const p of packages) {
    await query(
      'INSERT INTO packages (id, destination_id, adventure_id, title, cover_image, description, duration_days, price, difficulty, best_season, included_services, excluded_services, max_participants, rating, reviews_count, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [p.id, p.destination_id, p.adventure_id, p.title, p.cover_image, p.description, p.duration_days, p.price, p.difficulty, p.best_season, p.included_services, p.excluded_services, p.max_participants, p.rating, p.reviews_count, p.featured]
    );
  }

  // 7. Package Itineraries
  const itineraries = [
    { package_id: 1, day_number: 1, title: 'Arrival in Manali & Acclimatization', description: 'Check into hotel, gear check-up, and relaxing evening walk around Old Manali cafes.' },
    { package_id: 1, day_number: 2, title: 'Manali to Jobra & Trek to Chika', description: 'Drive to Jobra start point, followed by 3-hour trek through oak forests to Chika basecamp.' },
    { package_id: 1, day_number: 3, title: 'Chika to Balu Ka Ghera', description: 'Trek along rocky river bed offering spectacular views of snow peaks to Balu Ka Ghera camp.' },
    { package_id: 1, day_number: 4, title: 'Hampta Pass Crossing to Shea Goru', description: 'Steep ascent to Hampta Pass (14,100ft), snow slide descent to Shea Goru Lahaul valley.' },
    { package_id: 1, day_number: 5, title: 'Chandratal Lake & Drive to Manali', description: 'Visit turquoise Chandratal Lake, drive back to Manali via Rohtang pass.' }
  ];

  for (const it of itineraries) {
    await query(
      'INSERT INTO package_itineraries (package_id, day_number, title, description) VALUES (?, ?, ?, ?)',
      [it.package_id, it.day_number, it.title, it.description]
    );
  }

  // 8. Inquiries
  await query(
    'INSERT INTO inquiries (reference_id, user_id, name, email, phone, destination_id, subject, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    ['EXP-78923411', 5, 'Maya Lin', 'maya.user@exploria.com', '+1 555-0199', 1, 'Custom Family Package Inquiry for Manali', 'Planning family trip for 4 people to Manali in October.', 'IN_PROGRESS']
  );

  // 9. Bookings
  await query(
    'INSERT INTO bookings (booking_code, user_id, package_id, guide_id, travel_date, travelers_count, total_amount, status, payment_status, special_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    ['BK-88231940', 5, 1, 1, '2026-10-15', 2, 598.00, 'CONFIRMED', 'DEMO_PAID', 'Vegetarian food preference during trek camps.']
  );

  // 10. Reviews
  await query(
    'INSERT INTO reviews (user_id, package_id, guide_id, destination_id, rating, comment) VALUES (?, ?, ?, ?, ?, ?)',
    [5, 1, 1, 1, 5, 'The Hampta Pass trek with guide Aarav was unforgettable! Everything from camp food to safety gear was top tier. Highly recommended!']
  );

  console.log('[Seed] Seeding completed successfully!');
}
