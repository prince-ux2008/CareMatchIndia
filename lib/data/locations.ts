import { LocationHierarchy } from '../types';

export interface StateInfo {
  name: string;
  code: string;
  capital: string;
  hasRichData: boolean;
  districtsCount: number;
}

export const INDIAN_STATES: StateInfo[] = [
  { name: 'All India', code: 'ALL', capital: 'New Delhi', hasRichData: true, districtsCount: 750 },
  { name: 'Punjab', code: 'PB', capital: 'Chandigarh', hasRichData: true, districtsCount: 23 },
  { name: 'Delhi NCR', code: 'DL', capital: 'New Delhi', hasRichData: true, districtsCount: 11 },
  { name: 'Maharashtra', code: 'MH', capital: 'Mumbai', hasRichData: true, districtsCount: 36 },
  { name: 'Karnataka', code: 'KA', capital: 'Bengaluru', hasRichData: true, districtsCount: 31 },
  { name: 'Tamil Nadu', code: 'TN', capital: 'Chennai', hasRichData: true, districtsCount: 38 },
  { name: 'Uttar Pradesh', code: 'UP', capital: 'Lucknow', hasRichData: true, districtsCount: 75 },
  { name: 'Haryana', code: 'HR', capital: 'Chandigarh', hasRichData: true, districtsCount: 22 },
  { name: 'Gujarat', code: 'GJ', capital: 'Gandhinagar', hasRichData: true, districtsCount: 33 },
  { name: 'Rajasthan', code: 'RJ', capital: 'Jaipur', hasRichData: true, districtsCount: 50 },
  { name: 'Telangana', code: 'TG', capital: 'Hyderabad', hasRichData: true, districtsCount: 33 },
  { name: 'West Bengal', code: 'WB', capital: 'Kolkata', hasRichData: true, districtsCount: 23 },
  { name: 'Kerala', code: 'KL', capital: 'Thiruvananthapuram', hasRichData: true, districtsCount: 14 },
];

