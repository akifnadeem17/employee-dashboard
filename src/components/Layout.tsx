import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", submenu: ["Overview", "Analytics"] },
  { name: "Employees", submenu: ["List", "Add New"] },
  { name: "Projects", submenu: ["Active", "Archived"] },
  { name: "Settings" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("Dashboard");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <nav className="flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <div key={item.name} className="flex flex-col">
                    <Button
                      variant="ghost"
                      className={cn("justify-start", activeItem === item.name && "bg-accent text-accent-foreground")}
                      onClick={() => setActiveItem(item.name)}
                    >
                      {item.name}
                    </Button>
                    {item.submenu && (
                      <div className="ml-4 flex flex-col space-y-2 mt-2">
                        {item.submenu.map((subItem) => (
                          <Button key={subItem} variant="ghost" size="sm" className="justify-start">
                            {subItem}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="mr-4 hidden lg:flex">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {menuItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Button variant="ghost">{item.name}</Button>
                  {item.submenu && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <div className="py-1">
                        {item.submenu.map((subItem) => (
                          <Button key={subItem} variant="ghost" className="w-full justify-start">
                            {subItem}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main className="container py-6 mx-auto">{children}</main>
    </div>
  );
}
