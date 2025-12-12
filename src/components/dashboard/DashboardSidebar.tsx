import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import {
  Heart,
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  Stethoscope,
  ClipboardList,
  CreditCard,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: ('admin' | 'doctor' | 'receptionist')[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'doctor', 'receptionist'] },
  { label: 'User Management', href: '/dashboard/users', icon: Users, roles: ['admin'] },
  { label: 'Patients', href: '/dashboard/patients', icon: Users, roles: ['admin'] },
  { label: 'All Appointments', href: '/dashboard/all-appointments', icon: Calendar, roles: ['admin'] },
  { label: 'Register Patient', href: '/dashboard/register-patient', icon: UserPlus, roles: ['receptionist'] },
  { label: 'Patient Queue', href: '/dashboard/queue', icon: ClipboardList, roles: ['receptionist'] },
  { label: 'Appointments', href: '/dashboard/appointments', icon: Calendar, roles: ['doctor', 'receptionist'] },
  { label: 'Treatments', href: '/dashboard/treatments', icon: Stethoscope, roles: ['doctor'] },
  { label: 'Payments', href: '/dashboard/payments', icon: CreditCard, roles: ['receptionist'] },
  { label: 'My Profile', href: '/dashboard/profile', icon: Settings, roles: ['admin', 'doctor', 'receptionist'] },
];

interface SidebarContentProps {
  user: NonNullable<ReturnType<typeof useAuth>['user']>;
  filteredNavItems: NavItem[];
  location: ReturnType<typeof useLocation>;
  onNavClick?: () => void;
}

const SidebarContentComponent = ({ user, filteredNavItems, location, onNavClick }: SidebarContentProps) => {
  const getRoleBadgeColor = () => {
    switch (user.role) {
      case 'admin': return 'bg-admin';
      case 'doctor': return 'bg-doctor';
      case 'receptionist': return 'bg-receptionist';
      default: return 'bg-primary';
    }
  };

  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground">HMS</h1>
            <p className="text-xs text-sidebar-foreground/60">Hospital System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent">
          <div className="w-10 h-10 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-bold">
            {user.first_name[0]}{user.last_name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.first_name} {user.last_name}
            </p>
            <div className="flex items-center gap-1.5">
              <span className={cn("w-2 h-2 rounded-full", getRoleBadgeColor())} />
              <span className="text-xs text-sidebar-foreground/60 capitalize">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Mobile Sidebar Trigger Button
export const MobileSidebarTrigger = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-sidebar">
        <div className="flex flex-col h-full">
          <SidebarContentComponent 
            user={user} 
            filteredNavItems={filteredNavItems} 
            location={location}
            onNavClick={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

const DashboardSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className="hidden lg:flex w-64 bg-sidebar min-h-screen flex-col border-r border-sidebar-border">
      <SidebarContentComponent 
        user={user} 
        filteredNavItems={filteredNavItems} 
        location={location}
      />
    </aside>
  );
};

export default DashboardSidebar;
