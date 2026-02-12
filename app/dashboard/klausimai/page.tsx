"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import PageTitleBar from "../components/page-title-bar";
import { CustomTabs, TabItem } from "@/components/ui/custom-tabs";
import { Plus, Minus, Loader2, Search } from "lucide-react";
import { Modal, SuccessModal } from "@/components/ui/modal";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  items: FAQItem[];
}

// Fallback data in case API fails or returns empty
const fallbackFaqData: FAQCategory[] = [
  {
    id: "general",
    title: "Bendri klausimai",
    items: [
      {
        question: "Kas yra LazyFit?",
        answer: "LazyFit yra visapusė fitnes ir sveikatingumo platforma, sukurta padėti jums pasiekti savo sveikatos tikslus. Platforma apima mitybos planavimą, treniruočių programas, edukacinį turinį ir personalizuotus patarimus."
      },
      {
        question: "Kaip pradėti naudotis LazyFit?",
        answer: "Užsiregistruokite platformoje, užpildykite savo profilį su asmenine informacija (amžius, svoris, ūgis, tikslai) ir pradėkite naudotis mitybos planais, treniruočių programomis ir kitomis funkcijomis."
      },
      {
        question: "Ar LazyFit tinka pradedantiesiems?",
        answer: "Taip! LazyFit sukurta visiems – nuo pradedančiųjų iki pažengusių sportininkų. Mūsų programos pritaikytos skirtingiems lygiams ir tikslams."
      },
      {
        question: "Kokios funkcijos įeina į narystę?",
        answer: "Priklausomai nuo pasirinkto plano, galite naudotis mitybos planais, receptais, treniruočių programomis, kalorijų skaičiuokle, edukaciniais kursais ir personalizuotais patarimais."
      }
    ]
  },
  {
    id: "nutrition",
    title: "Mityba",
    items: [
      {
        question: "Kaip veikia kalorijų skaičiuoklė?",
        answer: "Kalorijų skaičiuoklė naudoja jūsų įvestus duomenis (amžių, lytį, ūgį, svorį ir fizinį aktyvumą), kad apskaičiuotų bazinę medžiagų apykaitą (BMR) ir rekomenduojamą dienos kalorijų normą pagal jūsų tikslą – numesti svorio, išlaikyti esamą ar priaugti."
      },
      {
        question: "Ar galiu sukurti savo mitybos planą?",
        answer: "Taip! Galite kurti asmeninius mitybos planus, pridėti mėgstamus receptus, sekti suvartotus maisto produktus ir stebėti savo progresą."
      },
      {
        question: "Kaip sekti suvartotus maisto produktus?",
        answer: "Naudokite kasdienį valgių sekiklį – tiesiog pridėkite produktus iš mūsų duomenų bazės arba sukurkite savo. Sistema automatiškai apskaičiuos kalorijas ir makroelementus."
      }
    ]
  },
  {
    id: "training",
    title: "Sportas",
    items: [
      {
        question: "Kokias treniruočių programas siūlote?",
        answer: "Siūlome įvairias programas: jėgos treniruotes, kardio, HIIT, jogą, tampymo pratimus ir specializuotas programas skirtingoms raumenų grupėms."
      },
      {
        question: "Ar treniruotės tinka namams?",
        answer: "Taip! Turime daug treniruočių, kurias galite atlikti namuose su minimaliu inventoriumi arba visai be jo."
      }
    ]
  },
  {
    id: "special",
    title: "Specialūs poreikiai",
    items: [
      {
        question: "Ar turite programų nėščiosioms?",
        answer: "Taip, turime specialias programas nėščiosioms ir po gimdymo atsigaunantiems. Šios programos sukurtos atsižvelgiant į kūno pokyčius ir saugumą."
      },
      {
        question: "Ar tinka žmonėms su sveikatos problemomis?",
        answer: "Prieš pradedant bet kokią programą, rekomenduojame pasikonsultuoti su gydytoju. Mūsų programas galima pritaikyti pagal individualius poreikius, tačiau specialių medicininių būklių atveju būtina specialisto konsultacija."
      },
      {
        question: "Ar turite vegetariškų/veganiškų mitybos planų?",
        answer: "Taip! Mūsų mitybos planai apima vegetariškus ir veganiškus variantus. Galite filtruoti receptus pagal savo mitybos pasirinkimus."
      },
      {
        question: "Ar galiu pritaikyti programas pagal savo traumą?",
        answer: "Rekomenduojame pasikonsultuoti su kineziterapeutu ar gydytoju dėl konkrečių pratimų. Mūsų platformoje galite pasirinkti treniruotes, kurios vengia tam tikrų raumenų grupių ar judesių."
      }
    ]
  }
];

