"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PageTitleBar from "../components/page-title-bar";
import { TabItem } from "../../components/tabs";
import Tabs from "../../components/tabs";
import ProfileAvatar from "../../components/profile-avatar";
import FormField from "../../components/form-field";
import PasswordSection from "../../components/password-section";
import DeleteAccount from "../../components/delete-account";
import Toggle from "../../components/toggle";
import MembershipUpgradeModal from "../../components/membership-upgrade-modal";
import MembershipCancellationModal from "../../components/membership-cancellation-modal";
import SuccessModal from "../../components/success-modal";

export default function AsmeninemPaskyraPage() {
  const { data: session, update: updateSession } = useSession();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    birthDate: "",
    gender: "Nepasirenkta",
    avatar: null as string | null,
    provider: "credentials",
    emailNotifications: true,
    generalNotifications: true
  });
  const [membershipSubTab, setMembershipSubTab] = useState("billing");
  const [membershipData, setMembershipData] = useState<any>(null);
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [invoicesData, setInvoicesData] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [showAllMemberships, setShowAllMemberships] = useState(false);
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [expandedFaqItems, setExpandedFaqItems] = useState<{ [key: number]: boolean }>({ 0: true });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const user = await response.json();
          setUserData({
            name: user.name || "",
            email: user.email || "",
            birthDate: user.birthDate ? user.birthDate.split('T')[0] : "",
            gender: user.gender || "Nepasirenkta",
            avatar: user.image,
            provider: user.provider || "credentials",
            emailNotifications: user.emailNotifications ?? true,
            generalNotifications: user.generalNotifications ?? true
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchUserData();
    }
  }, [session]);

  const tabs: TabItem[] = [
    {
      id: "personal",
      label: "Asmeninė informacija"
    },
    {
      id: "reports",
      label: "Pranešimai"
    },
    {
      id: "members",
      label: "Narystė"
    }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

    // Fetch membership data when switching to members tab
    if (tabId === "members" && !membershipData) {
      fetchMembershipData();
    }
  };

  const handleMembershipSubTabChange = (subTabId: string) => {
    setMembershipSubTab(subTabId);

    // Fetch invoices data when switching to invoices tab
    if (subTabId === "invoices" && invoicesData.length === 0) {
      fetchInvoicesData();
    }
  };

  const fetchMembershipData = async () => {
    setMembershipLoading(true);
    try {
      const response = await fetch("/api/user/membership");
      if (response.ok) {
        const data = await response.json();
        setMembershipData(data);
      }
    } catch (error) {
      console.error("Error fetching membership data:", error);
    } finally {
      setMembershipLoading(false);
    }
  };

  const fetchInvoicesData = async () => {
    setInvoicesLoading(true);
    try {
      const response = await fetch("/api/user/invoices");
      if (response.ok) {
        const data = await response.json();
        setInvoicesData(data);
      }
    } catch (error) {
      console.error("Error fetching invoices data:", error);
    } finally {
      setInvoicesLoading(false);
    }
  };

  const handleFieldSave = async (field: string, value: string) => {
    setSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(prev => ({
          ...prev,
          [field]: value
        }));

        // Update session if needed
        if (field === "name" || field === "email") {
          await updateSession();
        }
      } else {
        const error = await response.json();
        alert(`Klaida: ${error.error}`);
      }
    } catch (error) {
      console.error("Error saving field:", error);
      alert("Klaida išsaugant pakeitimus");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUserData(prev => ({
          ...prev,
          avatar: result.imageUrl
        }));

        // Update session with new image
        await updateSession();
      } else {
        const error = await response.json();
        alert(`Klaida: ${error.error}`);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Klaida įkeliant nuotrauką");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarRemove = async () => {
    setUploadingAvatar(true);
    try {
      const response = await fetch("/api/user/avatar", {
        method: "DELETE",
      });

      if (response.ok) {
        setUserData(prev => ({
          ...prev,
          avatar: null
        }));

        // Update session
        await updateSession();
      } else {
        const error = await response.json();
        alert(`Klaida: ${error.error}`);
      }
    } catch (error) {
      console.error("Error removing avatar:", error);
      alert("Klaida šalinant nuotrauką");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    setChangingPassword(true);
    try {
      const response = await fetch("/api/user/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        alert("Slaptažodis sėkmingai pakeistas!");
        return true;
      } else {
        const error = await response.json();
        alert(`Klaida: ${error.error}`);
        return false;
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Klaida keičiant slaptažodį");
      return false;
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    // This would need a separate API endpoint for account deletion
    alert("Account deletion functionality would be implemented here");
  };

  const toggleFaqItem = (index: number) => {
    setExpandedFaqItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleNotificationChange = async (field: 'emailNotifications' | 'generalNotifications', value: boolean) => {
    setSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (response.ok) {
        setUserData(prev => ({
          ...prev,
          [field]: value
        }));
      } else {
        const error = await response.json();
        alert(`Klaida: ${error.error}`);
        // Revert the change if it failed
        setUserData(prev => ({
          ...prev,
          [field]: !value
        }));
      }
    } catch (error) {
      console.error("Error saving notification setting:", error);
      alert("Klaida išsaugant nustatymą");
      // Revert the change if it failed
      setUserData(prev => ({
        ...prev,
        [field]: !value
      }));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 font-outfit">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Form fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
                <FormField
                  key="name"
                  label="Vardas, pavardė"
                  value={userData.name}
                  onSave={(value) => handleFieldSave("name", value)}
                  placeholder="Įveskite vardą ir pavardę"
                  className="border-0 p-0"
                  disabled={saving}
                />

                <FormField
                  key="email"
                  label="El. paštas"
                  value={userData.email}
                  type="email"
                  onSave={(value) => handleFieldSave("email", value)}
                  placeholder="Įveskite el. paštą"
                  className="border-0 p-0"
                  disabled={saving}
                  additionalContent={
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-blue-600">Google</span>
                      <span className="text-gray-400">
                        Jūsų prijungta „Google" paskyra yra {userData.email}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800">
                        Atjungti
                      </button>
                    </div>
                  }
                />

                <FormField
                  key="birthDate"
                  label="Gimimo data"
                  value={userData.birthDate}
                  type="date"
                  onSave={(value) => handleFieldSave("birthDate", value)}
                  className="border-0 p-0"
                  disabled={saving}
                />

                <div className="border-0 p-0">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Lytis</label>
                  </div>
                  <div className="flex items-center space-x-6">
                    {["Nepasirenkta", "Vyras", "Moteris"].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value={option}
                          checked={userData.gender === option}
                          onChange={async (e) => {
                            setUserData(prev => ({
                              ...prev,
                              gender: e.target.value
                            }));
                            await handleFieldSave("gender", e.target.value);
                          }}
                          disabled={saving}
                          className="mr-2 w-4 h-4 text-[#60988E] border-gray-300 focus:ring-[#60988E] focus:ring-2 disabled:opacity-50"
                          style={{
                            accentColor: '#60988E'
                          }}
                        />
                        <span className={`text-sm ${saving ? 'text-gray-400' : 'text-gray-900'}`}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <PasswordSection
                onPasswordChange={handlePasswordChange}
                loading={changingPassword}
                isOAuthUser={userData.provider !== "credentials"}
              />

              {/* Delete Account Section */}
              <DeleteAccount
                onDelete={handleDeleteAccount}
                userEmail={userData.email}
              />
            </div>

            {/* Right column - Profile Avatar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <ProfileAvatar
                  src={userData.avatar || undefined}
                  userName={userData.name}
                  onImageChange={handleAvatarChange}
                  onImageRemove={handleAvatarRemove}
                  loading={uploadingAvatar}
                />
              </div>
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="space-y-0">
                  {/* El. pašto įspėjimai */}
                  <div className="flex items-start justify-between py-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        El. pašto įspėjimai
                      </h3>
                      <p className="text-gray-600">
                        El. pašto įspėjimai apie pranešimus ar reklaminius pasiūlymus
                      </p>
                    </div>
                    <div className="ml-6">
                      <Toggle
                        checked={userData.emailNotifications}
                        onChange={(value) => handleNotificationChange('emailNotifications', value)}
                        size="md"
                        disabled={saving}
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200"></div>

                  {/* Bendri įspėjimai */}
                  <div className="flex items-start justify-between py-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Bendri įspėjimai
                      </h3>
                      <p className="text-gray-600">
                        Bendri įspėjimai apie pranešimus ar reklaminius pasiūlymus
                      </p>
                    </div>
                    <div className="ml-6">
                      <Toggle
                        checked={userData.generalNotifications}
                        onChange={(value) => handleNotificationChange('generalNotifications', value)}
                        size="md"
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "members":
        const membershipSubTabs: TabItem[] = [
          {
            id: "billing",
            label: "Mokėtojo informacija"
          },
          {
            id: "invoices",
            label: "Sąskaitos ir mokėjimai"
          },
          {
            id: "plans",
            label: "Visi planai"
          }
        ];

        const renderMembershipSubContent = () => {
          if (membershipLoading) {
            return (
              <div className="w-full">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="text-center py-8">
                    <p className="text-gray-600">Kraunami narystės duomenys...</p>
                  </div>
                </div>
              </div>
            );
          }

          switch (membershipSubTab) {
            case "billing":
              const userMembership = membershipData?.userMembership;
              const currentMembership = userMembership?.membership;

              return (
                <div className="w-full">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="space-y-8">
                        {/* Prenumeratos section */}
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prenumeratos</h2>
                          <p className="text-gray-600 mb-6">Prekės, už kurias mokate periodiškai, pvz., „LazyFit" planas ir programos.</p>

                          {currentMembership ? (
                            <div className="border border-gray-200 rounded-lg p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentMembership.name}</h3>
                                  <p className="text-gray-600">
                                    Kaina: {Number(currentMembership.price)} €/{currentMembership.duration === 30 ? 'mėn' : currentMembership.duration + ' d.'}
                                  </p>
                                  {userMembership.membershipExpiry && (
                                    <p className="text-gray-600">
                                      Pasibaigia {new Date(userMembership.membershipExpiry).toLocaleDateString('lt-LT')}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-500 mt-1">
                                    Būsena: {userMembership.membershipStatus === 'active' ? 'Aktyvi' : 'Neaktyvi'}
                                  </p>
                                </div>
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => setShowUpgradeModal(true)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                  >
                                    Pereiti prie 3 mėn narystės (sutaupysite 25 %)
                                  </button>
                                  <button
                                    onClick={() => setShowCancellationModal(true)}
                                    className="px-4 py-2 text-[#60988E] hover:text-[#4a7168]"
                                  >
                                    Atsisakyti narystės
                                  </button>
                                </div>
                              </div>

                              <div className="border border-gray-200 rounded-lg mt-4">
                                <button
                                  onClick={() => setShowAllMemberships(!showAllMemberships)}
                                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                  <span className="text-gray-900 font-medium">Visos narystės</span>
                                  <svg
                                    className={`w-5 h-5 text-gray-400 transition-transform ${showAllMemberships ? 'rotate-90' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>

                                {showAllMemberships && (
                                  <div className="border-t border-gray-200 p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      {membershipData?.availableMemberships?.map((membership: any) => (
                                        <div
                                          key={membership.id}
                                          className={`p-4 border rounded-lg ${
                                            currentMembership?.planId === membership.planId
                                              ? 'border-[#60988E] bg-[#60988E]/5'
                                              : 'border-gray-200'
                                          }`}
                                        >
                                          <h4 className="font-semibold text-base mb-1">{membership.name}</h4>
                                          <p className="text-lg font-bold text-[#60988E] mb-2">
                                            {Number(membership.price)} €
                                            <span className="text-sm font-normal text-gray-600">
                                              /{membership.duration === 30 ? 'mėn' : membership.duration + ' d.'}
                                            </span>
                                          </p>

                                          {membership.features && (
                                            <ul className="text-xs text-gray-600 mb-3 space-y-1">
                                              {JSON.parse(membership.features as string).slice(0, 2).map((feature: string, index: number) => (
                                                <li key={index} className="flex items-center">
                                                  <svg className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                  </svg>
                                                  {feature}
                                                </li>
                                              ))}
                                            </ul>
                                          )}

                                          <button
                                            className={`w-full py-2 px-3 text-sm rounded-md transition-colors ${
                                              currentMembership?.planId === membership.planId
                                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                : 'bg-[#60988E] text-white hover:bg-[#4a7168]'
                                            }`}
                                            disabled={currentMembership?.planId === membership.planId}
                                          >
                                            {currentMembership?.planId === membership.planId ? 'Dabartinis' : 'Pasirinkti'}
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="border border-gray-200 rounded-lg p-6">
                              <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nemate jokių narysčių</h3>
                                <p className="text-gray-600 mb-4">Šiuo metu neturite aktyvios narystės</p>
                                <button className="bg-[#60988E] text-white px-6 py-2 rounded-md hover:bg-[#4a7168] transition-colors">
                                  Peržiūrėti planus
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Atsiskaitymo ir Mokėjimo informacija sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Atsiskaitymo informacija</h3>

                            {!showBillingForm ? (
                              <>
                                <p className="text-gray-600 mb-4">Pridėkite išsamią atsiskaitymo informaciją, kad sąskaitos faktūros būtų atnaujintos.</p>
                                <button
                                  onClick={() => setShowBillingForm(true)}
                                  className="bg-[#60988E] text-white px-6 py-2 rounded-md hover:bg-[#4a7168] transition-colors"
                                >
                                  Pridėti atsiskaitymo informaciją
                                </button>
                              </>
                            ) : (
                              <form className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mokėtojas
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Vardas Pavardė"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60988E] focus:border-transparent"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    El. paštas
                                  </label>
                                  <input
                                    type="email"
                                    placeholder="jusu@email.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60988E] focus:border-transparent"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Šalis
                                  </label>
                                  <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60988E] focus:border-transparent bg-white">
                                    <option>Lietuva</option>
                                    <option>Latvija</option>
                                    <option>Estija</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Adresas
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="V. Druskio 10 - 139"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60988E] focus:border-transparent"
                                  />
                                </div>

                                <div className="flex gap-3 pt-4">
                                  <button
                                    type="button"
                                    onClick={() => setShowBillingForm(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    Atšaukti
                                  </button>
                                  <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-[#60988E] text-white rounded-md hover:bg-[#4a7168] transition-colors"
                                  >
                                    Išsaugoti
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>

                          <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mokėjimo informacija</h3>

                            {!showPaymentForm ? (
                              <>
                                <p className="text-gray-600 mb-4">Pridėkite mokėjimo metodą, kad galėtumėte įsigyti narystę.</p>
                                <button
                                  onClick={() => setShowPaymentForm(true)}
                                  className="bg-[#60988E] text-white px-6 py-2 rounded-md hover:bg-[#4a7168] transition-colors"
                                >
                                  Pridėti mokėjimo metodą
                                </button>
                              </>
                            ) : (
                              <form className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kortelės numeris
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      placeholder="0000 0000 0000 0000"
                                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60988E] focus:border-transparent"
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <rect x="3" y="4" width="18" height="12" rx="2" ry="2"/>
                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                      </svg>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Galiojimo data
                                    </label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        placeholder="DD.MM.YYYY"
                                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60988E] focus:border-transparent"
                                      />
                                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <rect x="3" y="4" width="18" height="16" rx="2" ry="2"/>
                                          <line x1="16" y1="2" x2="16" y2="6"/>
                                          <line x1="8" y1="2" x2="8" y2="6"/>
                                          <line x1="3" y1="10" x2="21" y2="10"/>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Saugos kodas
                                    </label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        placeholder="CVC"
                                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60988E] focus:border-transparent"
                                      />
                                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <circle cx="12" cy="12" r="3"/>
                                          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Šalis
                                  </label>
                                  <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60988E] focus:border-transparent bg-white">
                                    <option>Lietuva</option>
                                    <option>Latvija</option>
                                    <option>Estija</option>
                                  </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                  <button
                                    type="button"
                                    onClick={() => setShowPaymentForm(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    Atšaukti
                                  </button>
                                  <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-[#60988E] text-white rounded-md hover:bg-[#4a7168] transition-colors"
                                  >
                                    Išsaugoti
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              );
            case "invoices":
              if (invoicesLoading) {
                return (
                  <div className="w-full">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="text-center py-8">
                        <p className="text-gray-600">Kraunami sąskaitų duomenys...</p>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div className="w-full">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-6">Sąskaitos ir mokėjimai</h3>

                    {invoicesData.length > 0 ? (
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="grid grid-cols-4 gap-4 pb-4 border-b border-gray-200">
                          <div className="font-semibold text-gray-900">Data</div>
                          <div className="font-semibold text-gray-900">Aprašymas</div>
                          <div className="font-semibold text-gray-900">Suma</div>
                          <div className="font-semibold text-gray-900"></div>
                        </div>

                        {/* Invoice rows */}
                        {invoicesData.map((invoice) => (
                          <div key={invoice.id} className="grid grid-cols-4 gap-4 py-4 border-b border-gray-100 last:border-b-0">
                            <div className="text-gray-900">
                              {new Date(invoice.date).toLocaleDateString('lt-LT', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="text-gray-900">
                              {invoice.membershipName || invoice.description || 'Narystės mokestis'}
                            </div>
                            <div className="text-gray-900">
                              €{Number(invoice.amount).toFixed(2)}
                            </div>
                            <div className="text-right">
                              {invoice.pdfUrl ? (
                                <a
                                  href={invoice.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Peržiūrėti sąskaitą (PDF)
                                </a>
                              ) : (
                                <button
                                  disabled
                                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-400 cursor-not-allowed"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Peržiūrėti sąskaitą (PDF)
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600">Nėra sąskaitų istorijos</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            case "plans":
              const availableMemberships = membershipData?.availableMemberships || [];
              const planUserMembership = membershipData?.userMembership;

              const formatDuration = (days: number): string => {
                if (days % 365 === 0) {
                  const years = days / 365;
                  return `${years} ${years === 1 ? "metų" : "metų"}`;
                } else if (days % 30 === 0) {
                  const months = days / 30;
                  return `${months} ${months === 1 ? "mėn." : "mėn."}`;
                } else {
                  return `${days} ${days === 1 ? "dienos" : "dienų"}`;
                }
              };

              const formatPrice = (price: number | string): string => {
                const numPrice = typeof price === "number" ? price : Number.parseFloat(String(price));
                if (isNaN(numPrice)) {
                  return "0,00 €";
                }
                return numPrice.toFixed(2).replace(".", ",") + " €";
              };

              const calculateDiscountedPrice = (price: number | string, discountPercentage: number): number => {
                const numPrice = typeof price === "number" ? price : Number.parseFloat(String(price));
                return numPrice * (1 - discountPercentage / 100);
              };

              const calculateTotalPrice = (price: number | string, days: number): number => {
                const numPrice = typeof price === "number" ? price : Number.parseFloat(String(price));
                const months = days / 30;
                return numPrice * months;
              };

              const parseFeatures = (features: any): Array<{ text: string; included: boolean }> => {
                if (Array.isArray(features)) {
                  return features.map((feature) => ({
                    text: String(feature),
                    included: true,
                  }));
                } else if (typeof features === "object" && features !== null) {
                  try {
                    return Object.values(features).map((feature) => ({
                      text: String(feature),
                      included: true,
                    }));
                  } catch (e) {
                    return [];
                  }
                } else if (typeof features === "string") {
                  try {
                    const parsedFeatures = JSON.parse(features);
                    if (Array.isArray(parsedFeatures)) {
                      return parsedFeatures.map((feature) => ({
                        text: String(feature),
                        included: true,
                      }));
                    }
                    return [];
                  } catch (e) {
                    return features
                      .split("\n")
                      .filter(Boolean)
                      .map((feature) => ({
                        text: feature.trim(),
                        included: true,
                      }));
                  }
                }
                return [];
              };

              return (
                <div className="w-full">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-6">Visi planai</h3>

                    {availableMemberships.length > 0 ? (
                      <div className="flex justify-center items-stretch gap-6 overflow-x-auto">
                        {availableMemberships.map((membership: any) => {
                          const durationText = formatDuration(membership.duration);
                          const pricePerMonth = membership.price;
                          const totalPrice = calculateTotalPrice(pricePerMonth, membership.duration);
                          const discountedTotalPrice = calculateDiscountedPrice(totalPrice, membership.discountPercentage || 0);
                          const featuresList = parseFeatures(membership.features);
                          const isCurrentPlan = planUserMembership?.planId === membership.planId;

                          return (
                            <div
                              key={membership.id}
                              className={`bg-[#EFEFEF] shadow-lg rounded-xl p-6 text-[#101827] w-full max-w-sm md:max-w-md flex flex-col justify-between border-2 ${
                                isCurrentPlan ? 'border-[#60988E]' : 'border-transparent'
                              } transition-colors duration-300`}
                            >
                              <div className="flex items-center justify-center mt-4">
                                <h3 className="text-[32px] uppercase font-['mango'] flex items-center">
                                  {membership.name}
                                  {membership.discountPercentage > 0 && (
                                    <div className="ml-4 bg-[#FFD16E] text-black rounded-full w-16 h-16 flex items-center justify-center text-sm font-bold">
                                      {membership.discountPercentage}%
                                    </div>
                                  )}
                                </h3>
                              </div>

                              <div className="mt-4 text-center h-32">
                                <p className="text-sm font-medium">{durationText} narystė</p>
                                <p className="mt-2 py-2 px-4 border-[1px] border-[#60988E] rounded-full inline-block text-[15px] font-semibold">
                                  {formatPrice(pricePerMonth)}/mėnuo
                                </p>
                                {membership.discountPercentage > 0 && (
                                  <>
                                    <p className="text-sm mt-2 line-through text-gray-500">
                                      {formatPrice(totalPrice)}
                                    </p>
                                    <p className="text-sm text-[#101827] font-semibold">
                                      → {formatPrice(discountedTotalPrice)}
                                    </p>
                                  </>
                                )}
                              </div>

                              <ul className="mt-4 space-y-2 text-sm">
                                {featuresList.map((feature, featureIndex) => (
                                  <li key={featureIndex} className="flex items-center">
                                    <span className="text-green-600 mr-2">✔️</span>
                                    {feature.text}
                                  </li>
                                ))}
                              </ul>

                              <button
                                className={`font-['mango'] italic text-[28px] font-bold py-2 px-4 mt-6 rounded-lg w-full transition ${
                                  isCurrentPlan
                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                    : 'bg-[#101827] text-white hover:bg-[#EFEFEF] hover:text-[#101827]'
                                }`}
                                disabled={isCurrentPlan}
                              >
                                {isCurrentPlan ? 'Dabartinis planas' : 'Išsirinkti narystę'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600">Nėra dostupnų planų</p>
                      </div>
                    )}

                    {/* FAQ Section */}
                    <div className="mt-12">
                      <h2 className="text-[32px] uppercase font-['mango'] font-bold text-[#101827] mb-8">DUK</h2>

                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        {[
                          {
                            question: "1. Kaip veikia kalorijų skaičiuoklė?",
                            answer: "Kalorijų skaičiuoklė naudoja vartotojo įvestus duomenis, tokius kaip amžius, lytis, ūgis, svoris ir fizinis aktyvumas, kad apskaičiuotų bazinę medžiagų apykaitą (BMR) ir rekomenduojamą dienos kalorijų normą pagal pasirinktą tikslą (numesti svorio, išlaikyti esamą svorį ar priaugti svorio)."
                          },
                          {
                            question: "2. Ar kalorijų skaičiuoklė tinka visiems žmonėms?",
                            answer: "Kalorijų skaičiuoklė yra tinkama daugumai suaugusiųjų, tačiau nėra rekomenduojama nėščioms ar maitinančioms moterims, vaikams ir paaugliams be gydytojo konsultacijos."
                          },
                          {
                            question: "3. Ar galima skaičiuoti kalorijas sportuojant?",
                            answer: "Taip, sportuojant kalorijų poreikis padidėja. Skaičiuoklė atsižvelgia į jūsų fizinio aktyvumo lygį ir atitinkamai koreguoja dienos kalorijų normą."
                          },
                          {
                            question: "4. Kiek kartų per dieną reikėtų tikrinti savo kalorijų suvartojimą?",
                            answer: "Rekomenduojama sekti kalorijas visą dieną, įrašant maistą iš karto po valgymo. Tai padės tiksliau apskaičiuoti suvartotų kalorijų kiekį."
                          },
                          {
                            question: "5. Ar kalorijų skaičiuoklė padeda numesti svorio?",
                            answer: "Kalorijų skaičiuoklė yra puikus įrankis svorio kontrolei, nes padeda sekti energijos balansą. Norint numesti svorio, reikia suvartoti mažiau kalorijų nei išeikvojate."
                          }
                        ].map((faq, index) => (
                          <div key={index} className={`${index !== 0 ? 'border-t border-gray-200' : ''}`}>
                            <button
                              onClick={() => toggleFaqItem(index)}
                              className="w-full flex justify-between items-center text-left p-6 hover:bg-gray-50 transition-colors"
                            >
                              <h3 className="text-lg font-semibold text-[#101827] pr-4">
                                {faq.question}
                              </h3>
                              <span className="text-2xl font-bold text-[#101827] flex-shrink-0">
                                {expandedFaqItems[index] ? '−' : '+'}
                              </span>
                            </button>
                            {expandedFaqItems[index] && (
                              <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                {faq.answer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            default:
              return null;
          }
        };

        return (
          <div className="space-y-6">
            <Tabs
              tabs={membershipSubTabs}
              activeTab={membershipSubTab}
              onTabChange={handleMembershipSubTabChange}
              variant="sub"
            />
            {renderMembershipSubContent()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <PageTitleBar
        title="Asmeninė paskyra"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <div className="flex-1 p-6 font-outfit">
        <div className="max-w-7xl mx-auto">
          {renderTabContent()}
        </div>
      </div>

      {/* Membership Upgrade Modal */}
      <MembershipUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentMembership={membershipData?.userMembership}
        availableMemberships={membershipData?.availableMemberships}
      />

      {/* Membership Cancellation Modal */}
      <MembershipCancellationModal
        isOpen={showCancellationModal}
        onClose={() => setShowCancellationModal(false)}
        onCancel={() => {
          // Handle cancellation logic here
          console.log('Membership cancelled');
          setShowCancellationModal(false);
          setShowSuccessModal(true);
        }}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Jūsų narystė sėkmingai atšaukta!"
        buttonText="Į pradinis puslapį"
      />
    </>
  );
}