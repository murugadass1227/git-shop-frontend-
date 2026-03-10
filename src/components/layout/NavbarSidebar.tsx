'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowLeft,
  faBell,
  faChevronRight,
  faCirclePlus,
  faGift,
  faGear,
  faHeadphones,
  faRightFromBracket,
  faStar,
  faStore,
  faTag,
  faTruck,
  faUser,
  faWallet,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import type { IconType } from 'react-icons';
import {
  FaBaby,
  FaBriefcase,
  FaChild,
  FaFemale,
  FaGem,
  FaGift,
  FaHeart,
  FaImage,
  FaLightbulb,
  FaMale,
  FaMedal,
  FaMoon,
  FaMugHot,
  FaPenNib,
  FaRing,
  FaTags,
  FaTrophy,
  FaUsers,
} from 'react-icons/fa';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

type SidebarGroup = {
  title: string;
  items: { name: string; href: string }[];
};

type SidebarSection = {
  id: string;
  label: string;
  icon: IconDefinition;
  groups: SidebarGroup[];
};

type NavbarSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subSidebarSection: string | null;
  setSubSidebarSection: (value: string | null) => void;
  userRole?: 'user' | 'admin';
  showAsLoggedIn: boolean;
  avatarUrl: string | null;
  sidebarSectionsWithSub: SidebarSection[];
  profileHref: string;
  onRequestLogout: () => void;
};

function getChildIcon(name: string): IconType {
  const label = name.toLowerCase();

  if (label.includes('husband') || label.includes('boyfriend') || label.includes('brother') || label.includes('father') || label.includes('for him')) return FaMale;
  if (label.includes('wife') || label.includes('girlfriend') || label.includes('sister') || label.includes('mother') || label.includes('for her')) return FaFemale;
  if (label.includes('kids') || label.includes('boys') || label.includes('girls')) return FaChild;
  if (label.includes('baby')) return FaBaby;
  if (label.includes('couple') || label.includes('anniversary')) return FaHeart;
  if (label.includes('wedding') || label.includes('bride')) return FaRing;
  if (label.includes('photo') || label.includes('frame')) return FaImage;
  if (label.includes('crystal') || label.includes('resin')) return FaGem;
  if (label.includes('lamp') || label.includes('led')) return FaLightbulb;
  if (label.includes('mug')) return FaMugHot;
  if (label.includes('troph') || label.includes('award')) return FaTrophy;
  if (label.includes('corporate') || label.includes('branding') || label.includes('company') || label.includes('desk')) return FaBriefcase;
  if (label.includes('engraving') || label.includes('name plate')) return FaPenNib;
  if (label.includes('premium') || label.includes('budget') || label.includes('under')) return FaTags;
  if (label.includes('mini') || label.includes('family')) return FaUsers;
  if (label.includes('moon')) return FaMoon;
  if (label.includes('gift') || label.includes('combo') || label.includes('keychain')) return FaGift;

  return FaMedal;
}

function getItemTone(name: string) {
  const label = name.toLowerCase();

  if (label.includes('wife') || label.includes('girlfriend') || label.includes('mother') || label.includes('friend')) {
    return 'border border-pink-100 bg-pink-50 text-pink-500';
  }
  if (label.includes('sister') || label.includes('daughter') || label.includes('for her')) {
    return 'border border-fuchsia-100 bg-fuchsia-50 text-fuchsia-500';
  }
  if (label.includes('grandmother') || label.includes('all women')) {
    return 'border border-amber-100 bg-amber-50 text-amber-500';
  }
  if (label.includes('husband') || label.includes('boyfriend') || label.includes('father') || label.includes('for him')) {
    return 'border border-violet-100 bg-violet-50 text-violet-500';
  }
  if (label.includes('kids') || label.includes('baby') || label.includes('girls') || label.includes('boys')) {
    return 'border border-emerald-100 bg-emerald-50 text-emerald-500';
  }

  return 'border border-rose-100 bg-rose-50 text-rose-500';
}

