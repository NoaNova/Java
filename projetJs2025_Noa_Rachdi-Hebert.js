import fs from "fs";
import Papa from "papaparse";
import * as R from "ramda";

// Charger le fichier styles.csv
const file = fs.readFileSync("./styles.csv", "utf8");

// Parser le CSV
const parsed = Papa.parse(file, {
  header: true,
  skipEmptyLines: true,
});

const clothingList = parsed.data;
// Afficher les 5 premières lignes
console.log(parsed.data.slice(0, 5));



// Fonctions de tri/filtrage Ramda
// Total d'articles
const totalItems = R.length;
// Compter les vêtements par sexe
const countByGender = (gender) =>
    R.pipe(R.filter(
            R.pipe(R.prop("gender"), R.toLower, R.trim, R.equals(gender.toLowerCase()))
        ), R.length);
// Compter par masterCategory (ex: 'Apparel', 'Accessories', etc.)
const countByCategory = R.countBy(R.prop("masterCategory"));
// Compter par couleur de base
const countByColour = R.countBy(R.prop("baseColour"));
// Compter par saison
const countBySeason = R.countBy(R.pipe(R.prop("season"), R.trim));
// Compter par année
const countByYear = R.countBy(R.prop("year"));

// fonction filtrer par critere et nom choisi
const filterBy = (nom, critere) =>
    R.filter(
        R.pipe(
            R.prop(nom),
            R.when(R.is(String), R.pipe(R.toLower, R.trim)),
            R.equals(critere.toLowerCase().trim())
        )
    );

//Information basiques
console.log(`Total d'articles : ${totalItems(clothingList)}`);
console.log("Articles pour hommes :", countBy("gender", "Men")(clothingList));
console.log("Articles pour femme :", countBy("gender", "Women")(clothingList));

console.log("Distribution par catégorie :", countByCategory(clothingList));
console.log("Distribution par couleur :", countByColour(clothingList));
console.log("Distribution par saison :", countBySeason(clothingList));
console.log("Distribution par année :", countByYear(clothingList));

//filtre
console.log(`Nombre d'articles bleus : ${filterBy("baseColour", "Blue")(clothingList).length}`);
//association de filtres
console.log("Nombre d'articles bleus pour hommes en automne :", R.pipe(filterBy("baseColour", "Blue"), filterBy("gender", "Men"), filterBy("season", "Fall"), R.length)(clothingList));
console.log("Nombre de T-shirts roses :", R.pipe(filterBy("baseColour", "Pink"), filterBy("articleType", "Tshirts"), R.length)(clothingList));