import PageTitleBar from "../components/page-title-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Clock, UtensilsCrossed, ChefHat } from "lucide-react";

const fakeRecipes = [
  {
    id: 1,
    title: "Vištienos krūtinėlė su daržovėmis",
    calories: 380,
    protein: 42,
    prepTime: 30,
    difficulty: "Lengvas",
    image: null,
  },
  {
    id: 2,
    title: "Avižinė košė su bananais ir medumi",
    calories: 320,
    protein: 12,
    prepTime: 10,
    difficulty: "Lengvas",
    image: null,
  },
  {
    id: 3,
    title: "Lašišos filė su ryžiais",
    calories: 520,
    protein: 38,
    prepTime: 25,
    difficulty: "Vidutinis",
    image: null,
  },
  {
    id: 4,
    title: "Graikiškas jogurtas su uogomis",
    calories: 180,
    protein: 15,
    prepTime: 5,
    difficulty: "Lengvas",
    image: null,
  },
  {
    id: 5,
    title: "Avinžirnių salotos",
    calories: 290,
    protein: 14,
    prepTime: 15,
    difficulty: "Lengvas",
    image: null,
  },
  {
    id: 6,
    title: "Tuno salotų sumuštiniai",
    calories: 350,
    protein: 28,
    prepTime: 10,
    difficulty: "Lengvas",
    image: null,
  },
];

export default function PamegtiReceptaiPage() {
  return (
    <>
      <PageTitleBar title="Pamėgti receptai" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
            <div className="mb-6">
              <h2
                className="text-[36px] font-semibold text-[#101827]"
                style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
              >
                Pamėgti receptai
              </h2>
              <p className="text-[#6B7280] mt-2">
                Jūsų mėgstamiausių receptų kolekcija
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fakeRecipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-gray-100 h-36 flex items-center justify-center">
                    <ChefHat className="h-10 w-10 text-gray-300" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-base line-clamp-1">
                        {recipe.title}
                      </h3>
                      <button className="text-red-400 hover:text-red-500 shrink-0 ml-2">
                        <Heart className="h-5 w-5 fill-current" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {recipe.prepTime} min
                      </span>
                      <span>{recipe.calories} kcal</span>
                      <span>{recipe.protein}g balt.</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                        {recipe.difficulty}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        Peržiūrėti
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