export function NavbarSidebar({
  open,
  onOpenChange,
  subSidebarSection,
  setSubSidebarSection,
  userRole,
  showAsLoggedIn,
  avatarUrl,
  sidebarSectionsWithSub,
  profileHref,
  onRequestLogout,
}: NavbarSidebarProps) {
  const [activeGroupTitle, setActiveGroupTitle] = useState<string | null>(null);
  const hiddenScrollbarClass =
    'overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';
  const hiddenBothAxisScrollbarClass =
    'overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';
  const activeSection = useMemo(
    () => (subSidebarSection ? sidebarSectionsWithSub.find((s) => s.id === subSidebarSection) ?? null : null),
    [sidebarSectionsWithSub, subSidebarSection]
  );
  const activeGroup = useMemo(
    () => activeSection?.groups.find((group) => group.title === activeGroupTitle) ?? activeSection?.groups[0] ?? null,
    [activeGroupTitle, activeSection]
  );

  useEffect(() => {
    if (!activeSection) {
      setActiveGroupTitle(null);
      return;
    }

    const nextGroupTitle = activeSection.groups[0]?.title ?? null;
    setActiveGroupTitle((current) =>
      current && activeSection.groups.some((group) => group.title === current) ? current : nextGroupTitle
    );
  }, [activeSection]);

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => { onOpenChange(nextOpen); if (!nextOpen) setSubSidebarSection(null); }}>
      <SheetContent
        side="left"
        className={`flex h-full flex-row gap-0 overflow-hidden border-r border-rose-100 bg-gradient-to-br from-[#fffafb] via-[#fff6f9] to-[#fffdfd] p-0 shadow-[0_24px_80px_rgba(244,114,182,0.14)] ${
          activeSection
            ? '!w-screen !max-w-none sm:!w-[calc(100vw-1.5rem)] xl:!w-[78rem]'
            : '!w-[18.5rem] !max-w-[88vw]'
        }`}
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="flex h-full w-full min-w-0">
          <div className="flex h-full w-[18.5rem] max-w-[88vw] flex-col border-r border-rose-100/80 bg-white/95 backdrop-blur-sm">
            <div className="flex shrink-0 items-center justify-between border-b border-rose-100/80 px-5 py-4">
              <h2 className="text-lg font-semibold tracking-tight text-slate-800">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-500"
                onClick={() => { onOpenChange(false); setSubSidebarSection(null); }}
                aria-label="Close menu"
              >
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </Button>
            </div>

            <div className={`flex-1 min-h-0 ${hiddenScrollbarClass}`}>
              <div className="border-b border-rose-100/80 px-4 py-4">
                <div className="grid grid-cols-3 gap-3 rounded-[1.75rem] bg-gradient-to-br from-rose-50 via-white to-pink-50 p-3 shadow-[0_14px_35px_rgba(244,114,182,0.08)]">
                {userRole === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex flex-col items-center gap-2 rounded-2xl border border-transparent bg-white/80 p-2.5 text-center transition hover:-translate-y-0.5 hover:border-rose-100 hover:bg-white hover:shadow-sm"
                    onClick={() => onOpenChange(false)}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-500 shadow-sm">
                      <FontAwesomeIcon icon={faGear} className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-slate-700">Admin</span>
                  </Link>
                )}
                <Link
                  href={profileHref}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-transparent bg-white/80 p-2.5 text-center transition hover:-translate-y-0.5 hover:border-rose-100 hover:bg-white hover:shadow-sm"
                  onClick={() => onOpenChange(false)}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-500 shadow-sm">
                    {showAsLoggedIn && avatarUrl ? (
                      <img src={avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-700">{showAsLoggedIn ? 'Account' : 'Account'}</span>
                </Link>
                <Link
                  href="/wallet"
                  className="flex flex-col items-center gap-2 rounded-2xl border border-transparent bg-white/80 p-2.5 text-center transition hover:-translate-y-0.5 hover:border-rose-100 hover:bg-white hover:shadow-sm"
                  onClick={() => onOpenChange(false)}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-500 shadow-sm">
                    <FontAwesomeIcon icon={faWallet} className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">Wallet</span>
                </Link>
                {!userRole && (
                  <Link
                    href="/reminder"
                    className="flex flex-col items-center gap-2 rounded-2xl border border-transparent bg-white/80 p-2.5 text-center transition hover:-translate-y-0.5 hover:border-rose-100 hover:bg-white hover:shadow-sm"
                    onClick={() => onOpenChange(false)}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-500 shadow-sm">
                      <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-slate-700">Reminder</span>
                  </Link>
                )}
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="space-y-1">
                  {sidebarSectionsWithSub.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setSubSidebarSection(section.id);
                        setActiveGroupTitle(section.groups[0]?.title ?? null);
                      }}
                      className={`flex w-full items-center justify-between rounded-2xl border px-3.5 py-3 text-left transition ${
                        subSidebarSection === section.id
                          ? 'border-pink-100 bg-gradient-to-r from-pink-50 via-rose-50 to-white text-slate-900 shadow-[0_12px_25px_rgba(244,114,182,0.10)]'
                          : 'border-transparent text-slate-700 hover:border-rose-100 hover:bg-rose-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition ${
                            subSidebarSection === section.id
                              ? 'border-pink-100 bg-white text-pink-500 shadow-sm'
                              : 'border-rose-100 bg-rose-50 text-rose-400'
                          }`}
                        >
                          <FontAwesomeIcon icon={section.icon} className="h-4 w-4" />
                        </span>
                        <span className="truncate text-[15px] font-medium">{section.label}</span>
                      </div>
                      <FontAwesomeIcon
                        icon={faCirclePlus}
                        className={`h-4 w-4 shrink-0 ${subSidebarSection === section.id ? 'text-pink-500' : 'text-rose-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-rose-100/80 p-4">
                <div className="rounded-[1.75rem] border border-rose-100/80 bg-white/90 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-rose-300">Assistance</h3>
                <div className="space-y-1">
                  {[
                    { name: 'Account', icon: faUser, href: profileHref },
                    { name: 'Wallet', icon: faWallet, href: '/wallet' },
                    { name: 'Loyalty Program', icon: faStar, href: '/loyalty-program' },
                    { name: 'Refer & Earn', icon: faGift, href: '/refer-earn' },
                    { name: 'Offers', icon: faTag, href: '/offers' },
                    { name: 'Track Your Order', icon: faTruck, href: '/track-order' },
                    { name: 'Customer Support', icon: faHeadphones, href: '/support' },
                    { name: 'Franchise Enquiry', icon: faStore, href: '/franchise' },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-rose-50"
                      onClick={() => onOpenChange(false)}
                    >
                      {item.name === 'Account' && showAsLoggedIn && avatarUrl ? (
                        <img src={avatarUrl} alt="" className="h-5 w-5 rounded-full border border-rose-100 object-cover" />
                      ) : (
                        <FontAwesomeIcon icon={item.icon} className="h-4 w-4 text-slate-500 transition-colors group-hover:text-pink-500" />
                      )}
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    </Link>
                  ))}
                  {showAsLoggedIn && (
                    <button
                      type="button"
                      onClick={() => { onOpenChange(false); onRequestLogout(); }}
                      className="group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-red-50"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4 text-slate-500 group-hover:text-red-600 transition-colors" />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-red-600">Logout</span>
                    </button>
                  )}
                </div>
                </div>
              </div>
            </div>
          </div>

          {activeSection && (
            <>
              <div className="animate-slide-in-right-3d flex min-w-0 flex-1 xl:hidden">
                <div className="flex h-full min-w-0 flex-1 flex-col bg-white/96 backdrop-blur-sm">
                  <div className="flex shrink-0 items-center gap-3 border-b border-rose-100/80 px-4 py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-500"
                      onClick={() => setSubSidebarSection(null)}
                      aria-label="Back"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
                    </Button>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-pink-100 bg-pink-50 text-pink-500 shadow-sm">
                      <FontAwesomeIcon icon={activeSection.icon} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold text-slate-800">{activeSection.label}</h2>
                      <p className="mt-0.5 text-xs text-rose-300">Choose a group and continue browsing.</p>
                    </div>
                  </div>
                  <div className="border-b border-rose-100/80 px-4 py-4">
                    <div className={`flex gap-2 pb-1 ${hiddenBothAxisScrollbarClass}`}>
                      {activeSection.groups.map((group) => (
                        <button
                          key={group.title}
                          type="button"
                          onClick={() => setActiveGroupTitle(group.title)}
                          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                            activeGroup?.title === group.title
                              ? 'border-pink-100 bg-pink-50 text-pink-600 shadow-sm'
                              : 'border-rose-100 bg-white text-slate-600 hover:border-pink-100 hover:bg-rose-50'
                          }`}
                        >
                          {group.title}
                        </button>
                      ))}
                    </div>
                  </div>
                  {activeGroup && (
                    <>
                      <div className="border-b border-rose-100/80 px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900">{activeGroup.title}</p>
                        <p className="mt-1 text-xs text-rose-300">Curated picks in a softer, gift-first layout.</p>
                      </div>
                      <div className={`flex-1 min-h-0 px-4 py-5 sm:px-5 ${hiddenScrollbarClass}`}>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {activeGroup.items.map((child) => {
                            const ChildIcon = getChildIcon(child.name);
                            return (
                              <Link
                                key={child.name}
                                href={child.href}
                                className="group flex items-center gap-3 rounded-[1.5rem] border border-rose-100/80 bg-white p-3 transition hover:-translate-y-0.5 hover:border-pink-100 hover:bg-rose-50/50 hover:shadow-[0_14px_28px_rgba(244,114,182,0.10)]"
                                onClick={() => { onOpenChange(false); setSubSidebarSection(null); }}
                              >
                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${getItemTone(child.name)}`}>
                                  <ChildIcon className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium leading-5 text-slate-700 group-hover:text-slate-900">
                                  {child.name}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="hidden xl:flex xl:min-w-0 xl:flex-1">
                <div className="animate-slide-in-right-3d flex h-full w-[18rem] flex-col border-r border-rose-100/80 bg-white/92 backdrop-blur-sm">
                  <div className="flex shrink-0 items-center gap-3 border-b border-rose-100/80 px-4 py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-500"
                      onClick={() => setSubSidebarSection(null)}
                      aria-label="Back"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
                    </Button>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-pink-100 bg-pink-50 text-pink-500 shadow-sm">
                      <FontAwesomeIcon icon={activeSection.icon} className="h-4 w-4" />
                    </span>
                    <h2 className="truncate text-base font-semibold text-slate-800">{activeSection.label}</h2>
                  </div>
                  <div className={`flex-1 min-h-0 px-4 py-5 ${hiddenScrollbarClass}`}>
                    <div className="space-y-1">
                      {activeSection.groups.map((group) => (
                        <button
                          key={group.title}
                          type="button"
                          onClick={() => setActiveGroupTitle(group.title)}
                          className={`flex w-full items-center justify-between rounded-2xl border px-3.5 py-3 text-left transition ${
                            activeGroup?.title === group.title
                              ? 'border-pink-100 bg-gradient-to-r from-pink-50 via-rose-50 to-white text-slate-900 shadow-[0_12px_25px_rgba(244,114,182,0.10)]'
                              : 'border-transparent text-slate-700 hover:border-rose-100 hover:bg-rose-50/70'
                          }`}
                        >
                          <span className="text-[15px] font-medium">{group.title}</span>
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className={`h-4 w-4 ${activeGroup?.title === group.title ? 'text-pink-500' : 'text-rose-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {activeGroup && (
                  <div className="animate-slide-in-right-3d flex h-full min-w-0 flex-1 flex-col bg-white/96 backdrop-blur-sm">
                    <div className="border-b border-rose-100/80 px-5 py-4">
                      <p className="text-sm font-semibold text-slate-900">{activeGroup.title}</p>
                      <p className="mt-1 text-xs text-rose-300">Curated picks in a softer, gift-first layout.</p>
                    </div>
                    <div className={`flex-1 min-h-0 px-5 py-5 ${hiddenScrollbarClass}`}>
                      <div className="grid grid-cols-2 gap-4 2xl:grid-cols-3">
                        {activeGroup.items.map((child) => {
                          const ChildIcon = getChildIcon(child.name);
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="group flex items-center gap-3 rounded-[1.5rem] border border-rose-100/80 bg-white p-3 transition hover:-translate-y-0.5 hover:border-pink-100 hover:bg-rose-50/50 hover:shadow-[0_14px_28px_rgba(244,114,182,0.10)]"
                              onClick={() => { onOpenChange(false); setSubSidebarSection(null); }}
                            >
                              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${getItemTone(child.name)}`}>
                                <ChildIcon className="h-5 w-5" />
                              </div>
                              <span className="text-sm font-medium leading-5 text-slate-700 group-hover:text-slate-900">
                                {child.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
