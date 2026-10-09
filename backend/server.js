
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const treatmentNames = [
  "Knee Replacement", "Heart Surgery",
  "Cataract Surgery", "Dental Treatment",
  "Root Canal", "Eye Surgery",
  "Kidney Stone Treatment", "Appendix Surgery",
  "Normal Delivery", "C-Section Delivery",
  "MRI Scan", "CT Scan", "X-Ray",
  "Blood Test", "Diabetes Treatment",
  "Skin Treatment", "ENT Treatment",
  "Orthopedic Treatment", "Physiotherapy",
  "General Checkup", "Neurology",
  "Cardiology", "Gastroenterology",
  "Urology", "Cancer Treatment",
  "Pediatric Care", "Emergency Care"
];

const treatments = treatmentNames.map((name, i) => ({
  id: i + 1,
  name
}));

const hospitalRecords = [
  // ========== DELHI ==========
  {
    id: 1,
    name: "Indraprastha Apollo Hospitals",
    city: "Delhi",
    address: "Sarita Vihar, Delhi Mathura Road, New Delhi",
    phone: "01171791090",
    treatments: [
      "Heart Surgery", "Cardiology",
      "Cancer Treatment", "Pediatric Care",
      "Gastroenterology", "Neurology",
      "Urology", "Orthopedic Treatment",
      "ENT Treatment", "Emergency Care",
      "MRI Scan", "CT Scan"
    ],
    sourceUrl:
      "https://www.apollohospitals.com/region/delhi/about-us/indraprastha-apollo-hospital/",
    verificationStatus: "official-website"
  },
  {
    id: 2,
    name: "Max Super Speciality Hospital Saket",
    city: "Delhi",
    address: "1-2 Press Enclave Road, Saket, New Delhi 110017",
    phone: "01126515050",
    treatments: [
      "Heart Surgery", "Cardiology",
      "Cancer Treatment", "Neurology",
      "Gastroenterology", "Urology",
      "Orthopedic Treatment"
    ],
    sourceUrl:
      "https://www.maxhealthcare.in/hospital-network/max-super-speciality-hospital-saket",
    verificationStatus: "official-website"
  },
  {
    id: 3,
    name: "Max Smart Super Speciality Hospital Saket",
    city: "Delhi",
    address: "Press Enclave Marg, Saket District Centre, New Delhi 110017",
    phone: "9268880303",
    treatments: [
      "Cardiology", "Neurology",
      "Urology", "Orthopedic Treatment",
      "Pediatric Care", "MRI Scan",
      "CT Scan", "Cancer Treatment"
    ],
    sourceUrl:
      "https://www.maxhealthcare.in/hospital-network/max-smart-super-speciality-hospital-saket",
    verificationStatus: "official-website"
  },

  // ========== NOIDA ==========
  {
    id: 4,
    name: "Fortis Hospital Noida",
    city: "Noida",
    address: "B-22, Sector 62, Noida, Uttar Pradesh 201301",
    phone: "8447717722",
    treatments: [
      "Knee Replacement", "Heart Surgery",
      "Cardiology", "Neurology",
      "Orthopedic Treatment", "Cancer Treatment",
      "Gastroenterology", "Urology",
      "Emergency Care"
    ],
    sourceUrl:
      "https://www.fortishealthcare.com/location/fortis-hospital-noida",
    verificationStatus: "official-website"
  },
  {
    id: 5,
    name: "Medanta Noida",
    city: "Noida",
    address: "F Block, Sector 50, Noida, Uttar Pradesh 201303",
    phone: "8800001068",
    treatments: [
      "Heart Surgery", "Cardiology",
      "Cancer Treatment", "Neurology",
      "Gastroenterology", "Orthopedic Treatment",
      "MRI Scan", "CT Scan", "X-Ray",
      "Dental Treatment", "Cataract Surgery",
      "Eye Surgery", "Pediatric Care",
      "ENT Treatment", "Emergency Care"
    ],
    sourceUrl:
      "https://www.medanta.org/hospitals-near-me/noida-hospital",
    verificationStatus: "official-website"
  },

  // ========== GURUGRAM / GURGAON ==========
  {
    id: 6,
    name: "Medanta The Medicity",
    city: "Gurugram",
    address: "CH Baktawar Singh Road, Sector 38, Gurugram, Haryana 122001",
    phone: "8800001068",
    treatments: [
      "Heart Surgery", "Cardiology",
      "Cancer Treatment", "Neurology",
      "Gastroenterology", "Orthopedic Treatment",
      "Urology", "Pediatric Care"
    ],
    sourceUrl:
      "https://www.medanta.org/hospitals-near-me/gurugram-hospital",
    verificationStatus: "official-website"
  },
  {
    id: 7,
    name: "Artemis Hospital",
    city: "Gurugram",
    address: "Sector 51, Gurugram, Haryana 122001",
    phone: "01244511111",
    treatments: [
      "Knee Replacement", "Heart Surgery",
      "Cardiology", "Cancer Treatment",
      "Neurology", "Gastroenterology",
      "Orthopedic Treatment", "Dental Treatment",
      "Skin Treatment", "Diabetes Treatment",
      "Pediatric Care", "Emergency Care"
    ],
    sourceUrl:
      "https://www.artemishospitals.com/specialities",
    verificationStatus: "official-website"
  },
  {
    id: 8,
    name: "Fortis Memorial Research Institute",
    city: "Gurugram",
    address: "Sector 44, Gurugram, Haryana 122002",
    phone: "9205010100",
    treatments: [
      "Cardiology", "Cancer Treatment",
      "Gastroenterology", "Neurology",
      "Emergency Care"
    ],
    sourceUrl:
      "https://www.fortishealthcare.com/location/fortis-memorial-research-institute-gurgaon",
    verificationStatus: "official-website"
  },

  // ========== JAMNER ==========
  // These are earlier collected public listings.
  // Contacts/addresses require rechecking.
  // Specialty evidence is weaker than official websites.

  {
    id: 9,
    name: "Rubystar Hospital",
    city: "Jamner",
    address: "BOT Complex, Pachora Road, Jamner 424206",
    phone: "8788390646",
    treatments: [],
    sourceUrl: "https://rubystarhospital.com/locations/",
    verificationStatus: "listing-unconfirmed"
  },
  {
    id: 10,
    name: "Samarth Hospital",
    city: "Jamner",
    address: "Bhakti Park, Shivaji Nagar, Jamner 424206",
    phone: "02580299233",
    treatments: ["Skin Treatment", "Orthopedic Treatment"],
    sourceUrl: null,
    verificationStatus: "public-specialty-listing"
  },
  {
    id: 11,
    name: "Kamal Hospital and Maternity Home",
    city: "Jamner",
    address: "Shivaji Nagar, Jalgaon Road, Jamner 424206",
    phone: "02580232450",
    treatments: [],
    sourceUrl: null,
    verificationStatus: "listing-unconfirmed"
  },
  {
    id: 12,
    name: "New Asha Hospital",
    city: "Jamner",
    address: "Prakash Nagar, Jalgaon Road, Jamner 424206",
    phone: "02580230403",
    treatments: [],
    sourceUrl: null,
    verificationStatus: "listing-unconfirmed"
  },
  {
    id: 13,
    name: "AAI Hospital",
    city: "Jamner",
    address: "Supari Bag, Anand Nagar, Jamner 424206",
    phone: "8999800366",
    treatments: ["Pediatric Care"],
    sourceUrl: null,
    verificationStatus: "public-specialty-listing"
  },
  {
    id: 14,
    name: "Shiv Chhatrapati Hospital and Dental Clinic",
    city: "Jamner",
    address: "Pachora-Jamner Road, Ayodhya Nagar, Jamner 424206",
    phone: "9225513686",
    treatments: ["Dental Treatment"],
    sourceUrl: null,
    verificationStatus: "public-specialty-listing"
  },
  {
    id: 15,
    name: "Siddhivinayak Hospital",
    city: "Jamner",
    address: "Waki Road, Jamner 424206",
    phone: "02580230438",
    treatments: [],
    sourceUrl: null,
    verificationStatus: "listing-unconfirmed"
  },
  {
    id: 16,
    name: "Srushti Balrugnalay",
    city: "Jamner",
    address: "Pachora Road, Jamner 424206",
    phone: "02580233533",
    treatments: [],
    sourceUrl: null,
    verificationStatus: "listing-unconfirmed"
  },
  {
    id: 17,
    name: "Meera Superspeciality Hospital",
    city: "Jamner",
    address: "Jalgaon Road, Jamner",
    phone: null,
    treatments: [],
    sourceUrl: null,
    verificationStatus: "listing-unconfirmed"
  },
  {
    id: 18,
    name: "Sona Hospital and Maternity Home",
    city: "Jamner",
    address: "Anand Nagar, Jamner",
    phone: null,
    treatments: [],
    sourceUrl: null,
    verificationStatus: "listing-unconfirmed"
  },
  {
    id: 19,
    name: "RK Hospital",
    city: "Jamner",
    address: "Waki Road, Jamner",
    phone: "8788418065",
    treatments: [],
    sourceUrl: null,
    verificationStatus: "listing-unconfirmed"
  },
  {
    id: 20,
    name: "Ashirwad Hospital",
    city: "Jamner",
    address: "Pachora-Jamner Road, Jamner",
    phone: "02580299370",
    treatments: [],
    sourceUrl: null,
    verificationStatus: "listing-unconfirmed"
  },
  {
    id: 21,
    name: "Kaveesh Hospital",
    city: "Jamner",
    address: "Guru Ganesh Nagar, Pachora-Jamner Road, Jamner",
    phone: "9175579701",
    treatments: ["Pediatric Care"],
    sourceUrl: null,
    verificationStatus: "public-specialty-listing"
  },
  {
    id: 22,
    name: "Shivshakti Hospital",
    city: "Jamner",
    address: "Patel Nagar, Jamner",
    phone: null,
    treatments: [],
    sourceUrl: null,
    verificationStatus: "listing-unconfirmed"
  },
  {
    id: 23,
    name: "Al Masih Hospital and Maternity Home",
    city: "Jamner",
    address: "Bashir Nagar, Jamner",
    phone: null,
    treatments: [],
    sourceUrl: null,
    verificationStatus: "listing-unconfirmed"
  },
  {
    id: 24,
    name: "Sub District Hospital Jamner",
    city: "Jamner",
    address: "Mahavir Nagar, Jamner",
    phone: null,
    treatments: [],
    sourceUrl: null,
    verificationStatus: "listing-unconfirmed"
  }
];

