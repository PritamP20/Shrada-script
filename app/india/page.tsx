"use client";

import React, { useState } from "react";
// @ts-ignore
import India from "@svg-maps/india";

interface Location {
  id: string;
  name: string;
  path: string;
}

interface StateData {
  capital: string;
  population: string;
  area: string;
  languages: string;
  history: string;
  culture: string;
  mainImage: string;
  highlights: { name: string; image: string }[];
}

const stateData: Record<string, StateData> = {
  "Andhra Pradesh": {
    capital: "Amaravati",
    population: "53.9 million",
    area: "162,968 km²",
    languages: "Telugu, English, Hindi",
    history: "Andhra Pradesh has ancient roots dating back to the Satavahana dynasty (230 BCE - 220 CE). The region was ruled by various dynasties including the Chalukyas, Kakatiyas, and Vijayanagara Empire. The Qutb Shahi dynasty established Hyderabad as a major center. British colonial rule began in the 18th century. Post-independence, it was formed as a linguistic state in 1956, and Telangana was carved out in 2014.",
    culture: "Telugu culture is rich in classical arts, with Kuchipudi dance originating here. The state is famous for its spicy cuisine including biryani, pesarattu, and gongura dishes. Sankranti is the major festival celebrated with kite flying and rangoli. Traditional crafts include Kalamkari textiles, Bidriware, and pearl jewelry from Hyderabad. The state has a strong literary tradition with renowned poets and writers.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Charminar_Hyderabad.jpg",
    highlights: [
      { name: "Tirupati Temple", image: "https://upload.wikimedia.org/wikipedia/commons/9/99/Tirumala_Temple.jpg" },
      { name: "Amaravati Stupa", image: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amaravati_Stupa.jpg" }
    ]
  },
  "Arunachal Pradesh": {
    capital: "Itanagar",
    population: "1.4 million",
    area: "83,743 km²",
    languages: "Hindi, English, Tribal Languages",
    history: "Known as the 'Land of the Dawn-Lit Mountains', Arunachal Pradesh has been inhabited by various tribal communities for millennia. The Ahom kingdom influenced parts of the region. British colonial administration was minimal due to difficult terrain. The region was part of NEFA (North-East Frontier Agency) until 1972. It became a full state in 1987, despite territorial disputes with China.",
    culture: "Home to 26 major tribes including Nyishi, Adi, and Apatani, each with distinct traditions. Buddhism and indigenous animistic beliefs coexist. The Hornbill Festival showcases tribal culture. Traditional crafts include bamboo work, weaving, and wood carving. Thukpa and momos are popular foods. The state celebrates Losar, Dree, and Solung festivals with traditional dances and rituals.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Tawang_Monastery.jpg",
    highlights: [
      { name: "Ziro Valley", image: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Ziro_Valley.jpg" },
      { name: "Namdapha National Park", image: "https://upload.wikimedia.org/wikipedia/commons/5/50/Namdapha_Tiger.jpg" }
    ]
  },
  "Assam": {
    capital: "Dispur",
    population: "35.6 million",
    area: "78,438 km²",
    languages: "Assamese, Bengali, Hindi, English",
    history: "Ancient Assam was known as Pragjyotisha and Kamrupa. The Ahom dynasty ruled for 600 years (1228-1826), successfully resisting Mughal invasions. The region came under British control after the Treaty of Yandabo in 1826. It became a major tea-producing region during colonial times. Post-independence, several states were carved out of Assam including Nagaland, Mizoram, and Meghalaya.",
    culture: "Assamese culture is centered around the Vaishnavite traditions established by Srimanta Sankardeva. Bihu is the most important festival, celebrating agriculture cycles with traditional dances and songs. The state is famous for silk weaving, especially Muga silk. Assamese cuisine features fish, rice, and vegetables with minimal oil. Traditional art forms include Sattriya dance and various folk performances.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Kamakhya_Temple_Guwahati.jpg",
    highlights: [
      { name: "Kaziranga National Park", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/One_Horned_Rhino.jpg" },
      { name: "Majuli Island", image: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Majuli_Island_Assam.jpg" }
    ]
  },
  "Bihar": {
    capital: "Patna",
    population: "124.8 million",
    area: "94,163 km²",
    languages: "Hindi, Bhojpuri, Maithili, Urdu",
    history: "Bihar is the birthplace of Buddhism and Jainism, with Buddha attaining enlightenment at Bodh Gaya. The Mauryan Empire with Pataliputra as capital flourished here. The Gupta Empire brought a golden age of art and learning. Medieval period saw rule by various dynasties including the Palas and Muslim rulers. Under British rule, Bihar was part of Bengal Presidency until 1912.",
    culture: "Bihari culture reflects its ancient heritage with strong religious traditions. Chhath Puja is the most significant festival dedicated to the Sun God. The state has rich folk traditions including Bhojpuri songs and dances. Madhubani painting is a world-renowned art form. Traditional cuisine includes litti chokha, sattu, and various sweets like khaja and tilkut. The region has a strong oral literature tradition.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Mahabodhi_Temple_Bodhgaya.jpg",
    highlights: [
      { name: "Nalanda University", image: "https://upload.wikimedia.org/wikipedia/commons/4/41/Nalanda_University_Ruins.jpg" },
      { name: "Vikramshila", image: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Vikramshila_Ruins.jpg" }
    ]
  },
  "Chhattisgarh": {
    capital: "Raipur",
    population: "29.4 million",
    area: "135,192 km²",
    languages: "Hindi, Chhattisgarhi, Tribal Languages",
    history: "The region was part of ancient Dakshina Kosala kingdom. Various dynasties including Satavahanas, Vakatakas, and Kalachuris ruled here. The Maratha rulers controlled the area in the 18th century. During British rule, it was part of Central Provinces. Chhattisgarh was carved out of Madhya Pradesh in 2000 as India's 26th state.",
    culture: "Chhattisgarhi culture is deeply rooted in tribal traditions with over 40 tribal communities. The state is famous for its folk dances like Panthi, Raut Nacha, and Karma. Traditional arts include bell metal work, bamboo crafts, and tribal paintings. Rice is the staple food with dishes like bara and farra being popular. Festivals like Hareli, Pola, and Navakhani celebrate agricultural cycles.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/5/53/Chitrakote_Falls.jpg",
    highlights: [
      { name: "Sirpur Archaeological Site", image: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Sirpur_Temple.jpg" },
      { name: "Bastar Tribes", image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Bastar_Tribal_Art.jpg" }
    ]
  },
  "Goa": {
    capital: "Panaji",
    population: "1.5 million",
    area: "3,702 km²",
    languages: "Konkani, Marathi, English, Portuguese",
    history: "Ancient Goa was ruled by the Kadamba dynasty and later the Bahmani Sultanate. Portuguese colonization began in 1510 under Afonso de Albuquerque, making it the center of Portuguese India. The Inquisition was established here in 1560. Goa remained under Portuguese rule for 451 years until liberation in 1961. It became a state in 1987.",
    culture: "Goan culture is a unique blend of Indian and Portuguese influences. Carnival is celebrated with parades and festivities. The state is famous for its churches, especially Bom Jesus Basilica. Konkani music and dance, including Dekhni and Fugdi, are popular. Goan cuisine features seafood, vindaloo, and bebinca. The state has a relaxed coastal lifestyle with beautiful beaches and vibrant nightlife.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Bom_Jesus_Basilica_Goa.jpg",
    highlights: [
      { name: "Dudhsagar Falls", image: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Dudhsagar_Falls_Goa.jpg" },
      { name: "Fort Aguada", image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Fort_Aguada_Goa.jpg" }
    ]
  },
  "Gujarat": {
    capital: "Gandhinagar",
    population: "70.1 million",
    area: "196,244 km²",
    languages: "Gujarati, Hindi, English",
    history: "Gujarat was part of the Harappan civilization with sites like Lothal and Dholavira. The region saw rule by Mauryans, Guptas, and Chalukyas. The Solanki dynasty established a powerful kingdom with Anhilwara as capital. Muslim rulers including the Gujarat Sultanate controlled the region later. Mughal rule was followed by Maratha control and eventual British dominance.",
    culture: "Gujarati culture emphasizes business acumen, vegetarianism, and community values. Navratri is celebrated with great fervor featuring Garba and Dandiya dances. The state is famous for textiles, handicrafts, and diamond cutting. Gujarati thali represents diverse regional cuisines with dhokla, khandvi, and various sweets. Jainism has significantly influenced the culture with emphasis on non-violence and philanthropy.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/9/98/Somnath_Temple_Gujarat.jpg",
    highlights: [
      { name: "Rann of Kutch", image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Rann_of_Kutch.jpg" },
      { name: "Dwarka Temple", image: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Dwarkadheesh_Temple.jpg" }
    ]
  },
  "Haryana": {
    capital: "Chandigarh",
    population: "28.9 million",
    area: "44,212 km²",
    languages: "Hindi, Haryanvi, Punjabi, English",
    history: "Haryana is the land of the epic Mahabharata battle at Kurukshetra. The region was part of various ancient kingdoms including Mauryan and Gupta empires. Delhi Sultanate and Mughal Empire controlled the area for centuries. It was part of Punjab during British rule and became a separate state in 1966 after the Punjab Reorganization Act.",
    culture: "Haryanvi culture is known for its strong agricultural traditions and warrior heritage. Folk dances like Ghoomar and Khoria reflect rural life. The state is famous for its contribution to Indian sports, especially wrestling, boxing, and hockey. Traditional crafts include phulkari embroidery and pottery. Haryanvi cuisine features dairy products, bajra rotis, and seasonal vegetables.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Kurukshetra_Panorama_Science_Museum.jpg",
    highlights: [
      { name: "Sultanpur Bird Sanctuary", image: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Sultanpur_Bird_Sanctuary.jpg" },
      { name: "Pinjore Gardens", image: "https://upload.wikimedia.org/wikipedia/commons/5/59/Pinjore_Gardens_Haryana.jpg" }
    ]
  },
  "Himachal Pradesh": {
    capital: "Shimla",
    population: "7.3 million",
    area: "55,673 km²",
    languages: "Hindi, Pahari, English",
    history: "The region was inhabited by various tribes and later ruled by small hill kingdoms. The Katoch dynasty in Kangra and other Rajput rulers controlled different areas. Sikh rule under Ranjit Singh extended to some parts. British established hill stations like Shimla as summer capitals. The state was formed in 1971 by merging various princely states and districts.",
    culture: "Himachali culture is deeply connected to nature and mountains with numerous festivals celebrating seasons. Dussehra celebrations in Kullu are world-famous. The state has rich traditions of folk music and dance including Nati. Pahari miniature paintings and handicrafts like shawls and caps are renowned. Local cuisine features rajma, siddu, and various meat preparations reflecting mountain lifestyle.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Shimla_Mall_Road.jpg",
    highlights: [
      { name: "Rohtang Pass", image: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Rohtang_Pass_Himachal.jpg" },
      { name: "Key Monastery", image: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Key_Monastery_Spiti.jpg" }
    ]
  },
  "Jharkhand": {
    capital: "Ranchi",
    population: "38.6 million",
    area: "79,716 km²",
    languages: "Hindi, Santhali, Mundari, Ho",
    history: "Jharkhand region was inhabited by various tribal communities for millennia. The area was part of Magadha kingdom and later Mauryan Empire. Various dynasties including Nagvanshi kings ruled parts of the region. During British rule, it was part of Bihar and Bengal provinces. The state was carved out of Bihar in 2000 after a long movement for tribal autonomy.",
    culture: "Tribal culture dominates Jharkhand with over 30 tribal communities including Santhal, Munda, and Ho. Sarhul and Karma are major festivals celebrating nature and harvest. Traditional arts include Paitkar paintings, dokra metal crafts, and bamboo works. Tribal dances like Chhau, Jhumair, and Domkach are integral to cultural celebrations. The region has rich oral traditions with folk tales and songs.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/5/51/Hundru_Falls_Jharkhand.jpg",
    highlights: [
      { name: "Sun Temple Ranchi", image: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Sun_Temple_Ranchi.jpg" },
      { name: "Tribal Museum", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Tribal_Museum_Ranchi.jpg" }
    ]
  },
  "Karnataka": {
    capital: "Bengaluru",
    population: "68 million",
    area: "191,791 km²",
    languages: "Kannada, English, Hindi, Tulu",
    history: "Karnataka has ancient roots with references in epics and Puranas. The Kadamba dynasty was the first indigenous kingdom. The region saw rule by Chalukyas, Hoysalas, and the mighty Vijayanagara Empire. Hyder Ali and Tipu Sultan ruled Mysore kingdom, resisting British expansion. Various princely states were integrated to form Karnataka in 1956.",
    culture: "Karnataka is the cradle of Carnatic music with legendary composers like Purandara Dasa. Classical dance forms include Yakshagana and Bharatanatyam. The state has rich literary traditions in Kannada with eight Jnanpith awardees. Mysore silk, sandalwood crafts, and Channapatna dolls are famous. Festivals like Dasara in Mysore and Karaga in Bengaluru showcase cultural diversity.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Mysore_Palace_Front_View.jpg",
    highlights: [
      { name: "Hampi", image: "https://upload.wikimedia.org/wikipedia/commons/1/14/Hampi_virupaksha_temple.jpg" },
      { name: "Coorg", image: "https://upload.wikimedia.org/wikipedia/commons/7/70/Coorg_Coffee_Plantations.jpg" }
    ]
  },
  "Kerala": {
    capital: "Thiruvananthapuram",
    population: "35.7 million",
    area: "38,852 km²",
    languages: "Malayalam, English, Tamil",
    history: "Kerala's history includes ancient trading relations with Romans, Arabs, and Chinese. Various dynasties like Cheras, Cholas, and Pandyas ruled different regions. The Zamorin of Calicut and Travancore kingdom were prominent. Portuguese, Dutch, and British colonial influences shaped modern Kerala. The state was formed in 1956 by merging Travancore-Cochin with Malabar district.",
    culture: "Kerala culture is known for its unique art forms like Kathakali, Mohiniyattam, and Theyyam. The state has the highest literacy rate in India with strong emphasis on education. Ayurveda, backwater tourism, and spice trade are cultural hallmarks. Onam is the major festival celebrated with elaborate feasts and boat races. Malayalam cinema and literature have gained international recognition.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Kerala_Backwaters.jpg",
    highlights: [
      { name: "Munnar Tea Gardens", image: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Munnar_Tea_Plantation.jpg" },
      { name: "Kathakali Performance", image: "https://upload.wikimedia.org/wikipedia/commons/5/59/Kathakali_Performance.jpg" }
    ]
  },
  "Madhya Pradesh": {
    capital: "Bhopal",
    population: "85.4 million",
    area: "308,245 km²",
    languages: "Hindi, Bundeli, Malvi, Bhili",
    history: "Known as the 'Heart of India', Madhya Pradesh has ancient civilizations at Bhimbetka caves. The region was part of various empires including Mauryan, Gupta, and later medieval kingdoms. The Chandela dynasty built Khajuraho temples. During British rule, many princely states existed here. The modern state was formed in 1956 and reorganized when Chhattisgarh was carved out in 2000.",
    culture: "MP's culture reflects diverse tribal and regional traditions. The state has rich folk arts including Gond paintings and tribal dances. Classical music traditions flourish in Gwalior and Maihar. Festivals like Navratri, Diwali, and tribal festivals are celebrated with enthusiasm. Local cuisine varies by region with specialties like poha, dal bafla, and tribal delicacies. Handicrafts include chanderi silk and bamboo work.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Khajuraho_Temple_MP.jpg",
    highlights: [
      { name: "Sanchi Stupa", image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Sanchi_Stupa_MP.jpg" },
      { name: "Kanha National Park", image: "https://upload.wikimedia.org/wikipedia/commons/9/95/Tiger_Kanha_National_Park.jpg" }
    ]
  },
  "Maharashtra": {
    capital: "Mumbai",
    population: "124 million",
    area: "307,713 km²",
    languages: "Marathi, Hindi, English",
    history: "Maharashtra has ancient Buddhist and Hindu heritage with caves at Ajanta and Ellora. The region was ruled by Satavahanas, Chalukyas, and Rashtrakutas. The Maratha Empire under Chhatrapati Shivaji emerged as a major power. Peshwa rule expanded Maratha influence across India. British control led to the presidency system. Modern Maharashtra was formed in 1960 after linguistic reorganization.",
    culture: "Marathi culture celebrates Chhatrapati Shivaji and Maratha heritage with pride. Ganesh Chaturthi is the most important festival with elaborate celebrations. The state is home to Bollywood film industry and Marathi theater traditions. Classical arts like Lavani dance and Powada ballads are popular. Maharashtrian cuisine includes vada pav, puran poli, and various regional specialties. Warli art and Paithani sarees represent traditional crafts.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/9/91/Gateway_of_India_Mumbai.jpg",
    highlights: [
      { name: "Ajanta Caves", image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Ajanta_caves.jpg" },
      { name: "Shaniwar Wada", image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Shaniwar_Wada%2C_Pune.jpg" }
    ]
  },
  "Manipur": {
    capital: "Imphal",
    population: "3.3 million",
    area: "22,327 km²",
    languages: "Manipuri, English, Hindi",
    history: "Manipur was an independent kingdom for over 2000 years with its own culture and traditions. The Meitei rulers converted to Hinduism in the 18th century. Anglo-Manipur wars resulted in British paramountcy in 1891. The kingdom remained semi-autonomous during British rule. It merged with India in 1949 and became a full state in 1972.",
    culture: "Manipuri culture is centered around classical dance Manipuri, one of India's eight classical forms. Lai Haraoba is the most ancient festival celebrating pre-Hindu traditions. The state is known for martial arts like Thang-ta and traditional sports like polo, which originated here. Manipuri cuisine features fish, vegetables, and fermented products. Women play a significant role in society and markets are run entirely by women.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Loktak_Lake_Manipur.jpg",
    highlights: [
      { name: "Kangla Fort", image: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Kangla_Fort_Manipur.jpg" },
      { name: "Manipuri Dance", image: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Manipuri_Dance_Performance.jpg" }
    ]
  },
  "Meghalaya": {
    capital: "Shillong",
    population: "3.4 million",
    area: "22,429 km²",
    languages: "English, Khasi, Garo, Jaintia",
    history: "Meghalaya was inhabited by Austro-Asiatic tribes for millennia before other influences. The Khasi, Jaintia, and Garo kingdoms maintained autonomy for centuries. British administration was indirect through local chiefs. The region was part of Assam until 1972 when it became a separate state. The name 'Meghalaya' means 'abode of clouds' in Sanskrit.",
    culture: "Meghalaya is unique for its matrilineal society where property passes through female lineage. The state has three main tribal cultures - Khasi, Jaintia, and Garo, each with distinct traditions. Shad Suk Mynsiem and Wangala are major festivals celebrating harvest and culture. Traditional music using instruments like ka ksing kynthei is popular. The state is famous for its living root bridges and clean environment.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/3/37/Cherrapunji_Meghalaya.jpg",
    highlights: [
      { name: "Living Root Bridges", image: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Living_Root_Bridge_Meghalaya.jpg" },
      { name: "Elephant Falls", image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Elephant_Falls_Shillong.jpg" }
    ]
  },
  "Mizoram": {
    capital: "Aizawl",
    population: "1.2 million",
    area: "21,081 km²",
    languages: "Mizo, English, Hindi",
    history: "Mizoram was inhabited by various Mizo tribes who migrated from Myanmar and China. The region remained largely isolated until British administration began in the late 19th century. It was part of Assam as the Lushai Hills district. The Mizo National Front insurgency led to the Mizoram Peace Accord in 1986. It became a full state in 1987.",
    culture: "Mizo culture is predominantly Christian with over 85% of the population following Christianity. The society is egalitarian with strong community bonds. Chapchar Kut, Mim Kut, and Pawl Kut are major festivals celebrating seasons and harvest. Traditional bamboo dance called Cheraw is the signature cultural performance. Mizo cuisine features pork, fish, and bamboo shoots. The state has high literacy rates and women enjoy considerable freedom.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Aizawl_City_Mizoram.jpg",
    highlights: [
      { name: "Phawngpui Peak", image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Phawngpui_Peak_Mizoram.jpg" },
      { name: "Cheraw Dance", image: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Cheraw_Dance_Mizoram.jpg" }
    ]
  },
  "Nagaland": {
    capital: "Kohima",
    population: "2.2 million",
    area: "16,579 km²",
    languages: "English, Nagamese, Tribal Languages",
    history: "Nagaland was inhabited by various Naga tribes with distinct cultures and languages. The region remained largely independent until British annexation in the 1880s. Fierce resistance was offered by tribes like Angami and Ao. During World War II, the Battle of Kohima was fought here. The state was formed in 1963 after decades of insurgency and negotiations for autonomy.",
    culture: "Naga culture is diverse with 16 major tribes, each having unique traditions, dialects, and customs. The Hornbill Festival showcases inter-tribal cultural exchange. Traditional warrior cultures have transformed into vibrant artistic expressions. Christianity is predominant, introduced by missionaries. Naga cuisine features smoked meats, fermented bamboo shoots, and bhut jolokia peppers. Traditional crafts include wood carving, weaving, and jewelry making.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Kohima_War_Cemetery.jpg",
    highlights: [
      { name: "Hornbill Festival", image: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Hornbill_Festival_Nagaland.jpg" },
      { name: "Dzukou Valley", image: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Dzukou_Valley_Nagaland.jpg" }
    ]
  },
  "Odisha": {
    capital: "Bhubaneswar",
    population: "47.4 million",
    area: "155,707 km²",
    languages: "Odia, Hindi, English, Tribal Languages",
    history: "Ancient Odisha was known as Kalinga kingdom, famous for the Kalinga War fought by Emperor Ashoka. The region saw rule by various dynasties including Chedi, Somavamshi, and Eastern Gangas who built the Jagannath Temple. Maratha and British rule followed. The modern state was formed in 1936 as Orissa province and renamed Odisha in 2011.",
    culture: "Odishan culture is centered around Lord Jagannath worship and classical Odissi dance. The Rath Yatra of Puri is world-famous. The state has rich temple architecture and classical music traditions. Festivals like Durga Puja, Kali Puja, and Poila Boishakh are celebrated with great fervor. Traditional crafts include Pattachitra paintings, appliqué work, and stone carving. Odia cuisine features rice, fish, and various vegetarian delicacies.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Jagannath_Temple_Puri.jpg",
    highlights: [
      { name: "Konark Sun Temple", image: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Konark_Sun_Temple.jpg" },
      { name: "Chilika Lake", image: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Chilika_Lake_Odisha.jpg" }
    ]
  },
  "Punjab": {
    capital: "Chandigarh",
    population: "30.1 million",
    area: "50,362 km²",
    languages: "Punjabi, Hindi, English",
    history: "Punjab region was part of the Indus Valley Civilization and later various ancient kingdoms. The area saw invasions by Greeks, Kushans, and others. Sikh Gurus established religious foundations here. The Sikh Empire under Maharaja Ranjit Singh was powerful in the early 19th century. After partition in 1947, Punjab was divided between India and Pakistan, and later reorganized in 1966.",
    culture: "Punjabi culture is vibrant and energetic, centered around Sikhism and agricultural prosperity. Bhangra and Giddha are popular folk dances performed during festivals. Baisakhi celebrates harvest and Sikh new year. The Golden Temple in Amritsar is the holiest Sikh shrine. Punjabi cuisine is rich with butter, dairy, and wheat-based dishes like makki di roti and sarson da saag. The state has a strong tradition of valor and hospitality.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/6/64/Golden_Temple_Amritsar.jpg",
    highlights: [
      { name: "Wagah Border", image: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Wagah_Border_Ceremony.jpg" },
      { name: "Jallianwala Bagh", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Jallianwala_Bagh_Memorial.jpg" }
    ]
  },
  "Rajasthan": {
    capital: "Jaipur",
    population: "81.1 million",
    area: "342,239 km²",
    languages: "Hindi, Rajasthani, English",
    history: "Rajasthan's history spans ancient Indus Valley sites to Rajput kingdoms. The region saw various dynasties including Mauryans, Guptas, and later Rajput clans like Sisodias, Rathores, and Kachwahas who built magnificent forts and palaces. Mughal alliances shaped medieval history. British paramountcy was established through treaties. The state was formed in 1956 by integrating 22 princely states.",
    culture: "Rajasthani culture is renowned for its royal heritage, colorful festivals, and folk arts. Ghoomar and Kalbelia are UNESCO-recognized dances. The state celebrates Teej, Gangaur, and Desert Festival with great pomp. Miniature paintings, blue pottery, and textiles are famous crafts. Rajasthani cuisine includes dal baati churma, laal maas, and various sweets. The culture emphasizes hospitality, valor, and artistic excellence.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Hawa_Mahal_Jaipur.jpg",
    highlights: [
      { name: "Udaipur City Palace", image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Udaipur_City_Palace.jpg" },
      { name: "Thar Desert", image: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Thar_Desert_Rajasthan.jpg" }
    ]
  },
  "Sikkim": {
    capital: "Gangtok",
    population: "0.7 million",
    area: "7,096 km²",
    languages: "English, Nepali, Sikkimese, Lepcha",
    history: "Sikkim was originally inhabited by Lepcha and Bhutia tribes. The Namgyal dynasty was established in 1642 and ruled for over 300 years. British influence grew in the 19th century through treaties. After India's independence, Sikkim remained a protectorate until 1975 when it became India's 22nd state through a referendum.",
    culture: "Sikkimese culture blends Nepali, Lepcha, and Bhutia traditions with strong Buddhist influences. Losar, Dashain, and Tihar are major festivals. The state is known for its monasteries, prayer flags, and peaceful coexistence of different communities. Traditional arts include thangka paintings and wood carving. Sikkimese cuisine features momos, thukpa, and gundruk. The state is India's first fully organic state.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Rumtek_Monastery_Sikkim.jpg",
    highlights: [
      { name: "Kanchenjunga", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Kanchenjunga_Sikkim.jpg" },
      { name: "Nathu La Pass", image: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Nathu_La_Pass.jpg" }
    ]
  },
  "Tamil Nadu": {
    capital: "Chennai",
    population: "77.8 million",
    area: "130,060 km²",
    languages: "Tamil, English",
    history: "Tamil Nadu has one of the world's oldest civilizations with Sangam literature dating back 2000 years. The region was ruled by great dynasties - Cholas, Cheras, Pandyas, and later Pallavas and Vijayanagara Empire. European colonial powers established trading posts. The Madras Presidency was formed under British rule. The state was reorganized as Tamil Nadu in 1969.",
    culture: "Tamil culture is ancient and rich with classical traditions in literature, music, and dance. Bharatanatyam originated here and Carnatic music flourished. Tamil cinema and literature are highly influential. Festivals like Pongal, Diwali, and temple festivals are celebrated grandly. Traditional arts include Tanjore paintings, bronze sculptures, and silk weaving. Tamil cuisine varies by region with rice, sambar, and rasam being staples.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Brihadeeswarar_Temple_Thanjavur.jpg",
    highlights: [
      { name: "Mahabalipuram", image: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Shore_Temple_Mahabalipuram.jpg" },
      { name: "Meenakshi Temple", image: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Meenakshi_Temple_Madurai.jpg" }
    ]
  },
  "Telangana": {
    capital: "Hyderabad",
    population: "39.0 million",
    area: "112,077 km²",
    languages: "Telugu, Urdu, English, Hindi",
    history: "The region was part of various dynasties including Satavahanas, Kakatiyas, and later the Qutb Shahi dynasty which founded Hyderabad. The Nizams of Hyderabad ruled as princely state under British paramountcy. After independence, it was integrated into India and became part of Andhra Pradesh. Telangana was formed as the 29th state in 2014 after a prolonged statehood movement.",
    culture: "Telangana culture blends Telugu traditions with Hyderabadi Ganga-Jamuni tehzeeb. Bathukamma and Bonalu are unique festivals celebrating regional deities. The region is famous for its distinctive dialect, folk songs like Janapada Geethalu, and dances. Hyderabadi cuisine, especially biryani and haleem, is world-renowned. Traditional crafts include Pochampally ikat, Nirmal paintings, and Pembarthi metal work.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Charminar_Hyderabad.jpg",
    highlights: [
      { name: "Golconda Fort", image: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Golconda_Fort_Hyderabad.jpg" },
      { name: "Ramappa Temple", image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Ramappa_Temple_Telangana.jpg" }
    ]
  },
  "Tripura": {
    capital: "Agartala",
    population: "4.2 million",
    area: "10,486 km²",
    languages: "Bengali, Tripuri, English",
    history: "Tripura was ruled by the Manikya dynasty for over 500 years, maintaining independence until British paramountcy. The kingdom had its own coins, postal system, and administrative structure. It was a princely state during British rule and merged with India in 1949. The state faced insurgency issues for decades but has achieved peace in recent years.",
    culture: "Tripura culture is a blend of Bengali and tribal traditions. The indigenous tribes include Tripuri, Reang, and Jamatia with unique customs and festivals. Kharchi Puja and Garia dance are important cultural elements. The state has a rich tradition of handloom weaving and bamboo crafts. Bengali influence is strong in literature, music, and festivals like Durga Puja and Kali Puja.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Ujjayanta_Palace_Tripura.jpg",
    highlights: [
      { name: "Neermahal Palace", image: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Neermahal_Palace_Tripura.jpg" },
      { name: "Tribal Museum", image: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Tribal_Museum_Agartala.jpg" }
    ]
  },
  "Uttar Pradesh": {
    capital: "Lucknow",
    population: "241.1 million",
    area: "240,928 km²",
    languages: "Hindi, Urdu, English",
    history: "UP is the cradle of Indian civilization with ancient cities like Varanasi, Mathura, and Ayodhya. The region saw great empires including Mauryan, Gupta, and later Delhi Sultanate and Mughal rule. The Awadh region had its own nawabi culture. British established United Provinces in 1877. Post-independence, it became Uttar Pradesh and later Uttarakhand was carved out in 2000.",
    culture: "UP's culture is diverse reflecting its historical significance. The state is central to Hindu traditions with major pilgrimage sites. Kathak dance and Hindustani classical music flourished here. Festivals like Diwali, Holi, and Dussehra are celebrated grandly. The region has rich literary traditions in Hindi and Urdu. Cuisine varies from Awadhi kebabs to simple sattu-based dishes. Traditional crafts include chikankari embroidery and brassware.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_Agra.jpg",
    highlights: [
      { name: "Varanasi Ghats", image: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Varanasi_Ghats.jpg" },
      { name: "Fatehpur Sikri", image: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Fatehpur_Sikri_UP.jpg" }
    ]
  },
  "Uttarakhand": {
    capital: "Dehradun",
    population: "11.4 million",
    area: "53,483 km²",
    languages: "Hindi, Garhwali, Kumaoni, English",
    history: "The region has ancient significance in Hindu scriptures as Kedarkhand and Manaskhand. Various small kingdoms like Katyuri and Gorkha rule existed. British established hill stations and cantonment towns. The area was part of United Provinces until 2000 when it became India's 27th state as Uttaranchal, renamed Uttarakhand in 2007.",
    culture: "Uttarakhand culture is deeply spiritual with numerous temples and pilgrimage sites. Char Dham Yatra is central to Hindu pilgrimage. The state has distinct Garhwali and Kumaoni cultures with unique folk songs, dances like Langvir Nritya, and festivals. Traditional crafts include wood carving and woolen products. Local cuisine features mandua (finger millet), jhangora, and seasonal vegetables. Environmental conservation is integral to the cultural ethos.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Kedarnath_Temple_Uttarakhand.jpg",
    highlights: [
      { name: "Valley of Flowers", image: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Valley_of_Flowers_Uttarakhand.jpg" },
      { name: "Rishikesh", image: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Rishikesh_Ganga_Aarti.jpg" }
    ]
  },
  "West Bengal": {
    capital: "Kolkata",
    population: "99.6 million",
    area: "88,752 km²",
    languages: "Bengali, Hindi, English",
    history: "Bengal has ancient roots with references in Mahabharata. The region saw rule by various dynasties including Palas, Senas, and later Bengal Sultanate. Mughal rule was followed by British colonial administration with Calcutta as capital. The Bengal Renaissance began here with social and cultural reforms. Partition in 1947 divided Bengal, and the Indian portion became West Bengal.",
    culture: "Bengali culture is renowned for its intellectual and artistic achievements. Literature, cinema, and music have flourished with Nobel laureates and international recognition. Durga Puja is the biggest festival celebrated with artistic pandals. Fish and rice are dietary staples with sweets like rosogolla and sandesh being famous. Rabindra Sangeet, classical music, and Tagore's influence are integral to the culture. Traditional crafts include handloom textiles and terracotta work.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Victoria_Memorial_Kolkata.jpg",
    highlights: [
      { name: "Sundarbans", image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Sundarbans_Tiger_West_Bengal.jpg" },
      { name: "Darjeeling Tea Gardens", image: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Darjeeling_Tea_Garden.jpg" }
    ]
  },
  // Union Territories
  "Andaman and Nicobar Islands": {
    capital: "Port Blair",
    population: "0.4 million",
    area: "8,249 km²",
    languages: "Hindi, English, Bengali, Tamil",
    history: "The islands were inhabited by indigenous tribes for thousands of years. Various powers including Cholas and later European colonizers had influence. The British used it as a penal colony, building the infamous Cellular Jail. During World War II, the Japanese occupied the islands briefly. Post-independence, it became a Union Territory with strategic importance in the Bay of Bengal.",
    culture: "The culture is a blend of mainland Indian influences and indigenous tribal traditions. The native tribes like Jarawa and Sentinelese maintain their ancestral ways. Settlers from various states have created a multicultural society. Island festivals, seafood cuisine, and marine conservation are cultural highlights. Tourism and fishing are important cultural and economic activities.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Cellular_Jail_Andaman.jpg",
    highlights: [
      { name: "Radhanagar Beach", image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Radhanagar_Beach_Havelock.jpg" },
      { name: "Ross Island", image: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Ross_Island_Andaman.jpg" }
    ]
  },
  "Chandigarh": {
    capital: "Chandigarh",
    population: "1.2 million",
    area: "114 km²",
    languages: "Hindi, Punjabi, English",
    history: "Chandigarh is a planned city designed by French architect Le Corbusier after partition to serve as Punjab's capital. Construction began in 1952 with modern urban planning principles. When Punjab was reorganized in 1966, both Punjab and Haryana claimed the city, leading to its status as a Union Territory serving as capital for both states.",
    culture: "Chandigarh represents modern Indian urban culture with planned sectors, gardens, and architecture. The Rock Garden by Nek Chand is a unique artistic creation. The city celebrates festivals of both Punjab and Haryana with equal enthusiasm. Modern lifestyle, educational institutions, and cultural centers define the urban culture. The city is known for its cleanliness, greenery, and quality of life.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Rock_Garden_Chandigarh.jpg",
    highlights: [
      { name: "Sukhna Lake", image: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Sukhna_Lake_Chandigarh.jpg" },
      { name: "Capitol Complex", image: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Capitol_Complex_Chandigarh.jpg" }
    ]
  },
  "Dadra and Nagar Haveli and Daman and Diu": {
    capital: "Daman",
    population: "0.6 million",
    area: "603 km²",
    languages: "Gujarati, Hindi, Marathi, English",
    history: "These territories were Portuguese colonies for over 450 years until liberation in 1961. Dadra and Nagar Haveli were liberated by freedom fighters in 1954. Daman and Diu were liberated along with Goa in 1961. They were separate Union Territories until merged in 2020 into a single Union Territory for administrative efficiency.",
    culture: "The culture reflects Portuguese influence blended with local Gujarati and tribal traditions. Architecture shows colonial influence with churches and forts. Local festivals include both Hindu celebrations and Portuguese-influenced customs. Traditional crafts include bamboo work and tribal art. The coastal areas have fishing communities with maritime traditions.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Diu_Fort_Sunset.jpg",
    highlights: [
      { name: "Diu Fort", image: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Diu_Fort_Portuguese.jpg" },
      { name: "Silvassa Tribal Museum", image: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Tribal_Museum_Silvassa.jpg" }
    ]
  },
  "Delhi": {
    capital: "New Delhi",
    population: "33.8 million",
    area: "1,484 km²",
    languages: "Hindi, English, Punjabi, Urdu",
    history: "Delhi has been continuously inhabited for over 2500 years with various cities built at different periods. It was capital of several empires including Delhi Sultanate and Mughal Empire. The British made it the capital in 1911, building New Delhi. Post-independence, it became the national capital and was designated as National Capital Territory in 1991.",
    culture: "Delhi's culture is cosmopolitan, representing all of India's diversity. The city blends ancient heritage with modernity. Festivals from all religions are celebrated. Street food culture is vibrant with chaat, paranthas, and kebabs. The city has numerous historical monuments, museums, and cultural centers. Literary and artistic traditions flourish with various cultural festivals throughout the year.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Red_Fort_Delhi_India.jpg",
    highlights: [
      { name: "India Gate", image: "https://upload.wikimedia.org/wikipedia/commons/3/36/India_Gate_New_Delhi.jpg" },
      { name: "Lotus Temple", image: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Lotus_Temple_Delhi.jpg" }
    ]
  },
  "Jammu and Kashmir": {
    capital: "Srinagar (Summer), Jammu (Winter)",
    population: "14.2 million",
    area: "222,236 km²",
    languages: "Kashmiri, Dogri, Hindi, Urdu, English",
    history: "The region has ancient Hindu and Buddhist heritage with Kashmir being known as 'Kashmir Shaivism' center. Various dynasties ruled including Kushans and local kings. Muslim rule began in 14th century. The Dogra dynasty ruled as princely state under British paramountcy. After partition, it acceded to India leading to ongoing disputes. Article 370 was abrogated in 2019, and it was reorganized into two Union Territories.",
    culture: "Kashmiri culture is unique with Sufi traditions, handicrafts, and natural beauty central to identity. The region is famous for carpets, shawls, papier-mâché, and saffron. Dogri culture in Jammu region has its own traditions and festivals. Traditional music, dance, and cuisine reflect both Hindu and Islamic influences. Despite challenges, cultural traditions of hospitality and craftsmanship continue.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Dal_Lake_Srinagar_Kashmir.jpg",
    highlights: [
      { name: "Gulmarg", image: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Gulmarg_Kashmir_Valley.jpg" },
      { name: "Vaishno Devi", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Vaishno_Devi_Temple_Jammu.jpg" }
    ]
  },
  "Ladakh": {
    capital: "Leh",
    population: "0.3 million",
    area: "59,146 km²",
    languages: "Ladakhi, Hindi, English",
    history: "Ladakh was an independent Himalayan kingdom for centuries with strong Tibetan Buddhist connections. It was ruled by the Namgyal dynasty until the 19th century. Dogra rule was established in 1834, and it became part of Jammu and Kashmir. After 2019 reorganization, Ladakh became a separate Union Territory, fulfilling long-standing demands for autonomy.",
    culture: "Ladakhi culture is predominantly Tibetan Buddhist with monasteries (gompas) as cultural centers. Festivals like Hemis, Losar, and Ladakh Festival celebrate Buddhist traditions. The culture emphasizes non-violence, compassion, and environmental harmony. Traditional arts include thangka painting, woodcarving, and textile weaving. Barley-based cuisine and butter tea reflect high-altitude adaptations. Polo and archery are traditional sports.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Thiksey_Monastery_Ladakh.jpg",
    highlights: [
      { name: "Pangong Tso", image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Pangong_Tso_Lake_Ladakh.jpg" },
      { name: "Nubra Valley", image: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Nubra_Valley_Ladakh.jpg" }
    ]
  },
  "Lakshadweep": {
    capital: "Kavaratti",
    population: "0.07 million",
    area: "32 km²",
    languages: "Malayalam, English",
    history: "The islands were inhabited by people from Kerala coast and have ancient maritime trade connections. Various rulers including Cheras, Cholas, and later Mysore kingdom had influence. The islands came under British administration as part of Madras Presidency. After independence, they became a Union Territory in 1956, renamed from Laccadive, Minicoy and Amindivi Islands to Lakshadweep in 1973.",
    culture: "Lakshadweep culture is predominantly Muslim with Malayalam influences from Kerala mainland. Coconut palm cultivation and fishing are central to island life. Traditional boat races, folk songs, and dances reflect maritime culture. The communities are close-knit with emphasis on environmental conservation. Coral reef protection and sustainable tourism are important cultural values. Traditional crafts include coir making and boat building.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Kavaratti_Island_Lakshadweep.jpg",
    highlights: [
      { name: "Agatti Island", image: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Agatti_Island_Lagoon.jpg" },
      { name: "Bangaram Island", image: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Bangaram_Island_Beach.jpg" }
    ]
  },
  "Puducherry": {
    capital: "Puducherry",
    population: "1.4 million",
    area: "479 km²",
    languages: "Tamil, French, English, Telugu",
    history: "Puducherry was established as a French colonial settlement in 1674 and remained under French control for nearly 300 years. The French influence created a unique Indo-French culture. After independence, it remained a French territory until 1954 when it was transferred to India. It became a Union Territory in 1963, showcasing successful integration of colonial heritage with Indian administration.",
    culture: "Pondicherry culture uniquely blends French colonial heritage with Tamil traditions. French architecture, cuisine, and street names coexist with Tamil culture. Aurobindo Ashram and Auroville represent spiritual and international cultural dimensions. The French Quarter maintains colonial charm while Tamil areas celebrate traditional festivals. French bread, wine culture, and Tamil cuisine create a distinctive cultural fusion. Art, literature, and spirituality are important cultural elements.",
    mainImage: "https://upload.wikimedia.org/wikipedia/commons/3/3f/French_Quarter_Puducherry.jpg",
    highlights: [
      { name: "Auroville", image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Auroville_Matrimandir.jpg" },
      { name: "Promenade Beach", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Promenade_Beach_Puducherry.jpg" }
    ]
  }
};

export default function Page() {
  const [hovered, setHovered] = useState<string>("India");

  const { viewBox, locations } = India as {
    viewBox: string;
    locations: Location[];
  };

  const selectedData = stateData[hovered];

  return (
    <div className="flex items-center justify-between min-h-screen bg-gray-50 gap-6 p-6">
      {/* LEFT - State History */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        {selectedData ? (
          <>
            <h2 className="text-3xl font-bold mb-4 text-blue-800">{hovered}</h2>
            <div className="space-y-3 mb-4">
              <p className="text-gray-700"><span className="font-semibold text-blue-600">Capital:</span> {selectedData.capital}</p>
              <p className="text-gray-700"><span className="font-semibold text-blue-600">Population:</span> {selectedData.population}</p>
              <p className="text-gray-700"><span className="font-semibold text-blue-600">Area:</span> {selectedData.area}</p>
              <p className="text-gray-700"><span className="font-semibold text-blue-600">Languages:</span> {selectedData.languages}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-xl font-semibold mb-3 text-amber-700 flex items-center">
                <span className="mr-2">📜</span> Historical Background
              </h3>
              <p className="text-gray-700 leading-relaxed text-justify">{selectedData.history}</p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <span className="text-6xl mb-4 block">🏛️</span>
              <p className="text-lg">Hover over a state to explore its rich history</p>
            </div>
          </div>
        )}
      </div>

      {/* CENTER - Map */}
      <div className="flex flex-col items-center justify-center bg-gray-50">
        <svg
          viewBox={viewBox}
          xmlns="http://www.w3.org/2000/svg"
          className="w-[600px] h-auto rounded-xl shadow-xl bg-white p-4"
        >
          {locations.map((loc) => (
            <path
              key={loc.id}
              d={loc.path}
              fill={hovered === loc.name ? "#3b82f6" : "#e5e7eb"}
              stroke="#374151"
              strokeWidth={0.5}
              className="cursor-pointer transition-all duration-200 hover:fill-blue-400"
              onMouseEnter={() => setHovered(loc.name)}
              onMouseLeave={() => setHovered("India")}
            />
          ))}
        </svg>

        {hovered && hovered !== "India" && (
          <div className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg rounded-full shadow-lg">
            <span className="font-semibold">{hovered}</span>
          </div>
        )}
      </div>

      {/* RIGHT - Cultural Information */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        {selectedData ? (
          <>
            <div className="mb-6">
              <img
                src={selectedData.mainImage}
                alt={hovered}
                className="w-full h-64 object-cover rounded-xl shadow-md"
              />
            </div>
            
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-xl font-semibold mb-3 text-green-700 flex items-center">
                <span className="mr-2">🎨</span> Cultural Heritage
              </h3>
              <p className="text-gray-700 leading-relaxed text-justify">{selectedData.culture}</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-3 text-purple-700 flex items-center">
                <span className="mr-2">✨</span> Cultural Highlights
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {selectedData.highlights.map((highlight) => (
                  <div key={highlight.name} className="text-center bg-gray-50 rounded-lg p-3">
                    <img
                      src={highlight.image}
                      alt={highlight.name}
                      className="w-full h-28 object-cover rounded-lg shadow-sm mb-2"
                    />
                    <p className="text-sm font-medium text-gray-700">{highlight.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <span className="text-6xl mb-4 block">🎭</span>
              <p className="text-lg">Hover over a state to discover its vibrant culture</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}