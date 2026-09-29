-- Exploria Tourism Platform - Database Seed Data

USE exploria_db;

-- Clear old records
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE chat_messages;
TRUNCATE TABLE guide_availability;
TRUNCATE TABLE favorites;
TRUNCATE TABLE reviews;
TRUNCATE TABLE bookings;
TRUNCATE TABLE guide_requests;
TRUNCATE TABLE inquiries;
TRUNCATE TABLE package_itineraries;
TRUNCATE TABLE packages;
TRUNCATE TABLE adventures;
TRUNCATE TABLE destinations;
TRUNCATE TABLE guides;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Passwords hashed for 'password123' using bcrypt: $2a$10$7zBqR0P5w2hO3y9kQ5a1u.5g1b1O8c4h2j3k4l5m6n7o8p9q0r

-- 1. Users
INSERT INTO users (id, name, email, phone, password, role, avatar, bio) VALUES
(1, 'Admin System', 'admin@exploria.com', '+1 555-0100', '$2a$10$7zBqR0P5w2hO3y9kQ5a1u.5g1b1O8c4h2j3k4l5m6n7o8p9q0r', 'ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', 'Exploria Head Administrator & Chief Operations Lead.'),
(2, 'Aarav Sharma', 'aarav.guide@exploria.com', '+91 9876543210', '$2a$10$7zBqR0P5w2hO3y9kQ5a1u.5g1b1O8c4h2j3k4l5m6n7o8p9q0r', 'GUIDE', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'Certified Himalayan Mountaineer with 8+ years experience guiding high-altitude treks in Himachal and Ladakh.'),
(3, 'Elena Rostova', 'elena.guide@exploria.com', '+91 9812345678', '$2a$10$7zBqR0P5w2hO3y9kQ5a1u.5g1b1O8c4h2j3k4l5m6n7o8p9q0r', 'GUIDE', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', 'PADI Master Scuba Diver and water sports expert based in Goa & Andaman islands.'),
(4, 'Rohan Verma', 'rohan.guide@exploria.com', '+91 9898989898', '$2a$10$7zBqR0P5w2hO3y9kQ5a1u.5g1b1O8c4h2j3k4l5m6n7o8p9q0r', 'GUIDE', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', 'Rishikesh Rafting & Bungee Jumping Safety Instructor and wilderness survivalist.'),
(5, 'Maya Lin', 'maya.user@exploria.com', '+1 555-0199', '$2a$10$7zBqR0P5w2hO3y9kQ5a1u.5g1b1O8c4h2j3k4l5m6n7o8p9q0r', 'USER', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', 'Avid traveler and photography enthusiast seeking scenic mountain trails.'),
(6, 'David Chen', 'david.user@exploria.com', '+1 555-0188', '$2a$10$7zBqR0P5w2hO3y9kQ5a1u.5g1b1O8c4h2j3k4l5m6n7o8p9q0r', 'USER', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200', 'Adventure seeker interested in scuba diving, kayaking, and coastal expeditions.');

-- 2. Guides Profile
INSERT INTO guides (id, user_id, location, experience_years, languages, specializations, hourly_rate, rating, reviews_count, availability_status, is_approved) VALUES
(1, 2, 'Manali, Himachal Pradesh', 8, '["English", "Hindi", "Pahari"]', '["Trekking", "Camping", "Skiing", "Mountaineering"]', 35.00, 4.95, 42, 'AVAILABLE', TRUE),
(2, 3, 'Panaji, Goa', 6, '["English", "Hindi", "Konkani", "Russian"]', '["Scuba Diving", "Kayaking", "Water Sports", "Snorkeling"]', 30.00, 4.88, 38, 'AVAILABLE', TRUE),
(3, 4, 'Rishikesh, Uttarakhand', 7, '["English", "Hindi", "Garhwali"]', '["Rafting", "Bungee Jumping", "Paragliding", "Rock Climbing"]', 32.00, 4.92, 51, 'AVAILABLE', TRUE);

-- 3. Destinations
INSERT INTO destinations (id, name, country_state, description, image_url, best_time, estimated_budget, popular_activities, featured, rating) VALUES
(1, 'Manali', 'Himachal Pradesh, India', 'Nestled in the high Himalayas, Manali offers breathtaking snow-capped peaks, lush pine valleys, Solang valley adventures, and ancient temples.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000', 'October to May', 450.00, '["Trekking", "Paragliding", "Skiing", "Camping"]', TRUE, 4.90),
(2, 'Goa', 'Goa, India', 'India\'s beach capital featuring golden sun-kissed beaches, vibrant nightlife, Portuguese colonial architecture, and world-class scuba diving.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000', 'November to February', 380.00, '["Scuba Diving", "Water Sports", "Beach Hopping", "Kayaking"]', TRUE, 4.85),
(3, 'Rishikesh', 'Uttarakhand, India', 'The Yoga Capital of the World and India\'s top adventure hub, famous for white-water Ganges rafting, giant bungee jumps, and spiritual ghats.', 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=1000', 'September to June', 300.00, '["White Water Rafting", "Bungee Jumping", "Cliff Jumping", "Camping"]', TRUE, 4.92),
(4, 'Leh-Ladakh', 'Union Territory, India', 'Land of high passes, surreal turquoise Pangong lake, lunar landscapes, ancient Buddhist monasteries, and ultimate high-altitude motorcycling.', 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=80&w=1000', 'May to September', 750.00, '["Motorcycling", "High Altitude Trekking", "Camping", "Photography"]', TRUE, 4.98),
(5, 'Kerala', 'Kerala, India', 'God\'s Own Country, famed for tranquil backwater houseboats, misty tea gardens of Munnar, wildlife safaris, and pristine coastal beaches.', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1000', 'September to March', 500.00, '["Houseboat Cruise", "Tea Plantation Walk", "Bamboo Rafting", "Ayurveda"]', TRUE, 4.88),
(6, 'Sikkim', 'Sikkim, India', 'Jewel of the Eastern Himalayas, home to Mt. Kanchenjunga, serene glacial lakes like Tsomgo, alpine meadows, and Buddhist heritage.', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1000', 'March to June & Oct to Dec', 420.00, '["Trekking", "Yak Safari", "Monastery Tour", "River Rafting"]', FALSE, 4.80),
(7, 'Andaman Islands', 'Union Territory, India', 'Tropical paradise with crystal-clear turquoise waters, pristine Radhanagar beach, coral reef snorkeling, and historic Cellular Jail.', 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&q=80&w=1000', 'October to May', 650.00, '["Deep Sea Diving", "Sea Walking", "Snorkeling", "Glass Bottom Boat"]', TRUE, 4.94),
(8, 'Coorg', 'Karnataka, India', 'The Scotland of India, characterized by sprawling coffee plantations, cascading waterfalls like Abbey Falls, misty hills, and trekking trails.', 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=1000', 'October to March', 320.00, '["Coffee Plantation Tour", "Trekking", "River Rafting", "Waterfall Rappelling"]', FALSE, 4.75),
(9, 'Kashmir', 'Jammu & Kashmir, India', 'Paradise on Earth featuring iconic Shikara rides on Dal Lake, Gulmarg cable car, lush Betaab valley, and winter ski slopes.', 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=1000', 'March to October', 600.00, '["Shikara Ride", "Skiing", "Gondola Ride", "Trekking"]', TRUE, 4.96),
(10, 'Jaisalmer', 'Rajasthan, India', 'The Golden City of Thar desert, boasting majestic Jaisalmer Fort, overnight desert dunes camping, camel safaris, and cultural folk dances.', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1000', 'October to March', 350.00, '["Camel Safari", "Dune Bashing", "Desert Camping", "Fort Exploration"]', FALSE, 4.82);

-- 4. Adventures
INSERT INTO adventures (id, destination_id, name, category, description, duration, difficulty, price, best_time, safety_info, required_equipment, image_url) VALUES
(1, 1, 'Hampta Pass Trek', 'Trekking', 'Crossing dramatic green Kullu valley to stark high-altitude desert of Lahaul with panoramic snow views.', '5 Days', 'Moderate', 199.00, 'June to October', 'Must carry insulated clothes, high altitude sickness medication, and sturdy trekking shoes.', 'Trekking boots, Thermal layers, Rucksack, Rain jacket, Trekking pole', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'),
(2, 2, 'Grande Island Deep Scuba Diving', 'Scuba Diving', 'Dive into underwater tropical coral reefs with certified PADI dive masters and spot exotic marine species.', '1 Day', 'Easy', 75.00, 'October to April', 'Includes full safety briefing, equipment check, and dedicated instructor per 2 divers.', 'Wetsuit, Mask & Snorkel, Fins, Buoyancy Control Device (Provided)', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800'),
(3, 3, 'Ganges Grade IV White Water Rafting', 'Rafting', 'Conquer famous rapids like Roller Coaster, Golf Course, and Club House along 24km of wild river stretch.', '1 Day', 'Moderate', 45.00, 'September to June', 'Helmets and ISO certified lifejackets mandatory. Certified river guide on every raft.', 'Lifejacket, Helmet, Paddle (Provided), Quick-dry clothing', 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&q=80&w=800'),
(4, 3, 'Jumpin Heights 83m Bungee Jump', 'Bungee Jumping', 'India highest cantilevered bungee jump over a rocky cliff and lush river stream in Rishikesh.', '4 Hours', 'Hard', 60.00, 'Round the year', 'Designed by New Zealand experts. Age limit: 12-60 years. Max weight: 110kg.', 'Comfortable attire, Closed shoes', 'https://images.unsplash.com/photo-1512412046876-f386342eddb3?auto=format&fit=crop&q=80&w=800'),
(5, 1, 'Solang Valley Paragliding Expedition', 'Paragliding', 'Soar high like a bird above pine-covered mountains and valley floor with qualified tandem pilots.', '2 Hours', 'Easy', 50.00, 'October to May', 'Tandem pilots with 500+ hours flight experience. Weather dependent.', 'Windbreaker jacket, Sunglasses, Sturdy shoes', 'https://images.unsplash.com/photo-1516592673884-4a382d427493?auto=format&fit=crop&q=80&w=800'),
(6, 4, 'Chadar Frozen River Trek', 'Trekking', 'Walk on the frozen Zanskar river in sub-zero winter temperatures, surrounded by ice canyon walls.', '9 Days', 'Extreme', 499.00, 'January to February', 'Extreme cold conditions (-20°C). Requires high physical stamina and cold gear.', 'Sub-zero sleeping bag, Crampons, Waterproof thermal boots, Goggles', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800'),
(7, 7, 'Havelock Island Reef Snorkeling', 'Scuba Diving', 'Float gently over vibrant living coral beds and underwater marine flora in crystal clear waters.', '1 Day', 'Easy', 40.00, 'October to May', 'Beginner friendly with flotation vests provided.', 'Swimwear, Sunscreen, Towel', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800'),
(8, 5, 'Periyar Tiger Trail Night Safari', 'Safari', 'Guided jungle trekking and nocturnal camping inside Periyar Tiger Reserve with local tribal trackers.', '2 Days', 'Moderate', 120.00, 'October to March', 'Accompanied by armed forest guards and official naturalists.', 'Earth-toned clothing, Torch/Headlamp, Hiking boots', 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=800'),
(9, 9, 'Gulmarg Powder Snow Skiing', 'Trekking', 'Experience Asia longest ropeway gondola and ski down powder snow slopes of Mount Afarwat.', '3 Days', 'Hard', 250.00, 'December to March', 'Avalanche safety gear provided for off-piste skiers.', 'Ski suit, Gloves, Ski goggles, Helmet', 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800'),
(10, 10, 'Thar Desert Overnight Camel Safari', 'Camping', 'Riding camels across golden sand dunes into sunset followed by traditional Rajasthani folk night.', '2 Days', 'Easy', 85.00, 'October to March', 'Hydration pack provided. Safe desert camp setup.', 'Cotton clothes, Sunglasses, Scarf, Warm jacket for night', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800');

-- 5. Packages
INSERT INTO packages (id, destination_id, adventure_id, title, cover_image, description, duration_days, price, difficulty, best_season, included_services, excluded_services, max_participants, rating, reviews_count, featured) VALUES
(1, 1, 1, 'Ultimate Alpine Manali Adventure & Hampta Trek', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000', 'A complete 5-day Himalayan escape featuring Solang valley paragliding, riverside camping, and the iconic Hampta Pass crossover trek.', 5, 299.00, 'Moderate', 'June - October', '["3-Star Hotel Stay & Alpine Tents", "All Meals (Breakfast, Lunch, Dinner)", "Certified Mountain Guide & Porters", "Trek Permits & Safety Gear", "Private Airport / Bus Transfer"]', '["Personal Expenses", "Travel Insurance", "Flight Tickets"]', 12, 4.95, 34, TRUE),

(2, 2, 2, 'Goa Sun, Sea & Scuba Discovery Expedition', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000', 'Immerse yourself in coastal paradise with boat cruises to Grande Island, PADI scuba diving session, underwater photography, and beach bonfire.', 4, 249.00, 'Easy', 'November - February', '["Luxury Beach Resort Accommodation", "PADI Diving Session & Video", "Daily Breakfast & Seafood BBQ", "Speedboat Transfers", "Water Sports Voucher"]', '["Alcoholic Beverages", "Personal Shopping"]', 15, 4.88, 29, TRUE),

(3, 3, 3, 'Rishikesh Thrill Seeker & River Rafting Weekend', 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=1000', 'Action-packed weekend featuring 24km river rafting, 83m bungee jump, luxury cliffside glamping, Ganga Aarti tour, and evening bonfire.', 3, 179.00, 'Hard', 'September - June', '["Riverside Luxury Glamping", "24km River Rafting Trip", "Bungee Jumping Entry Ticket", "All Meals & Evening Snacks", "Certified Instructors"]', '["Video Footage Fee", "Items of Personal Nature"]', 10, 4.92, 45, TRUE),

(4, 4, 6, 'Ladakh High Passes & Pangong Lake Grand Odyssey', 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=80&w=1000', 'Traverse Khardung La (world high pass), camp beneath starry skies at Pangong Tso Lake, explore Nubra Valley double-humped camel safari.', 7, 699.00, 'Hard', 'May - September', '["Boutique Hotel & Luxury Lake Camps", "Royal Enfield Motorbike or SUV", "Inner Line Permits & Oxygen Cylinder", "Breakfast & Dinner Daily", "Experienced Lead Mechanic & Guide"]', '["Fuel for Personal Rides", "Flight to Leh"]', 8, 4.98, 52, TRUE),

(5, 5, 8, 'Kerala Backwaters & Periyar Jungle Explorer', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1000', 'Relax on a private houseboat cruise through Alleppey backwaters, walk through tea estates of Munnar, and join a night jungle safari.', 6, 450.00, 'Easy', 'September - March', '["Private Houseboat Night Stay", "Heritage Resort Stays", "Periyar National Park Safari", "All Meals on Houseboat", "Chauffeur Driven Car"]', '["Ayurvedic Spa Treatments", "Tips"]', 14, 4.86, 21, TRUE),

(6, 7, 7, 'Andaman Exotic Island Hopping & Coral Reef Diving', 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&q=80&w=1000', 'Explore Havelock and Neil islands, walk on Radhanagar Beach, dive into vibrant coral reef reserves, and ride a sea kayak through mangroves.', 5, 550.00, 'Easy', 'October - May', '["Beachfront Villa Stay", "Scuba & Snorkeling Equipment", "Catamaran Ferry Tickets", "Daily Gourmet Breakfast", "Guided Coral Tour"]', '["Camera Permits", "Airfare"]', 10, 4.94, 39, TRUE),

(7, 9, 9, 'Kashmir Valley & Gulmarg Ski Paradise Pass', 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=1000', 'Discover Srinagar houseboats, cable car gondola ride to Gulmarg peak, snow skiing lessons, and breathtaking Pahalgam valley walk.', 5, 480.00, 'Moderate', 'December - March', '["Dal Lake Houseboat & Resort", "Gulmarg Gondola Phase 1 & 2 Tickets", "Ski Instructor & Equipment", "Daily Breakfast & Kashmiri Dinner", "Shikara Ride Ticket"]', '["Personal Warm Gear Rental", "Flights"]', 12, 4.91, 18, FALSE),

(8, 10, 10, 'Jaisalmer Thar Desert Camel Safari & Royal Fort', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1000', 'Live like royalty inside ancient Jaisalmer Fort, venture into Thar Desert on camelback, enjoy Rajasthani folk dance, and sleep under stars.', 3, 199.00, 'Easy', 'October - March', '["Heritage Fort Hotel & Swiss Tents", "Camel Safari & Quad Biking", "Cultural Folk Music & Dinner", "Guided Fort Heritage Walk", "Station Pick up & Drop"]', '["Personal Shopping", "Tips"]', 20, 4.84, 15, FALSE);

-- 6. Package Itineraries
INSERT INTO package_itineraries (package_id, day_number, title, description) VALUES
(1, 1, 'Arrival in Manali & Altitude Acclimatization', 'Meet our team at Manali bus station. Transfer to hotel, gear check-up, and relaxing evening walk around Old Manali cafes.'),
(1, 2, 'Manali to Jobra & Trek to Chika Basecamp', 'Scenic drive to Jobra start point, followed by an easy 3-hour walk through oak and pine forests to Chika campsite along Rani river.'),
(1, 3, 'Chika to Balu Ka Ghera', 'Trek along snow-melt streams and rocky terrain offering spectacular views of Dhaula Dhar ranges to Balu Ka Ghera basecamp.'),
(1, 4, 'Balu Ka Ghera to Hampta Pass & Descent to Shea Goru', 'Steep incline ascent to Hampta Pass (14,100ft) with panoramas of Lahaul peaks, followed by fun snow slide descent to Shea Goru.'),
(1, 5, 'Shea Goru to Chatru, Chandratal Lake & Drive Back to Manali', 'Cross cold mountain stream to Chatru, drive to surreal turquoise Chandratal Lake, then drive through Rohtang pass back to Manali.'),

(2, 1, 'Welcome to Goa & Sunset Cruise', 'Airport pick up, check into beach resort. Enjoy evening Mandovi river sunset catamaran cruise with Goan cultural dance.'),
(2, 2, 'Grande Island Scuba Diving & Snorkeling Expedition', 'Early morning boat ride to Grande Island. Complete dive briefing, submerge 12 meters to spot parrotfish and coral reefs.'),
(2, 3, 'North Goa Water Sports & Beach Hopping', 'Experience jet skiing, banana boat ride, and parasailing at Baga Beach, followed by evening at Vagator fort view.'),
(2, 4, 'Heritage Walk & Souvenir Departure', 'Explore Fontainhas Latin quarter colorful heritage houses and local spice market before airport drop off.'),

(3, 1, 'Check-in to Luxury Glamping & Ganga Aarti', 'Arrive in Rishikesh camp along river bank. Attend peaceful evening Triveni Ghat Ganga Aarti and enjoy camp bonfire.'),
(3, 2, '24km Rafting Thrill & Jumpin Heights Bungee', 'Conquer Grade IV rapids from Marine Drive to Laxman Jhula. Afternoon adrenaline jump at 83m Jumpin Heights cliff.'),
(3, 3, 'Cliff Jumping, Waterfall Hike & Departure', 'Morning waterfall trek to Neer Garh, cliff jumping into natural pools, followed by checkout and departure.');

-- 7. Inquiries
INSERT INTO inquiries (id, reference_id, user_id, name, email, phone, destination_id, subject, message, status) VALUES
(1, 'EXP-78923411', 5, 'Maya Lin', 'maya.user@exploria.com', '+1 555-0199', 1, 'Custom Family Package Inquiry for Manali', 'Hi, we are planning a family trip for 4 people to Manali in October. Are customized itineraries with senior-friendly walks available?', 'IN_PROGRESS'),
(2, 'EXP-45612399', 6, 'David Chen', 'david.user@exploria.com', '+1 555-0188', 2, 'PADI Scuba Certification Query', 'Hello, does the Goa package include PADI open water certification or is it only a discovery dive session?', 'RESOLVED'),
(3, 'EXP-99128374', NULL, 'Sarah Jenkins', 'sarah.j@gmail.com', '+44 7700 900077', 4, 'Ladakh Bike Tour Solo Traveler', 'I want to join a group bike expedition to Leh Ladakh in August. Do you provide bike rental and lead mechanics?', 'PENDING');

-- 8. Guide Requests
INSERT INTO guide_requests (id, user_id, guide_id, destination, travel_dates, preferred_activities, budget, travelers_count, special_requirements, status) VALUES
(1, 5, 1, 'Manali, Himachal Pradesh', '2026-10-15 to 2026-10-20', 'Trekking, Camping, Photography', 500.00, 2, 'We prefer a certified local guide who speaks English and knows quiet camera locations.', 'MATCHED'),
(2, 6, 2, 'Goa, India', '2026-11-05 to 2026-11-08', 'Scuba Diving, Kayaking', 400.00, 2, 'Need underwater photography included.', 'ACCEPTED');

-- 9. Bookings
INSERT INTO bookings (id, booking_code, user_id, package_id, guide_id, travel_date, travelers_count, total_amount, status, payment_status, special_notes) VALUES
(1, 'BK-88231940', 5, 1, 1, '2026-10-15', 2, 598.00, 'CONFIRMED', 'DEMO_PAID', 'Vegetarian food preference during trek camps.'),
(2, 'BK-55214730', 6, 2, 2, '2026-11-05', 2, 498.00, 'CONFIRMED', 'DEMO_PAID', 'Requires extra scuba diving wetsuit sizes L and M.');

-- 10. Reviews
INSERT INTO reviews (id, user_id, package_id, guide_id, destination_id, rating, comment) VALUES
(1, 5, 1, 1, 1, 5, 'The Hampta Pass trek with guide Aarav was unforgettable! Everything from camp food to safety gear was top tier. Highly recommended!'),
(2, 6, 2, 2, 2, 5, 'Elena was an amazing scuba dive instructor. She made us feel super calm underwater and captured brilliant HD videos!'),
(3, 5, 3, 3, 3, 5, 'Rishikesh rafting was thrilling beyond words. Rohan ensured complete safety while giving us maximum fun on Roller Coaster rapid.');

-- 11. Favorites
INSERT INTO favorites (id, user_id, package_id) VALUES
(1, 5, 1),
(2, 5, 4),
(3, 6, 2);

-- 12. Guide Availability
INSERT INTO guide_availability (id, guide_id, date, status) VALUES
(1, 1, '2026-10-15', 'BOOKED'),
(2, 1, '2026-10-16', 'BOOKED'),
(3, 1, '2026-10-17', 'BOOKED'),
(4, 2, '2026-11-05', 'BOOKED'),
(5, 2, '2026-11-06', 'BOOKED');

-- 13. Chat Messages
INSERT INTO chat_messages (id, sender_id, receiver_id, message, is_read) VALUES
(1, 5, 2, 'Hi Aarav, looking forward to our Hampta pass trek in October!', TRUE),
(2, 2, 5, 'Hello Maya! Excited to guide you. Please ensure you pack sturdy thermal layers for cold evenings.', TRUE);
