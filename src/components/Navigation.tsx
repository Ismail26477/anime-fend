"use client"

import { Search, Bell, User, LogOut, Menu, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SearchModal } from "./SearchModal"
import { useState, useEffect } from "react"

const Navigation = () => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [isHeadingClicked, setIsHeadingClicked] = useState(false)
  const [clickedNavItems, setClickedNavItems] = useState<{ [key: string]: boolean }>({})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const location = useLocation()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 50) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Anime", path: "/anime" },
  ]

  const handleNavItemClick = (path: string) => {
    setClickedNavItems((prev) => ({
      ...prev,
      [path]: true,
    }))
    setMobileMenuOpen(false)
  }

  const handleSearchOpen = () => {
    setSearchOpen(true)
    setMobileMenuOpen(false)
  }

  const handleSearchClose = () => {
    setSearchOpen(false)
  }

  return (
    <nav
      className={`w-full px-4 md:px-8 py-3 transition-all fixed top-0 left-0 right-0 z-50 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className={`flex items-center gap-2 transition-opacity ${
              isHeadingClicked ? "hover:opacity-80" : "opacity-100"
            }`}
            onClick={() => setIsHeadingClicked(true)}
          >
            <span className="text-lg font-bold text-white">An!dost</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium text-white transition-opacity ${
                  clickedNavItems[item.path] ? "hover:opacity-80" : ""
                }`}
                onClick={() => handleNavItemClick(item.path)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-foreground/10 md:hidden"
            onClick={handleSearchOpen}
          >
            <Search className="h-5 w-5" />
          </Button>
          <div className="hidden md:flex items-center">
            <SearchModal />
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-foreground/10">
            <Bell className="h-5 w-5" />
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-foreground/10">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-foreground/10">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-foreground/10 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-foreground/20 pt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-4 py-2 text-sm font-medium text-white hover:opacity-80 transition-opacity"
              onClick={() => handleNavItemClick(item.path)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}

      {searchOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-foreground/20 pt-4">
          <SearchModal onClose={handleSearchClose} />
        </div>
      )}
    </nav>
  )
}

export default Navigation