export default function KlausimaiPage() {
  const [faqData, setFaqData] = useState<FAQCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const response = await fetch("/api/faq");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setFaqData(data);
          } else {
            setFaqData(fallbackFaqData);
          }
        } else {
          setFaqData(fallbackFaqData);
        }
      } catch (error) {
        console.error("Error fetching FAQ:", error);
        setFaqData(fallbackFaqData);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQ();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Build tabs from categories
  const tabs: TabItem[] = useMemo(() => {
    const categoryTabs = faqData.map((cat) => ({
      id: cat.id,
      label: cat.title,
    }));
    return [{ id: "all", label: "Visi klausimai" }, ...categoryTabs];
  }, [faqData]);

  // Filter categories based on active tab only (no search filtering)
  const filteredCategories = useMemo(() => {
    return activeCategory === "all"
      ? faqData
      : faqData.filter((cat) => cat.id === activeCategory);
  }, [faqData, activeCategory]);

  // Search suggestions for dropdown
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || !isFocused) return [];
    const query = searchQuery.toLowerCase();
    const suggestions: { categoryId: string; categoryTitle: string; index: number; question: string }[] = [];

    faqData.forEach((cat) => {
      cat.items.forEach((item, index) => {
        if (item.question.toLowerCase().includes(query)) {
          suggestions.push({
            categoryId: cat.id,
            categoryTitle: cat.title,
            index,
            question: item.question,
          });
        }
      });
    });

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }, [faqData, searchQuery, isFocused]);

  const toggleItem = (itemKey: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const handleTabChange = (tabId: string) => {
    setActiveCategory(tabId);
    setExpandedItems({});
  };

  const handleSuggestionClick = (categoryId: string, index: number) => {
    const itemKey = `${categoryId}-${index}`;
    // Keep "all" tab so all sections stay visible
    setActiveCategory("all");
    setExpandedItems({ [itemKey]: true });
    setShowDropdown(false);
    setSearchQuery("");

    // Scroll to the question after a short delay to let state update
    setTimeout(() => {
      const element = document.getElementById(`faq-item-${itemKey}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleAskQuestion = async () => {
    if (!questionText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/user-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText.trim() }),
      });

      if (response.ok) {
        setShowAskModal(false);
        setQuestionText("");
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Error submitting question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageTitleBar title="Klausimai" />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
              <span className="ml-3 text-dark-grey">Kraunama...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitleBar title="Klausimai" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="mb-8">
            <CustomTabs
              tabs={tabs}
              activeTab={activeCategory}
              onTabChange={handleTabChange}
              variant="pill"
            />
          </div>

          {/* Search and Ask Section */}
          <div className="rounded-[32px] border border-dashed border-[#9FA4B0] p-8 mb-8">
            <h2
              className="text-[36px] font-semibold text-center text-black mb-2"
              style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
            >
              Nerandi dominančio klausimo?
            </h2>
            <p className="text-center text-dark-grey text-sm-regular mb-6">
              Pasinaudok &quot;paieškos&quot; įvesties langu arba užduok
              <br />
              klausimą mums ir mes atsakysime
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div ref={searchRef} className="relative w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-green z-10" />
                <input
                  type="text"
                  placeholder="Paieška"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    setIsFocused(true);
                    setShowDropdown(true);
                  }}
                  onBlur={() => setIsFocused(false)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-light-grey rounded-full text-sm-regular focus:outline-none focus:border-brand-green transition-colors"
                />
                {/* Search suggestions dropdown */}
                {showDropdown && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-light-grey overflow-hidden z-20">
                    {searchSuggestions.map((suggestion, idx) => (
                      <button
                        key={`${suggestion.categoryId}-${suggestion.index}`}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSuggestionClick(suggestion.categoryId, suggestion.index);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                          idx !== searchSuggestions.length - 1 ? "border-b border-light-grey" : ""
                        }`}
                      >
                        <p className="text-sm text-black line-clamp-1">{suggestion.question}</p>
                        <p className="text-xs text-dark-grey mt-0.5">{suggestion.categoryTitle}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-dark-grey text-sm-regular">arba</span>
              <button
                onClick={() => setShowAskModal(true)}
                className="bg-brand-green hover:bg-brand-green-dark text-white text-sm font-normal px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                Užduoti klausimą
              </button>
            </div>
          </div>

          {/* FAQ Categories with Items */}
          {filteredCategories.length > 0 ? (
            <div className="space-y-6">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-2xl border border-light-grey overflow-hidden"
                >
                  {/* Category Title */}
                  <div className="p-5 pb-0">
                    <h3
                      className="text-[36px] font-semibold text-black"
                      style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
                    >
                      {category.title}
                    </h3>
                  </div>

                  {/* Items */}
                  <div className="mt-4">
                    {category.items.map((item, index) => {
                      const itemKey = `${category.id}-${index}`;
                      const isExpanded = expandedItems[itemKey];

                      return (
                        <div
                          key={itemKey}
                          id={`faq-item-${itemKey}`}
                          className={`${index !== 0 ? "border-t border-light-grey" : ""}`}
                        >
                          <button
                            onClick={() => toggleItem(itemKey)}
                            className="w-full flex justify-between items-center text-left px-5 py-4 hover:bg-white-darken transition-colors"
                          >
                            <span className="text-sm-medium text-black pr-4">
                              {index + 1}. {item.question}
                            </span>
                            {isExpanded ? (
                              <Minus className="w-5 h-5 text-dark-grey flex-shrink-0" />
                            ) : (
                              <Plus className="w-5 h-5 text-dark-grey flex-shrink-0" />
                            )}
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isExpanded
                                ? "max-h-96 opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="px-5 pb-5 text-sm-regular text-dark-grey leading-relaxed">
                              {item.answer}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-light-grey p-8 text-center">
              <p className="text-dark-grey">
                {searchQuery
                  ? "Nerasta klausimų pagal jūsų paiešką."
                  : "Šioje kategorijoje nėra klausimų."}
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Ask Question Modal */}
      <Modal
        isOpen={showAskModal}
        onClose={() => setShowAskModal(false)}
        title="Užduoti klausimą"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1.5">
              Jūsų klausimas
            </label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Įveskite savo klausimą..."
              rows={4}
              className="w-full px-4 py-3 bg-white border border-light-grey rounded-lg text-sm focus:outline-none focus:border-brand-green transition-colors resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAskModal(false)}
              className="flex-1 py-3 px-6 rounded-lg border border-light-grey bg-white text-black font-medium hover:bg-gray-50 transition-colors"
            >
              Atšaukti
            </button>
            <button
              type="button"
              onClick={handleAskQuestion}
              disabled={!questionText.trim() || isSubmitting}
              className="flex-1 py-3 px-6 rounded-lg bg-brand-green text-white font-medium hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Siunčiama..." : "Siųsti"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Jūsų klausimas sėkmingai išsiųstas! Atsakymą gausite el. paštu."
        buttonText="Supratau"
        onButtonClick={() => setShowSuccessModal(false)}
      />
    </>
  );
}
