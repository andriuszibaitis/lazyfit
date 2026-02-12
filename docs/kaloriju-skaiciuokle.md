# Kalorijų Skaičiuoklė - Kaip tai veikia?

## Kas yra kalorijų skaičiuoklė?

Kalorijų skaičiuoklė apskaičiuoja, kiek kalorijų jums reikia per dieną, kad pasiektumėte savo tikslą.

---

## Skaičiavimo principas

### 1. Bazinis metabolizmas (BMR)

Tai kalorijų kiekis, kurį jūsų kūnas sudegina ramybės būsenoje - tiesiog kvėpuojant ir palaikant organų veiklą.

**Skaičiavimas:**

| Lytis | Formulė |
|-------|---------|
| Vyrai | (10 × svoris kg) + (6.25 × ūgis cm) - (5 × amžius) + 5 |
| Moterys | (10 × svoris kg) + (6.25 × ūgis cm) - (5 × amžius) - 161 |

**Pavyzdys - 30 metų vyras, 180 cm, 80 kg:**
```
BMR = (10 × 80) + (6.25 × 180) - (5 × 30) + 5
BMR = 800 + 1125 - 150 + 5
BMR = 1780 kcal/dieną
```

**Pavyzdys - 25 metų moteris, 165 cm, 60 kg:**
```
BMR = (10 × 60) + (6.25 × 165) - (5 × 25) - 161
BMR = 600 + 1031 - 125 - 161
BMR = 1345 kcal/dieną
```

---

### 2. Aktyvumo koeficientas

BMR padauginame iš koeficiento pagal jūsų aktyvumo lygį:

| Aktyvumas | Koeficientas |
|-----------|--------------|
| Sėdimas, beveik nesportuoja | 1.2 |
| Lengvas: sportuoja 1-3 k./sav. | 1.375 |
| Normalus: 3-5 k./sav. | 1.465 |
| Aktyvus: intensyvus 4-5 k./sav. | 1.55 |
| Labai aktyvus: 6-7 k./sav. | 1.725 |
| Itin aktyvus: fizinis darbas ar 2 kartus per dieną sportas | 1.9 |

**Pavyzdys - vyras su BMR 1780 kcal, normalus aktyvumas (sportas 3-5 k./sav.):**
```
TDEE = 1780 × 1.465 = 2608 kcal/dieną
```

**Pavyzdys - moteris su BMR 1345 kcal, lengvas aktyvumas (sportas 1-3 k./sav.):**
```
TDEE = 1345 × 1.375 = 1849 kcal/dieną
```

---

### 3. Tikslo pritaikymas

Pagal jūsų tikslą koreguojame kalorijų kiekį:

#### Noriu NUMESTI svorio

| Variantas | Skaičiavimas | Rezultatas per savaitę |
|-----------|--------------|------------------------|
| Palaikyti esamą | TDEE × 100% | Svoris nekinta |
| Lengvas | TDEE × 90% | ~0.25 kg |
| **Vidutinis (Siūloma)** | TDEE × 80% | ~0.5 kg |
| Greitas | TDEE × 60% | ~1 kg |

**Pavyzdys - vyras nori numesti, TDEE = 2759 kcal:**
```
Palaikyti:  2759 kcal
Lengvas:    2759 × 0.90 = 2483 kcal
Vidutinis:  2759 × 0.80 = 2207 kcal  ← Siūloma
Greitas:    2759 × 0.60 = 1655 kcal
```

#### Noriu PRIAUGTI svorio

| Variantas | Skaičiavimas | Rezultatas per savaitę |
|-----------|--------------|------------------------|
| Palaikyti esamą | TDEE × 100% | Svoris nekinta |
| Lengvas | TDEE × 110% | ~0.25 kg |
| **Vidutinis (Siūloma)** | TDEE × 115% | ~0.35 kg |
| Greitas | TDEE × 120% | ~0.5 kg |

**Pavyzdys - moteris nori priaugti, TDEE = 1849 kcal:**
```
Palaikyti:  1849 kcal
Lengvas:    1849 × 1.10 = 2034 kcal
Vidutinis:  1849 × 1.15 = 2126 kcal  ← Siūloma
Greitas:    1849 × 1.20 = 2219 kcal
```

---

## Pilnas skaičiavimo pavyzdys

**Duomenys:** Moteris, 28 metai, 170 cm, 65 kg, sportuoja 3-5 kartus per savaitę, nori numesti svorio.

**1 žingsnis - BMR:**
```
BMR = (10 × 65) + (6.25 × 170) - (5 × 28) - 161
BMR = 650 + 1062.5 - 140 - 161
BMR = 1412 kcal
```

**2 žingsnis - TDEE (aktyvumas: normalus, koef. 1.465):**
```
TDEE = 1412 × 1.465 = 2069 kcal
```

**3 žingsnis - Tikslas (numesti svorio):**
```
Palaikyti:  2069 kcal
Lengvas:    1862 kcal  (-207 kcal/d)
Vidutinis:  1655 kcal  (-414 kcal/d)  ← Siūloma
Greitas:    1241 kcal  (-828 kcal/d)
```

**Rezultatas:** Rekomenduojama valgyti **1655 kcal per dieną**, kad numestų ~0.5 kg per savaitę.

---

## Kodėl siūlome vidutinį variantą?

- **Lengvas** - lėtas, bet lengvai išlaikomas ilgą laiką
- **Vidutinis** - optimalus balansas tarp greičio ir sveikatos
- **Greitas** - greiti rezultatai, bet sunkiau išlaikyti, gali trūkti energijos

---

## Svarbu žinoti

- Skaičiuoklė pateikia **apytikslį** įvertinimą
- Kiekvieno žmogaus metabolizmas skiriasi
- Stebėkite rezultatus 2-3 savaites ir koreguokite
- Perskaičiuokite kas 4-6 savaites arba pasikeitus svoriui 2-3 kg