export const LOCATION_DATA: Record<string, LocationHierarchy> = {
  Punjab: {
    state: 'Punjab',
    stateCode: 'PB',
    districts: [
      {
        name: 'Jalandhar',
        cities: [
          { name: 'Jalandhar', latitude: 31.326, longitude: 75.5762, pincode: '144001' },
          { name: 'Model Town (Jalandhar)', latitude: 31.3092, longitude: 75.582, pincode: '144003' },
          { name: 'Rama Mandi', latitude: 31.3197, longitude: 75.6269, pincode: '144005' },
          { name: 'Kartarpur', latitude: 31.4395, longitude: 75.4988, pincode: '144801' },
          { name: 'Nakodar', latitude: 31.1278, longitude: 75.4746, pincode: '144040' },
          { name: 'Phillaur', latitude: 31.0264, longitude: 75.7876, pincode: '144410' },
          { name: 'Shahkot', latitude: 31.0811, longitude: 75.3402, pincode: '144702' },
          { name: 'Adampur', latitude: 31.4304, longitude: 75.7262, pincode: '144102' },
          { name: 'Goraya', latitude: 31.1312, longitude: 75.7687, pincode: '144409' },
        ],
      },
      {
        name: 'Ludhiana',
        cities: [
          { name: 'Ludhiana', latitude: 30.901, longitude: 75.8573, pincode: '141001' },
          { name: 'Civil Lines (Ludhiana)', latitude: 30.9069, longitude: 75.8398, pincode: '141001' },
          { name: 'Sarabha Nagar', latitude: 30.8872, longitude: 75.8115, pincode: '141002' },
          { name: 'Khanna', latitude: 30.7071, longitude: 76.2167, pincode: '141401' },
          { name: 'Jagraon', latitude: 30.7853, longitude: 75.4784, pincode: '142026' },
          { name: 'Samrala', latitude: 30.8354, longitude: 76.1924, pincode: '141114' },
          { name: 'Raikot', latitude: 30.6489, longitude: 75.5996, pincode: '141109' },
          { name: 'Doraha', latitude: 30.8037, longitude: 76.0354, pincode: '141421' },
          { name: 'Sahnewal', latitude: 30.8415, longitude: 75.9868, pincode: '141120' },
        ],
      },
      {
        name: 'Amritsar',
        cities: [
          { name: 'Amritsar', latitude: 31.634, longitude: 74.8723, pincode: '143001' },
          { name: 'Majitha Road', latitude: 31.6578, longitude: 74.8812, pincode: '143001' },
          { name: 'Ranjit Avenue', latitude: 31.6519, longitude: 74.8617, pincode: '143001' },
          { name: 'Ajnala', latitude: 31.8415, longitude: 74.7618, pincode: '143102' },
          { name: 'Baba Bakala', latitude: 31.5583, longitude: 75.2573, pincode: '143201' },
          { name: 'Jandiala Guru', latitude: 31.5645, longitude: 75.0232, pincode: '143115' },
          { name: 'Attari', latitude: 31.6033, longitude: 74.6041, pincode: '143108' },
        ],
      },
      {
        name: 'SAS Nagar (Mohali) / Chandigarh',
        cities: [
          { name: 'Chandigarh', latitude: 30.7333, longitude: 76.7794, pincode: '160017' },
          { name: 'Mohali', latitude: 30.7046, longitude: 76.7179, pincode: '160055' },
          { name: 'Sector 62 (Mohali)', latitude: 30.6975, longitude: 76.7262, pincode: '160062' },
          { name: 'Zirakpur', latitude: 30.6425, longitude: 76.8173, pincode: '140603' },
          { name: 'Kharar', latitude: 30.7455, longitude: 76.6433, pincode: '140301' },
          { name: 'Dera Bassi', latitude: 30.5847, longitude: 76.8441, pincode: '140507' },
          { name: 'Kurali', latitude: 30.8267, longitude: 76.5746, pincode: '140103' },
          { name: 'New Chandigarh (Mullanpur)', latitude: 30.7891, longitude: 76.7321, pincode: '140901' },
        ],
      },
      {
        name: 'Patiala',
        cities: [
          { name: 'Patiala', latitude: 30.3398, longitude: 76.3869, pincode: '147001' },
          { name: 'Rajpura', latitude: 30.4839, longitude: 76.5939, pincode: '140401' },
          { name: 'Nabha', latitude: 30.3752, longitude: 76.1527, pincode: '147201' },
          { name: 'Samana', latitude: 30.1534, longitude: 76.1927, pincode: '147101' },
          { name: 'Patran', latitude: 29.9576, longitude: 76.0645, pincode: '147005' },
          { name: 'Sanaur', latitude: 30.2977, longitude: 76.4526, pincode: '147103' },
        ],
      },
      {
        name: 'Bathinda',
        cities: [
          { name: 'Bathinda', latitude: 30.211, longitude: 74.9455, pincode: '151001' },
          { name: 'Rampura Phul', latitude: 30.2677, longitude: 75.2366, pincode: '151103' },
          { name: 'Talwandi Sabo', latitude: 29.9856, longitude: 75.0877, pincode: '151302' },
          { name: 'Maur Mandi', latitude: 30.0768, longitude: 75.2396, pincode: '151509' },
          { name: 'Goniana', latitude: 30.3168, longitude: 74.9084, pincode: '151201' },
        ],
      },
      {
        name: 'Hoshiarpur',
        cities: [
          { name: 'Hoshiarpur', latitude: 31.5273, longitude: 75.9143, pincode: '146001' },
          { name: 'Dasuya', latitude: 31.8152, longitude: 75.6599, pincode: '144205' },
          { name: 'Mukerian', latitude: 31.9567, longitude: 75.6174, pincode: '144211' },
          { name: 'Garhshankar', latitude: 31.2152, longitude: 76.1465, pincode: '144527' },
          { name: 'Tanda Urmar', latitude: 31.6664, longitude: 75.6415, pincode: '144204' },
        ],
      },
      {
        name: 'Kapurthala',
        cities: [
          { name: 'Kapurthala', latitude: 31.38, longitude: 75.38, pincode: '144601' },
          { name: 'Phagwara', latitude: 31.224, longitude: 75.7708, pincode: '144401' },
          { name: 'Sultanpur Lodhi', latitude: 31.2166, longitude: 75.1979, pincode: '144626' },
          { name: 'Bholath', latitude: 31.5348, longitude: 75.5178, pincode: '144622' },
        ],
      },
      {
        name: 'Faridkot',
        cities: [
          { name: 'Faridkot', latitude: 30.6769, longitude: 74.7583, pincode: '151203' },
          { name: 'Kotkapura', latitude: 30.5824, longitude: 74.8286, pincode: '151204' },
          { name: 'Jaitu', latitude: 30.4398, longitude: 74.8872, pincode: '151202' },
        ],
      },
      {
        name: 'Pathankot',
        cities: [
          { name: 'Pathankot', latitude: 32.2689, longitude: 75.6497, pincode: '145001' },
          { name: 'Sujanpur', latitude: 32.3168, longitude: 75.6174, pincode: '145023' },
        ],
      },
      {
        name: 'Moga',
        cities: [
          { name: 'Moga', latitude: 30.823, longitude: 75.1734, pincode: '142001' },
          { name: 'Bagha Purana', latitude: 30.6868, longitude: 75.1278, pincode: '142038' },
        ],
      },
      {
        name: 'Sangrur',
        cities: [
          { name: 'Sangrur', latitude: 30.2458, longitude: 75.8421, pincode: '148001' },
          { name: 'Sunam', latitude: 30.1315, longitude: 75.7988, pincode: '148028' },
        ],
      },
    ],
  },
  'Delhi NCR': {
    state: 'Delhi NCR',
    stateCode: 'DL',
    districts: [
      {
        name: 'New Delhi / AIIMS Campus',
        cities: [
          { name: 'Ansari Nagar (AIIMS & Safdarjung)', latitude: 28.5672, longitude: 77.21, pincode: '110029' },
          { name: 'Connaught Place', latitude: 28.6304, longitude: 77.2177, pincode: '110001' },
          { name: 'Chanakyapuri', latitude: 28.5912, longitude: 77.1923, pincode: '110021' },
        ],
      },
      {
        name: 'South Delhi',
        cities: [
          { name: 'Saket (Max Healthcare Hub)', latitude: 28.5244, longitude: 77.2167, pincode: '110017' },
          { name: 'Hauz Khas', latitude: 28.5494, longitude: 77.2001, pincode: '110016' },
          { name: 'Vasant Kunj (ILBS & Fortis)', latitude: 28.5293, longitude: 77.1517, pincode: '110070' },
          { name: 'Okhla (Apollo Indraprastha)', latitude: 28.5355, longitude: 77.2882, pincode: '110025' },
        ],
      },
      {
        name: 'Gurugram (Haryana / NCR)',
        cities: [
          { name: 'Medanta / Sector 38', latitude: 28.4395, longitude: 77.0423, pincode: '122001' },
          { name: 'DLF Cyber City / Sector 44 (Fortis)', latitude: 28.4595, longitude: 77.0726, pincode: '122002' },
          { name: 'Artemis Hospital / Sector 51', latitude: 28.4312, longitude: 77.0789, pincode: '122003' },
        ],
      },
      {
        name: 'Noida / Gautam Buddha Nagar',
        cities: [
          { name: 'Noida Sector 62 (Fortis)', latitude: 28.6212, longitude: 77.3645, pincode: '201309' },
          { name: 'Noida Sector 128 (Jaypee)', latitude: 28.5142, longitude: 77.3712, pincode: '201304' },
          { name: 'Greater Noida', latitude: 28.4744, longitude: 77.504, pincode: '201310' },
        ],
      },
    ],
  },
  Maharashtra: {
    state: 'Maharashtra',
    stateCode: 'MH',
    districts: [
      {
        name: 'Mumbai',
        cities: [
          { name: 'Parel (Tata Memorial & KEM)', latitude: 19.0028, longitude: 72.8423, pincode: '400012' },
          { name: 'Mumbai Central (Wockhardt & Nair)', latitude: 18.9712, longitude: 72.8189, pincode: '400008' },
          { name: 'Andheri West (Kokilaben Hospital)', latitude: 19.1312, longitude: 72.8256, pincode: '400053' },
          { name: 'Mahim (Hinduja Hospital)', latitude: 19.0345, longitude: 72.8412, pincode: '400016' },
          { name: 'Bandra (Lilavati Hospital)', latitude: 19.0512, longitude: 72.8289, pincode: '400050' },
        ],
      },
      {
        name: 'Pune',
        cities: [
          { name: 'Shivajinagar / Sassoon General', latitude: 18.5308, longitude: 73.8475, pincode: '411005' },
          { name: 'Sangamvadi (Ruby Hall Clinic)', latitude: 18.5362, longitude: 73.8789, pincode: '411001' },
          { name: 'Kothrud (Deenanath Mangeshkar)', latitude: 18.5074, longitude: 73.8077, pincode: '411038' },
        ],
      },
      {
        name: 'Nagpur',
        cities: [
          { name: 'AIIMS Nagpur (MIHAN)', latitude: 21.0645, longitude: 79.0512, pincode: '441108' },
          { name: 'Nagpur Central (GMC Nagpur)', latitude: 21.1458, longitude: 79.0882, pincode: '440001' },
        ],
      },
    ],
  },
  Karnataka: {
    state: 'Karnataka',
    stateCode: 'KA',
    districts: [
      {
        name: 'Bengaluru Urban',
        cities: [
          { name: 'Hosur Road (Narayana Health City)', latitude: 12.8256, longitude: 77.6892, pincode: '560099' },
          { name: 'Old Airport Road (Manipal Hospital)', latitude: 12.9582, longitude: 77.6489, pincode: '560017' },
          { name: 'Wilson Garden (NIMHANS)', latitude: 12.9431, longitude: 77.5975, pincode: '560029' },
          { name: 'Victoria Hospital Campus', latitude: 12.9634, longitude: 77.5742, pincode: '560002' },
          { name: 'Bannerghatta Road (Apollo & Fortis)', latitude: 12.8912, longitude: 77.5982, pincode: '560076' },
        ],
      },
      {
        name: 'Mysuru',
        cities: [
          { name: 'Mysuru Central (KR Hospital & Apollo)', latitude: 12.3115, longitude: 76.6542, pincode: '570001' },
        ],
      },
      {
        name: 'Mangaluru',
        cities: [
          { name: 'Mangaluru (KMC & Father Muller)', latitude: 12.8708, longitude: 74.8812, pincode: '575001' },
        ],
      },
    ],
  },
  'Tamil Nadu': {
    state: 'Tamil Nadu',
    stateCode: 'TN',
    districts: [
      {
        name: 'Chennai',
        cities: [
          { name: 'Greams Road (Apollo Main Hospital)', latitude: 13.0612, longitude: 77.2512, pincode: '600006' },
          { name: 'Park Town (Madras Medical College & RGGGH)', latitude: 13.0827, longitude: 80.2707, pincode: '600003' },
          { name: 'Vadapalani (SIMS Hospital)', latitude: 13.0512, longitude: 80.2115, pincode: '600026' },
          { name: 'Adyar (Cancer Institute WIA)', latitude: 13.0012, longitude: 80.2562, pincode: '600020' },
        ],
      },
      {
        name: 'Vellore',
        cities: [
          { name: 'Vellore (Christian Medical College - CMC)', latitude: 12.9249, longitude: 79.1352, pincode: '632004' },
          { name: 'Ranipet Campus (CMC New Campus)', latitude: 12.9612, longitude: 79.2812, pincode: '632401' },
        ],
      },
      {
        name: 'Coimbatore',
        cities: [
          { name: 'Coimbatore (PSG & Kovai Medical Center)', latitude: 11.0168, longitude: 76.9558, pincode: '641014' },
        ],
      },
    ],
  },
  'Uttar Pradesh': {
    state: 'Uttar Pradesh',
    stateCode: 'UP',
    districts: [
      {
        name: 'Lucknow',
        cities: [
          { name: 'Raebareli Road (SGPGI Lucknow)', latitude: 26.7456, longitude: 80.9389, pincode: '226014' },
          { name: 'Chowk (King George Medical University - KGMU)', latitude: 26.8689, longitude: 80.9124, pincode: '226003' },
          { name: 'Amar Shaheed Path (Medanta Lucknow)', latitude: 26.7812, longitude: 80.9982, pincode: '226030' },
        ],
      },
      {
        name: 'Varanasi',
        cities: [
          { name: 'BHU Campus (Sir Sunderlal Hospital & IMS BHU)', latitude: 25.2677, longitude: 82.9912, pincode: '221005' },
        ],
      },
      {
        name: 'Kanpur',
        cities: [
          { name: 'GSVM Medical College Campus', latitude: 26.4712, longitude: 80.3215, pincode: '208002' },
        ],
      },
    ],
  },
  Telangana: {
    state: 'Telangana',
    stateCode: 'TG',
    districts: [
      {
        name: 'Hyderabad',
        cities: [
          { name: 'Jubilee Hills (Apollo Health City)', latitude: 17.4239, longitude: 78.4112, pincode: '500033' },
          { name: 'Punjagutta (NIMS Hospital)', latitude: 17.4256, longitude: 78.4512, pincode: '500082' },
          { name: 'Banjara Hills (KIMS & Care Hospital)', latitude: 17.4156, longitude: 78.4412, pincode: '500034' },
          { name: 'Gachibowli (AIG Hospitals - Asian Institute)', latitude: 17.4412, longitude: 78.3612, pincode: '500032' },
        ],
      },
    ],
  },
  'West Bengal': {
    state: 'West Bengal',
    stateCode: 'WB',
    districts: [
      {
        name: 'Kolkata',
        cities: [
          { name: 'SSKM Hospital / IPGMER Campus', latitude: 22.5398, longitude: 88.3425, pincode: '700020' },
          { name: 'EM Bypass (Apollo Multispecialty Kolkata)', latitude: 22.5689, longitude: 88.4012, pincode: '700054' },
          { name: 'Mukundapur (Rabindranath Tagore International RTIICS)', latitude: 22.4812, longitude: 88.3982, pincode: '700099' },
          { name: 'Salt Lake (AMRI & Medica)', latitude: 22.5812, longitude: 88.4112, pincode: '700098' },
        ],
      },
    ],
  },
  Gujarat: {
    state: 'Gujarat',
    stateCode: 'GJ',
    districts: [
      {
        name: 'Ahmedabad',
        cities: [
          { name: 'Asarwa (Civil Hospital & UN Mehta Heart Institute)', latitude: 23.0512, longitude: 72.6012, pincode: '380016' },
          { name: 'SG Highway (Apollo & Zydus Hospital)', latitude: 23.0789, longitude: 72.5189, pincode: '380054' },
        ],
      },
      {
        name: 'Surat',
        cities: [
          { name: 'Surat (New Civil Hospital & Kiran Hospital)', latitude: 21.1702, longitude: 72.8311, pincode: '395001' },
        ],
      },
    ],
  },
  Rajasthan: {
    state: 'Rajasthan',
    stateCode: 'RJ',
    districts: [
      {
        name: 'Jaipur',
        cities: [
          { name: 'JLN Marg (SMS Medical College & Hospital)', latitude: 26.8912, longitude: 75.8189, pincode: '302004' },
          { name: 'Malviya Nagar (Fortis & EHCC)', latitude: 26.8512, longitude: 75.8089, pincode: '302017' },
        ],
      },
      {
        name: 'Jodhpur',
        cities: [
          { name: 'Basni (AIIMS Jodhpur)', latitude: 26.2412, longitude: 73.0112, pincode: '342005' },
        ],
      },
    ],
  },
  Kerala: {
    state: 'Kerala',
    stateCode: 'KL',
    districts: [
      {
        name: 'Kochi / Ernakulam',
        cities: [
          { name: 'Edappally (Amrita Hospital - AIMS)', latitude: 10.0312, longitude: 76.2912, pincode: '682041' },
          { name: 'Kochi (Aster Medcity)', latitude: 10.0512, longitude: 76.2612, pincode: '682027' },
        ],
      },
      {
        name: 'Thiruvananthapuram',
        cities: [
          { name: 'Medical College Campus (GMC Trivandrum & SCTIMST)', latitude: 8.5241, longitude: 76.9366, pincode: '695011' },
        ],
      },
    ],
  },
  Haryana: {
    state: 'Haryana',
    stateCode: 'HR',
    districts: [
      {
        name: 'Gurugram',
        cities: [
          { name: 'Sector 38 (Medanta The Medicity)', latitude: 28.4395, longitude: 77.0423, pincode: '122001' },
          { name: 'Sector 44 (Fortis Memorial Research Institute)', latitude: 28.4595, longitude: 77.0726, pincode: '122002' },
        ],
      },
      {
        name: 'Faridabad',
        cities: [
          { name: 'Sector 88 (Amrita Hospital Faridabad)', latitude: 28.4089, longitude: 77.3178, pincode: '121002' },
        ],
      },
      {
        name: 'Ambala',
        cities: [
          { name: 'Ambala Cantt Civil Hospital', latitude: 30.3782, longitude: 76.7767, pincode: '134003' },
        ],
      },
    ],
  },
};

