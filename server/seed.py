# seed.py
from app import create_app, db  # Import db from app.py
from models import User, Destination, Review, Booking
from datetime import datetime, timedelta
import random

app = create_app()

def seed_database():
    with app.app_context():
        # Clear existing data
        print("Clearing existing data...")
        db.session.query(Review).delete()
        db.session.query(Booking).delete()
        db.session.query(Destination).delete()
        db.session.query(User).delete()
        db.session.commit()

        print("Seeding new data...")
        
        # Create test users
        users = [
            User(
                email="test@example.com",
                name="Test User",
                avatar="https://i.pravatar.cc/300"
            ),
            User(
                email="admin@example.com",
                name="Admin User",
                avatar="https://i.pravatar.cc/300"
            )
        ]
        for user in users:
            user.set_password("password123")  # Set a default password for each user
        db.session.add_all(users)
        
        # Kenyan destinations
        kenyan_destinations = [
            Destination(
                title="Maasai Mara",
                location="Narok County",
                description="World-renowned for the Great Migration where millions of wildebeest and zebras cross its plains in an annual spectacle. Offers exceptional Big Five sightings with vast open savannahs perfect for game viewing. Stay in luxury tented camps for an authentic safari experience under African skies.",
                image_url="https://tanzania-specialist.com/wp-content/uploads/2023/07/masai-mara-wildebeests-and-zebra.jpg",
                fees=1200,
                type="kenyan",
                is_package=False
            ),

            Destination(
                title="Diani Beach",
                location="Kwale County",
                description="Pristine 17km stretch of white sand beach lined with palm trees and turquoise waters ideal for swimming and water sports. Home to vibrant coral reefs just offshore, perfect for snorkeling and diving with tropical fish. Enjoy beachfront resorts offering world-class hospitality and Swahili coastal cuisine.",
                image_url="https://www.nairobinationalparkkenya.com/wp-content/uploads/2023/06/diani-sea-resort-1.jpg",
                fees=800,
                type="kenyan",
                is_package=False
            ),

            Destination(
                title="Amboseli National Park",
                location="Kajiado County",
                description="Famous for its large elephant herds roaming against the stunning backdrop of Mount Kilimanjaro. The swamp grounds attract diverse wildlife including buffalo, giraffes, and over 400 bird species. Experience breathtaking sunsets over the savannah with Kilimanjaro's snow-capped peak glowing in the distance.",
                image_url="https://images.unsplash.com/photo-1691161848365-ee26f84ac0c3?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                fees=950,
                type="kenyan",
                is_package=False
            ),

            Destination(
                title="Lamu Island",
                location="Lamu County",
                description="A UNESCO World Heritage Site preserving centuries-old Swahili culture with narrow alleyways and ornate wooden doors. Explore the car-free old town by donkey and relax on untouched beaches with dhow boats dotting the horizon. The annual Lamu Cultural Festival showcases traditional dances, dhow races, and Swahili poetry.",
                image_url="https://www.siyabona.com/images/lamu-island-kenya-01-590x390.jpg",
                fees=750,
                type="kenyan",
                is_package=False
            ),

            Destination(
                title="Hell's Gate National Park",
                location="Nakuru County",
                description="Unique for its dramatic geothermal activity with steaming vents and towering red cliffs that inspired Disney's Lion King. One of few Kenyan parks allowing cycling safaris and walking tours amidst zebras and giraffes. Hike through the spectacular gorge where hot springs meet towering rock walls.",
                image_url="https://cdn.getyourguide.com/img/location/5a1d364ab5693.jpeg/99.jpg",
                fees=600,
                type="kenyan",
                is_package=False
            ),
            Destination(
            title="Lake Nakuru National Park",
            location="Nakuru County",
            description="Famous for its flamingo populations that turn the lake shores pink. The park also hosts rhinos, lions, and leopards against a scenic backdrop of the Great Rift Valley. Excellent for birdwatchers with over 400 species recorded.",
            image_url="https://www.aberdarenationalparks.com/wp-content/uploads/2023/03/lake-nakuru-national-park-750x400.jpg",
            fees=850,
            type="kenyan",
            is_package=False
        ),
        Destination(
            title="Mount Kenya",
            location="Central Kenya",
            description="Africa's second highest peak offering spectacular trekking routes through diverse ecological zones. The mountain's glaciers and snow-capped peaks create stunning vistas, while lower slopes feature dense forests rich in wildlife. Ideal for both experienced climbers and casual hikers.",
            image_url="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/b9/18/38/caption.jpg?w=500&h=500&s=1",
            fees=700,
            type="kenyan",
            is_package=False
        ),
        Destination(
            title="Watamu Marine Park",
            location="Coast Province",
            description="Pristine marine protected area with spectacular coral reefs perfect for snorkeling and diving. The park hosts sea turtles, tropical fish, and dolphins in its crystal-clear waters. Nearby, you can explore the mysterious Gede Ruins, a 12th-century Swahili village.",
            image_url="https://africanspicesafaris.com/wp-content/uploads/2024/05/wamamu-marine-national-park-reserve-snorkeling-and-scuba-diving.gif",
            fees=650,
            type="kenyan",
            is_package=False
        )
            
        ]
        
        
        # International destinations
        international_destinations = [

            # Single Destinations
           Destination(
                title="Bali",
                location="Indonesia",
                description="Tropical paradise known for its volcanic mountains, emerald rice terraces, and world-class surfing beaches. Rich Hindu culture shines through thousands of temples, colorful ceremonies, and traditional dance performances. Stay in luxurious jungle villas or beachfront resorts with breathtaking ocean views.",
                image_url="https://www.worldatlas.com/upload/88/3b/8e/pura-ulun-danu-bratan-temple-bali-indonesia-guitar-photographer.jpg",
                fees=1500,
                type="international",
                is_package=False
            ),

            Destination(
                title="Paris",
                location="France",
                description="The romantic 'City of Light' boasting iconic landmarks like the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral. Stroll along the Seine, explore charming Montmartre, and indulge in world-renowned cuisine and patisseries. Springtime brings blooming gardens while winter sparkles with Christmas markets along the Champs-Élysées.",
                image_url="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/15/6d/d6/paris.jpg?w=1200&h=-1&s=1",
                fees=2000,
                type="international",
                is_package=False
            ),

            Destination(
                title="Santorini",
                location="Greece",
                description="Breathtaking volcanic island famous for its whitewashed buildings with blue domes clinging to dramatic cliffs. Watch legendary sunsets over the caldera from Oia village while luxury yachts dot the azure waters below. Explore ancient ruins, volcanic beaches, and sample exceptional local wines from centuries-old vineyards.",
                image_url="https://www.princess.com/content/dam/princess-headless/shorex/ports/santorini-greece-oia-village-blue-roof-buildings.jpg",
                fees=1800,
                type="international",
                is_package=False
            ),

            Destination(
                title="Kyoto",
                location="Japan",
                description="Japan's ancient capital with over 1,600 Buddhist temples and Shinto shrines amidst traditional wooden machiya houses. Experience tea ceremonies, geisha culture in Gion district, and stunning cherry blossoms in spring. The golden Kinkaku-ji temple and bamboo forests of Arashiyama showcase Japan's timeless beauty.",
                image_url="https://www.jal.co.jp/in/en/guide-to-japan/destinations/articles/kyoto/5-ways-to-explore-bamboo-forest/_jcr_content/root/responsivegrid/sectioncontainer/image_1306044576.coreimg.jpeg/1738126876576.jpeg",
                fees=2200,
                type="international",
                is_package=False
            ),

            Destination(
                title="Cape Town",
                location="South Africa",
                description="Stunning coastal city framed by Table Mountain and surrounded by pristine beaches and vineyards. Take the cable car up Table Mountain for panoramic views or visit penguins at Boulders Beach. The nearby Cape Winelands offer world-class wines paired with gourmet cuisine in picturesque valley settings.",
                image_url="https://www.tripsavvy.com/thmb/ax9dykj68rl4XE6YZTwY85lhBo0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/aerial-view-of-cape-town-and-it-s-majestic--flat-topped-table-mountain-1169318257-07b81b2f33d74f6aaf1685b306c86bfa.jpg",
               
                fees=1600,
                type="international",
                is_package=False
            ),
            Destination(
                title="Machu Picchu",
                location="Peru",
                description="The breathtaking 15th-century Inca citadel nestled high in the Andes Mountains. This archaeological wonder features sophisticated dry-stone construction and panoramic mountain views. Visit at sunrise to see the ruins emerge from the mist for a truly magical experience.",
                image_url="https://caminoincamachupicchu.org/cmingutd/wp-content/uploads/2021/06/machu-picchu-ci.jpg",
                fees=1900,
                type="international",
                is_package=False
            ),
            Destination(
                title="Great Barrier Reef",
                location="Australia",
                description="The world's largest coral reef system stretching over 2,300 kilometers with extraordinary marine biodiversity. Snorkel or dive among colorful corals, tropical fish, turtles, and reef sharks. Conservation-focused tours help protect this fragile underwater ecosystem.",
                image_url="https://images.unsplash.com/photo-1544551763-46a013bb70d5",
                fees=2300,
                type="international",
                is_package=False
            ),
            Destination(
                title="Petra",
                location="Jordan",
                description="The ancient 'Rose City' carved into pink sandstone cliffs by the Nabataeans over 2,000 years ago. Walk through the dramatic Siq canyon to discover the iconic Treasury building at sunrise. Explore hundreds of elaborate tombs, temples, and an ancient Roman-style theater.",
                image_url="https://images.memphistours.com/large/184203755_Petra.jpg",
                fees=1700,
                type="international",
                is_package=False
            )
        ]
        
        # Packages for kenya and international
        packages = [

               # Kenyan packages

            Destination(
                title="Kenya Safari Adventure",
                location="Maasai Mara, Lake Nakuru, Amboseli",
                description="7-day immersive safari covering Kenya's most spectacular wildlife destinations with expert Maasai guides. Witness the Great Migration in Mara, flamingo flocks at Nakuru, and elephant herds with Kilimanjaro views in Amboseli. Includes luxury tented camps, night game drives, and authentic cultural encounters with local communities.",
                image_url="https://www.kenyawildlifetours.com/wp-content/uploads/2021/06/amboseli-NP-582x393-1.jpg",
                fees=2800,
                type="kenyan",
                is_package=True,
                duration="7 days, 6 nights"
            ),

            Destination(
                title="Classic Kenya Safari",
                location="Maasai Mara, Lake Nakuru, Amboseli",
                description="Premium 7-day journey through Kenya's iconic parks staying at award-winning eco-lodges with private verandas. Enjoy sunrise game drives, bush breakfasts, and sundowners overlooking watering holes teeming with wildlife. Special access to conservancies ensures intimate wildlife encounters away from crowds.",
                image_url="https://kenyaluxurysafari.co.uk/wp-content/uploads/image10-63.webp",
                fees=2800,
                type="kenyan",
                is_package=True,
                duration="7 days, 6 nights"
            ),

            Destination(
                title="Beach & Bush Adventure",
                location="Diani Beach, Tsavo East",
                description="5-day perfect blend of relaxation and adventure combining safari thrills with beachfront luxury. Track the 'Red Elephants' of Tsavo before unwinding on Diani's white sands with snorkeling and dhow trips. Includes a romantic beach dinner under the stars and guided nature walks in coastal forests.",
                image_url="https://bayandbush.com.au/wp-content/uploads/2024/01/sea-kayak-in-jervis-bay-with-tea-on-the-beach-1080x675.png",
                fees=2200,
                type="kenyan",
                is_package=True,
                duration="5 days, 4 nights"
            ),

            Destination(
                title="Northern Kenya Explorer",
                location="Samburu, Shaba, Buffalo Springs",
                description="4-day expedition to Kenya's wild north discovering unique species like Grevy's zebra and reticulated giraffe. Stay at intimate bush camps offering night game drives and guided walks with Samburu warriors. Experience authentic cultural interactions and spectacular landscapes rarely visited by tourists.",
                image_url="https://pallidsafaris.com/wp-content/uploads/2024/02/kenya.jpg",
                fees=1900,
                type="kenyan",
                is_package=True,
                duration="4 days, 3 nights"
            ),
            Destination(
                title="Luxury Safari Experience",
                location="Maasai Mara, Laikipia",
                description="8-day exclusive safari staying at award-winning luxury lodges with private game drives. Includes hot air balloon ride over the Mara and guided bush walks with Maasai warriors. Perfect for travelers seeking both adventure and pampering in the wild.",
                image_url="https://i0.wp.com/theluxurytravelexpert.com/wp-content/uploads/2019/03/SAFARI-LODGES-AFRFICA.jpg?fit=1300%2C731&ssl=1",
                fees=5200,
                type="kenyan",
                is_package=True,
                duration="8 days, 7 nights"
            ),
            Destination(
                title="Coastal Cultural Journey",
                location="Mombasa, Lamu, Malindi",
                description="6-day exploration of Kenya's Swahili coast with dhow cruises, spice farm tours, and historical site visits. Experience authentic Swahili cuisine and stay in traditional coral stone houses. Includes a sunset sail on a traditional Arab dhow.",
                image_url="https://www.volcanoesparkrwanda.org/wp-content/uploads/2024/08/Lamu-Cultural-Festival.png",
                fees=2800,
                type="kenyan",
                is_package=True,
                duration="6 days, 5 nights"
            ),
            Destination(
                title="Great Rift Valley Explorer",
                location="Lake Naivasha, Hell's Gate, Lake Bogoria",
                description="5-day adventure through Kenya's dramatic Rift Valley landscapes featuring cycling safaris, boat rides, and geothermal springs. Spot flamingos at the alkaline lakes and hike through spectacular gorges. Includes a night at a lakeside tented camp.",
                image_url="https://safarihub.com/wp-content/uploads/2018/10/Rift-valley.png",
                fees=2100,
                type="kenyan",
                is_package=True,
                duration="5 days, 4 nights"
            ),



            # International Packages 
            
           Destination(
                title="European Tour",
                location="Paris, Rome, Barcelona",
                description="14-day cultural journey through Europe's most enchanting cities with skip-the-line access to major landmarks. From the Eiffel Tower to the Colosseum and Sagrada Familia, experience the best art, architecture and cuisine. Includes wine tasting in Tuscany, gondola rides in Venice, and flamenco shows in Barcelona.",
                image_url="https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
                fees=4500,
                type="international",
                is_package=True,
                duration="14 days, 13 nights"
            ),

            Destination(
                title="European Highlights Tour",
                location="Paris, Rome, Barcelona",
                description="Luxury 14-day itinerary featuring private guided tours, premium accommodations, and exclusive experiences in each city. Enjoy a private after-hours Vatican visit, cooking class with a Parisian chef, and hot air balloon over Catalonia. Includes first-class rail travel between destinations for maximum comfort.",
                image_url="https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
                fees=4500,
                type="international",
                is_package=True,
                duration="14 days, 13 nights"
            ),

            Destination(
                title="Southeast Asia Adventure",
                location="Bali, Bangkok, Singapore",
                description="10-day vibrant journey from Bali's temples to Bangkok's floating markets and Singapore's futuristic gardens. Includes surfing lessons in Canggu, Thai cooking classes, and a night safari at Singapore Zoo. Stay in boutique hotels blending modern luxury with local design traditions.",
                image_url="https://i.natgeofe.com/k/95d61645-a0c7-470f-b198-74a399dd5dfb/singapore-city_3x2.jpg",
                fees=3800,
                type="international",
                is_package=True,
                duration="10 days, 9 nights"
            ),

            Destination(
                title="Dubai Luxury Escape",
                location="Dubai, Abu Dhabi",
                description="7-day opulent experience featuring private yacht charters, desert glamping under the stars, and VIP access to Burj Khalifa's top floors. Includes gold-cappuccinos at the 7-star Burj Al Arab and shopping at the gold souk with a personal stylist. Helicopter tour over Palm Jumeirah completes this lavish getaway.",
                image_url="https://cf.bstatic.com/xdata/images/hotel/max1024x768/501257675.jpg?k=1a188c56691dc4d08650c6be21cdc38b24812283512d4686ce1eecb43c214bb0&o=&hp=1",
                fees=3200,
                type="international",
                is_package=True,
                duration="7 days, 6 nights"
            ),
            Destination(
                title="Scandinavian Winter Wonderland",
                location="Norway, Sweden, Finland",
                description="10-day Arctic adventure featuring Northern Lights viewing, dog sledding, and ice hotel stays. Includes a reindeer safari with Sami people and a cruise through Norway's spectacular fjords. Experience the magic of Christmas markets in Stockholm and Helsinki.",
                image_url="https://theloverspassport.com/wp-content/uploads/2024/11/The-Northern-Lights-in-Hamnoy-Village-Norway.jpg",
                fees=4900,
                type="international",
                is_package=True,
                duration="10 days, 9 nights"
            ),
            Destination(
                title="Southeast Asia Highlights",
                location="Thailand, Cambodia, Vietnam",
                description="12-day cultural journey visiting Bangkok's temples, Angkor Wat, and Halong Bay. Includes cooking classes, tuk-tuk rides, and a Mekong Delta cruise. Stay in boutique hotels and learn about the region's rich history and traditions.",
                image_url="https://www.responsibletravel.com/imagesClient/1772_1710.jpg",
                fees=3800,
                type="international",
                is_package=True,
                duration="12 days, 11 nights"
            ),
            Destination(
                title="Patagonian Adventure",
                location="Chile, Argentina",
                description="14-day trekking expedition through Torres del Paine and Los Glaciares National Parks. Hike to granite towers, cruise past calving glaciers, and stay in remote mountain lodges. Includes expert guides and all equipment for an unforgettable wilderness experience.",
                image_url="https://images.squarespace-cdn.com/content/v1/57c8a003d482e9daf9a5f97c/1482332755471-BYW49PRF5LZ1E9L75EAP/glacier.jpg",
                fees=5500,
                type="international",
                is_package=True,
                duration="14 days, 13 nights"
            )

           
        ]
        
        db.session.add_all(kenyan_destinations)
        db.session.add_all(international_destinations)
        db.session.add_all(packages)
        db.session.commit()
        
        # Create reviews for each destination
        destinations = Destination.query.all()
        reviews = []
        for dest in destinations:
            for i in range(random.randint(1, 5)):
                reviews.append(Review(
                    user_id=random.choice([user.id for user in users]),
                    destination_id=dest.id,
                    rating=random.randint(3, 5),
                    comment=f"Amazing experience at {dest.title}! " + 
                            random.choice(["Would visit again!", "Highly recommended.", "Best vacation ever!"])
                ))
        
        db.session.add_all(reviews)
        
        # Create bookings
        bookings = [
            Booking(
                user_id=users[0].id,
                destination_id=destinations[0].id,
                travel_date=datetime.now().date() + timedelta(days=30),
                return_date=datetime.now().date() + timedelta(days=37),
                adults=2,
                children=1,
                special_requests="Vegetarian meals required"
            )
        ]
        
        db.session.add_all(bookings)
        db.session.commit()
        print("✅ Seeding completed successfully!")

if __name__ == '__main__':
    seed_database()