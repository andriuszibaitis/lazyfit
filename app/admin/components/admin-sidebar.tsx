"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Settings,
  Mail,
  Shield,
  BarChart,
  FileText,
  Menu,
  X,
  CreditCard,
  ChevronDown,
  Dumbbell,
  Utensils,
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  Apple,
  Tag,
  List,
  HelpCircle,
  MessageSquareMore,
  Trophy,
} from "lucide-react";
import { useState, useEffect } from "react";

type RecipeCategory = {
  id: string;
  name: string;
  slug: string;
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const [recipeCategories, setRecipeCategories] = useState<RecipeCategory[]>(
    []
  );

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/recipe-categories");
        if (response.ok) {
          const data = await response.json();
          setRecipeCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch recipe categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("admin-sidebar");
      const toggleButton = document.getElementById("sidebar-toggle");

      if (
        isMobile &&
        isOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        toggleButton &&
        !toggleButton.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  useEffect(() => {
    if (pathname.includes("/admin/turinys")) {
      setContentOpen(true);
    }

    if (pathname.includes("/admin/turinys/receptai")) {
      setRecipesOpen(true);
    }
  }, [pathname]);

  const handleNavigate = (href: string) => {
    router.push(href);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const contentSubMenu = [
    {
      name: "Sportas",
      href: "/admin/turinys/sportas",
      icon: <Dumbbell className="h-5 w-5" />,
      type: "link",
    },
    {
      name: "Mityba",
      href: "/admin/turinys/mityba",
      icon: <Utensils className="h-5 w-5" />,
      type: "link",
    },
    {
      name: "Mokymai",
      href: "/admin/turinys/mokymai",
      icon: <GraduationCap className="h-5 w-5" />,
      type: "link",
    },
    {
      name: "Receptai",
      href: "/admin/turinys/receptai",
      icon: <BookOpen className="h-5 w-5" />,
      type: "dropdown",
      isOpen: recipesOpen,
      toggle: () => setRecipesOpen(!recipesOpen),
      subItems: [
        {
          name: "Visi receptai",
          href: "/admin/turinys/receptai",
          icon: <List className="h-4 w-4" />,
          type: "link",
        },
        {
          name: "Kategorijos",
          href: "/admin/turinys/receptai/kategorijos",
          icon: <Tag className="h-4 w-4" />,
          type: "link",
        },
      ],
    },
    {
      name: "DUK",
      href: "/admin/turinys/klausimai",
      icon: <HelpCircle className="h-5 w-5" />,
      type: "link",
    },
    {
      name: "Pasiekimai",
      href: "/admin/turinys/pasiekimai",
      icon: <Trophy className="h-5 w-5" />,
      type: "link",
    },
  ];

  const menuItems = [
    {
      name: "Skydelis",
      href: "/admin",
      icon: <Home className="h-5 w-5" />,
      type: "link",
    },
    {
      name: "Vartotojai",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      type: "link",
    },
    {
      name: "Narystės",
      href: "/admin/memberships",
      icon: <CreditCard className="h-5 w-5" />,
      type: "link",
    },
    {
      name: "Puslapiai",
      href: "/admin/pages",
      icon: <FileText className="h-5 w-5" />,
      type: "link",
    },
    {
      name: "Turinys",
      icon: <LayoutDashboard className="h-5 w-5" />,
      type: "dropdown",
      isOpen: contentOpen,
      toggle: () => setContentOpen(!contentOpen),
      subItems: contentSubMenu,
    },
    {
      name: "Maistas",
      href: "/admin/maistas",
      icon: <Apple className="h-5 w-5" />,
      type: "link",
    },
    {
      name: "Klientų klausimai",
      href: "/admin/klientu-klausimai",
      icon: <MessageSquareMore className="h-5 w-5" />,
      type: "link",
    },
    {
      name: "Rolės",
      href: "/admin/roles",
      icon: <Shield className="h-5 w-5" />,
      type: "link",
    },
    {
      name: "El. laiškai",
      href: "/admin/emails",
      icon: <Mail className="h-5 w-5" />,
      type: "link",
    },
    {
      name: "Statistika",
      href: "/admin/statistics",
      icon: <BarChart className="h-5 w-5" />,
      type: "link",
    },
    {
      name: "Žurnalai",
      href: "/admin/logs",
      icon: <FileText className="h-5 w-5" />,
      type: "link",
    },
    {
      name: "Nustatymai",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      type: "link",
    },
  ];

  const renderMenuItem = (item: any, index: number, level = 0) => {
    if (item.type === "link") {
      return (
        <li key={`${item.name}-${index}-${level}`}>
          <button
            onClick={() => handleNavigate(item.href)}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors text-left ${
              pathname === item.href
                ? "bg-[#60988E] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.name}</span>
          </button>
        </li>
      );
    } else if (item.type === "dropdown") {
      return (
        <li key={`${item.name}-${index}-${level}`}>
          <div className="flex flex-col">
            <button
              onClick={
                item.href ? () => handleNavigate(item.href) : item.toggle
              }
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                pathname === item.href ||
                (item.name === "Turinys" &&
                  pathname.includes("/admin/turinys")) ||
                (item.name === "Receptai" &&
                  pathname.includes("/admin/turinys/receptai"))
                  ? "bg-[#60988E] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
              {item.subItems && (
                <ChevronDown
                  className={`ml-auto h-4 w-4 transition-transform ${
                    item.isOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {item.isOpen && item.subItems && (
              <ul
                className={`mt-2 ml-6 space-y-1 border-l-2 border-gray-200 pl-4`}
              >
                {item.subItems.map((subItem: any, subIndex: number) =>
                  renderMenuItem(subItem, subIndex, level + 1)
                )}
              </ul>
            )}
          </div>
        </li>
      );
    }
    return null;
  };

  return (
    <>
      {}
      <button
        id="sidebar-toggle"
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {}
      <div
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition duration-200 ease-in-out md:sticky md:top-0 bg-white shadow-lg z-40 h-screen flex flex-col`}
        style={{ minWidth: "20rem", width: "20rem" }}
      >
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#60988E]">LazyFit</span>
            <Shield className="h-5 w-5 text-[#60988E]" />
          </Link>
          <p className="text-sm text-gray-500 mt-1">Administravimo skydelis</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-4">
            {menuItems.map((item, index) => renderMenuItem(item, index))}
          </ul>
        </nav>

        <div className="p-6 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            <span>Grįžti į svetainę</span>
          </Link>
        </div>
      </div>

      {}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
