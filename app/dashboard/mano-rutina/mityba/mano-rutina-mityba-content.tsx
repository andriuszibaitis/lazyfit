"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageTitleBar from "../../components/page-title-bar";
import NutritionPlanCard from "../../mityba/nutrition-plan-card";
import { ChevronLeft, ChevronRight, Trash2, Heart, CheckCircle, PauseCircle } from "lucide-react";
import CreatePlanModal from "./create-plan-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { CustomTabs } from "@/components/ui/custom-tabs";
import { getNutritionPlanIcon } from "@/components/icons/nutrition-plan-icons";

interface NutritionPlan {
  id: string;
  name: string;
  description: string | null;
  benefits: string | null;
  icon: string | null;
  isPopular: boolean;
  image: string;
  daysCount: number;
  mealsPerDay: number;
  avgDailyCalories: number;
  avgDailyProtein: number;
  avgDailyCarbs: number;
  avgDailyFat: number;
  gender: string;
}

interface UserNutritionPlan {
  id: string;
  name: string;
  goal: string;
  activityLevel: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  bmr: number;
  tdee: number;
  targetCalories: number;
  icon: string | null;
  isActive: boolean;
  createdAt: Date;
}

interface UserProfile {
  gender: string | null;
  age: number | null;
}

interface ManoRutinaMitybaContentProps {
  plans: NutritionPlan[];
  userPlans: UserNutritionPlan[];
  hasUserPlans: boolean;
  userProfile: UserProfile;
}

