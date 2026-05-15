'use client'

import { useEffect } from 'react'
import { useQueryState, parseAsJson, parseAsStringLiteral } from 'nuqs'
import { useRadarFiltersStore } from '@/lib/store/radar-filters'
import { Temperature, Industry } from '@/lib/api/types'

export function useUrlFilters() {
  const [industriesParam, setIndustriesParam] = useQueryState(
    'industries',
    parseAsJson<Industry[]>((v) => v as Industry[]).withDefault([])
  )
  const [temperatureParam, setTemperatureParam] = useQueryState<Temperature>(
    'temperature',
    parseAsStringLiteral<Temperature>(['caliente', 'tibio', 'frío'])
  )
  const [queryParam, setQueryParam] = useQueryState('query', { defaultValue: '' })
  const [scoreMinParam, setScoreMinParam] = useQueryState('scoreMin', {
    defaultValue: '0',
    parse: String,
    serialize: String,
  })
  const [scoreMaxParam, setScoreMaxParam] = useQueryState('scoreMax', {
    defaultValue: '100',
    parse: String,
    serialize: String,
  })
  const [pageParam, setPageParam] = useQueryState('page', {
    defaultValue: '1',
    parse: String,
    serialize: String,
  })
  const [orderByParam, setOrderByParam] = useQueryState(
    'orderBy',
    parseAsStringLiteral<'name' | 'score' | 'industry'>(['name', 'score', 'industry']).withDefault('score')
  )
  const [orderParam, setOrderParam] = useQueryState(
    'order',
    parseAsStringLiteral<'asc' | 'desc'>(['asc', 'desc']).withDefault('desc')
  )

  const store = useRadarFiltersStore()

  // Sync URL params to store on mount
  useEffect(() => {
    store.setIndustries(industriesParam)
    store.setTemperature(temperatureParam ?? undefined)
    store.setQuery(queryParam)
    store.setScoreRange([parseInt(scoreMinParam), parseInt(scoreMaxParam)])
    store.setPage(parseInt(pageParam))
    store.setOrderBy(orderByParam)
    store.setOrder(orderParam)
  }, [])

  // Sync store changes to URL
  const syncToUrl = () => {
    setIndustriesParam(store.industries)
    setTemperatureParam(store.temperature ?? null)
    setQueryParam(store.query)
    setScoreMinParam(String(store.scoreRange[0]))
    setScoreMaxParam(String(store.scoreRange[1]))
    setPageParam(String(store.page))
    setOrderByParam(store.orderBy)
    setOrderParam(store.order)
  }

  return { syncToUrl }
}
