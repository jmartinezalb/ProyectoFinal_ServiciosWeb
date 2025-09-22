const { validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });

    res.status(201).json({ message: "Usuario creado correctamente", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Credenciales inválidas" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