export function getDistrictsForState(stateName: string): string[] {
  if (!stateName || stateName === 'All India') {
    return ['All Districts', 'Jalandhar', 'Ludhiana', 'Amritsar', 'Mohali', 'Ahmedabad', 'Mumbai', 'Kolkata', 'Bengaluru', 'Chennai', 'Lucknow', 'Jaipur', 'Hyderabad', 'Kochi'];
  }
  const stateData = LOCATION_DATA[stateName];
  if (!stateData) {
    return ['Central District'];
  }
  return stateData.districts.map(d => d.name);
}

export function getCitiesForDistrict(stateName: string, districtName?: string): string[] {
  const stateData = LOCATION_DATA[stateName] || LOCATION_DATA['Punjab'];
  if (!stateData) return ['Central Hub'];
  if (!districtName || districtName === 'All Districts') {
    const allCities: string[] = [];
    stateData.districts.forEach(d => {
      d.cities.forEach(c => allCities.push(c.name));
    });
    return allCities;
  }
  const dist = stateData.districts.find(d => d.name.toLowerCase() === districtName.toLowerCase());
  if (!dist) return stateData.districts[0]?.cities.map(c => c.name) || ['Central Hub'];
  return dist.cities.map(c => c.name);
}

export function getDefaultCityForState(stateName: string): string {
  if (!stateName || stateName === 'All India') return 'All India Hubs';
  const stateData = LOCATION_DATA[stateName];
  if (!stateData || !stateData.districts[0]?.cities[0]) return 'Central Hub';
  return stateData.districts[0].cities[0].name;
}