const hospitals = hospitalRecords.map(h => ({
  ...h,
  isDemo: false,
  hasBedsAvailable: null,
  hasIcuAvailable: null,
  averageRating: null,
  reviewCount: null,
  lowestTreatmentPrice: null,
  insuranceProviders: [],
  treatmentDataVerified:
    h.verificationStatus === "official-website"
}));

const normalizeCity = value => {
  const city = String(value || "").trim().toLowerCase();
  if (city === "gurgaon") return "gurugram";
  if (city === "new delhi") return "delhi";
  return city;
};

app.get("/", (req, res) => {
  res.send("MediMatrix Backend Running Successfully!");
});

app.get("/api/treatments", (req, res) => {
  res.json(treatments);
});

app.get("/api/treatments/search", (req, res) => {
  const name = String(req.query.name || "")
    .trim().toLowerCase();

  res.json(treatments.filter(t =>
    t.name.toLowerCase().includes(name)
  ));
});

app.get("/api/hospitals/search", (req, res) => {
  const city = normalizeCity(req.query.city);
  const treatment = String(req.query.treatment || "")
    .trim().toLowerCase();
  const insurance = String(req.query.insurance || "")
    .trim().toLowerCase();

  const page = Math.max(
    0, parseInt(req.query.page, 10) || 0
  );

  const size = Math.min(
    50, Math.max(1, parseInt(req.query.size, 10) || 9)
  );

  const filtered = hospitals.filter(h => {
    const cityMatch =
      !city || normalizeCity(h.city).includes(city);

    const treatmentMatch =
      !treatment ||
      h.treatments.some(t =>
        t.toLowerCase().includes(treatment)
      );

    const insuranceMatch =
      !insurance ||
      h.insuranceProviders.some(p =>
        p.toLowerCase().includes(insurance)
      );

    return cityMatch && treatmentMatch && insuranceMatch;
  });

  res.json({
    content: filtered.slice(
      page * size, (page + 1) * size
    ),
    totalElements: filtered.length,
    totalPages: Math.ceil(filtered.length / size),
    number: page,
    size
  });
});

app.get("/api/hospitals/:id", (req, res) => {
  const hospital = hospitals.find(
    h => h.id === Number(req.params.id)
  );

  if (!hospital) {
    return res.status(404).json({
      message: "Hospital not found"
    });
  }

  res.json(hospital);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `MediMatrix Backend running at http://localhost:${PORT}`
  );
});
