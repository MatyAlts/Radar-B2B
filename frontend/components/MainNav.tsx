'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function MainNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Radar', icon: '📡' },
    { href: '/leads', label: 'Leads', icon: '👥' },
  ]

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="px-6 py-4 flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">Radar B2B</span>
        </div>

        <div className="flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md transition-colors font-medium text-sm',
                pathname === item.href
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
