'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Settings, User, Bell } from 'lucide-react'

export function MainNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Radar', icon: '📡' },
    { href: '/leads', label: 'Leads', icon: '👥' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-border/40">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-primary text-primary-foreground shadow-sm">
              <span className="text-xl font-black">R</span>
            </div>
            <div className="flex flex-col -space-y-0.5">
              <span className="text-lg font-bold tracking-tight text-foreground">
                Radar<span className="text-muted-foreground">B2B</span>
              </span>
              <span className="text-[9px] font-medium tracking-widest text-muted-foreground uppercase">
                Enterprise Dashboard
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors rounded-md',
                  pathname === item.href
                    ? 'text-foreground bg-secondary/80'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="h-9 w-9 flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-all">
            <Bell className="h-4 w-4" />
          </button>
          <button className="h-9 w-9 flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-all">
            <Settings className="h-4 w-4" />
          </button>
          <div className="h-8 w-[1px] bg-border/40 mx-2" />
          <div className="flex items-center gap-3 pl-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-foreground hidden sm:block">Admin</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
