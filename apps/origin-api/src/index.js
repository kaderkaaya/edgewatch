const express = require("express");

const PRODUCTS = [
  { id: 1, name: "Red Rose" },
  { id: 2, name: "White Rose" },
  { id: 3, name: "Tulip" },
  { id: 4, name: "Orchid" },
];

const app = express();

app.get("/search", (req, res) => {
  const query = String(req.query.q || "").trim().toLowerCase();
  const products = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(query)
  );

  res.json({ query, products });
});

app.listen(3000, () => {
  console.log("origin-api on localhost:3000");
});