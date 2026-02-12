# LazyFit Design System

Šis dokumentas aprašo LazyFit projekto dizaino sistemą, pagrįstą Figma maketu. Naudokite šias klases ir spalvas visame projekte, kad išlaikytumėte vizualinį nuoseklumą.

---

## 📝 Turinys

1. [Tipografija](#tipografija)
2. [Spalvos](#spalvos)
3. [Ikonos](#ikonos)
4. [Komponentų pavyzdžiai](#komponentų-pavyzdžiai)

---

## 🔤 Tipografija

### Šriftai

Projekte naudojami 3 šriftai:

- **Mango Grotesque** - antraštėms (H1, H2, H3)
- **Outfit** - pagrindiniams tekstams
- **DM Sans** - papildomiems tekstams

### Antraštės

#### H1 - Page Title (XL)
```tsx
<h1 className="heading-xl">Pagrindinis pavadinimas</h1>
// arba
<h1 className="font-mango text-header-xl">Pagrindinis pavadinimas</h1>
```
**Stilius:** Mango Grotesque, 48px, Semi-Bold, line-height: 0.9

#### H2 - Section Title (L)
```tsx
<h2 className="heading-l">Sekcijos pavadinimas</h2>
```
**Stilius:** Mango Grotesque, 36px, Semi-Bold, line-height: 0.9

#### H3 - Subsection (M)
```tsx
<h3 className="heading-m">Poskyrio pavadinimas</h3>
```
**Stilius:** Mango Grotesque, 28px, Semi-Bold, line-height: 0.9

#### Card Section Title
```tsx
<h4 className="heading-card">Kortelės pavadinimas</h4>
```
**Stilius:** Outfit, 18px, Medium, line-height: 1.2, letter-spacing: -0.36px

---

### Tekstai

#### Text Medium (16px)

```tsx
// Regular
<p className="text-md-regular">Įprastas tekstas</p>

// Medium
<p className="text-md-medium">Vidutinio svorio tekstas</p>

// Semi-bold
<p className="text-md-semibold">Pusiau paryškintas tekstas</p>

// Bold
<p className="text-md-bold">Paryškintas tekstas</p>
```

#### Text Small (14px)

```tsx
// Regular
<p className="text-sm-regular">Mažas tekstas</p>

// Medium
<p className="text-sm-medium">Mažas vidutinis tekstas</p>

// Semi-bold
<p className="text-sm-semibold">Mažas pusiau paryškintas</p>

// Bold
<p className="text-sm-bold">Mažas paryškintas</p>
```

#### Text Extra Small (13px)

```tsx
// Regular
<p className="text-xs-regular">Labai mažas tekstas</p>

// Medium
<p className="text-xs-medium">Labai mažas vidutinis</p>

// Semi-bold
<p className="text-xs-semibold">Labai mažas pusiau paryškintas</p>

// Bold
<p className="text-xs-bold">Labai mažas paryškintas</p>
```

#### Text Tiny (11px)

```tsx
// Regular
<span className="text-tiny-regular">Mažiausias tekstas</span>

// Medium
<span className="text-tiny-medium">Mažiausias vidutinis</span>

// Semi-bold
<span className="text-tiny-semibold">Mažiausias pusiau paryškintas</span>

// Bold
<span className="text-tiny-bold">Mažiausias paryškintas</span>
```

---

## 🎨 Spalvos

### Bazinės spalvos

```tsx
// Baltos spalvos
<div className="bg-white">Balta</div>
<div className="bg-white-darken">Tamsesnė balta</div>

// Juodos spalvos
<div className="text-black">Juodas tekstas</div>
<div className="text-black-2">Šiek tiek šviesesnė juoda</div>
```

**Hex kodai:**
- `white` - #FFFFFF
- `white-darken` - #F7F7F7
- `black` - #141313
- `black-2` - #1E1E1E

---

### Brand spalvos (Žalios)

```tsx
// Pagrindinis brand green
<button className="bg-brand-green text-white">Mygtukas</button>

// Šviesesnė versija
<div className="bg-brand-green-light">Šviesi žalia</div>

// Tamsesnė versija
<div className="bg-brand-green-dark">Tamsi žalia</div>
```

**Hex kodai:**
- `brand-green` - #60988E
- `brand-green-light` - #AFCBC7
- `brand-green-dark` - #34786C
- `light-green` - #D7E5E3

---

### Sisteminės spalvos

#### Success (Sėkmė)

```tsx
// Fonas
<div className="bg-success-light p-4">
  <p className="text-success">Sėkmingai išsaugota!</p>
</div>

// Mygtukas
<button className="bg-success text-white">Patvirtinti</button>

// Tekstas
<p className="text-text-success">Operacija sėkminga</p>
```

**Hex kodai:**
- `success` - #25A55A
- `success-light` - #C8E8D6
- `bg-success` - #ECF7EC
- `text-success` - #87CEA5

#### Warning (Įspėjimas)

```tsx
// Fonas
<div className="bg-warning-light p-4 rounded">
  <p className="text-warning">Įspėjimas!</p>
</div>

// Mygtukas
<button className="bg-warning text-black">Perspėti</button>

// Background
<div className="bg-bg-warning p-6">
  <span className="text-text-warning">Atsargiai!</span>
</div>
```

**Hex kodai:**
- `warning` - #FFB700
- `warning-light` - #FFE2A5
- `light-yellow` - #FFF7DF
- `bg-warning` - #FFF1C2
- `text-warning` - #FFD16E

#### Destructive (Klaida/Ištrynimas)

```tsx
// Fonas
<div className="bg-destructive-light p-4">
  <p className="text-destructive">Klaida įvyko!</p>
</div>

// Mygtukas
<button className="bg-destructive text-white">Ištrinti</button>

// Tamsesnis variantas
<button className="bg-destructive-dark text-white hover:bg-destructive">
  Patvirtinti ištrynimą
</button>
```

**Hex kodai:**
- `destructive` - #E74043
- `destructive-light` - #FBD0CD
- `destructive-dark` - #BA1E21
- `bg-error` - #FDECEC
- `text-error` - #F69891

#### Information (Informacija)

```tsx
<div className="bg-bg-information p-4 rounded-lg">
  <p className="text-sm-regular text-text-black">
    Informacinis pranešimas
  </p>
</div>
```

**Hex kodai:**
- `bg-information` - #F0F7FF

---

### Pilkos spalvos

```tsx
// Šviesios pilkos
<div className="bg-light-grey">Šviesi pilka</div>
<div className="bg-grey-light">Vidutinė pilka</div>

// Tamsesnės pilkos
<div className="bg-dark-grey text-white">Tamsi pilka</div>

// Tekstui
<p className="text-text-grey">Pilkas tekstas</p>
<p className="text-text-secondary">Antrinis tekstas</p>
```

**Hex kodai:**
- `light-grey` - #EFEFEF
- `grey-light` - #CCCED3
- `grey` - #B2B4B9
- `dark-grey` - #555B65
- `text-grey` - #CCCED3
- `text-secondary` - #E6E6E6

---

### Mitybos spalvos

Naudojamos grafikams ir mitybos informacijai:

```tsx
<div className="flex gap-4">
  <div className="bg-calories p-3 rounded">
    <span className="text-xs-bold text-white">1500 kcal</span>
  </div>
  <div className="bg-carbs p-3 rounded">
    <span className="text-xs-bold text-white">150g angliavandenių</span>
  </div>
  <div className="bg-protein p-3 rounded">
    <span className="text-xs-bold text-white">120g baltymų</span>
  </div>
  <div className="bg-fat p-3 rounded">
    <span className="text-xs-bold text-white">50g riebalų</span>
  </div>
</div>
```

**Hex kodai:**
- `calories` - #BBB1FC (Violetinė)
- `carbs` - #51BD9B (Žydra)
- `protein` - #F98466 (Oranžinė)
- `fat` - #334BA3 (Mėlyna)

---

### Border spalvos

```tsx
// Pagrindinės
<div className="border border-primary">Juodas kraštas</div>
<div className="border border-secondary">Tamsiai pilkas kraštas</div>

// Brand
<div className="border-2 border-brand-green">Žalias kraštas</div>
<div className="border border-brand-green-dark">Tamsiai žalias kraštas</div>

// Šviesios
<div className="border border-light-grey">Šviesi pilka</div>
<div className="border border-white">Baltas kraštas</div>

// Sisteminės
<div className="border border-warning">Įspėjimo kraštas</div>
<div className="border border-success">Sėkmės kraštas</div>
<div className="border border-destructive">Klaidos kraštas</div>
```

**Hex kodai:**
- `border-primary` - #101827
- `border-secondary` - #555B65
- `border-grey` - #B2B4B9
- `border-light-grey` - #CCCED3
- `border-brand-green` - #60988E
- `border-brand-green-dark` - #34786C
- `border-white` - #FFFFFF

---

## 🎯 Ikonos

Projekte naudojame **[Lucide React](https://lucide.dev/)** ikonų biblioteką - modernų, gerai palaikomą ir lengvai pritaikomą ikonų rinkinį.

### Dydžiai

Ikonos turi atitikti dizaino sistemos dydžius:

```tsx
import { Home, User, Settings } from 'lucide-react';

// Mažos ikonos - 16px
<Home className="w-4 h-4" />

// Vidutinės ikonos - 20px
<User className="w-5 h-5" />

// Standartinės ikonos - 24px (rekomenduojamas)
<Settings className="w-6 h-6" />

// Didelės ikonos - 32px
<Home className="w-8 h-8" />
```

### Spalvos

Ikonos turėtų naudoti dizaino sistemos spalvas:

```tsx
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

// Success
<CheckCircle className="w-5 h-5 text-success" />

// Warning
<AlertTriangle className="w-5 h-5 text-warning" />

// Error / Destructive
<XCircle className="w-5 h-5 text-destructive" />

// Info / Brand
<Info className="w-5 h-5 text-brand-green" />

// Text colors
<Home className="w-5 h-5 text-text-black" />
<User className="w-5 h-5 text-text-grey" />
```

### Dažniausiai naudojamos ikonos

#### Navigacija ir UI

```tsx
import {
  Home,           // Pagrindinis
  Dumbbell,       // Treniruotės
  Apple,          // Mityba
  TrendingUp,     // Progresas / Statistika
  User,           // Profilis
  Settings,       // Nustatymai
  Menu,           // Mobilusis meniu
  X,              // Uždaryti
  ChevronRight,   // Rodyklė dešinėn
  ChevronLeft,    // Rodyklė kairėn
  ChevronDown,    // Rodyklė žemyn
  ChevronUp,      // Rodyklė aukštyn
} from 'lucide-react';
```

#### Veiksmai

```tsx
import {
  Plus,           // Pridėti
  Edit,           // Redaguoti
  Trash2,         // Ištrinti
  Save,           // Išsaugoti
  Download,       // Parsisiųsti
  Upload,         // Įkelti
  Search,         // Paieška
  Filter,         // Filtruoti
  Eye,            // Peržiūrėti
  EyeOff,         // Slėpti
  Copy,           // Kopijuoti
  Share2,         // Dalintis
} from 'lucide-react';
```

#### Būsenos ir pranešimai

```tsx
import {
  CheckCircle,    // Sėkmė
  AlertTriangle,  // Įspėjimas
  XCircle,        // Klaida
  Info,           // Informacija
  Clock,          // Laukiama
  Check,          // Patvirtinta
} from 'lucide-react';
```

#### Sportas ir sveikata

```tsx
import {
  Activity,       // Aktyvumas
  Heart,          // Širdis / Sveikata
  Zap,            // Energija
  Target,         // Tikslas
  Calendar,       // Kalendorius
  Timer,          // Laikmatis
  Award,          // Pasiekimai
  TrendingUp,     // Augimas
  BarChart2,      // Grafikai
} from 'lucide-react';
```

### Naudojimo pavyzdžiai

#### Su mygtukais

```tsx
import { Plus, Save, Trash2 } from 'lucide-react';

// Primary button su ikona
<button className="bg-brand-green hover:bg-brand-green-dark text-white text-sm-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
  <Plus className="w-5 h-5" />
  Pridėti treniruotę
</button>

// Icon only button
<button className="bg-brand-green hover:bg-brand-green-dark text-white p-2 rounded-lg transition-colors">
  <Save className="w-5 h-5" />
</button>

// Destructive button
<button className="bg-destructive hover:bg-destructive-dark text-white text-sm-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
  <Trash2 className="w-4 h-4" />
  Ištrinti
</button>
```

#### Su alert'ais

```tsx
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

// Success alert
<div className="bg-bg-success border-l-4 border-success p-4 mb-4">
  <div className="flex items-center gap-3">
    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
    <p className="text-sm-medium text-success">
      Jūsų profilis sėkmingai atnaujintas!
    </p>
  </div>
</div>

// Warning alert
<div className="bg-bg-warning border-l-4 border-warning p-4 mb-4">
  <div className="flex items-center gap-3">
    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
    <p className="text-sm-medium text-warning">
      Jūsų prenumerata baigiasi po 3 dienų.
    </p>
  </div>
</div>

// Error alert
<div className="bg-bg-error border-l-4 border-destructive p-4 mb-4">
  <div className="flex items-center gap-3">
    <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
    <p className="text-sm-medium text-destructive">
      Įvyko klaida išsaugant duomenis.
    </p>
  </div>
</div>
```

#### Su input laukais

```tsx
import { Search, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

// Search input
<div className="relative">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-grey" />
  <input
    type="text"
    placeholder="Ieškoti..."
    className="w-full pl-10 pr-4 py-3 border border-light-grey rounded-lg text-md-regular focus:outline-none focus:border-brand-green"
  />
</div>

// Password input su toggle
function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Slaptažodis"
        className="w-full px-4 py-3 pr-12 border border-light-grey rounded-lg text-md-regular focus:outline-none focus:border-brand-green"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-grey hover:text-text-black"
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
}
```

#### Navigacijoje

```tsx
import { Home, Dumbbell, Apple, TrendingUp, User } from 'lucide-react';

<nav className="flex items-center gap-6">
  <a href="/" className="flex items-center gap-2 text-sm-semibold text-brand-green">
    <Home className="w-5 h-5" />
    Pagrindinis
  </a>
  <a href="/treniruotes" className="flex items-center gap-2 text-sm-regular text-text-grey hover:text-brand-green">
    <Dumbbell className="w-5 h-5" />
    Treniruotės
  </a>
  <a href="/mityba" className="flex items-center gap-2 text-sm-regular text-text-grey hover:text-brand-green">
    <Apple className="w-5 h-5" />
    Mityba
  </a>
  <a href="/progresas" className="flex items-center gap-2 text-sm-regular text-text-grey hover:text-brand-green">
    <TrendingUp className="w-5 h-5" />
    Progresas
  </a>
  <a href="/profilis" className="flex items-center gap-2 text-sm-regular text-text-grey hover:text-brand-green">
    <User className="w-5 h-5" />
    Profilis
  </a>
</nav>
```

#### Stats kortelėse

```tsx
import { Activity, Target, TrendingUp, Calendar } from 'lucide-react';

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Šiandienos aktyvumas */}
  <div className="bg-white border border-light-grey rounded-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="bg-brand-green-light p-3 rounded-lg">
        <Activity className="w-6 h-6 text-brand-green" />
      </div>
    </div>
    <h3 className="text-xs-medium text-text-grey mb-1">Šiandien</h3>
    <p className="heading-card text-text-black">3 treniruotės</p>
  </div>

  {/* Savaitės tikslas */}
  <div className="bg-white border border-light-grey rounded-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="bg-warning-light p-3 rounded-lg">
        <Target className="w-6 h-6 text-warning" />
      </div>
    </div>
    <h3 className="text-xs-medium text-text-grey mb-1">Savaitės tikslas</h3>
    <p className="heading-card text-text-black">80%</p>
  </div>

  {/* Progresas */}
  <div className="bg-white border border-light-grey rounded-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="bg-success-light p-3 rounded-lg">
        <TrendingUp className="w-6 h-6 text-success" />
      </div>
    </div>
    <h3 className="text-xs-medium text-text-grey mb-1">Progresas</h3>
    <p className="heading-card text-text-black">+12%</p>
  </div>

  {/* Sekantis tikslas */}
  <div className="bg-white border border-light-grey rounded-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="bg-bg-information p-3 rounded-lg">
        <Calendar className="w-6 h-6 text-brand-green" />
      </div>
    </div>
    <h3 className="text-xs-medium text-text-grey mb-1">Sekantis</h3>
    <p className="heading-card text-text-black">Rytoj</p>
  </div>
</div>
```

#### Badge'uose

```tsx
import { Check, Clock, X } from 'lucide-react';

// Success badge su ikona
<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success-light text-success text-xs-semibold">
  <Check className="w-3 h-3" />
  Aktyvus
</span>

// Pending badge
<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-warning-light text-warning text-xs-semibold">
  <Clock className="w-3 h-3" />
  Laukiama
</span>

// Inactive badge
<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-destructive-light text-destructive text-xs-semibold">
  <X className="w-3 h-3" />
  Neaktyvus
</span>
```

### Geriausios praktikos

1. **Dydis ir išlygiavimas**
   ```tsx
   // Gerai - ikona suderinta su tekstu
   <div className="flex items-center gap-2">
     <Home className="w-5 h-5" />
     <span className="text-sm-semibold">Pagrindinis</span>
   </div>

   // Blogai - ikona per didelė
   <div className="flex items-center gap-2">
     <Home className="w-10 h-10" />
     <span className="text-sm-semibold">Pagrindinis</span>
   </div>
   ```

2. **Spalvos**
   ```tsx
   // Gerai - naudojamos sistemos spalvos
   <CheckCircle className="w-5 h-5 text-success" />

   // Blogai - naudojamos pasirinktinės spalvos
   <CheckCircle className="w-5 h-5" style={{ color: '#00ff00' }} />
   ```

3. **Prieinamumas**
   ```tsx
   // Gerai - su aria-label
   <button aria-label="Uždaryti" className="p-2">
     <X className="w-5 h-5" />
   </button>

   // Gerai - su tekstu
   <button className="flex items-center gap-2">
     <X className="w-5 h-5" />
     <span>Uždaryti</span>
   </button>
   ```

4. **Nuoseklumas**
   - Visame projekte naudokite tas pačias ikonas toms pačioms funkcijoms
   - `Trash2` visada ištrynimui
   - `Edit` / `Pencil` redagavimui
   - `Plus` pridėjimui
   - `X` uždarymui

### Pilnas ikonų sąrašas

Visas ikonų sąrašas: [lucide.dev/icons](https://lucide.dev/icons)

Populiariausios kategorijos:
- **Arrows** - rodyklės ir navigacija
- **Design** - dizaino elementai
- **Editor** - redagavimo įrankiai
- **Files** - failų valdymas
- **Layout** - išdėstymo elementai
- **Media** - medijos valdymas
- **Sports** - sporto ikonos
- **Devices** - įrenginiai

---

## 🧩 Komponentų pavyzdžiai

### Mygtukai

#### Pagrindinis mygtukas (Primary)

```tsx
<button className="bg-brand-green hover:bg-brand-green-dark text-white text-sm-semibold px-6 py-3 rounded-lg transition-colors">
  Prisijungti
</button>
```

#### Antrinis mygtukas (Secondary)

```tsx
<button className="bg-white border-2 border-brand-green text-brand-green text-sm-semibold px-6 py-3 rounded-lg hover:bg-light-green transition-colors">
  Atšaukti
</button>
```

#### Destructive mygtukas

```tsx
<button className="bg-destructive hover:bg-destructive-dark text-white text-sm-semibold px-6 py-3 rounded-lg transition-colors">
  Ištrinti
</button>
```

#### Išjungtas mygtukas

```tsx
<button disabled className="bg-grey-light text-dark-grey text-sm-semibold px-6 py-3 rounded-lg cursor-not-allowed opacity-50">
  Nepasiekiamas
</button>
```

---

### Kortelės (Cards)

#### Pagrindinė kortelė

```tsx
<div className="bg-white border border-light-grey rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
  <h3 className="heading-card text-text-black mb-3">
    Kortelės pavadinimas
  </h3>
  <p className="text-sm-regular text-text-grey mb-4">
    Kortelės aprašymas su papildomu tekstu
  </p>
  <button className="bg-brand-green text-white text-sm-semibold px-4 py-2 rounded-lg">
    Veikimas
  </button>
</div>
```

#### Sėkmės kortelė

```tsx
<div className="bg-success-light border border-success rounded-lg p-6">
  <div className="flex items-start gap-3">
    <div className="bg-success rounded-full p-2">
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </div>
    <div>
      <h4 className="text-md-semibold text-success mb-1">Sėkmingai!</h4>
      <p className="text-sm-regular text-text-black">Jūsų duomenys sėkmingai išsaugoti.</p>
    </div>
  </div>
</div>
```

#### Įspėjimo kortelė

```tsx
<div className="bg-warning-light border border-warning rounded-lg p-6">
  <div className="flex items-start gap-3">
    <div className="bg-warning rounded-full p-2">
      <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </div>
    <div>
      <h4 className="text-md-semibold text-warning mb-1">Dėmesio!</h4>
      <p className="text-sm-regular text-text-black">Patikrinkite įvestus duomenis.</p>
    </div>
  </div>
</div>
```

---

### Formos laukai (Input Fields)

#### Teksto laukas

```tsx
<div className="mb-4">
  <label className="block text-sm-medium text-text-black mb-2">
    El. paštas
  </label>
  <input
    type="email"
    placeholder="vardas@pavyzdys.lt"
    className="w-full px-4 py-3 border border-light-grey rounded-lg text-md-regular focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green-light transition-colors"
  />
</div>
```

#### Teksto laukas su klaida

```tsx
<div className="mb-4">
  <label className="block text-sm-medium text-text-black mb-2">
    Slaptažodis
  </label>
  <input
    type="password"
    className="w-full px-4 py-3 border-2 border-destructive rounded-lg text-md-regular focus:outline-none focus:ring-2 focus:ring-destructive-light"
  />
  <p className="text-xs-regular text-destructive mt-1">
    Slaptažodis turi būti bent 8 simbolių ilgio
  </p>
</div>
```

#### Textarea

```tsx
<div className="mb-4">
  <label className="block text-sm-medium text-text-black mb-2">
    Komentaras
  </label>
  <textarea
    rows={4}
    placeholder="Įveskite savo komentarą..."
    className="w-full px-4 py-3 border border-light-grey rounded-lg text-md-regular resize-none focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green-light"
  />
</div>
```

---

### Badge'ai

```tsx
// Success badge
<span className="inline-flex items-center px-3 py-1 rounded-full bg-success-light text-success text-xs-semibold">
  Aktyvus
</span>

// Warning badge
<span className="inline-flex items-center px-3 py-1 rounded-full bg-warning-light text-warning text-xs-semibold">
  Laukiama
</span>

// Error badge
<span className="inline-flex items-center px-3 py-1 rounded-full bg-destructive-light text-destructive text-xs-semibold">
  Neaktyvus
</span>

// Info badge
<span className="inline-flex items-center px-3 py-1 rounded-full bg-light-green text-brand-green text-xs-semibold">
  Naujas
</span>
```

---

### Alert pranešimai

#### Success alert

```tsx
<div className="bg-bg-success border-l-4 border-success p-4 mb-4">
  <div className="flex items-center">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-success" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="ml-3">
      <p className="text-sm-medium text-success">
        Jūsų profilis sėkmingai atnaujintas!
      </p>
    </div>
  </div>
</div>
```

#### Warning alert

```tsx
<div className="bg-bg-warning border-l-4 border-warning p-4 mb-4">
  <div className="flex items-center">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="ml-3">
      <p className="text-sm-medium text-warning">
        Jūsų prenumerata baigiasi po 3 dienų.
      </p>
    </div>
  </div>
</div>
```

#### Error alert

```tsx
<div className="bg-bg-error border-l-4 border-destructive p-4 mb-4">
  <div className="flex items-center">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-destructive" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="ml-3">
      <p className="text-sm-medium text-destructive">
        Įvyko klaida išsaugant duomenis. Bandykite dar kartą.
      </p>
    </div>
  </div>
</div>
```

---

### Mitybos statistika

```tsx
<div className="bg-white border border-light-grey rounded-lg p-6">
  <h3 className="heading-card mb-4">Šiandienos mityba</h3>

  <div className="space-y-3">
    {/* Kalorijos */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-calories"></div>
        <span className="text-sm-regular text-text-black">Kalorijos</span>
      </div>
      <span className="text-sm-semibold text-text-black">1,650 / 2,000 kcal</span>
    </div>

    {/* Angliavandeniai */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-carbs"></div>
        <span className="text-sm-regular text-text-black">Angliavandeniai</span>
      </div>
      <span className="text-sm-semibold text-text-black">180 / 250g</span>
    </div>

    {/* Baltymai */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-protein"></div>
        <span className="text-sm-regular text-text-black">Baltymai</span>
      </div>
      <span className="text-sm-semibold text-text-black">95 / 120g</span>
    </div>

    {/* Riebalai */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-fat"></div>
        <span className="text-sm-regular text-text-black">Riebalai</span>
      </div>
      <span className="text-sm-semibold text-text-black">48 / 65g</span>
    </div>
  </div>
</div>
```

---

### Navigacija

```tsx
<nav className="bg-white border-b border-light-grey">
  <div className="max-w-7xl mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="heading-m text-brand-green">LazyFit</h1>
      </div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-8">
        <a href="/" className="text-sm-semibold text-text-black hover:text-brand-green transition-colors">
          Pagrindinis
        </a>
        <a href="/treniruotes" className="text-sm-regular text-text-grey hover:text-brand-green transition-colors">
          Treniruotės
        </a>
        <a href="/mityba" className="text-sm-regular text-text-grey hover:text-brand-green transition-colors">
          Mityba
        </a>
        <a href="/progresas" className="text-sm-regular text-text-grey hover:text-brand-green transition-colors">
          Progresas
        </a>
      </div>

      {/* CTA Button */}
      <button className="bg-brand-green hover:bg-brand-green-dark text-white text-sm-semibold px-5 py-2 rounded-lg transition-colors">
        Pradėti
      </button>
    </div>
  </div>
</nav>
```

---

### Lentelės

```tsx
<div className="bg-white border border-light-grey rounded-lg overflow-hidden">
  <table className="min-w-full divide-y divide-light-grey">
    <thead className="bg-bg-white-darken">
      <tr>
        <th className="px-6 py-3 text-left text-xs-semibold text-dark-grey uppercase tracking-wider">
          Data
        </th>
        <th className="px-6 py-3 text-left text-xs-semibold text-dark-grey uppercase tracking-wider">
          Treniruotė
        </th>
        <th className="px-6 py-3 text-left text-xs-semibold text-dark-grey uppercase tracking-wider">
          Trukmė
        </th>
        <th className="px-6 py-3 text-left text-xs-semibold text-dark-grey uppercase tracking-wider">
          Statusas
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-light-grey">
      <tr className="hover:bg-bg-white-darken transition-colors">
        <td className="px-6 py-4 whitespace-nowrap text-sm-regular text-text-black">
          2025-01-18
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm-medium text-text-black">
          Jėgos treniruotė
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm-regular text-text-grey">
          45 min
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-success-light text-success text-xs-semibold">
            Atlikta
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

### Progress bar

```tsx
<div className="space-y-2">
  <div className="flex justify-between items-center">
    <span className="text-sm-medium text-text-black">Šios savaitės tikslas</span>
    <span className="text-sm-semibold text-brand-green">4 / 5 treniruotės</span>
  </div>
  <div className="w-full bg-grey-light rounded-full h-2">
    <div className="bg-brand-green h-2 rounded-full transition-all" style={{ width: '80%' }}></div>
  </div>
</div>
```

---

### Modal

```tsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-lg max-w-md w-full p-6">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h3 className="heading-card text-text-black">Patvirtinkite veiksmą</h3>
      <button className="text-text-grey hover:text-text-black transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Content */}
    <p className="text-sm-regular text-text-grey mb-6">
      Ar tikrai norite ištrinti šią treniruotę? Šis veiksmas negali būti atšauktas.
    </p>

    {/* Actions */}
    <div className="flex gap-3 justify-end">
      <button className="px-4 py-2 border border-light-grey text-text-black text-sm-semibold rounded-lg hover:bg-light-grey transition-colors">
        Atšaukti
      </button>
      <button className="px-4 py-2 bg-destructive hover:bg-destructive-dark text-white text-sm-semibold rounded-lg transition-colors">
        Ištrinti
      </button>
    </div>
  </div>
</div>
```

---

## 💡 Geriausios praktikos

### 1. Nuoseklumas
- Visada naudokite dizaino sistemos spalvas ir tipografiją
- Nenaudokite pasirinktinių hex kodų arba RGB reikšmių
- Laikykitės nustatytų margin/padding reikšmių

### 2. Prieinamumas
```tsx
// Gerai - aiškus kontrastas
<button className="bg-brand-green text-white">Mygtukas</button>

// Blogai - prastas kontrastas
<button className="bg-brand-green-light text-white">Mygtukas</button>
```

### 3. Responsive dizainas
```tsx
<h1 className="heading-xl md:text-[64px] lg:text-[72px]">
  Responsive antraštė
</h1>

<p className="text-sm-regular md:text-md-regular">
  Responsive tekstas
</p>
```

### 4. Hover ir Focus būsenos
```tsx
<button className="bg-brand-green hover:bg-brand-green-dark focus:ring-2 focus:ring-brand-green-light focus:outline-none transition-all">
  Interaktyvus mygtukas
</button>
```

### 5. Komponentų kompozicija
```tsx
// Sukurkite pakartotinai naudojamus komponentus
export function PrimaryButton({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-brand-green hover:bg-brand-green-dark disabled:bg-grey-light disabled:cursor-not-allowed text-white text-sm-semibold px-6 py-3 rounded-lg transition-colors"
    >
      {children}
    </button>
  );
}
```

---

## 📦 Importuoti spalvas į JS/TS

Jei reikia spalvų JavaScript/TypeScript kode:

```typescript
// colors.ts
export const colors = {
  brand: {
    green: '#60988E',
    greenLight: '#AFCBC7',
    greenDark: '#34786C',
  },
  success: {
    default: '#25A55A',
    light: '#C8E8D6',
    bg: '#ECF7EC',
    text: '#87CEA5',
  },
  warning: {
    default: '#FFB700',
    light: '#FFE2A5',
    bg: '#FFF1C2',
    text: '#FFD16E',
  },
  destructive: {
    default: '#E74043',
    light: '#FBD0CD',
    dark: '#BA1E21',
    bg: '#FDECEC',
    text: '#F69891',
  },
  nutrition: {
    calories: '#BBB1FC',
    carbs: '#51BD9B',
    protein: '#F98466',
    fat: '#334BA3',
  },
} as const;
```

---

## 🔗 Naudingos nuorodos

- [Figma dizainas](https://www.figma.com/design/rwpE6c7oAqiR5WQmchdsAw/)
- [Tailwind CSS dokumentacija](https://tailwindcss.com/docs)
- [Next.js dokumentacija](https://nextjs.org/docs)

---

**Paskutinis atnaujinimas:** 2025-01-18
