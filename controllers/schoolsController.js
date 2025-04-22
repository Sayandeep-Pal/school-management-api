const db = require("../db");
const calculateDistance = require("../utils/distanceCalculator");

exports.addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: "Invalid input data." });
  }

  try {
    await db.execute(
      "INSERT INTO sql12774688 (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude]
    );
    res.status(201).json({ message: "School added successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.listSchools = async (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLng = parseFloat(req.query.longitude);

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({ message: "Invalid coordinates." });
  }

  try {
    const [schools] = await db.execute("SELECT * FROM sql12774688");

    schools.forEach((school) => {
      school.distance = calculateDistance(
        userLat,
        userLng,
        school.latitude,
        school.longitude
      );
    });

    schools.sort((a, b) => a.distance - b.distance);

    res.status(200).json(schools);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