export default function ManoRutinaMitybaContent({ plans, userPlans, hasUserPlans, userProfile }: ManoRutinaMitybaContentProps) {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"my-plans" | "all-plans">("my-plans");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "activate" | "delete" | "pause";
    planId: string;
    planName: string;
  }>({ isOpen: false, type: "activate", planId: "", planName: "" });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openMenuId]);

  const [isActivating, setIsActivating] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  const handlePausePlan = async (planId: string) => {
    if (isPausing) return;

    setIsPausing(true);
    try {
      const response = await fetch(`/api/user-nutrition-plans/${planId}/pause`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Nepavyko pristabdyti plano");
      }

      setConfirmModal({ ...confirmModal, isOpen: false });
      router.refresh();
    } catch (error) {
      console.error("Error pausing plan:", error);
      alert("Nepavyko pristabdyti plano");
    } finally {
      setIsPausing(false);
    }
  };

  const handleActivatePlan = async (planId: string) => {
    if (isActivating) return;

    setIsActivating(true);
    try {
      const response = await fetch(`/api/user-nutrition-plans/${planId}/activate`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Nepavyko aktyvuoti plano");
      }

      setConfirmModal({ ...confirmModal, isOpen: false });
      router.refresh();
    } catch (error) {
      console.error("Error activating plan:", error);
      alert("Nepavyko aktyvuoti plano");
    } finally {
      setIsActivating(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/user-nutrition-plans/${planId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Nepavyko ištrinti plano");
      }

      setConfirmModal({ ...confirmModal, isOpen: false });
      router.refresh();
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Nepavyko ištrinti plano");
    } finally {
      setIsDeleting(false);
    }
  };

  // Scroll animation on mount - scroll from start to end and back to show scrollability
  useEffect(() => {
    if (scrollContainerRef.current && !hasUserPlans && plans.length > 3) {
      const container = scrollContainerRef.current;
      const cardWidth = 300;

      // Scroll right by 2 cards
      setTimeout(() => {
        container.scrollTo({ left: cardWidth * 2, behavior: "smooth" });

        // Then scroll back to start
        setTimeout(() => {
          container.scrollTo({ left: 0, behavior: "smooth" });
        }, 600);
      }, 400);
    }
  }, [hasUserPlans, plans.length]);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const cardWidth = 300;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case "maintain": return "Palaikyti svorį";
      case "lose": return "Numesti svorio";
      case "gain": return "Priaugti svorio";
      default: return goal;
    }
  };

  // If user has plans, show tabs view
  if (hasUserPlans) {
    return (
      <>
        <PageTitleBar title="Mano rutina" />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
              {/* Tabs */}
              <CustomTabs
                tabs={[
                  { id: "my-plans", label: "Mano planai" },
                  { id: "all-plans", label: "Visi planai" },
                ]}
                activeTab={activeTab}
                onTabChange={(tabId) => setActiveTab(tabId as "my-plans" | "all-plans")}
                className="mb-6"
              />

              {/* Tab content */}
              {activeTab === "my-plans" && (
                <div>
                  {/* User plans list */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                    {userPlans.map((plan) => {
                      // Mock data for demo - in real app this would come from tracking
                      const consumedCalories = plan.isActive ? 95 : 0;
                      const progressPercent = Math.round((consumedCalories / plan.targetCalories) * 100);
                      const today = new Date();
                      const formattedDate = today.toLocaleDateString("lt-LT", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });

                      return (
                        <div
                          key={plan.id}
                          onClick={() => router.push(`/dashboard/mano-rutina/mityba/planas/${plan.id}`)}
                          className="bg-white rounded-2xl p-5 border border-[#EFEFEF] hover:shadow-sm transition-shadow cursor-pointer"
                        >
                          {/* Header row */}
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                              plan.isActive ? "bg-[#ECFFDF]" : "bg-[#F5F5F5]"
                            }`}>
                              {(() => {
                                const IconComponent = plan.icon ? getNutritionPlanIcon(plan.icon) : Heart;
                                return (
                                  <IconComponent
                                    className={`w-6 h-6 ${plan.isActive ? "text-[#60988E]" : "text-[#9FA4B0]"}`}
                                  />
                                );
                              })()}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              {/* Title row with badge and menu */}
                              <div className="flex items-center gap-3 mb-1">
                                <h3
                                  className="text-[#101827] text-[28px] font-semibold truncate"
                                  style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
                                >
                                  {plan.name}
                                </h3>
                                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium font-[Outfit] whitespace-nowrap ${
                                  plan.isActive
                                    ? "bg-[#60988E] text-white"
                                    : "bg-[#F5F5F5] text-[#6B7280] border border-[#E6E6E6]"
                                }`}>
                                  {plan.isActive ? "Aktyvūs planas" : "Planas pristabdytas"}
                                </span>
                                <div className="relative ml-auto flex-shrink-0">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenMenuId(openMenuId === plan.id ? null : plan.id);
                                    }}
                                    className="w-8 h-8 rounded-lg border border-[#E6E6E6] flex items-center justify-center hover:bg-gray-50 transition-colors"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <circle cx="8" cy="3" r="1.5" fill="#6B7280"/>
                                      <circle cx="8" cy="8" r="1.5" fill="#6B7280"/>
                                      <circle cx="8" cy="13" r="1.5" fill="#6B7280"/>
                                    </svg>
                                  </button>

                                  {/* Dropdown menu */}
                                  {openMenuId === plan.id && (
                                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-[#E6E6E6] shadow-lg z-20 min-w-[180px] py-1">
                                      {!plan.isActive && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuId(null);
                                            setConfirmModal({
                                              isOpen: true,
                                              type: "activate",
                                              planId: plan.id,
                                              planName: plan.name,
                                            });
                                          }}
                                          className="w-full px-4 py-2.5 text-left text-sm font-[Outfit] text-[#101827] hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                          <CheckCircle className="w-4 h-4 text-[#60988E]" />
                                          Aktyvuoti planą
                                        </button>
                                      )}
                                      {plan.isActive && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuId(null);
                                            setConfirmModal({
                                              isOpen: true,
                                              type: "pause",
                                              planId: plan.id,
                                              planName: plan.name,
                                            });
                                          }}
                                          className="w-full px-4 py-2.5 text-left text-sm font-[Outfit] text-[#101827] hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                          <PauseCircle className="w-4 h-4 text-[#F59E0B]" />
                                          Pristabdyti planą
                                        </button>
                                      )}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenMenuId(null);
                                          setConfirmModal({
                                            isOpen: true,
                                            type: "delete",
                                            planId: plan.id,
                                            planName: plan.name,
                                          });
                                        }}
                                        className="w-full px-4 py-2.5 text-left text-sm font-[Outfit] text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Ištrinti planą
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Meta info */}
                              <p className="text-[#6B7280] text-sm font-[Outfit]">
                                Tikslas: {getGoalLabel(plan.goal)} <span className="mx-2">·</span> kcal diena: {Math.round(plan.targetCalories)} kcal
                              </p>
                            </div>
                          </div>

                          {/* Date */}
                          <p className="text-[#9FA4B0] text-sm font-[Outfit] mt-4 mb-2">
                            {formattedDate}
                          </p>

                          {/* Progress bar */}
                          <div className="w-full h-2 bg-[#F0F0F0] rounded-full overflow-hidden mb-2">
                            <div
                              className={`h-full rounded-full transition-all ${
                                plan.isActive ? "bg-[#60988E]" : "bg-[#D1D5DB]"
                              }`}
                              style={{ width: `${Math.min(progressPercent, 100)}%` }}
                            />
                          </div>

                          {/* Calories info */}
                          <div className="flex items-center justify-between text-sm font-[Outfit]">
                            <span className={plan.isActive ? "text-[#60988E] font-medium" : "text-[#9FA4B0]"}>
                              {consumedCalories} kcal
                            </span>
                            <span className="text-[#9FA4B0]">
                              {progressPercent} %
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Create new plan button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-[#60988E] text-white py-3 px-6 rounded-full font-medium hover:bg-[#34786C] transition-colors font-[Outfit]"
                    >
                      Sukurti naują planą
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "all-plans" && (
                <div className="mt-6">
                  {/* Grid layout - same as /dashboard/mityba/mitybos-planai */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <NutritionPlanCard key={plan.id} plan={plan} />
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Create plan modal */}
        <CreatePlanModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          userProfile={userProfile}
        />

        {/* Confirm modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={() => {
            if (confirmModal.type === "activate") {
              handleActivatePlan(confirmModal.planId);
            } else if (confirmModal.type === "pause") {
              handlePausePlan(confirmModal.planId);
            } else {
              handleDeletePlan(confirmModal.planId);
            }
          }}
          title={
            confirmModal.type === "activate"
              ? `Ar tikrai norite aktyvuoti mitybos planą "${confirmModal.planName}"?`
              : confirmModal.type === "pause"
              ? `Ar tikrai norite pristabdyti mitybos planą "${confirmModal.planName}"?`
              : `Ar tikrai norite ištrinti mitybos planą "${confirmModal.planName}"?`
          }
          description={
            confirmModal.type === "activate"
              ? `Kai suaktyvinsite ${confirmModal.planName} planą, dabartinis jūsų planas bus automatiškai sustabdytas. Pradėkime!`
              : confirmModal.type === "pause"
              ? `Kai pristabdysite ${confirmModal.planName} planą, jis nebebus aktyvus ir kalorijos nebus skaičiuojamos.`
              : "Šis veiksmas negrįžtamas. Planas bus ištrintas visam laikui."
          }
          confirmText={
            confirmModal.type === "activate"
              ? "Aktyvuoti"
              : confirmModal.type === "pause"
              ? "Pristabdyti"
              : "Ištrinti"
          }
          cancelText="Atšaukti"
          isLoading={
            confirmModal.type === "activate"
              ? isActivating
              : confirmModal.type === "pause"
              ? isPausing
              : isDeleting
          }
          variant={confirmModal.type === "delete" ? "danger" : "default"}
        />
      </>
    );
  }

  // If user has no plans, show selection view
  return (
    <>
      <PageTitleBar title="Mano rutina" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
            {/* Header with title and navigation arrows */}
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-[36px] font-semibold text-[#101827]"
                style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
              >
                Pasirinkite mitybos planą
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => scroll(scrollContainerRef, "left")}
                  className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => scroll(scrollContainerRef, "right")}
                  className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Scrollable container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pt-4 pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {plans.map((plan) => (
                <div key={plan.id} className="flex-shrink-0 w-[280px]">
                  <NutritionPlanCard plan={plan} />
                </div>
              ))}
            </div>

            {/* Or section with button */}
            <div className="flex flex-col items-center mt-8">
              <span className="text-[#6B7280] text-sm font-[Outfit] mb-4">arba</span>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#60988E] text-white py-3 px-6 rounded-full font-medium hover:bg-[#34786C] transition-colors font-[Outfit]"
              >
                Sukurti savo mitybos planą
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create plan modal */}
      <CreatePlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        userProfile={userProfile}
      />
    </>
  );
}
