'use client'

import { useMemo } from 'react'
import { usePublications } from '@/hooks/use-gemini-api'
import type { GeminiPublication } from '@/lib/gemini-api'
import { useFavorites } from '@/hooks/use-favorites'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts'

type YearPoint = { year: number; count: number }
type CategoryPoint = { category: string; count: number }

export function DashboardAnalytics() {
  const { publications = [], loading, error } = usePublications()
  const { favoriteIds } = useFavorites()

  const {
    totalPublications,
    favoritesCount,
    viewedCount,
    latestYear,
    yearSeries,
    categorySeries,
  } = useMemo<{
    totalPublications: number;
    favoritesCount: number;
    viewedCount: number;
    latestYear: number;
    yearSeries: YearPoint[];
    categorySeries: CategoryPoint[];
  }>(() => {
    const pubs: GeminiPublication[] = Array.isArray(publications) ? (publications as GeminiPublication[]) : []
    const totalPublications = pubs.length
    const favoritesCount = pubs.filter((p) => p && (p as any).id && favoriteIds.has((p as any).id)).length
    const viewedCount = pubs.filter((p) => p && (p as any).isViewed).length
    const latestYear = pubs.reduce((y, p) => Math.max(y, ((p as any)?.year) || 0), 0)

	const yearCounts: Record<string, number> = {}
	;(pubs || []).forEach((p: unknown) => {
	  const yr = (p as any)?.year
	  if (typeof yr === 'number') {
	    const key = String(yr)
	    yearCounts[key] = (yearCounts[key] || 0) + 1
	  }
	})
	const yearSeries: Array<{ year: number; count: number }> = Object.entries(yearCounts)
	  .map(([year, count]) => ({ year: Number(year), count: Number(count) }))
	  .sort((a, b) => a.year - b.year)

	const categoryCounts: Record<string, number> = {}
	;(pubs || []).forEach((p: unknown) => {
	  const cat = (p as any)?.category ? String((p as any).category) : ''
	  if (cat) {
	    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
	  }
	})
	const categorySeries: Array<{ category: string; count: number }> = Object.entries(categoryCounts)
	  .map(([category, count]) => ({ category, count: Number(count) }))
	  .sort((a, b) => b.count - a.count)

    return {
      totalPublications,
      favoritesCount,
      viewedCount,
      latestYear,
      yearSeries,
      categorySeries,
    }
  }, [publications, favoriteIds])

  return (
    <div className="space-y-6">
      {/* Loading / Error */}
      {(loading || error) && (
        <div className="grid grid-cols-1 gap-4">
          {loading && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-white/70">
              Loading analytics...
            </div>
          )}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-5 text-red-300">
              {error}
            </div>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
          <p className="text-white/60 text-xs">Total Publications</p>
          <p className="text-white text-2xl font-bold mt-1">{totalPublications.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
          <p className="text-white/60 text-xs">Favorites</p>
          <p className="text-white text-2xl font-bold mt-1">{favoritesCount.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
          <p className="text-white/60 text-xs">Viewed</p>
          <p className="text-white text-2xl font-bold mt-1">{viewedCount.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
          <p className="text-white/60 text-xs">Latest Publication Year</p>
          <p className="text-white text-2xl font-bold mt-1">{latestYear}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Publications per Year</h3>
          </div>
          <ChartContainer
            config={{ count: { label: 'Publications', color: 'hsl(262 83% 62%)' } }}
            className="h-64"
          >
            <LineChart data={yearSeries as unknown as any[]} margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.5)" tickLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Publications by Category</h3>
          </div>
          <ChartContainer
            config={{ count: { label: 'Publications', color: 'hsl(20 90% 60%)' } }}
            className="h-64"
          >
            <BarChart data={categorySeries as unknown as any[]} margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="category" stroke="rgba(255,255,255,0.5)" tickLine={false} hide={true} />
              <YAxis stroke="rgba(255,255,255,0.5)" tickLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-white/70">
            {(categorySeries as CategoryPoint[]).slice(0, 6).map((item: CategoryPoint) => (
              <div key={item.category} className="truncate">{item.category}: {item.count}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