export function getCoordinatesForCity(state: string, queryCityOrLoc: string): { latitude: number; longitude: number; resolvedName: string } {
  const q = (queryCityOrLoc || '').toLowerCase().trim();
  
  if (q === 'all india' || q === 'all india hubs' || state === 'All India') {
    return { latitude: 22.5937, longitude: 78.9629, resolvedName: 'National Geographic Center (Nagpur/All India)' };
  }

  // 1. Search in current state first
  const stateData = LOCATION_DATA[state] || LOCATION_DATA['Punjab'];
  if (stateData) {
    for (const dist of stateData.districts) {
      if (dist.name.toLowerCase().includes(q) || q.includes(dist.name.toLowerCase())) {
        return { latitude: dist.cities[0].latitude, longitude: dist.cities[0].longitude, resolvedName: dist.name };
      }
      for (const c of dist.cities) {
        const cLower = c.name.toLowerCase();
        if (cLower.includes(q) || q.includes(cLower.split(' ')[0]) || q.includes(cLower)) {
          return { latitude: c.latitude, longitude: c.longitude, resolvedName: c.name };
        }
      }
    }
  }

  // 2. Global search across all northern Indian states
  for (const st of Object.values(LOCATION_DATA)) {
    for (const dist of st.districts) {
      if (dist.name.toLowerCase().includes(q) || q.includes(dist.name.toLowerCase())) {
        return { latitude: dist.cities[0].latitude, longitude: dist.cities[0].longitude, resolvedName: dist.name };
      }
      for (const c of dist.cities) {
        const cLower = c.name.toLowerCase();
        if (cLower.includes(q) || q.includes(cLower.split(' ')[0])) {
          return { latitude: c.latitude, longitude: c.longitude, resolvedName: c.name };
        }
      }
    }
  }

  // Default to state capital if state known
  if (LOCATION_DATA[state]?.districts[0]?.cities[0]) {
    const fallback = LOCATION_DATA[state].districts[0].cities[0];
    return { latitude: fallback.latitude, longitude: fallback.longitude, resolvedName: fallback.name };
  }

  // Default to Jalandhar coordinates if not found
  return { latitude: 31.326, longitude: 75.5762, resolvedName: 'Jalandhar (Default Center)' };
}

